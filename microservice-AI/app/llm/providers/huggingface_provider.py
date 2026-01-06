from typing import Dict, Any, List, Optional
from app.llm.base import BaseLLMProvider
import httpx
import logging
import json

logger = logging.getLogger(__name__)

class HuggingFaceProvider(BaseLLMProvider):
    """Hugging Face Inference API provider"""
    
    def __init__(self, api_key: str, model: str = "mistralai/Mistral-7B-Instruct-v0.2"):
        self.api_key = api_key
        self.model = model
        self.api_url = f"https://router.huggingface.co/models/{model}"
        self.headers = {"Authorization": f"Bearer {api_key}"}
        logger.info(f"Initialized HuggingFace provider with model: {model}")

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Dict[str, Any]:
        """Send chat request to Hugging Face Inference API"""
        try:
            # Construct prompt for Mistral Instruct format
            # Format: <s>[INST] Instruction [/INST] Model answer</s>
            prompt = ""
            for msg in messages:
                if msg["role"] == "user":
                    prompt += f"[INST] {msg['content']} [/INST]"
                elif msg["role"] == "assistant":
                    prompt += f" {msg['content']} </s><s>"
                elif msg["role"] == "system":
                    prompt += f"[INST] {msg['content']} [/INST]"
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "return_full_text": False
                }
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, headers=self.headers, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                 raise Exception(f"HF Error: {response.text}")

            result = response.json()
            # HF returns a list of dicts, usually just one
            generated_text = result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")

            return {
                "content": generated_text.strip(),
                "model": self.model,
                "usage": {}
            }
        except Exception as e:
            logger.error(f"HuggingFace completion failed: {str(e)}")
            raise

    async def generate_structured(self, prompt: str, schema: Dict[str, Any], model: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON output (Manual simulation for HF)"""
        try:
            # Append instructions to force JSON
            full_prompt = f"{prompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching this schema: {json.dumps(schema)}"
            
            params = {
                "max_new_tokens": 1000,
                "temperature": 0.1, # Low temperature for structure
                "return_full_text": False
            }
            
            payload = {"inputs": full_prompt, "parameters": params}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, headers=self.headers, json=payload, timeout=30.0)
                
            if response.status_code != 200:
                raise Exception(f"HF Error: {response.status_code}")
                
            result = response.json()
            text_content = result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")
            
            # Simple cleanup to find JSON
            start = text_content.find('{')
            end = text_content.rfind('}') + 1
            if start != -1 and end != -1:
                json_str = text_content[start:end]
                return json.loads(json_str)
            else:
                raise Exception("No JSON found in response")
                
        except Exception as e:
            logger.error(f"HuggingFace structured generation failed: {str(e)}")
            raise

    async def generate(self, prompt: str, **kwargs) -> str:
        """Simple text generation"""
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": kwargs.get("max_tokens", 1000),
                "temperature": kwargs.get("temperature", 0.7),
                "return_full_text": False
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.api_url, headers=self.headers, json=payload, timeout=30.0)
            
        if response.status_code != 200:
            raise Exception(f"Hugging Face API error: {response.text}")
            
        result = response.json()
        return result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")

    async def list_models(self) -> List[str]:
        return [self.model]

    async def generate_embedding(self, text: str) -> List[float]:
        # HF Embedding API (Feature Extraction)
        url = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
        payload = {"inputs": text}
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=payload)
        return response.json()
