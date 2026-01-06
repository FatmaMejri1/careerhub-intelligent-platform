from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.schemas import CVAnalysisRequest, CVAnalysisResponse, CVGenerationRequest
from app.core.orchestrator import AIOrchestrator
from loguru import logger

router = APIRouter()

@router.post("/cv", response_model=CVAnalysisResponse)
async def analyze_cv(
    request: CVAnalysisRequest,
    orchestrator: AIOrchestrator = Depends()
):
    """Analyze CV and extract skills"""
    try:
        # Log the request (safely)
        cv_log = str(request.cv_text)[:50] if request.cv_text else "None"
        logger.info(f"Analyzing CV showing first 50 chars: {cv_log}...")
        
        result = await orchestrator.analyze_cv_workflow(
            cv_text=request.cv_text,
            job_description=request.job_description
        )
        
        return CVAnalysisResponse(**result)

    except Exception as e:
        logger.error(f"CV analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", response_model=Dict[str, Any])
async def generate_document(
    request: CVGenerationRequest,
    orchestrator: AIOrchestrator = Depends()
):
    """Generate CV or Cover Letter"""
    logger.info("!! GENERATE REQUEST RECEIVED !!")
    try:
        logger.info(f"Generating {request.type} for job: {request.target_job}")
        result = await orchestrator.generate_document_workflow(
            target_job=request.target_job,
            additional_info=request.additional_info,
            type=request.type
        )
        return result
    except Exception as e:
        logger.error(f"Document generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommend-profile", response_model=Dict[str, Any])
async def recommend_for_profile(
    request: Dict[str, Any],
    orchestrator: AIOrchestrator = Depends()
):
    """Recommend courses and certifications based on profile data"""
    try:
        logger.info(f"Received recommendation request for: {request.get('titre')}")
        result = await orchestrator.recommend_profile_courses_workflow(request)
        return result
    except Exception as e:
        logger.error(f"Recommendation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))