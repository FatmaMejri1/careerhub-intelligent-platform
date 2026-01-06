import google.generativeai as genai
from typing import Dict, Any, List, Optional
from app.llm.base import BaseLLMProvider
import json
import logging

logger = logging.getLogger(__name__)

class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM provider"""
    
    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        genai.configure(api_key=api_key)
        self.model_name = model
        self.model = genai.GenerativeModel(model)
        logger.info(f"Initialized Gemini provider with model: {model}")
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Dict[str, Any]:
        """Send chat completion request to Gemini"""
        try:
            # Convert OpenAI format to Gemini format
            contents = []
            for msg in messages:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({"role": role, "parts": [msg["content"]]})
                
            generation_config = genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens
            )
            
            response = self.model.generate_content(
                contents,
                generation_config=generation_config
            )
            
            return {
                "content": response.text,
                "model": self.model_name,
                "usage": {
                    "prompt_tokens": 0,  # Gemini SDK doesn't return this easily in same call
                    "completion_tokens": 0,
                    "total_tokens": 0
                }
            }
        except Exception as e:
            logger.error(f"Gemini chat completion failed: {str(e)}")
            raise

    async def generate_structured(self, prompt: str, schema: Dict[str, Any], model: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON output using Gemini"""
        try:
            # Gemini support JSON response format
            generation_config = genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
            
            full_prompt = f"{prompt}\n\nRespond with a JSON object matching this schema: {json.dumps(schema)}"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini structured generation failed: {str(e)}")
            raise

    async def generate(self, prompt: str, **kwargs) -> str:
        """Simple text generation"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {str(e)}")
            raise

    async def list_models(self) -> List[str]:
        return [self.model_name]
