from typing import List, Dict, Any
from app.schemas import Question, QuestionType, DifficultyLevel
from app.dependencies import get_llm_provider
from app.config import settings
import json
import uuid
from loguru import logger

class QuizGenerator:
    """Generates adaptive quizzes using AI"""
    
    def __init__(self, llm=None):
        self.llm = llm or get_llm_provider()
    
    async def generate(
        self,
        job_description: str,
        required_skills: List[str],
        difficulty_level: DifficultyLevel,
        num_questions: int = 4
    ) -> List[Question]:
        """Generate quiz questions based on job requirements with speed optimization"""
        
        target_questions = min(num_questions, 6) 
        
        logger.info(f"Generating {target_questions} mixed-difficulty questions for skills: {required_skills}")
        
        prompt = self._create_quiz_prompt(
            job_description=job_description,
            required_skills=required_skills,
            difficulty_level=difficulty_level,
            num_questions=target_questions
        )
        
        schema = {
            "type": "object",
            "properties": {
                "questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "type": {"type": "string", "enum": ["technical"]},
                            "skill": {"type": "string"},
                            "text": {"type": "string"},
                            "options": {"type": "array", "items": {"type": "string"}},
                            "correct_answer": {"type": "integer", "minimum": 0, "maximum": 3},
                            "explanation": {"type": "string"},
                            "difficulty": {"type": "string", "enum": ["beginner", "intermediate", "advanced"]}
                        },
                        "required": ["id", "type", "skill", "text", "options", "correct_answer", "explanation", "difficulty"]
                    }
                }
            },
            "required": ["questions"]
        }
        
        try:
            # Generate structured quiz using LLM
            response = await self.llm.generate_structured(prompt, schema)
            questions_data = response.get("questions", [])
            
            questions = []
            for q_data in questions_data:
                # Map string difficulty back to Enum
                diff_str = q_data.get("difficulty", "intermediate").lower()
                diff_enum = DifficultyLevel.INTERMEDIATE
                if "begin" in diff_str or "easy" in diff_str:
                    diff_enum = DifficultyLevel.BEGINNER
                elif "adv" in diff_str or "diff" in diff_str:
                    diff_enum = DifficultyLevel.ADVANCED

                questions.append(Question(
                    id=q_data.get("id", str(uuid.uuid4())),
                    type=QuestionType.TECHNICAL,
                    skill=q_data["skill"],
                    text=q_data["text"],
                    options=q_data["options"][:4],
                    correct_answer=q_data["correct_answer"],
                    explanation=q_data["explanation"],
                    difficulty=diff_enum
                ))
            
            return questions
            
        except Exception as e:
            logger.error(f"Quiz generation failed: {str(e)}")
            return self._generate_fallback_questions(required_skills, target_questions)

    def _create_quiz_prompt(
        self,
        job_description: str,
        required_skills: List[str],
        difficulty_level: DifficultyLevel,
        num_questions: int
    ) -> str:
        """Concise prompt with example for fast and reliable generation"""
        
        example = {
            "questions": [
                {
                    "id": "1",
                    "type": "technical",
                    "skill": "React",
                    "text": "What is the primary purpose of useMemo?",
                    "options": ["Memoize values", "Trigger effects", "Manage state", "Route pages"],
                    "correct_answer": 0,
                    "explanation": "useMemo cache expensive calculations.",
                    "difficulty": "intermediate"
                }
            ]
        }
        
        return f"""
        Generate a technical interview quiz in JSON format with exactly {num_questions} questions.
        IMPORTANT: Use a VARIETY of difficulty levels (e.g., Mix of Beginner, Intermediate, and Advanced).
        
        ROLE: {job_description[:300]}
        TECHNOLOGIES: {', '.join(required_skills)}
        
        STRICT JSON SCHEMA:
        {json.dumps(example, indent=2)}
        
        RULES:
        1. 100% technical, related to the TECHNOLOGIES.
        2. VARIANT Difficulty: At least one Easy, one Intermediate, and one Advanced question.
        3. SHORT questions.
        4. Options must be clear and distinct.
        5. No behavioral questions.
        """
    
    def _generate_fallback_questions(self, skills: List[str], num_questions: int) -> List[Question]:
        """Generate fallback questions if AI fails"""
        questions = []
        difficulties = [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE, DifficultyLevel.ADVANCED]
        
        # Ensure we have at least some skills
        safe_skills = skills if skills else ["Professionalism", "Problem Solving", "Technical Communication", "Architecture"]
        
        for i in range(num_questions):
            skill = safe_skills[i % len(safe_skills)]
            diff = difficulties[i % len(difficulties)]
            questions.append(Question(
                id=str(uuid.uuid4()),
                type=QuestionType.TECHNICAL,
                skill=skill,
                text=f"How would you evaluate your proficiency level with {skill} at an {diff.value} level?",
                options=["No experience", "Theoretical knowledge only", "Practical experience", "Expert / Can lead"],
                correct_answer=2, # Default as a reasonable choice
                explanation=f"This question assesses your self-evaluation of {skill}.",
                difficulty=diff
            ))
        
        return questions