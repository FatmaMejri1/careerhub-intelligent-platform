from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

class BaseLLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Dict[str, Any]:
        """Send chat completion request"""
        pass
    
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> str:
        """Generate text from a prompt"""
        pass

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        schema: Dict[str, Any],
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate structured JSON output"""
        pass
    
    @abstractmethod
    async def list_models(self) -> List[str]:
        """List available models"""
        pass