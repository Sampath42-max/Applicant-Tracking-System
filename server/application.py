import os
import io
import csv
import PyPDF2
import logging
import requests
import time
import secrets
import smtplib
import ssl
from datetime import datetime
from urllib.parse import urljoin, urlparse
from collections import defaultdict, deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from email.message import EmailMessage
from threading import Lock
from fastapi import BackgroundTasks, FastAPI, File, Form, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import re
import json
import google.generativeai as genai
import uvicorn
from bs4 import BeautifulSoup
from itsdangerous import BadSignature, URLSafeTimedSerializer
from pydantic import BaseModel, Field
from werkzeug.security import check_password_hash, generate_password_hash
from config import settings

try:
    import pymongo
    from pymongo.errors import PyMongoError
    from bson import ObjectId
    from bson.errors import InvalidId
except Exception:
    pymongo = None
    PyMongoError = Exception
    ObjectId = None
    InvalidId = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Configure external APIs from config settings.
GEMINI_API_KEY = settings.GEMINI_API_KEY
CAREER_SOURCES_CACHE = {}
CAREER_JOBS_CACHE = {}
CAREER_SOURCES_CACHE_TTL_SECONDS = settings.CAREER_SOURCES_CACHE_TTL_SECONDS
CAREER_JOBS_CACHE_TTL_SECONDS = settings.CAREER_JOBS_CACHE_TTL_SECONDS
CAREER_FETCH_WORKERS = settings.CAREER_FETCH_WORKERS
AUTH_SECRET_KEY = settings.AUTH_SECRET_KEY
SESSION_COOKIE_NAME = "session"
SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
auth_serializer = URLSafeTimedSerializer(AUTH_SECRET_KEY)
RATE_LIMIT_REQUESTS = defaultdict(deque)
RATE_LIMIT_LOCK = Lock()
MAX_RESUME_BYTES = settings.MAX_RESUME_BYTES
IS_PRODUCTION = settings.IS_PRODUCTION

class SignupRequest(BaseModel):
    fullName: str | None = Field(None, max_length=100)
    name: str | None = Field(None, max_length=100)
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=8, max_length=12)

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=1, max_length=128)

class SaveJobRequest(BaseModel):
    jobId: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    company: str = Field("", max_length=255)
    location: str = Field("", max_length=255)
    description: str = Field("", max_length=50000)
    applyLink: str = Field("", max_length=4000)
    publisher: str = Field("", max_length=255)
    postedAt: str | None = Field(None, max_length=80)

if not GEMINI_API_KEY:
    logger.error("⚠️  GEMINI_API_KEY not set! Please set it as an environment variable.")
    logger.error("   Example: export GEMINI_API_KEY='your_api_key_here'")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("✅ Gemini API configured successfully")

# Initialize Gemini model
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI(title="Resume Checker API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://192.168.56.1:3000",
        "https://applicant-tracking-system-eight.vercel.app"
    ],
    allow_origin_regex=(
        None if IS_PRODUCTION
        else r"^http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File uploads
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'Uploads')
ALLOWED_EXTENSIONS = {'pdf'}
app.state.upload_folder = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def snake_to_camel(s):
    parts = s.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def convert_keys_to_camel_case(data):
    if isinstance(data, dict):
        return {snake_to_camel(k): convert_keys_to_camel_case(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_keys_to_camel_case(item) for item in data]
    else:
        return data

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def has_control_characters(value):
    return bool(re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', value or ""))

def validate_password(password):
    if len(password) < 8 or len(password) > 12:
        return False, "Password must be 8 to 12 characters"
    if re.match(r'^[0-9]', password):
        return False, "Password must not start with a number"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, "Valid password"

def validate_email(email):
    return bool(re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email or ""))

def validate_full_name(full_name):
    letters_only = (
        full_name.replace(" ", "").replace(".", "").replace("'", "").replace("-", "")
    )
    return (
        2 <= len(full_name) <= 100
        and not has_control_characters(full_name)
        and bool(letters_only)
        and letters_only.isalpha()
    )

def validate_text_input(value, max_length):
    value = (value or "").strip()
    return len(value) <= max_length and not has_control_characters(value)

def validate_external_url(value):
    if not value:
        return True
    parsed = urlparse(value.strip())
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)

def rate_limit_response(request, bucket, limit, window_seconds):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    key = (bucket, client_ip)
    with RATE_LIMIT_LOCK:
        attempts = RATE_LIMIT_REQUESTS[key]
        while attempts and now - attempts[0] >= window_seconds:
            attempts.popleft()
        if len(attempts) >= limit:
            retry_after = max(1, int(window_seconds - (now - attempts[0])))
            return JSONResponse(
                {"error": "Too many requests. Please try again later."},
                status_code=429,
                headers={"Retry-After": str(retry_after)},
            )
        attempts.append(now)
    return None



mongo_client = None
mongodb_db = None

def serialize_doc(doc):
    if not doc:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
        elif isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc

def get_db_connection():
    global mongo_client, mongodb_db
    if pymongo is None:
        raise RuntimeError("pymongo is not installed. Install it from requirements.txt.")
    
    if mongo_client is None:
        mongo_uri = settings.MONGODB_URI
        db_name = settings.MONGODB_DATABASE
        
        # Initialize client
        mongo_client = pymongo.MongoClient(mongo_uri)
        mongodb_db = mongo_client[db_name]
        
        # Create indexes for collections
        try:
            mongodb_db.users.create_index("email", unique=True)
            mongodb_db.resumes.create_index("user_id")
            mongodb_db.saved_jobs.create_index("user_id")
            mongodb_db.jobs.create_index([("job_title", 1), ("company", 1), ("apply_link", 1)])
        except Exception as idx_err:
            logger.warning(f"Could not create MongoDB indexes: {idx_err}")
            
    return mongodb_db

def database_error_response(exc, action):
    message = str(exc)
    logger.error(f"{action} database error: {message}", exc_info=True)
    return JSONResponse(
        {"error": f"Could not {action.lower()}. Please check database configuration."},
        status_code=500,
    )

def public_user(user):
    if not user:
        return None
    return {
        "id": user.get("id"),
        "fullName": user.get("full_name") or "",
        "email": user.get("email") or "",
        "authProvider": user.get("auth_provider") or "email",
        "profilePicture": user.get("profile_picture"),
        "createdAt": str(user.get("created_at")) if user.get("created_at") else None,
    }

def fetch_user_by_id(user_id):
    try:
        db = get_db_connection()
        oid = ObjectId(user_id)
        user = db.users.find_one({"_id": oid})
        return serialize_doc(user)
    except (InvalidId, TypeError):
        return None
    except Exception as exc:
        logger.error(f"Error fetching user by id: {exc}")
        return None

def fetch_user_by_email(email):
    try:
        db = get_db_connection()
        user = db.users.find_one({"email": email.lower().strip()})
        return serialize_doc(user)
    except Exception as exc:
        logger.error(f"Error fetching user by email: {exc}")
        return None

def store_resume_record(user_id, file_name, extracted_text):
    try:
        db = get_db_connection()
        user_oid = ObjectId(user_id)
        db.resumes.insert_one({
            "user_id": user_oid,
            "file_name": file_name,
            "file_url": None,
            "extracted_text": extracted_text,
            "uploaded_at": datetime.now()
        })
    except Exception as exc:
        logger.warning(f"Could not store resume metadata: {str(exc)}")

def fetch_profile_activity(user_id):
    db = get_db_connection()
    try:
        user_oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return {"resumes": [], "savedJobs": [], "stats": {"resumeCount": 0, "savedJobCount": 0}}
    
    # Fetch resumes
    resumes_cursor = db.resumes.find({"user_id": user_oid}).sort("uploaded_at", -1).limit(20)
    resumes = [serialize_doc(r) for r in resumes_cursor]
    resume_count = db.resumes.count_documents({"user_id": user_oid})
    
    # Fetch saved jobs using aggregation (join with jobs)
    pipeline = [
        { "$match": { "user_id": user_oid } },
        { "$sort": { "saved_at": -1 } },
        { "$limit": 20 },
        {
            "$lookup": {
                "from": "jobs",
                "localField": "job_id",
                "foreignField": "_id",
                "as": "job_details"
            }
        },
        { "$unwind": { "path": "$job_details", "preserveNullAndEmptyArrays": True } },
        {
            "$project": {
                "_id": 0,
                "saved_id": "$_id",
                "saved_at": 1,
                "job_id": "$job_details._id",
                "job_title": "$job_details.job_title",
                "company": "$job_details.company",
                "location": "$job_details.location",
                "job_description": "$job_details.job_description",
                "apply_link": "$job_details.apply_link",
                "source": "$job_details.source",
                "posted_at": "$job_details.posted_at"
            }
        }
    ]
    saved_jobs_cursor = db.saved_jobs.aggregate(pipeline)
    saved_jobs = []
    for sj in saved_jobs_cursor:
        sj["saved_id"] = str(sj["saved_id"])
        if sj.get("job_id"):
            sj["job_id"] = str(sj["job_id"])
        else:
            sj["job_id"] = ""
        if sj.get("saved_at") and isinstance(sj["saved_at"], datetime):
            sj["saved_at"] = sj["saved_at"].isoformat()
        if sj.get("posted_at") and isinstance(sj["posted_at"], datetime):
            sj["posted_at"] = sj["posted_at"].isoformat()
        saved_jobs.append(sj)
        
    saved_job_count = db.saved_jobs.count_documents({"user_id": user_oid})
    
    return {
        "resumes": convert_keys_to_camel_case(resumes),
        "savedJobs": convert_keys_to_camel_case(saved_jobs),
        "stats": {"resumeCount": resume_count, "savedJobCount": saved_job_count},
    }

def store_saved_job(user_id, job):
    db = get_db_connection()
    try:
        user_oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        raise ValueError("Invalid user ID.")
        
    apply_link = job.applyLink.strip()
    if apply_link and not validate_external_url(apply_link):
        raise ValueError("The job apply link is invalid.")
    textual_values = [job.title, job.company, job.location, job.description, job.publisher]
    if any(not validate_text_input(value, limit) for value, limit in zip(textual_values, [255, 255, 255, 50000, 255])):
        raise ValueError("Job information contains invalid characters.")
    posted_at = None
    if job.postedAt:
        try:
            posted_at = datetime.fromisoformat(job.postedAt.replace("Z", "+00:00")).replace(tzinfo=None)
        except ValueError:
            posted_at = None
            
    # Check if job exists
    stored_job = db.jobs.find_one({
        "job_title": job.title.strip(),
        "company": job.company.strip(),
        "apply_link": apply_link
    })
    
    if stored_job:
        job_id = stored_job["_id"]
    else:
        # Insert job
        res = db.jobs.insert_one({
            "job_title": job.title.strip(),
            "company": job.company.strip(),
            "location": job.location.strip(),
            "job_description": job.description.strip(),
            "apply_link": apply_link,
            "source": job.publisher.strip() or "Company careers",
            "posted_at": posted_at
        })
        job_id = res.inserted_id

    # Check if already saved
    existing_saved = db.saved_jobs.find_one({
        "user_id": user_oid,
        "job_id": job_id
    })
    
    if existing_saved:
        return str(existing_saved["_id"]), True

    # Save job
    res_saved = db.saved_jobs.insert_one({
        "user_id": user_oid,
        "job_id": job_id,
        "saved_at": datetime.now()
    })
    return str(res_saved.inserted_id), False

def create_session_response(user, message):
    response = JSONResponse({"message": message, "user": public_user(user)})
    token = auth_serializer.dumps({"user_id": user["id"]})
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,
        max_age=SESSION_MAX_AGE_SECONDS,
        samesite="lax",
    )
    return response

def get_current_user_from_request(request):
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        return None
    try:
        payload = auth_serializer.loads(token, max_age=SESSION_MAX_AGE_SECONDS)
        user_id = payload.get("user_id")
        return fetch_user_by_id(user_id) if user_id else None
    except (BadSignature, PyMongoError, RuntimeError):
        return None

def require_authenticated_user(request):
    user = get_current_user_from_request(request)
    if not user:
        return None, JSONResponse({"error": "Please login or signup to continue."}, status_code=401)
    return user, None

class CareerSourcesError(Exception):
    def __init__(self, message, status_code=502):
        super().__init__(message)
        self.status_code = status_code

def clean_external_text(value):
    if not value:
        return ""
    if isinstance(value, (list, tuple)):
        value = " ".join(clean_external_text(item) for item in value)
    if isinstance(value, dict):
        value = value.get("name") or value.get("value") or json.dumps(value)
    return BeautifulSoup(str(value), "html.parser").get_text(" ", strip=True)

def text_from_schema(value):
    if isinstance(value, list):
        return " ".join(text_from_schema(item) for item in value if item)
    if isinstance(value, dict):
        return clean_external_text(value.get("name") or value.get("description") or value.get("value"))
    return clean_external_text(value)

def configured_career_sources_sheet_url():
    return settings.CAREER_SOURCES_SHEET_CSV_URL.strip()

def source_company_label(url, label=""):
    if label.strip():
        return clean_external_text(label)[:255]
    host = urlparse(url).netloc.lower().replace("www.", "")
    host_parts = host.split(".")
    root = host_parts[0]
    if root in {"career", "careers", "job", "jobs"} and len(host_parts) > 1:
        root = host_parts[1]
    root = re.sub(r"careers?$", "", root).replace("-", " ").strip()
    return root.title() or "Company"

def normalize_sheet_header(value):
    return re.sub(r"[^a-z0-9]+", "_", str(value or "").strip().casefold()).strip("_")

def get_sheet_value(row, *names):
    for name in names:
        value = row.get(normalize_sheet_header(name), "")
        if value is not None and str(value).strip():
            return str(value).strip()
    return ""

def normalize_source_country(value):
    country = clean_external_text(value).casefold()
    if country in {"india", "in", "ind"}:
        return "in"
    if country in {"united states", "united states of america", "usa", "us"}:
        return "us"
    return country[:2] if len(country) == 2 else "in"

def country_display_name(country_code):
    return "United States" if country_code == "us" else "India"

def normalize_parser_type(value, url):
    parser = re.sub(r"[^a-z0-9]+", "_", clean_external_text(value).casefold()).strip("_")
    host = urlparse(url).netloc.casefold()
    if parser:
        return parser
    if "amazon.jobs" in host:
        return "amazon"
    if "oraclecloud.com" in host:
        return "oracle"
    if "successfactors" in host:
        return "successfactors"
    return "auto"

def fetch_career_sources():
    sheet_url = configured_career_sources_sheet_url()
    if not sheet_url:
        raise CareerSourcesError("Career source sheet URL is not configured.", 500)
    cached = CAREER_SOURCES_CACHE.get(sheet_url)
    if cached and time.time() - cached["timestamp"] < CAREER_SOURCES_CACHE_TTL_SECONDS:
        return cached["sources"]
    try:
        response = requests.get(sheet_url, timeout=25, headers={"User-Agent": "ResumeNexaJobs/1.0"})
    except requests.RequestException as exc:
        logger.error(f"Career source sheet request failed: {type(exc).__name__}")
        raise CareerSourcesError("Could not load the company careers sheet right now.") from exc
    logger.info(f"Career source sheet status code={response.status_code}")
    if response.status_code in {401, 403}:
        raise CareerSourcesError(
            "The company careers sheet is not publicly viewable. Set sharing to anyone with the link can view.",
            502,
        )
    if not response.ok:
        raise CareerSourcesError("Could not load the company careers sheet right now.")
    rows = list(csv.reader(io.StringIO(response.text)))
    if not rows:
        raise CareerSourcesError("The company careers sheet is empty.", 400)
    headers = [normalize_sheet_header(cell) for cell in rows[0]]
    url_index = next((i for i, value in enumerate(headers) if value in {"career_url", "url", "link"} or "url" in value or "link" in value), None)
    has_named_headers = {"company", "career_url"}.issubset(set(headers)) or url_index is not None
    data_rows = rows[1:] if has_named_headers else rows
    sources = []
    seen = set()
    seen_provider_hosts = set()
    for row in data_rows:
        cells = [cell.strip() for cell in row]
        row_data = {headers[index]: cells[index] for index in range(min(len(headers), len(cells)))} if has_named_headers else {}
        source_url = get_sheet_value(row_data, "career_url", "url", "link") or (
            cells[url_index] if url_index is not None and url_index < len(cells) else next(
            (cell for cell in cells if validate_external_url(cell) and cell.lower().startswith(("http://", "https://"))),
            "",
            )
        )
        source_url = source_url.strip()
        verification_url = get_sheet_value(row_data, "verification_source_url", "verification_url", "source_url")
        if verification_url and not validate_external_url(verification_url):
            verification_url = ""
        if not source_url or not validate_external_url(source_url):
            continue
        source_key = (source_url, verification_url)
        if source_key in seen:
            continue
        source_host = urlparse(source_url).netloc.casefold().replace("www.", "")
        if source_host == "amazon.jobs" and source_host in seen_provider_hosts:
            continue
        company = get_sheet_value(row_data, "company", "organisation", "organization", "name")
        country = normalize_source_country(get_sheet_value(row_data, "country"))
        parser_type = normalize_parser_type(get_sheet_value(row_data, "parser_type", "parser"), source_url)
        source_type = get_sheet_value(row_data, "source_type", "source") or "career_page"
        sources.append({
            "company": source_company_label(source_url, company),
            "url": source_url,
            "country": country,
            "sourceType": clean_external_text(source_type)[:80],
            "parserType": parser_type,
            "verificationUrl": verification_url,
        })
        seen.add(source_key)
        seen_provider_hosts.add(source_host)
    if not sources:
        raise CareerSourcesError("No valid company careers URLs were found in the sheet.", 400)
    CAREER_SOURCES_CACHE[sheet_url] = {"timestamp": time.time(), "sources": sources}
    return sources

def extract_section_from_description(description, labels):
    if not description:
        return ""
    heading = "|".join(re.escape(label) for label in labels)
    match = re.search(
        rf"(?is)(?:^|\s)({heading})\s*:?\s*(.+?)(?=\s(?:responsibilities|requirements|qualifications|eligibility|eligible batch|batch|about us|apply now)\s*:|$)",
        description,
    )
    return clean_external_text(match.group(2))[:4000] if match else ""

def infer_job_details(node, description):
    requirements = text_from_schema(
        node.get("qualifications") or node.get("skills") or node.get("experienceRequirements")
    ) or extract_section_from_description(description, ["requirements", "qualifications", "skills"])
    responsibilities = text_from_schema(node.get("responsibilities")) or extract_section_from_description(
        description, ["responsibilities", "what you'll do", "role responsibilities"]
    )
    eligibility = text_from_schema(node.get("educationRequirements")) or extract_section_from_description(
        description, ["eligibility", "education", "who can apply"]
    )
    batch_match = re.search(
        r"(?i)\b(?:batch|graduat(?:ion|ing)\s*year|passing\s*out|pass\s*out)\b\s*[:\-]?\s*([0-9,\-/ &to]{4,40})",
        description,
    )
    batch = batch_match.group(1).strip() if batch_match else extract_section_from_description(description, ["eligible batch", "batch"])
    searchable = f"{description} {requirements} {eligibility} {node.get('title', '')}".lower()
    experience = "Fresher" if any(term in searchable for term in ("fresher", "entry level", "graduate", "intern")) else (
        "Experienced" if any(term in searchable for term in ("years experience", "year experience", "senior", "lead", "professional")) else "Not specified"
    )
    return {
        "requirements": requirements,
        "responsibilities": responsibilities,
        "eligibility": eligibility,
        "batch": batch,
        "experienceLevel": experience,
    }

def normalize_structured_job(node, source, page_url):
    title = clean_external_text(node.get("title") or node.get("name"))
    if not title:
        return None
    organization = node.get("hiringOrganization") or {}
    company = clean_external_text(organization.get("name") if isinstance(organization, dict) else organization) or source["company"]
    logo = organization.get("logo") if isinstance(organization, dict) else None
    if isinstance(logo, dict):
        logo = logo.get("url")
    logo = str(logo or "")
    if not validate_external_url(logo):
        logo = ""
    locations = node.get("jobLocation") or []
    locations = locations if isinstance(locations, list) else [locations]
    location_parts = []
    for item in locations:
        address = item.get("address", {}) if isinstance(item, dict) else {}
        if isinstance(address, dict):
            place = ", ".join(str(value) for value in (
                address.get("addressLocality"), address.get("addressRegion"), address.get("addressCountry")
            ) if value)
            if place:
                location_parts.append(place)
        elif address:
            location_parts.append(str(address))
    work_type = str(node.get("jobLocationType") or "")
    description = clean_external_text(node.get("description"))[:50000]
    combined = f"{work_type} {description}".lower()
    work_mode = "Remote" if "telecommute" in combined or "remote" in combined else ("Hybrid" if "hybrid" in combined else "In office")
    details = infer_job_details(node, description)
    apply_link = str(node.get("url") or page_url)
    return {
        "id": str(node.get("identifier") or apply_link),
        "title": title[:255],
        "company": company[:255],
        "publisher": source["company"],
        "sourceType": source.get("sourceType", "career_page"),
        "parserType": source.get("parserType", "auto"),
        "verificationSourceUrl": source.get("verificationUrl", ""),
        "sourceCountry": source.get("country", "in"),
        "employmentType": clean_external_text(node.get("employmentType"))[:80],
        "careerArea": "",
        "location": ", ".join(location_parts)[:255] or "Location not specified",
        "isRemote": work_mode == "Remote",
        "workMode": work_mode,
        "postedAt": node.get("datePosted"),
        "applyLink": apply_link[:4000],
        "description": description,
        "logo": logo or None,
        "countryVerified": source.get("country", "in") == "in",
        "highlights": {},
        "salary": {},
        **details,
    }

def extract_structured_jobs(html_text, source, page_url):
    soup = BeautifulSoup(html_text, "html.parser")
    records = []
    def visit(node):
        if isinstance(node, list):
            for child in node:
                visit(child)
        elif isinstance(node, dict):
            node_types = node.get("@type", [])
            node_types = node_types if isinstance(node_types, list) else [node_types]
            if "JobPosting" in node_types:
                job = normalize_structured_job(node, source, page_url)
                if job:
                    records.append(job)
            for child in node.values():
                visit(child)
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            visit(json.loads(script.string or script.get_text() or "{}"))
        except json.JSONDecodeError:
            continue
    for posting in soup.find_all(attrs={"itemtype": re.compile(r"schema\.org/JobPosting", re.I)}):
        def micro_value(prop):
            field = posting.find(attrs={"itemprop": prop})
            return clean_external_text(field.get("content") or field.get_text(" ", strip=True)) if field else ""
        node = {
            "title": micro_value("title"),
            "description": micro_value("description"),
            "datePosted": micro_value("datePosted"),
            "validThrough": micro_value("validThrough"),
            "hiringOrganization": micro_value("hiringOrganization"),
            "jobLocation": {"address": {"addressCountry": micro_value("streetAddress")}},
            "url": page_url,
        }
        job = normalize_structured_job(node, source, page_url)
        if job and not any(existing["title"] == job["title"] and existing["applyLink"] == job["applyLink"] for existing in records):
            records.append(job)
    return records

def discover_official_job_links(html_text, source_url):
    soup = BeautifulSoup(html_text, "html.parser")
    links = []
    seen = set()
    source_host = urlparse(source_url).netloc.casefold()
    for anchor in soup.find_all("a", href=True):
        link = urljoin(source_url, anchor["href"])
        searchable = f"{link} {anchor.get_text(' ', strip=True)}".lower()
        if link == source_url or not validate_external_url(link) or urlparse(link).netloc.casefold() != source_host:
            continue
        if not re.search(r"job[-_ ]?details?|jobdetail|/job/[^?#]+|/jobs/[^?#]+/[^?#]+", searchable):
            continue
        if link not in seen:
            links.append(link)
            seen.add(link)
    return links

def infer_work_mode(text):
    searchable = (text or "").casefold()
    if "remote" in searchable or "work from home" in searchable:
        return "Remote"
    if "hybrid" in searchable:
        return "Hybrid"
    return "In office"

def fetch_amazon_career_jobs(source):
    parsed_url = urlparse(source["url"])
    search_url = f"{parsed_url.scheme}://{parsed_url.netloc}/en/search.json"
    country_code = source.get("country", "in")
    country_name = country_display_name(country_code)
    try:
        response = requests.get(
            search_url,
            params={
                "base_query": "",
                "loc_query": country_name,
                "country": "USA" if country_code == "us" else "IND",
                "result_limit": "100",
            },
            timeout=25,
            headers={"User-Agent": "ResumeNexaJobs/1.0", "Accept": "application/json"},
        )
        response.raise_for_status()
        records = response.json().get("jobs", [])
    except (requests.RequestException, ValueError) as exc:
        logger.warning(f"Amazon careers feed failed: {type(exc).__name__}")
        return []
    jobs = []
    origin = f"{parsed_url.scheme}://{parsed_url.netloc}"
    for record in records:
        title = clean_external_text(record.get("title"))
        if not title:
            continue
        description = clean_external_text(record.get("description"))[:50000]
        requirements = " ".join(filter(None, (
            clean_external_text(record.get("basic_qualifications")),
            clean_external_text(record.get("preferred_qualifications")),
        )))[:4000]
        responsibilities = extract_section_from_description(
            description, ["key job responsibilities", "responsibilities"]
        )
        details = infer_job_details(
            {"title": title, "qualifications": requirements, "responsibilities": responsibilities},
            f"{description} {requirements}",
        )
        job_path = str(record.get("job_path") or "")
        apply_link = urljoin(origin, job_path) if job_path else source["url"]
        work_mode = infer_work_mode(f"{title} {description}")
        jobs.append({
            "id": str(record.get("id") or apply_link),
            "title": title[:255],
            "company": clean_external_text(record.get("company_name"))[:255] or source["company"],
            "publisher": source["company"],
            "sourceType": source.get("sourceType", "career_page"),
            "parserType": source.get("parserType", "amazon"),
            "verificationSourceUrl": source.get("verificationUrl", ""),
            "sourceCountry": country_code,
            "employmentType": clean_external_text(record.get("job_schedule_type"))[:80],
            "careerArea": clean_external_text(record.get("job_category"))[:120],
            "location": clean_external_text(record.get("location"))[:255] or country_name,
            "isRemote": work_mode == "Remote",
            "workMode": work_mode,
            "postedAt": record.get("posted_date"),
            "applyLink": apply_link[:4000],
            "description": description,
            "logo": None,
            "countryVerified": country_code == "in",
            "highlights": {},
            "salary": {},
            **details,
        })
    return jobs

def fetch_successfactors_career_jobs(source):
    parsed_url = urlparse(source["url"])
    search_url = f"{parsed_url.scheme}://{parsed_url.netloc}/search/"
    country_name = country_display_name(source.get("country", "in"))
    try:
        response = requests.get(
            search_url,
            params={"q": "", "locationsearch": country_name},
            timeout=25,
            headers={"User-Agent": "ResumeNexaJobs/1.0"},
        )
        response.raise_for_status()
        detail_links = discover_official_job_links(response.text, search_url)
        def fetch_detail(detail_url):
            try:
                detail_response = requests.get(detail_url, timeout=10, headers={"User-Agent": "ResumeNexaJobs/1.0"})
                if detail_response.ok:
                    parsed_jobs = extract_structured_jobs(detail_response.text, source, detail_url)
                    for job in parsed_jobs:
                        job["countryVerified"] = source.get("country", "in") == "in"
                    return parsed_jobs
            except requests.RequestException as exc:
                logger.warning(f"Skipping job detail {urlparse(detail_url).netloc}: {type(exc).__name__}")
            return []
        jobs = []
        if detail_links:
            workers = min(8, len(detail_links))
            with ThreadPoolExecutor(max_workers=workers) as executor:
                for parsed_jobs in executor.map(fetch_detail, detail_links):
                    jobs.extend(parsed_jobs)
        return jobs
    except requests.RequestException as exc:
        logger.warning(f"SuccessFactors source failed {parsed_url.netloc}: {type(exc).__name__}")
        return []

def fetch_workday_career_jobs(source):
    parsed_url = urlparse(source["url"])
    site = parsed_url.path.strip("/").split("/")[0]
    tenant = parsed_url.netloc.split(".")[0]
    if not site or not tenant:
        return []
    api_base = f"{parsed_url.scheme}://{parsed_url.netloc}/wday/cxs/{tenant}/{site}"
    country_name = country_display_name(source.get("country", "in"))
    try:
        response = requests.post(
            f"{api_base}/jobs",
            json={"appliedFacets": {}, "limit": 20, "offset": 0, "searchText": ""},
            timeout=25,
            headers={
                "User-Agent": "ResumeNexaJobs/1.0",
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        )
        response.raise_for_status()
        records = response.json().get("jobPostings", [])
    except (requests.RequestException, ValueError) as exc:
        logger.warning(f"Workday careers source failed {parsed_url.netloc}: {type(exc).__name__}")
        return []

    jobs = []
    for record in records:
        title = clean_external_text(record.get("title"))
        if not title:
            continue
        external_path = str(record.get("externalPath") or "")
        detail_url = f"{api_base}{external_path}" if external_path.startswith("/") else ""
        description = ""
        requirements = ""
        responsibilities = ""
        detail_location = ""
        country_verified = False
        posted_at = record.get("postedOn") or record.get("startDate")
        if detail_url:
            try:
                detail_response = requests.get(
                    detail_url,
                    timeout=10,
                    headers={"User-Agent": "ResumeNexaJobs/1.0", "Accept": "application/json"},
                )
                if detail_response.ok:
                    detail = detail_response.json().get("jobPostingInfo", {})
                    description = clean_external_text(detail.get("jobDescription") or detail.get("jobDescriptionText"))[:50000]
                    requirements = clean_external_text(detail.get("qualifications"))[:4000]
                    responsibilities = clean_external_text(detail.get("jobResponsibilities"))[:4000]
                    detail_location = clean_external_text(detail.get("location") or detail.get("jobRequisitionLocation"))[:255]
                    detail_country = detail.get("country") or {}
                    if isinstance(detail_country, dict):
                        country_verified = str(detail_country.get("alpha2Code") or detail_country.get("descriptor") or "").casefold() in {"in", "india"}
                    posted_at = detail.get("postedOn") or posted_at
            except (requests.RequestException, ValueError) as exc:
                logger.warning(f"Skipping Workday job detail {parsed_url.netloc}: {type(exc).__name__}")
        searchable_text = f"{title} {description} {requirements} {record.get('locationsText', '')}"
        details = infer_job_details(
            {"title": title, "qualifications": requirements, "responsibilities": responsibilities},
            searchable_text,
        )
        apply_link = urljoin(f"{parsed_url.scheme}://{parsed_url.netloc}", external_path) if external_path else source["url"]
        jobs.append({
            "id": str(record.get("bulletFields") or external_path or f"{source['company']}-{title}"),
            "title": title[:255],
            "company": source["company"],
            "publisher": source["company"],
            "sourceType": source.get("sourceType", "career_page"),
            "parserType": source.get("parserType", "workday"),
            "verificationSourceUrl": source.get("verificationUrl", ""),
            "sourceCountry": source.get("country", "in"),
            "employmentType": clean_external_text(record.get("timeType"))[:80],
            "careerArea": clean_external_text(record.get("jobFamily") or record.get("jobFamilyGroup"))[:120],
            "location": detail_location or clean_external_text(record.get("locationsText"))[:255] or country_name,
            "isRemote": infer_work_mode(searchable_text) == "Remote",
            "workMode": infer_work_mode(searchable_text),
            "postedAt": posted_at,
            "applyLink": apply_link[:4000],
            "description": description or clean_external_text(record.get("subtitle"))[:50000],
            "logo": None,
            "countryVerified": country_verified,
            "highlights": {},
            "salary": {},
            **details,
        })
    return jobs

def fetch_applytojob_career_jobs(source):
    try:
        response = requests.get(source["url"], timeout=20, headers={"User-Agent": "ResumeNexaJobs/1.0"})
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.warning(f"ApplyToJob source failed {urlparse(source['url']).netloc}: {type(exc).__name__}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    links = []
    seen = set()
    for anchor in soup.find_all("a", href=True):
        text = anchor.get_text(" ", strip=True)
        link = urljoin(source["url"], anchor["href"])
        if link in seen or not validate_external_url(link):
            continue
        if "/apply/" not in link.lower() and not re.search(r"\b(apply|job|role|position)\b", text, re.I):
            continue
        links.append(link)
        seen.add(link)
    jobs = extract_structured_jobs(response.text, source, source["url"])
    for detail_url in links[:100]:
        try:
            detail_response = requests.get(detail_url, timeout=10, headers={"User-Agent": "ResumeNexaJobs/1.0"})
            if detail_response.ok:
                jobs.extend(extract_structured_jobs(detail_response.text, source, detail_url))
        except requests.RequestException as exc:
            logger.warning(f"Skipping ApplyToJob detail {urlparse(detail_url).netloc}: {type(exc).__name__}")
    deduped = []
    seen_jobs = set()
    for job in jobs:
        job["sourceType"] = source.get("sourceType", "career_page")
        job["parserType"] = source.get("parserType", "applytojob")
        job["verificationSourceUrl"] = source.get("verificationUrl", "")
        job["sourceCountry"] = source.get("country", "in")
        job["countryVerified"] = source.get("country", "in") == "in"
        key = (job.get("title", "").casefold(), job.get("applyLink", "").casefold())
        if key not in seen_jobs:
            deduped.append(job)
            seen_jobs.add(key)
    return deduped

def fetch_oracle_candidate_jobs(source, page_html):
    endpoint_match = re.search(
        r"https?://[a-z0-9.-]+\.oraclecloud\.com(?::\d+)?",
        page_html,
        re.I,
    )
    site_match = re.search(r"siteNumber[=\\\"']+([A-Za-z0-9_]+)", page_html, re.I)
    if not endpoint_match or not site_match:
        return []
    api_origin = endpoint_match.group(0)
    site_number = site_match.group(1)
    endpoint = f"{api_origin}/hcmRestApi/resources/latest/recruitingCEJobRequisitions"
    try:
        facet_response = requests.get(
            endpoint,
            params={
                "onlyData": "true",
                "expand": "requisitionList",
                "finder": f"findReqs;siteNumber={site_number},facetsList=LOCATIONS,limit=1,offset=0",
            },
            timeout=20,
            headers={"User-Agent": "ResumeNexaJobs/1.0", "Accept": "application/json"},
        )
        facet_response.raise_for_status()
        search_state = (facet_response.json().get("items") or [{}])[0]
        country_name = country_display_name(source.get("country", "in"))
        india_facet = next(
            (facet for facet in search_state.get("locationsFacet", []) if str(facet.get("Name", "")).casefold() == country_name.casefold()),
            None,
        )
        if not india_facet:
            return []
        response = requests.get(
            endpoint,
            params={
                "onlyData": "true",
                "expand": "requisitionList",
                "finder": (
                    f"findReqs;siteNumber={site_number},facetsList=LOCATIONS,"
                    f"limit=100,offset=0,selectedLocationsFacet={india_facet['Id']}"
                ),
            },
            timeout=25,
            headers={"User-Agent": "ResumeNexaJobs/1.0", "Accept": "application/json"},
        )
        response.raise_for_status()
        records = (response.json().get("items") or [{}])[0].get("requisitionList", [])
    except (requests.RequestException, ValueError) as exc:
        logger.warning(f"Oracle careers source failed {urlparse(source['url']).netloc}: {type(exc).__name__}")
        return []
    page_base = source["url"].split("?", 1)[0].rstrip("/")
    jobs = []
    for record in records:
        title = clean_external_text(record.get("Title"))
        if not title:
            continue
        description = clean_external_text(record.get("ShortDescriptionStr"))[:50000]
        requirements = clean_external_text(record.get("ExternalQualificationsStr"))[:4000]
        responsibilities = clean_external_text(record.get("ExternalResponsibilitiesStr"))[:4000]
        details = infer_job_details(
            {"title": title, "qualifications": requirements, "responsibilities": responsibilities},
            f"{description} {requirements}",
        )
        work_mode = infer_work_mode(f"{record.get('WorkplaceType', '')} {description}")
        job_id = str(record.get("Id") or "")
        jobs.append({
            "id": job_id or f"{source['company']}-{title}",
            "title": title[:255],
            "company": source["company"],
            "publisher": source["company"],
            "sourceType": source.get("sourceType", "career_page"),
            "parserType": source.get("parserType", "oracle"),
            "verificationSourceUrl": source.get("verificationUrl", ""),
            "sourceCountry": source.get("country", "in"),
            "employmentType": clean_external_text(record.get("JobSchedule") or record.get("JobType"))[:80],
            "careerArea": clean_external_text(record.get("JobFamily") or record.get("JobFunction"))[:120],
            "location": clean_external_text(record.get("PrimaryLocation"))[:255] or country_name,
            "isRemote": work_mode == "Remote",
            "workMode": work_mode,
            "postedAt": record.get("PostedDate"),
            "applyLink": f"{page_base}/job/{job_id}" if job_id else page_base,
            "description": description,
            "logo": None,
            "countryVerified": source.get("country", "in") == "in",
            "highlights": {},
            "salary": {},
            **details,
        })
    return jobs

def discover_external_successfactors_source(source, page_html):
    for link in re.findall(r"https?://[^\"' <]+/[^\"' <]*search/[^\"' <]*", page_html, re.I):
        link = link.replace("&amp;", "&").replace("&#34;", "")
        host = urlparse(link).netloc.casefold()
        if host.startswith("careers.") and validate_external_url(link):
            return {**source, "url": link, "parserType": "successfactors"}
    return None

def fetch_single_company_jobs(source):
    host = urlparse(source["url"]).netloc.casefold()
    parser_type = source.get("parserType", "auto")
    if parser_type in {"unsupported", "manual", "js_only", "javascript_only", "blocked", "generic_or_manual"}:
        logger.info(f"Careers source host={host} parser={parser_type} skipped=manual_or_unsupported")
        return []
    if parser_type.startswith("amazon") or "amazon.jobs" in host:
        source_jobs = fetch_amazon_career_jobs(source)
        logger.info(f"Careers source host={host} parser={parser_type} adapter=amazon jobs={len(source_jobs)}")
        return source_jobs
    if parser_type.startswith("workday") or "myworkdayjobs.com" in host:
        source_jobs = fetch_workday_career_jobs(source)
        logger.info(f"Careers source host={host} parser={parser_type} adapter=workday jobs={len(source_jobs)}")
        return source_jobs
    if parser_type.startswith("applytojob") or "applytojob.com" in host:
        source_jobs = fetch_applytojob_career_jobs(source)
        logger.info(f"Careers source host={host} parser={parser_type} adapter=applytojob jobs={len(source_jobs)}")
        return source_jobs
    try:
        response = requests.get(source["url"], timeout=20, headers={"User-Agent": "ResumeNexaJobs/1.0"})
        response.raise_for_status()
        source_jobs = []
        if parser_type in {"auto", "json_ld", "schema", "schema_org", "structured", "microdata"}:
            source_jobs.extend(extract_structured_jobs(response.text, source, source["url"]))
        if not source_jobs and (parser_type.startswith("oracle") or "oraclecloud.com" in response.text.casefold()):
            source_jobs.extend(fetch_oracle_candidate_jobs(source, response.text))
        if not source_jobs and (parser_type.startswith("successfactors") or "successfactors" in response.text.casefold()):
            source_jobs.extend(fetch_successfactors_career_jobs(source))
        if not source_jobs:
            external_successfactors = discover_external_successfactors_source(source, response.text)
            if external_successfactors:
                source_jobs.extend(fetch_successfactors_career_jobs(external_successfactors))
        country_scoped_source = source.get("country", "in") == "in" or re.search(r"(?:india|/in(?:[-_/]|$))", source["url"].casefold())
        if not source_jobs and country_scoped_source:
            for detail_url in discover_official_job_links(response.text, source["url"]):
                try:
                    detail_response = requests.get(detail_url, timeout=10, headers={"User-Agent": "ResumeNexaJobs/1.0"})
                    if detail_response.ok:
                        source_jobs.extend(extract_structured_jobs(detail_response.text, source, detail_url))
                except requests.RequestException as exc:
                    logger.warning(f"Skipping job detail {urlparse(detail_url).netloc}: {type(exc).__name__}")
        logger.info(f"Careers source host={host} parser={parser_type} country={source.get('country', 'in')} jobs={len(source_jobs)}")
        return source_jobs
    except requests.RequestException as exc:
        logger.warning(f"Skipping careers source {urlparse(source['url']).netloc}: {type(exc).__name__}")
        return []

def fetch_company_career_jobs():
    sheet_url = configured_career_sources_sheet_url()
    cached = CAREER_JOBS_CACHE.get(sheet_url)
    if cached and time.time() - cached["timestamp"] < CAREER_JOBS_CACHE_TTL_SECONDS:
        return cached["jobs"], cached["sources"]
    sources = fetch_career_sources()
    jobs = []
    visible_jobs = set()
    worker_count = max(1, min(CAREER_FETCH_WORKERS, len(sources)))
    with ThreadPoolExecutor(max_workers=worker_count) as executor:
        futures = {executor.submit(fetch_single_company_jobs, source): source for source in sources}
        source_job_groups = [future.result() for future in as_completed(futures)]
    for source_jobs in source_job_groups:
        for job in source_jobs:
            visible_key = (job["company"].casefold(), job["title"].casefold(), job["location"].casefold())
            if visible_key not in visible_jobs:
                jobs.append(job)
                visible_jobs.add(visible_key)
    CAREER_JOBS_CACHE[sheet_url] = {"timestamp": time.time(), "jobs": jobs, "sources": sources}
    return jobs, sources

def is_india_job(job):
    if job.get("countryVerified"):
        return True
    location = str(job.get("location") or "").casefold().strip()
    india_markers = (
        "india", "bengaluru", "bangalore", "hyderabad", "pune", "chennai",
        "mumbai", "noida", "gurugram", "gurgaon", "delhi", "kolkata",
        "kochi", "coimbatore", "ahmedabad",
    )
    return location == "in" or any(marker in location for marker in india_markers)

def fetch_sheet_career_jobs(category, query):
    try:
        jobs, sources = fetch_company_career_jobs()
    except CareerSourcesError as exc:
        return JSONResponse({"error": str(exc)}, status_code=exc.status_code)
    query_text = (query or "").strip().casefold()
    category_terms = {
        "it": ("software", "developer", "data", "cloud", "devops", "security", "technology"),
        "non-it": ("sales", "marketing", "finance", "human resource", "operations"),
        "core": ("mechanical", "electrical", "civil", "electronics", "manufacturing"),
    }
    filtered = []
    for job in jobs:
        if not is_india_job(job):
            continue
        searchable = " ".join(str(job.get(field) or "") for field in (
            "title", "company", "location", "description", "requirements", "responsibilities", "eligibility"
        )).casefold()
        if query_text and query_text not in searchable:
            continue
        if not query_text and category in category_terms and not any(term in searchable for term in category_terms[category]):
            continue
        filtered.append(job)
    available_companies = sorted({str(job.get("publisher") or job.get("company") or "").strip() for job in filtered if job.get("publisher") or job.get("company")})
    return {
        "category": category,
        "query": query.strip(),
        "jobs": filtered,
        "count": len(filtered),
        "total": len(filtered),
        "provider": "Company career pages",
        "sourceCount": len(sources),
        "availableCompanyCount": len(available_companies),
        "availableCompanies": available_companies,
    }

def extract_text_from_pdf(pdf_file):
    """Extract text content from PDF file"""
    try:
        pdf_file.seek(0)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        if not text.strip():
            raise Exception("No extractable text found in the PDF. The file may be scanned or image-based.")
        logger.debug("Successfully extracted text from PDF.")
        return text
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {str(e)}")
        raise

def extract_resume_sections(resume_text):
    """Extract specific sections from resume"""
    sections = {
        "skills": [],
        "projects": [],
        "experience": [],
        "education": [],
        "contact": {},
        "summary": ""
    }
    
    # Extract skills
    skills_pattern = r'(?i)(?:skills?|technical skills?|core competencies)[\s:]*([^#\n]+(?:\n(?![A-Z][a-z]+:)[^\n]+)*)'
    skills_match = re.search(skills_pattern, resume_text)
    if skills_match:
        skills_text = skills_match.group(1)
        skills = re.split(r'[,;•\-\*\n]', skills_text)
        sections["skills"] = [s.strip() for s in skills if s.strip() and len(s.strip()) > 2][:15]
    
    # Extract projects
    projects_pattern = r'(?i)(?:projects?|key projects?)[\s:]*([^#]+?)(?=(?:\n[A-Z][a-z]+:)|$)'
    projects_match = re.search(projects_pattern, resume_text)
    if projects_match:
        projects_text = projects_match.group(1)
        project_items = re.split(r'(?:\n|^)[•\-\*]\s*|\n(?=[A-Z])', projects_text)
        sections["projects"] = [p.strip() for p in project_items if p.strip() and len(p.strip()) > 10][:5]
    
    # Extract experience
    experience_pattern = r'(?i)(?:experience|work history|employment)[\s:]*([^#]+?)(?=(?:\n[A-Z][a-z]+:)|$)'
    experience_match = re.search(experience_pattern, resume_text)
    if experience_match:
        experience_text = experience_match.group(1)
        sections["experience"] = [exp.strip() for exp in experience_text.split('\n') if exp.strip()][:10]
    
    # Extract education
    education_pattern = r'(?i)(?:education|academic background)[\s:]*([^#]+?)(?=(?:\n[A-Z][a-z]+:)|$)'
    education_match = re.search(education_pattern, resume_text)
    if education_match:
        education_text = education_match.group(1)
        sections["education"] = [edu.strip() for edu in education_text.split('\n') if edu.strip()][:5]
    
    # Extract contact
    email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
    phone_pattern = r'[\+\(]?[0-9][0-9 \.\-\(\)]{8,}[0-9]'
    
    email_match = re.search(email_pattern, resume_text)
    phone_match = re.search(phone_pattern, resume_text)
    
    if email_match:
        sections["contact"]["email"] = email_match.group()
    if phone_match:
        sections["contact"]["phone"] = phone_match.group()
    
    # Extract summary
    summary_pattern = r'(?i)(?:summary|about me|profile|objective)[\s:]*([^\n]+(?:\n(?![A-Z][a-z]+:)[^\n]+)*)'
    summary_match = re.search(summary_pattern, resume_text)
    if summary_match:
        sections["summary"] = summary_match.group(1).strip()
    
    return sections

def analyze_resume_with_gemini(resume_text, resume_sections, target_role=None):
    
    prompt = f"""
You are an expert ATS (Applicant Tracking System) and professional resume reviewer specializing in 2025 resume standards. 
Analyze the following resume comprehensively based on modern professional resume writing rules.

RESUME TEXT:
{resume_text}

TARGET ROLE:
{target_role if target_role else 'Not provided. Give general resume feedback, but do not invent a role.'}

EXTRACTED SECTIONS:
- Skills: {', '.join(resume_sections['skills'][:10]) if resume_sections['skills'] else 'Not found'}
- Projects: {len(resume_sections['projects'])} projects detected
- Experience: {len(resume_sections['experience'])} entries detected
- Education: {len(resume_sections['education'])} entries detected
- Contact Info: {'Email and Phone found' if resume_sections['contact'].get('email') and resume_sections['contact'].get('phone') else 'Incomplete contact info'}

EVALUATION CRITERIA (2025 Professional Resume Standards):

1. **LENGTH & BREVITY (0-100)**
   - One page for early-career (0-5 years)
   - Maximum two pages for experienced candidates (5+ years)
   - Penalize if too long or unnecessarily brief

2. **FORMATTING & ATS OPTIMIZATION (0-100)**
   - Standard fonts (Arial, Calibri, Times New Roman) at 10-12pt
   - Clear section headings (Work Experience, not "My Career Path")
   - Consistent date formats throughout
   - No complex graphics, tables, or columns that break ATS
   - Proper use of bullet points
   - 1-inch margins

3. **CONTENT QUALITY & IMPACT (0-100)**
   - Uses "Action Verb + Task + Metric" formula (e.g., "Increased sales by 20%")
   - Quantifiable achievements (numbers, percentages, metrics)
   - Reverse-chronological order
   - Focus on achievements, not just duties
   - 3-6 bullet points per role

4. **ESSENTIAL SECTIONS PRESENT (0-100)**
   Required:
   - Contact Information (name, email, phone, location)
   - Professional Summary or Objective (2-3 sentences)
   - Work Experience (with job title, company, dates, location)
   - Skills Section (hard skills listed clearly)
   - Education (degree, major, institution)
   
   Bonus:
   - Certifications
   - Languages
   - Projects/Volunteering

5. **WHAT TO AVOID (Deductions)**
   - Personal data (birth date, marital status, religion)
   - Photos (unless specifically requested)
   - Complex graphics or charts
   - Unprofessional email addresses
   - Full home addresses
   - References (save for separate document)

6. **ROLE ALIGNMENT**
   - If a target role is provided, tailor keyword analysis and recommendations to that role.
   - If no target role is provided, keep suggestions role-neutral and based only on resume content.

Provide your analysis in VALID JSON format only (no markdown, no backticks, no additional text):

{{
    "overall_score": <0-100 based on all criteria>,
    "content_score": <0-100 for content quality and impact>,
    "formatting_score": <0-100 for ATS optimization and formatting>,
    "impact_score": <0-100 for use of metrics and achievements>,
    "keywords_score": <0-100 for industry keywords and skills>,
    
    "length_assessment": {{
        "page_count_estimate": <1 or 2>,
        "is_appropriate": <true/false>,
        "feedback": "brief explanation"
    }},
    
    "strengths": [
        "Specific strength 1 with example",
        "Specific strength 2 with example",
        "Specific strength 3 with example"
    ],
    
    "improvements": [
        "Specific actionable improvement 1, tailored to target role if provided",
        "Specific actionable improvement 2, tailored to target role if provided",
        "Specific actionable improvement 3, tailored to target role if provided",
        "Specific actionable improvement 4",
        "Specific actionable improvement 5"
    ],
    
    "keyword_analysis": {{
        "strong_keywords": ["keyword1", "keyword2", "keyword3"],
        "missing_keywords": ["missing1", "missing2", "missing3"],
        "industry_relevance": "brief assessment"
    }},
    
    "detailed_feedback": {{
        "contact_info": "assessment of header/contact section",
        "summary": "assessment of professional summary/objective",
        "experience": "assessment of work experience section",
        "skills": "assessment of skills section",
        "education": "assessment of education section",
        "formatting": "assessment of overall formatting and ATS compatibility",
        "quantifiable_achievements": "assessment of metrics usage"
    }},
    
    "section_checklist": {{
        "has_contact_info": <true/false>,
        "has_professional_summary": <true/false>,
        "has_work_experience": <true/false>,
        "has_skills_section": <true/false>,
        "has_education": <true/false>,
        "has_inappropriate_content": <true/false>,
        "missing_sections": ["section1", "section2"]
    }},
    
    "ats_compatibility": {{
        "score": <0-100>,
        "uses_standard_headings": <true/false>,
        "has_complex_formatting": <true/false>,
        "parsing_issues": ["issue1", "issue2"] or []
    }}
}}

Be specific, actionable, and constructive. Reference actual content from the resume in your feedback.
Rate strictly according to 2025 professional standards.
"""

    try:
        logger.info("🤖 Calling Gemini API for comprehensive resume analysis...")
        response = model.generate_content(prompt)
        
        # Extract and clean JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0]
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0]
        
        response_text = response_text.strip()
        
        # Parse JSON
        analysis_result = json.loads(response_text)
        logger.info("✅ Successfully received and parsed Gemini API response")
        logger.info(f"   Overall Score: {analysis_result.get('overall_score', 'N/A')}/100")
        return analysis_result
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ Failed to parse Gemini response as JSON: {str(e)}")
        raise Exception("Failed to parse AI response. Please try again.")
        
    except Exception as e:
        logger.error(f"❌ Gemini API request failed: {type(e).__name__}")
        raise Exception("AI analysis failed. Please try again.")

@app.get('/')
def home():
    """Root endpoint - API information"""
    return {
        "message": "Resume Checker API - Powered by Gemini AI",
        "version": "2.0",
        "status": "running",
        "endpoints": {
            "health_check": "/api/health",
            "resume_analysis": "/api/resume/check (POST)",
            "india_jobs": "/api/jobs/india (GET)",
            "signup": "/api/signup (POST)",
            "login": "/api/login (POST)",
            "profile": "/api/profile (GET)",
            "saved_jobs": "/api/jobs/saved (POST, DELETE)",
            "logout": "/api/logout (POST)"
        },
        "documentation": "Visit /api/health to check if Gemini API is configured"
    }

@app.post('/api/signup')
def signup(payload: SignupRequest, request: Request):
    limited = rate_limit_response(request, "signup", limit=5, window_seconds=15 * 60)
    if limited:
        return limited

    full_name = (payload.fullName or payload.name or "").strip()
    email = payload.email.lower().strip()
    password = payload.password

    if not validate_full_name(full_name):
        return JSONResponse({"error": "Enter a valid full name using letters, spaces, hyphens, or apostrophes."}, status_code=400)
    if not validate_email(email):
        return JSONResponse({"error": "Valid email is required."}, status_code=400)

    is_valid_password, password_message = validate_password(password)
    if not is_valid_password:
        return JSONResponse({"error": password_message}, status_code=400)

    try:
        if fetch_user_by_email(email):
            return JSONResponse({"error": "An account with this email already exists."}, status_code=409)

        password_hash = generate_password_hash(password)
        db = get_db_connection()
        res = db.users.insert_one({
            "full_name": full_name,
            "email": email.lower().strip(),
            "password_hash": password_hash,
            "auth_provider": "email",
            "provider_id": None,
            "profile_picture": None,
            "created_at": datetime.now()
        })
        user_id = str(res.inserted_id)
        user = fetch_user_by_id(user_id)
        return create_session_response(user, "Signup successful")
    except PyMongoError as exc:
        return database_error_response(exc, "create account")
    except RuntimeError as exc:
        logger.error(f"Signup configuration error: {str(exc)}", exc_info=True)
        return JSONResponse({"error": str(exc)}, status_code=500)

@app.post('/api/login')
def login(payload: LoginRequest, request: Request):
    limited = rate_limit_response(request, "login", limit=10, window_seconds=15 * 60)
    if limited:
        return limited

    email = payload.email.lower().strip()
    if not validate_email(email):
        return JSONResponse({"error": "Valid email is required."}, status_code=400)
    try:
        user = fetch_user_by_email(email)
    except PyMongoError as exc:
        return database_error_response(exc, "login")
    except RuntimeError as exc:
        logger.error(f"Login configuration error: {str(exc)}", exc_info=True)
        return JSONResponse({"error": str(exc)}, status_code=500)

    if not user or user.get("auth_provider") != "email" or not user.get("password_hash"):
        return JSONResponse({"error": "Invalid email or password."}, status_code=401)

    if not check_password_hash(user["password_hash"], payload.password):
        return JSONResponse({"error": "Invalid email or password."}, status_code=401)

    return create_session_response(user, "Login successful")

@app.get('/api/profile')
def profile(request: Request):
    limited = rate_limit_response(request, "profile", limit=90, window_seconds=60)
    if limited:
        return limited
    user = get_current_user_from_request(request)
    if not user:
        return {"authenticated": False, "user": None}
    try:
        activity = fetch_profile_activity(user["id"])
    except PyMongoError as exc:
        return database_error_response(exc, "load profile activity")
    except RuntimeError as exc:
        return JSONResponse({"error": str(exc)}, status_code=500)
    return {"authenticated": True, "user": public_user(user), **activity}

@app.post('/api/jobs/saved')
def save_job(payload: SaveJobRequest, request: Request):
    limited = rate_limit_response(request, "save_job", limit=30, window_seconds=60)
    if limited:
        return limited
    user, auth_error = require_authenticated_user(request)
    if auth_error:
        return auth_error
    try:
        saved_id, already_saved = store_saved_job(user["id"], payload)
        return {
            "message": "Job already saved." if already_saved else "Job saved to your profile.",
            "savedId": saved_id,
            "alreadySaved": already_saved,
        }
    except ValueError as exc:
        return JSONResponse({"error": str(exc)}, status_code=400)
    except PyMongoError as exc:
        return database_error_response(exc, "save job")

@app.delete('/api/jobs/saved/{saved_id}')
def remove_saved_job(saved_id: str, request: Request):
    limited = rate_limit_response(request, "remove_saved_job", limit=30, window_seconds=60)
    if limited:
        return limited
    user, auth_error = require_authenticated_user(request)
    if auth_error:
        return auth_error
    try:
        db = get_db_connection()
        try:
            saved_oid = ObjectId(saved_id)
            user_oid = ObjectId(user["id"])
        except (InvalidId, TypeError):
            return JSONResponse({"error": "Saved job was not found."}, status_code=404)
            
        res = db.saved_jobs.delete_one({
            "_id": saved_oid,
            "user_id": user_oid
        })
        if res.deleted_count == 0:
            return JSONResponse({"error": "Saved job was not found."}, status_code=404)
        return {"message": "Job removed from your profile."}
    except PyMongoError as exc:
        return database_error_response(exc, "remove saved job")

@app.get('/api/health')
def health_check():
    """Health check endpoint"""
    gemini_configured = bool(GEMINI_API_KEY)
    return {
        "status": "healthy",
        "gemini_api_configured": gemini_configured,
        "career_sources_sheet_configured": bool(configured_career_sources_sheet_url()),
        "message": "API is configured and ready" if gemini_configured else "⚠️  Please set GEMINI_API_KEY environment variable",
        "endpoints": {
            "resume_check": "/api/resume/check",
            "india_jobs": "/api/jobs/india",
            "signup": "/api/signup",
            "login": "/api/login",
            "profile": "/api/profile",
            "saved_jobs": "/api/jobs/saved",
            "health": "/api/health",
            "logout": "/api/logout"
        }
    }

@app.get('/api/jobs/india')
def india_jobs(
    request: Request,
    category: str = Query("all", pattern="^(all|it|non-it|core)$"),
    query: str = Query("", max_length=120),
    date_posted: str = Query("all", pattern="^(today|3days|week|month|all)$"),
):
    """Search current openings from company career URLs configured in Google Sheets."""
    limited = rate_limit_response(request, "jobs", limit=30, window_seconds=60)
    if limited:
        return limited
    if not validate_text_input(query, 120):
        return JSONResponse({"error": "Search query contains invalid characters."}, status_code=400)
    return fetch_sheet_career_jobs(category, query)

@app.post('/api/resume/check')
async def check_resume(request: Request, resume: UploadFile = File(None), targetRole: str = Form(None)):
    """Main endpoint for resume analysis using Gemini AI"""
    try:
        limited = rate_limit_response(request, "resume_analysis", limit=5, window_seconds=60 * 60)
        if limited:
            return limited
        user, auth_error = require_authenticated_user(request)
        if auth_error:
            return auth_error

        logger.info("📥 Processing /api/resume/check request")
        
        # Check if Gemini API is configured
        if not GEMINI_API_KEY:
            logger.error("❌ Gemini API key not configured")
            return JSONResponse({
                "error": "Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            }, status_code=500)
        
        if resume is None:
            logger.warning("❌ No resume file in request")
            return JSONResponse({"error": "No resume file provided"}, status_code=400)
        
        resume_file = resume
        
        if not resume_file or resume_file.filename == '':
            logger.warning("❌ Empty resume file")
            return JSONResponse({"error": "Empty resume file"}, status_code=400)
        
        if not allowed_file(resume_file.filename):
            logger.warning(f"❌ Invalid file type: {resume_file.filename}")
            return JSONResponse({"error": "Only PDF files are supported"}, status_code=400)

        target_role = targetRole.strip() if targetRole else None
        if target_role and not validate_text_input(target_role, 120):
            return JSONResponse({"error": "Target role contains invalid characters or is too long."}, status_code=400)

        uploaded_bytes = await resume_file.read(MAX_RESUME_BYTES + 1)
        if len(uploaded_bytes) > MAX_RESUME_BYTES:
            return JSONResponse({"error": "Resume file is too large. Maximum size is 5 MB."}, status_code=413)
        if not uploaded_bytes.startswith(b"%PDF"):
            return JSONResponse({"error": "Uploaded file is not a valid PDF document."}, status_code=400)

        # Extract text from PDF
        logger.info("📄 Extracting text from PDF...")
        resume_text = extract_text_from_pdf(io.BytesIO(uploaded_bytes))
        logger.info(f"✅ Extracted {len(resume_text)} characters")
        safe_filename = os.path.basename(resume_file.filename)[:255]
        store_resume_record(user["id"], safe_filename, resume_text)
        
        # Extract sections
        logger.info("📋 Extracting resume sections...")
        resume_sections = extract_resume_sections(resume_text)
        
        # Analyze with Gemini (no fallback - must succeed or fail)
        gemini_analysis = analyze_resume_with_gemini(resume_text, resume_sections, target_role)
        
        # Prepare response
        response = {
            "resume_text": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,  # Truncate for response
            "extracted_sections": resume_sections,
            "target_role": target_role,
            
            "normal_score": gemini_analysis.get("overall_score", 0),
            
            "normal_score_details": {
                "experience_skills_score": gemini_analysis.get("content_score", 0),
                "structure_formatting_score": gemini_analysis.get("formatting_score", 0),
                "grammar_readability_score": gemini_analysis.get("impact_score", 0),
                "keyword_matching_score": gemini_analysis.get("keywords_score", 0),
                
                "strengths": gemini_analysis.get("strengths", []),
                "improvements": gemini_analysis.get("improvements", []),
                "keyword_analysis": gemini_analysis.get("keyword_analysis", {}),
                "detailed_feedback": gemini_analysis.get("detailed_feedback", {}),
                "section_checklist": gemini_analysis.get("section_checklist", {}),
                "ats_compatibility": gemini_analysis.get("ats_compatibility", {}),
                "length_assessment": gemini_analysis.get("length_assessment", {}),
                
                "detected_skills": resume_sections["skills"][:10],
                "sections_found": [key for key, value in resume_sections.items() if value]
            }
        }
        
        logger.info("✅ Successfully processed resume check with Gemini AI")
        logger.info(f"   📊 Final Score: {response['normal_score']}/100")
        return convert_keys_to_camel_case(response)
        
    except Exception as e:
        logger.error(f"❌ Error in /api/resume/check: {type(e).__name__}", exc_info=True)
        return JSONResponse({"error": "Failed to process resume. Please try again."}, status_code=500)

@app.post('/api/logout')
def logout():
    logger.info("Processing /api/logout request")
    response = JSONResponse({"message": "Logged out successfully"})
    response.delete_cookie(SESSION_COOKIE_NAME)
    return response

# Error handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    if exc.status_code != 404:
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
    return JSONResponse({
        "error": "Endpoint not found",
        "message": "The requested URL was not found on the server",
        "available_endpoints": {
            "root": "/ (GET)",
            "health": "/api/health (GET)",
            "signup": "/api/signup (POST)",
            "login": "/api/login (POST)",
            "profile": "/api/profile (GET)",
            "saved_jobs": "/api/jobs/saved (POST, DELETE)",
            "india_jobs": "/api/jobs/india (GET)",
            "resume_check": "/api/resume/check (POST)",
            "logout": "/api/logout (POST)"
        }
    }, status_code=404)

@app.exception_handler(Exception)
async def internal_error(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse({
        "error": "Internal server error",
        "message": "An error occurred while processing your request"
    }, status_code=500)

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("🚀 Starting Resume Checker API with Gemini AI")
    logger.info("=" * 60)
    logger.info("Available endpoints:")
    logger.info("  - GET  /              : API information")
    logger.info("  - GET  /api/health    : Health check")
    logger.info("  - POST /api/resume/check : Resume analysis")
    logger.info("  - POST /api/logout    : Logout")
    logger.info("=" * 60)
    
    if not GEMINI_API_KEY:
        logger.warning("⚠️  WARNING: GEMINI_API_KEY not set!")
        logger.warning("   Set it with: export GEMINI_API_KEY='your_key_here'")
    else:
        logger.info("✅ Gemini API key is configured")
    
    logger.info("=" * 60)
    uvicorn.run("application:app", host='0.0.0.0', port=settings.PORT, reload=True)
