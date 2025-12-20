"""
Application configuration management.
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # Application
    app_name: str = "Financer API"
    app_version: str = "2.0.0"
    debug: bool = False
    environment: str = "development"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1

    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    allowed_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: List[str] = ["*"]

    # Database
    database_backend: str = "memory"  # memory, mongodb, postgresql
    mongodb_url: Optional[str] = None
    database_name: str = "financer"

    # Redis
    redis_url: Optional[str] = None
    cache_ttl: int = 300  # 5 minutes

    # Firebase
    firebase_api_key: Optional[str] = None
    firebase_auth_domain: Optional[str] = None
    firebase_project_id: Optional[str] = None
    firebase_storage_bucket: Optional[str] = None
    firebase_messaging_sender_id: Optional[str] = None
    firebase_app_id: Optional[str] = None
    firebase_measurement_id: Optional[str] = None
    firebase_credentials_json: Optional[str] = None

    # Google AI
    google_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.0-flash-exp"
    max_tokens: int = 2048
    temperature: float = 0.7

    # NSE API
    nse_base_url: str = "https://www.nseindia.com"
    nse_api_base: str = "https://www.nseindia.com/api"
    nse_request_timeout: int = 15
    nse_rate_limit_interval: float = 1.0

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds

    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # Email (SendGrid)
    sendgrid_api_key: Optional[str] = None
    from_email: str = "noreply@financer.com"

    # Monitoring
    sentry_dsn: Optional[str] = None

    @validator('allowed_origins', pre=True)
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

    @validator('firebase_credentials_json', pre=True)
    def parse_firebase_credentials(cls, v):
        if v and isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return v
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()