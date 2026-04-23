from typing import Dict, Any, List
from app.llm.base import BaseLLMProvider
import logging
import json

logger = logging.getLogger(__name__)

class ProfileRecommender:
    """
    Generates personalized course and certification recommendations 
    based on a candidate's full profile using LLM.
    """
    
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm = llm_provider

    async def recommend(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze profile and recommend courses/certifications.
        """
        logger.info(f"Generating recommendations for profile: {profile_data.get('titre', 'Unknown')}")
        
        prompt = self._create_prompt(profile_data)
        schema = self._get_schema()
        
        try:
            return await self.llm.generate_structured(prompt, schema)
        except Exception as e:
            logger.error(f"Recommendation generation failed: {e}")
            return self._get_fallback()

    def _create_prompt(self, data: Dict[str, Any]) -> str:
        return f"""
        You are an expert Career Coach and AI HR Assistant.
        Analyze the following candidate profile and recommend the BEST online courses and professional certifications to boost their career.
        
        CANDIDATE PROFILE:
        - Title: {data.get('titre', 'N/A')}
        - Experience Level: {data.get('niveau_experience', 'N/A')}
        - Current Skills: {data.get('competences', [])}
        - Bio: {data.get('objectif', 'N/A')}
        - USER SPECIFIED KEYWORDS: {data.get('keywords', 'None')}
        
        TASK:
        1. Identify skill gaps or next-level skills needed for their role, prioritizing any interests mentioned in the keywords.
        2. Recommend exactly 3 high-quality Online Courses (from Coursera, Udemy, edX, Pluralsight, etc.).
        3. Recommend exactly 3 recognized Professional Certifications (e.g., AWS, PMS, Google, Microsoft, etc.).
        
        REQUIREMENTS:
        - Recommendations must be real, existing specific courses/certs.
        - 'reason' should explain why this specific item helps THIS candidate.
        - 'difficulty' should be Beginner, Intermediate, or Advanced.
        """

    def _get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "courses": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "platform": {"type": "string"},
                            "difficulty": {"type": "string"},
                            "reason": {"type": "string"}
                        },
                        "required": ["title", "platform", "difficulty", "reason"]
                    }
                },
                "certifications": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "organization": {"type": "string"},
                            "difficulty": {"type": "string"},
                            "reason": {"type": "string"}
                        },
                        "required": ["title", "organization", "difficulty", "reason"]
                    }
                }
            },
            "required": ["courses", "certifications"]
        }

    def _get_fallback(self) -> Dict[str, Any]:
        return {
            "courses": [
                {"title": "Full Stack Development", "platform": "Coursera", "difficulty": "Intermediate", "reason": "General recommendation for software roles."},
                {"title": "Agile Project Management", "platform": "Udemy", "difficulty": "Beginner", "reason": "Essential for modern teams."}
            ],
            "certifications": []
        }
