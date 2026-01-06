from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    SITUATIONAL = "situational"

# Request schemas
class CVAnalysisRequest(BaseModel):
    cv_text: str
    job_description: Optional[str] = None

class CVGenerationRequest(BaseModel):
    target_job: str
    additional_info: Optional[str] = ""
    type: str = "cv" # 'cv' or 'lm'

class QuizGenerationRequest(BaseModel):
    job_description: str
    required_skills: List[str]
    candidate_level: DifficultyLevel = DifficultyLevel.INTERMEDIATE
    num_questions: int = Field(ge=3, le=15, default=8)

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: Dict[str, int]  # question_id -> selected_option_index

class RecommendationRequest(BaseModel):
    weak_skills: List[str]
    job_context: str
    candidate_level: DifficultyLevel = DifficultyLevel.INTERMEDIATE

# Response schemas
class SkillAnalysis(BaseModel):
    skill: str
    confidence: float
    level: Optional[str] = None

class CVAnalysisResponse(BaseModel):
    extracted_skills: List[SkillAnalysis]
    experience_level: str
    years_experience: Optional[float] = None
    summary: Optional[str] = None
    match_score: Optional[float] = None
    
    # Enhanced profile analysis
    clarity_score: float = 0.0
    linguistic_faults: List[str] = []
    visibility_recommendations: List[str] = []
    recommended_jobs: List[str] = []
    recommended_certificates: List[str] = []
    tools_to_learn: List[str] = []
    structural_feedback: Optional[str] = None

class Question(BaseModel):
    id: str
    type: QuestionType
    skill: str
    text: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: DifficultyLevel

class QuizResponse(BaseModel):
    quiz_id: str
    questions: List[Question]
    time_limit: int = 1800
    generated_at: datetime = Field(default_factory=datetime.now)

class QuizEvaluation(BaseModel):
    quiz_id: str
    score: float
    passed: bool
    weak_areas: List[str]
    recommendations: List[Dict[str, Any]] = []

class CourseRecommendation(BaseModel):
    skill: str
    title: str
    platform: str
    url: str
    duration: str
    level: str
    match_score: float

class FraudAnalysisRequest(BaseModel):
    user_id: Optional[int] = None
    full_name: str
    cv_text: Optional[str] = None
    social_links: List[str] = []
    experiences: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []

class FraudEvidence(BaseModel):
    label: str
    value: str
    severity: str # 'low', 'medium', 'high'

class FraudAnalysisResponse(BaseModel):
    fraud_score: int # Final combined score
    heuristic_score: int # Calculated by rules
    ai_fraud_score: int # Calculated by AI
    is_suspicious: bool
    ai_analysis: str
    evidence: List[FraudEvidence]

class APIError(BaseModel):
    detail: str
    error_code: str