from fastapi import APIRouter, HTTPException, Depends
from app.schemas import QuizGenerationRequest, QuizSubmission, QuizResponse, QuizEvaluation
from app.core.orchestrator import AIOrchestrator
from app.dependencies import get_llm_provider
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    request: QuizGenerationRequest,
    orchestrator: AIOrchestrator = Depends()
):
    """Generate adaptive quiz based on job description"""
    try:
        logger.info(f"Generating quiz for job: {request.job_description[:100]}...")
        
        quiz = await orchestrator.generate_quiz_workflow(request)
        
        logger.info(f"Quiz generated successfully: {quiz.quiz_id}")
        return quiz
        
    except Exception as e:
        logger.error(f"Quiz generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@router.post("/evaluate", response_model=QuizEvaluation)
async def evaluate_quiz(
    submission: QuizSubmission,
    orchestrator: AIOrchestrator = Depends()
):
    """Evaluate quiz answers and provide feedback"""
    try:
        evaluation = await orchestrator.evaluate_quiz_workflow(submission)
        return evaluation
    except Exception as e:
        logger.error(f"Quiz evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")