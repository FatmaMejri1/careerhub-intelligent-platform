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

# LLM Provider dependency
def get_llm_provider():
    """Get LLM provider based on configuration with automatic fallback"""
    logger.info(f"Keys: HF={bool(settings.huggingface_api_key)}, Gemini={bool(settings.gemini_api_key)}, OpenAI={bool(settings.openai_api_key)}, Ollama_Enabled={settings.use_ollama}")
    # 1. Use Hugging Face if API key is provided
    if settings.huggingface_api_key:
        logger.info(f"Using Hugging Face Cloud Provider ({settings.huggingface_model})")
        from app.llm.providers.huggingface_provider import HuggingFaceProvider
        return HuggingFaceProvider(
            api_key=settings.huggingface_api_key,
            model=settings.huggingface_model
        )

    # 2. Use Gemini if API key is provided (Fastest/Best for Cloud)
    if settings.gemini_api_key:
        try:
            logger.info(f"Attempting to use Gemini Provider ({settings.gemini_model})")
            from app.llm.providers.gemini_provider import GeminiProvider
            return GeminiProvider(
                api_key=settings.gemini_api_key,
                model=settings.gemini_model
            )
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Provider: {e}. Falling back...")
    
    
    # 2. Use OpenAI if API key is provided
    if not settings.use_ollama and settings.openai_api_key:
        logger.info("Using OpenAI Cloud Provider")
        from app.llm.providers.openai_provider import OpenAIProvider
        return OpenAIProvider(
            api_key=settings.openai_api_key,
            model=settings.openai_model,
            base_url=settings.openai_base_url
        )
    else:
        # Fallback to Ollama or if explicitly requested
        logger.info(f"Using Ollama Local Provider (Model: {settings.ollama_model})")
        from app.llm.providers.ollama_provider import OllamaProvider
        return OllamaProvider(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model,
            api_key=settings.ollama_api_key
        )