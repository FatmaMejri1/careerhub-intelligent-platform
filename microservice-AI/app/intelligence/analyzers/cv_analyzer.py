from typing import List, Dict, Any, Optional
from app.dependencies import get_llm_provider
from app.schemas import SkillAnalysis
import json
from loguru import logger

class CVAnalyzer:
    """Analyzes CVs using AI to extract skills and experience"""
    
    def __init__(self, llm=None):
        self.llm = llm or get_llm_provider()
    
    async def analyze(self, cv_text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
        """Analyze CV text to extract skills and experience level"""
        
        logger.info("Analyzing CV with AI...")
        
        # Create prompt for CV analysis
        prompt = self._create_analysis_prompt(cv_text, job_description)
        
        # Define response schema
        schema = {
            "type": "object",
            "properties": {
                "extracted_skills": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "skill": {"type": "string"},
                            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                            "level": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"]}
                        },
                        "required": ["skill", "confidence", "level"]
                    }
                },
                "experience_level": {"type": "string"},
                "years_experience": {"type": "number"},
                "summary": {"type": "string"},
                "clarity_score": {"type": "number", "minimum": 0, "maximum": 100},
                "linguistic_faults": {"type": "array", "items": {"type": "string"}},
                "visibility_recommendations": {"type": "array", "items": {"type": "string"}},
                "recommended_jobs": {"type": "array", "items": {"type": "string"}},
                "recommended_certificates": {"type": "array", "items": {"type": "string"}},
                "tools_to_learn": {"type": "array", "items": {"type": "string"}},
                "structural_feedback": {"type": "string"}
            },
            "required": [
                "extracted_skills", "experience_level", "years_experience", "summary", 
                "clarity_score", "linguistic_faults", "visibility_recommendations",
                "recommended_jobs", "recommended_certificates", "tools_to_learn"
            ]
        }
        
        try:
            # Generate structured analysis using LLM
            result = await self.llm.generate_structured(prompt, schema)
            
            # If job description provided, calculate a match score (simple logic for now)
            if job_description:
                result["match_score"] = self._calculate_match_score(result["extracted_skills"], job_description)
            else:
                result["match_score"] = None
                
            logger.info(f"CV analysis complete. Found {len(result.get('extracted_skills', []))} skills.")
            return result
            
        except Exception as e:
            logger.error(f"CV analysis failed: {str(e)}")
            # Fallback to basic extraction
            return self._fallback_analysis(cv_text)
    
    def _create_analysis_prompt(self, cv_text: str, job_description: Optional[str] = None) -> str:
        """Create prompt for CV analysis"""
        
        base_prompt = f"""
        You are an expert HR AI analyst. Your task is to analyze the following Curriculum Vitae (CV) text and extract structured data.
        
        CV TEXT:
        {(cv_text or "No CV text provided")[:3000]}  # Limit text length if needed
        """
        
        if job_description:
            base_prompt += f"""
            
            Compare this CV against the following JOB DESCRIPTION:
            {job_description[:1500]}
            
            Focus on skills relevant to this job.
            """
            
        base_prompt += """
        
        Extract the following:
        1. A list of technical and soft skills (extracted_skills) with your confidence score (0-1) and the candidate's proficiency level.
        2. The overall experience level (experience_level).
        3. Estimated total years of professional experience (years_experience).
        4. A brief professional summary of the candidate (summary).
        5. Deep Analysis Fields:
           - clarity_score: A score from 0-100 on how professional and easy-to-read the CV is.
           - linguistic_faults: List of grammar, spelling or style issues found.
           - visibility_recommendations: Tips to improve LinkedIn/Resume visibility.
           - recommended_jobs: List of job titles that perfectly match this profile.
           - recommended_certificates: Specific professional certifications that would boost this profile.
           - tools_to_learn: Modern tools or technologies currently missing but relevant to the profile.
           - structural_feedback: General feedback on CV layout and structure.
        """
        
        return base_prompt

    def _calculate_match_score(self, skills: List[Dict[str, Any]], job_description: str) -> float:
        """Calculate a simple match score purely based on skill presence"""
        # This is a placeholder. In a real system, we'd use embedding similarity.
        # For now, let's return a dummy score or implement basic keyword matching if needed.
        return 0.75 # Default mock score
        
    def _fallback_analysis(self, cv_text: str) -> Dict[str, Any]:
        """Simple fallback if AI fails"""
        return {
            "extracted_skills": [],
            "experience_level": "Unknown",
            "years_experience": 0,
            "summary": "AI Analysis Failed",
            "match_score": 0.0,
            "clarity_score": 0.0,
            "linguistic_faults": [],
            "visibility_recommendations": [],
            "recommended_jobs": [],
            "recommended_certificates": [],
            "tools_to_learn": [],
            "structural_feedback": "Analysis failed due to a technical error."
        }
