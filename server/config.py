import os
import logging
import secrets
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AliasChoices, Field, field_validator, model_validator

# Set up logging for configuration module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_ENV_PATH = os.path.join(BASE_DIR, '.env')
ROOT_ENV_PATH = os.path.join(os.path.dirname(BASE_DIR), '.env')

# Force override system environment variables with local .env files
load_dotenv(dotenv_path=ROOT_ENV_PATH, override=True)
load_dotenv(dotenv_path=SERVER_ENV_PATH, override=True)

class Settings(BaseSettings):
    # Load configuration from server/.env first, then root .env if keys not defined
    model_config = SettingsConfigDict(
        env_file=(SERVER_ENV_PATH, ROOT_ENV_PATH),
        env_file_encoding='utf-8',
        extra='ignore'
    )

    # Environment Mode
    ENV: str = "development"

    @property
    def IS_PRODUCTION(self) -> bool:
        return self.ENV.lower() in {"production", "prod"}

    # FastAPI Port
    PORT: int = 5001

    # Gemini API Key
    GEMINI_API_KEY: str | None = None

    # JSearch API Key
    JSEARCH_API_KEY: str | None = None

    # MongoDB configurations
    MONGODB_URI: str | None = None
    MONGODB_DATABASE: str = "ats_project"

    # CSV Data source sheet URL
    CAREER_SOURCES_SHEET_CSV_URL: str = (
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOc_ZV_cLauNyajyst8_v7FLiaI3N4lYh2wZAaxtUXRA0Sa9YFrvAz4Lf1j4AYy8hWg7TQftNo0siq/pub?gid=0&single=true&output=csv"
    )

    # Cache configurations
    CAREER_SOURCES_CACHE_TTL_SECONDS: int = 900
    CAREER_JOBS_CACHE_TTL_SECONDS: int = 900
    CAREER_FETCH_WORKERS: int = 5

    # Auth and security serializer secret key
    AUTH_SECRET_KEY: str | None = Field(default=None, validation_alias=AliasChoices("AUTH_SECRET_KEY", "SECRET_KEY"))

    # File uploads
    MAX_RESUME_BYTES: int = 5 * 1024 * 1024

    # SMTP Configurations
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM: str | None = None
    SMTP_USE_SSL: bool = False


    # Validators
    @field_validator("GEMINI_API_KEY")
    @classmethod
    def check_gemini_api_key(cls, v: str | None) -> str | None:
        if not v:
            logger.warning("⚠️ GEMINI_API_KEY is not configured in the environment.")
        return v

    @field_validator("MONGODB_URI")
    @classmethod
    def validate_mongodb_uri(cls, v: str | None) -> str:
        # Check if we are running in production environment
        is_prod = os.environ.get("ENV", "").lower() in {"production", "prod"}
        if not v:
            if is_prod:
                logger.error("❌ MONGODB_URI is not set in production!")
                raise ValueError("MONGODB_URI must be configured in production environments.")
            else:
                logger.warning("⚠️ MONGODB_URI is not set. Defaulting to local MongoDB development instance.")
                return "mongodb://localhost:27017/"
        return v

    @field_validator("AUTH_SECRET_KEY")
    @classmethod
    def validate_auth_secret_key(cls, v: str | None) -> str:
        if not v:
            generated_key = secrets.token_urlsafe(48)
            logger.warning("⚠️ AUTH_SECRET_KEY / SECRET_KEY is not configured; using an ephemeral session key.")
            return generated_key
        return v

    @model_validator(mode="after")
    def set_smtp_from(self) -> 'Settings':
        if not self.SMTP_FROM:
            self.SMTP_FROM = self.SMTP_USER
        return self

settings = Settings()
