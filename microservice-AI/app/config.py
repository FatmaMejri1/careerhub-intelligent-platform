from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    app_name: str = "Smart Career AI"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 5000
    
    # Gemini
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.5-flash"

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017/smartcareerhub_fresh"
    mongodb_db: str = "smartcareerhub_fresh"

    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # Thresholds
    skill_similarity_threshold: float = 0.7
    quiz_pass_threshold: float = 80.0
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()