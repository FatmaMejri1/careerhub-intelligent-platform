from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    app_name: str = "Smart Career AI"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 5000
    
    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "google/gemini-1.5-flash"
    openai_base_url: Optional[str] = None
    
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_api_key: Optional[str] = None
    ollama_model: str = "mistral"
    use_ollama: bool = True # Use true to prioritize the provided key
    
    # Gemini
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-1.5-flash"

    # Hugging Face
    huggingface_api_key: Optional[str] = None
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    
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