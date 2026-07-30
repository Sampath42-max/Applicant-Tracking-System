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
        "https://resume-nexa.vercel.app"
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
            "resume_analysis": "/api/resume/check (POST)"
        },
        "documentation": "Visit /api/health to check if Gemini API is configured"
    }

@app.get('/api/health')
def health_check():
    """Health check endpoint"""
    gemini_configured = bool(GEMINI_API_KEY)
    return {
        "status": "healthy",
        "gemini_api_configured": gemini_configured,
        "message": "API is configured and ready" if gemini_configured else "⚠️  Please set GEMINI_API_KEY environment variable",
        "endpoints": {
            "resume_check": "/api/resume/check",
            "health": "/api/health"
        }
    }

@app.post('/api/resume/check')
async def check_resume(request: Request, resume: UploadFile = File(None), targetRole: str = Form(None)):
    """Main endpoint for resume analysis using Gemini AI"""
    try:
        limited = rate_limit_response(request, "resume_analysis", limit=5, window_seconds=60 * 60)
        if limited:
            return limited


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
            "resume_check": "/api/resume/check (POST)"
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
    logger.info("=" * 60)
    
    if not GEMINI_API_KEY:
        logger.warning("⚠️  WARNING: GEMINI_API_KEY not set!")
        logger.warning("   Set it with: export GEMINI_API_KEY='your_key_here'")
    else:
        logger.info("✅ Gemini API key is configured")
    
    logger.info("=" * 60)
    uvicorn.run("application:app", host='0.0.0.0', port=settings.PORT, reload=True)
