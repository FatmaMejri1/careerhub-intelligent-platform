from typing import Generator
from app.config import settings
import redis
from loguru import logger

# Redis dependency
def get_redis_client() -> redis.Redis:
    """Get Redis client connection"""
    try:
        client = redis.from_url(settings.redis_url)
        client.ping()  # Test connection
        return client
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
        # Fallback to in-memory cache
        return None

# MongoDB dependency
def get_mongodb():
    """Get MongoDB manager instance"""
    from app.storage.mongodb import mongodb_manager
    return mongodb_manager

# LLM Provider dependency
def get_llm_provider():
    """Get LLM provider (Gemini ONLY)"""
    logger.info(f"LLM Setup: Gemini={bool(settings.gemini_api_key)}")
    
    if not settings.gemini_api_key:
        logger.error("GEMINI_API_KEY is not set in environments!")
        raise ValueError("GEMINI_API_KEY must be provided.")

    try:
        logger.info(f"Initializing Gemini Provider ({settings.gemini_model})")
        from app.llm.providers.gemini_provider import GeminiProvider
        return GeminiProvider(
            api_key=settings.gemini_api_key,
            model=settings.gemini_model
        )
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Provider: {e}")
        raise