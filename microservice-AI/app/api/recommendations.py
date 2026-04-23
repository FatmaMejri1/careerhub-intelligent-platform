from fastapi import APIRouter, HTTPException, Depends
from app.schemas import RecommendationRequest, CourseRecommendation
from typing import List, Dict, Any
from app.core.orchestrator import AIOrchestrator
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/courses", response_model=list[CourseRecommendation])
async def recommend_courses(
    request: RecommendationRequest,
    orchestrator: AIOrchestrator = Depends()
):
    """Recommend courses based on weak skills"""
    try:
        grouped_recs = await orchestrator.recommend_courses_workflow(
            weak_skills=request.weak_skills,
            job_context=request.job_context
        )
        
        flat_recs = []
        for group in grouped_recs:
            skill = group["skill"]
            for course in group["courses"]:
                flat_recs.append(
                    CourseRecommendation(
                        skill=skill,
                        title=course["title"],
                        platform=course["provider"],
                        url=course["link"],
                        duration=course.get("duration", "Unknown"),
                        level=course.get("level", "All"),
                        match_score=course.get("match_score", 0.0)
                    )
                )
                
        return flat_recs

    except Exception as e:
        logger.error(f"Recommendation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jobs")
async def recommend_jobs(
    profile_data: Dict[str, Any],
    orchestrator: AIOrchestrator = Depends()
):
    """Recommend job offers based on candidate profile"""
    try:
        return await orchestrator.recommend_jobs_workflow(profile_data)
    except Exception as e:
        logger.error(f"Job recommendation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))