from typing import Dict, Any, List, Optional
from app.llm.base import BaseLLMProvider
from app.dependencies import get_llm_provider
import json
from loguru import logger

class CVGenerator:
    def __init__(self, llm: Optional[BaseLLMProvider] = None):
        self.llm = llm or get_llm_provider()

    async def generate(self, target_job: str, additional_info: str = "", type: str = "cv") -> Dict[str, Any]:
        """Generate CV or Cover Letter content based on AI"""
        logger.info(f"Generating content for {target_job} ({type})")
        prompt = self._create_generation_prompt(target_job, additional_info, type)
        
        try:
            logger.info("Calling LLM generate_structured")
            response = await self.llm.generate_structured(prompt, self._get_schema(type))
            logger.info("LLM generation successful")
            return response
        except Exception as e:
            logger.error(f"LLM generation failed: {str(e)}")
            # Fallback
            return self._get_fallback(target_job, type)

    def _create_generation_prompt(self, target_job: str, additional_info: str, type: str) -> str:
        if type == "cv":
            return f"""
            You are a professional HR and CV writer. Generate a high-quality CV for the position of "{target_job}".
            Additional constraints/info: {additional_info}
            
            The output must be a valid JSON matching the schema provided.
            Focus on modern skills, relevant experiences, and a professional summary.
            Use a professional tone.
            """
        else:
            return f"""
            You are a professional career coach. Write a compelling cover letter for the position of "{target_job}".
            Additional constraints/info: {additional_info}
            
            The output must be a valid JSON containing 'content' and 'subject'.
            Make it persuasive and well-structured.
            """

    def _get_schema(self, type: str) -> Dict[str, Any]:
        if type == "cv":
            return {
                "type": "object",
                "properties": {
                    "full_name": {"type": "string"},
                    "professional_summary": {"type": "string"},
                    "experiences": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "company": {"type": "string"},
                                "duration": {"type": "string"},
                                "responsibilities": {"type": "array", "items": {"type": "string"}}
                            }
                        }
                    },
                    "skills": {"type": "array", "items": {"type": "string"}},
                    "education": {"type": "array", "items": {"type": "string"}}
                }
            }
        else:
            return {
                "type": "object",
                "properties": {
                    "subject": {"type": "string"},
                    "content": {"type": "string"}
                }
            }

    def _get_fallback(self, target_job: str, type: str) -> Dict[str, Any]:
        if type == "cv":
            return {
                "full_name": "[Votre Nom]",
                "professional_summary": f"Développeur passionné visant le poste de {target_job}.",
                "experiences": [
                    {
                        "title": target_job,
                        "company": "Entreprise exemple",
                        "duration": "2020 - Présent",
                        "responsibilities": ["Développement de solutions innovantes", "Collaboration d'équipe"]
                    }
                ],
                "skills": ["Communication", "Technique"],
                "education": ["Diplôme d'Ingénieur"]
            }
        else:
            return {
                "subject": f"Candidature pour le poste de {target_job}",
                "content": "Madame, Monsieur,\n\nJe suis très intéressé par le poste..."
            }
