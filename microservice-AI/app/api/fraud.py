from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.schemas import FraudAnalysisRequest, FraudAnalysisResponse
from app.core.orchestrator import AIOrchestrator
from loguru import logger

router = APIRouter()

@router.post("/analyze", response_model=FraudAnalysisResponse)
async def analyze_fraud(
    request: FraudAnalysisRequest,
    orchestrator: AIOrchestrator = Depends()
):
    """Analyze a candidate profile for potential fraud"""
    try:
        logger.info(f"AI Fraud Analysis requested for: {request.full_name}")
        
        result = await orchestrator.analyze_fraud_workflow(request)
        
        return FraudAnalysisResponse(**result)

    except Exception as e:
        logger.error(f"Fraud analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
