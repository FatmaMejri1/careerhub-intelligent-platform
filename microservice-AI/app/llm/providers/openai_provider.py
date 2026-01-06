from typing import Dict, Any, List, Optional
from app.llm.base import BaseLLMProvider
import json
from loguru import logger
import openai

class OpenAIProvider(BaseLLMProvider):
    """OpenAI GPT provider"""
    
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo", base_url: Optional[str] = None):
        self.client = openai.OpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        logger.info(f"Initialized OpenAI provider with model: {model} at {base_url or 'default OpenAI'}")
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Dict[str, Any]:
        """Send chat completion request"""
        try:
            response = self.client.chat.completions.create(
                model=model or self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            return {
                "content": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            logger.error(f"OpenAI chat completion failed: {str(e)}")
            raise

    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from prompt"""
        try:
            response = self.client.chat.completions.create(
                model=kwargs.get("model", self.model),
                messages=[{"role": "user", "content": prompt}],
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI text generation failed: {str(e)}")
            raise
    
    async def generate_structured(self, prompt: str, schema: Dict[str, Any], model: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON output"""
        system_prompt = f"""
        You must respond with a valid JSON object following this schema:
        {json.dumps(schema, indent=2)}
        
        Only return the JSON object, no additional text.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=model or self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            logger.error(f"OpenAI structured generation failed: {str(e)}")
            raise

    async def list_models(self) -> List[str]:
        """List available models"""
        return ["gpt-3.5-turbo", "gpt-4-turbo-preview", "gpt-4"]

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        try:
            response = self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI embedding generation failed: {str(e)}")
            raise