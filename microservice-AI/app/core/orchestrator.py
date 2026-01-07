from typing import Dict, Any, List
from app.schemas import QuizGenerationRequest, QuizResponse, QuizSubmission, QuizEvaluation
from app.intelligence.generators.quiz_generator import QuizGenerator
from app.evaluation.scoring.quiz_scorer import QuizScorer
from app.intelligence.recommenders.course_recommender import CourseRecommender
from app.intelligence.analyzers.cv_analyzer import CVAnalyzer
from app.intelligence.analyzers.fraud_analyzer import FraudAnalyzer
from app.intelligence.generators.cv_generator import CVGenerator
from app.intelligence.generators.profile_recommender import ProfileRecommender
from app.llm.providers.gemini_provider import GeminiProvider # Or use get_llm_provider
from app.dependencies import get_llm_provider, get_mongodb
from app.storage.cache.memory_cache import MemoryCache
from app.schemas import FraudAnalysisRequest
import logging
import uuid
import asyncio

logger = logging.getLogger(__name__)

class AIOrchestrator:
    """Main orchestrator for AI workflows"""
    
    def __init__(self):
        self.quiz_generator = QuizGenerator()
        self.quiz_scorer = QuizScorer()
        self.course_recommender = CourseRecommender()
        self.cv_analyzer = CVAnalyzer()
        self.fraud_analyzer = FraudAnalyzer()
        self.cv_generator = CVGenerator()
        
        # Get LLM provider for recommender
        llm = get_llm_provider()
        self.profile_recommender = ProfileRecommender(llm_provider=llm)
        
        self.cache = MemoryCache()  # Start with memory cache
        self.mongodb = get_mongodb()

    async def _log_activity(self, activity_type: str, request: Any, response: Any):
        """Background logging to MongoDB"""
        try:
            req_dict = request.dict() if hasattr(request, "dict") else str(request)
            res_dict = response.dict() if hasattr(response, "dict") else (response if isinstance(response, dict) else str(response))
            
            # Fire and forget logging
            asyncio.create_task(self.mongodb.log_ai_activity(
                activity_type=activity_type,
                request_data=req_dict,
                response_data=res_dict
            ))
        except Exception as e:
            logger.warning(f"Failed to queue MongoDB log: {e}")
        
    async def generate_quiz_workflow(self, request: QuizGenerationRequest) -> QuizResponse:
        """
        Complete quiz generation workflow with caching for speed
        """
        # Create a unique cache key based on job content and level
        import hashlib
        job_hash = hashlib.md5(f"{request.job_description}_{request.candidate_level}".encode()).hexdigest()
        cache_key = f"quiz_v3:{job_hash}" # v3 for schema change (difficulty included)
        
        # Check cache first
        try:
            cached_data = self.cache.get(cache_key)
            if cached_data:
                logger.info("Found cached quiz for this job description. Restoration attempt...")
                from app.schemas import Question
                questions = []
                for q in cached_data:
                    if isinstance(q, dict):
                        questions.append(Question(**q))
                    else:
                        questions.append(q)
                
                return QuizResponse(
                    quiz_id=str(uuid.uuid4()),
                    questions=questions,
                    time_limit=1800
                )
        except Exception as e:
            logger.warning(f"Cache restoration failed (likely schema change): {e}. Regenerating...")
            self.cache.delete(cache_key)


        logger.info(f"Starting quiz generation workflow for {request.candidate_level} level")
        
        # 1. Generate quiz using AI
        questions = await self.quiz_generator.generate(
            job_description=request.job_description,
            required_skills=request.required_skills,
            difficulty_level=request.candidate_level,
            num_questions=request.num_questions
        )
        
        # 2. Store in cache (24 hours TTL)
        self.cache.set(cache_key, questions, ttl=86400)
        
        # 3. Create quiz response
        quiz_response = QuizResponse(
            quiz_id=str(uuid.uuid4()),
            questions=questions,
            time_limit=1800  # 30 minutes
        )
        
        logger.info(f"Quiz generated successfully with {len(questions)} questions")
        await self._log_activity("quiz_generation", request, quiz_response)
        return quiz_response
    
    async def evaluate_quiz_workflow(self, submission: QuizSubmission) -> QuizEvaluation:
        """
        Complete quiz evaluation workflow
        """
        logger.info(f"Evaluating quiz: {submission.quiz_id}")
        
        # 1. Get quiz from cache (in real app, from database)
        # For now, we'll simulate
        quiz_data = self._get_quiz_from_cache(submission.quiz_id)
        
        if not quiz_data:
            raise ValueError(f"Quiz {submission.quiz_id} not found")
        
        # 2. Evaluate answers
        evaluation = await self.quiz_scorer.evaluate(
            questions=quiz_data["questions"],
            answers=submission.answers
        )
        
        # 3. If failed, get recommendations
        if not evaluation.passed and evaluation.weak_areas:
            recommendations = await self.course_recommender.recommend(
                weak_skills=evaluation.weak_areas,
                job_context=quiz_data.get("job_description", "")
            )
            # Attach recommendations to evaluation
            evaluation.recommendations = recommendations
        
        logger.info(f"Quiz evaluated: score={evaluation.score}%, passed={evaluation.passed}")
        return evaluation
    
    async def analyze_cv_workflow(self, cv_text: str, job_description: str = None) -> Dict[str, Any]:
        """
        CV analysis workflow
        """
        logger.info("Starting CV analysis workflow")
        
        # Use the real AI analyzer
        analysis_result = await self.cv_analyzer.analyze(cv_text, job_description)
        
        await self._log_activity("cv_analysis", {"cv_len": len(cv_text), "job": job_description}, analysis_result)
        logger.info("CV analysis completed successfully")
        return analysis_result

    async def generate_document_workflow(self, target_job: str, additional_info: str = "", type: str = "cv") -> Dict[str, Any]:
        """
        CV/LM generation workflow
        """
        logger.info(f"Starting {type} generation workflow for {target_job}")
        return await self.cv_generator.generate(target_job, additional_info, type)

    async def recommend_courses_workflow(self, weak_skills: List[str], job_context: str = "") -> List[Dict[str, Any]]:
        """
        Course recommendation workflow
        """
        logger.info(f"Starting recommendation workflow for skills: {weak_skills}")
        return await self.course_recommender.recommend(weak_skills, job_context)
    
    async def recommend_profile_courses_workflow(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Personalized course/cert recommendations based on full profile
        """
        logger.info("Starting profile recommendation workflow")
        
        # 1. Get LLM broad recommendations
        result = await self.profile_recommender.recommend(profile_data)
        
        # 2. Enhance with Vector Search to find REAL links
        # We iterate through the LLM-suggested courses and try to find a match in our database
        try:
            enhanced_courses = []
            for course in result.get("courses", []):
                # Search for specific course or similar
                query = f"{course['title']} {course.get('platform', '')} {course.get('difficulty', '')}"
                
                # Query vector store (accessing underlying store of course_recommender)
                matches = self.course_recommender.vector_store.query(query_text=query, n_results=1)
                
                real_link = "#"
                # If we have a decent match
                if matches and matches[0]:
                    # We might want to use the diverse title from DB or keep LLM title?
                    # Let's keep LLM title but attach the link
                    meta = matches[0]["metadata"]
                    real_link = meta.get("url", "#")
                    
                    # Optional: Override platform/duration if available
                    if "duration" in meta:
                        course["duration"] = meta["duration"]
                        
                course["link"] = real_link
                enhanced_courses.append(course)
                
            result["courses"] = enhanced_courses
            
        except Exception as e:
            logger.warning(f"Failed to enhance recommendations with vector search: {e}")
            # Continue with LLM results (links will be missing/default)
            
        await self._log_activity("profile_recommendations", profile_data, result)
        return result

    async def analyze_fraud_workflow(self, request: FraudAnalysisRequest) -> Dict[str, Any]:
        """
        Candidate profile fraud analysis workflow
        """
        logger.info(f"Starting fraud analysis workflow for user: {request.user_id or request.full_name}")
        
        profile_data = request.dict()
        result = await self.fraud_analyzer.analyze(profile_data)
        
        score = result.get('fraud_score', 0) if result else 0
        logger.info(f"Fraud analysis completed with score: {score}")
        
        final_res = result or self.fraud_analyzer._fallback_fraud_analysis([])
        await self._log_activity("fraud_analysis", request, final_res)
        return final_res

    def _get_quiz_from_cache(self, quiz_id: str) -> Dict[str, Any]:
        """Get quiz from cache (mock for now)"""
        # In real implementation, fetch from Redis/database
        return self.cache.get(f"quiz:{quiz_id}")