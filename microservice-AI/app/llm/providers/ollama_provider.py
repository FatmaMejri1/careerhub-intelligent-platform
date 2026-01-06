import requests
from typing import Dict, Any, List, Optional
from app.llm.base import BaseLLMProvider
import json
import logging

logger = logging.getLogger(__name__)

class OllamaProvider(BaseLLMProvider):
    """Local Ollama LLM provider"""
    
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "mistral", api_key: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.model = model
        logger.info(f"Initialized Ollama provider with model: {model} at {base_url}")
    
    async def chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False
        }
        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            return {
                "content": data["message"]["content"],
                "model": self.model
            }
        except Exception as e:
            logger.error(f"Ollama chat completion failed: {e}")
            raise

    async def generate_structured(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured output. For Ollama, we'll use a prompt-based approach as full JSON schema support varies."""
        url = f"{self.base_url}/api/generate"
        full_prompt = f"{prompt}\n\nIMPORTANT: You MUST respond ONLY with a valid JSON object matching this schema: {json.dumps(schema)}"
        
        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "format": "json",
            "stream": False
        }
        try:
            response = requests.post(url, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            return json.loads(data["response"])
        except Exception as e:
            logger.error(f"Ollama structured generation failed: {e}")
            raise

    async def generate(self, prompt: str, **kwargs) -> str:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data["response"]
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            raise
