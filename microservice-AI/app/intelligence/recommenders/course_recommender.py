from typing import List, Dict, Any
from app.storage.vector.chroma_store import ChromaVectorStore
from app.schemas import CourseRecommendation
import logging
import uuid

logger = logging.getLogger(__name__)

class CourseRecommender:
    """Recommend courses based on skills using Vector Search"""
    
    def __init__(self):
        self.vector_store = ChromaVectorStore(collection_name="courses")
        from app.storage.postgres import PostgresManager
        import asyncio
        self.db = PostgresManager()
        self._seed_if_empty()
        
    async def recommend(self, weak_skills: List[str], job_context: str = "") -> List[Dict[str, Any]]:
        """Recommend courses for weak skills"""
        logger.info(f"Generating recommendations for skills: {weak_skills}")
        
        recommendations = []
        
        for skill in weak_skills:
            # Query vector DB for each skill
            query = f"course for learning {skill} {job_context}"
            results = self.vector_store.query(query_text=query, n_results=2)
            
            skill_recs = []
            
            # Add Vector DB results
            for res in results:
                meta = res["metadata"]
                skill_recs.append({
                    "title": meta.get("title", "Unknown Course"),
                    "provider": meta.get("provider", "Unknown"),
                    "link": meta.get("url", "#"),
                    "duration": meta.get("duration", "Self-paced"),
                    "level": meta.get("level", "All Levels"),
                    "match_score": 1.0 - (res["distance"] if res["distance"] else 0.5),
                    "type": "AI Suggested"
                })

            # Add PostgreSQL results for this skill
            try:
                # Simple keyword search in PostgreSQL
                async with self.db.pool.acquire() as conn:
                    rows = await conn.fetch(
                        "SELECT titre, plateforme, url, duree, niveau FROM formations WHERE competence_associee ILIKE $1 OR titre ILIKE $1 LIMIT 2",
                        f"%{skill}%"
                    )
                    for row in rows:
                        skill_recs.append({
                            "title": row["titre"],
                            "provider": row["plateforme"],
                            "link": row["url"],
                            "duration": row["duree"],
                            "level": row["niveau"],
                            "match_score": 0.9,
                            "type": "Internal Platform"
                        })
            except Exception as e:
                logger.error(f"PostgreSQL course search failed: {e}")
            
            if skill_recs:
                recommendations.append({
                    "skill": skill,
                    "courses": skill_recs
                })
                
        return recommendations

    def _seed_if_empty(self):
        """Seed database with sample courses if empty"""
        if self.vector_store.count() == 0:
            logger.info("Seeding course database with sample data...")
            
            sample_courses = [
                # Python
                {"title": "Python for Everybody", "provider": "Coursera", "url": "https://coursera.org", "duration": "20 hours", "level": "Beginner", "text": "Learn Python programming basics, data structures, and web access."},
                {"title": "Advanced Python Mastery", "provider": "Udemy", "url": "https://udemy.com", "duration": "15 hours", "level": "Advanced", "text": "Deep dive into Python internals, decorators, generators, and async/await."},
                {"title": "FastAPI - The Modern Python Web Framework", "provider": "Udemy", "url": "https://udemy.com", "duration": "10 hours", "level": "Intermediate", "text": "Build high performance APIs with Python, FastAPI, and Pydantic."},
                
                # Java
                {"title": "Java Programming Masterclass", "provider": "Udemy", "url": "https://udemy.com", "duration": "40 hours", "level": "All Levels", "text": "Covering Java 11/17, Object Oriented Programming, and Spring Boot basics."},
                {"title": "Spring Boot 3 & Spring Framework 6", "provider": "Udemy", "url": "https://udemy.com", "duration": "30 hours", "level": "Advanced", "text": "Build enterprise Java applications with Spring Boot, Hibernate, and Microservices."},
                
                # Frontend
                {"title": "The Complete React Developer Course", "provider": "Udemy", "url": "https://udemy.com", "duration": "30 hours", "level": "Intermediate", "text": "Learn React, Redux, Context API, and Hooks to build modern web apps."},
                {"title": "Vue.js 3 - The Complete Guide", "provider": "Udemy", "url": "https://udemy.com", "duration": "25 hours", "level": "Intermediate", "text": "Master Vue 3, Composition API, Router, and Vuex."},
                
                # DevOps
                {"title": "Docker & Kubernetes: The Practical Guide", "provider": "Udemy", "url": "https://udemy.com", "duration": "20 hours", "level": "Advanced", "text": "Containerize apps with Docker and orchestrate them with Kubernetes."},
                {"title": "AWS Certified Solutions Architect", "provider": "A Cloud Guru", "url": "https://acloudguru.com", "duration": "50 hours", "level": "Advanced", "text": "Prepare for the AWS SAA-C03 exam. Learn EC2, S3, RDS, Lambda, and VPC."},
                
                # Soft Skills
                {"title": "Leadership: Practical Leadership Skills", "provider": "Udemy", "url": "https://udemy.com", "duration": "5 hours", "level": "All Levels", "text": "Master leadership skills, team management, and delegation."},
                {"title": "Effective Communication Skills", "provider": "Coursera", "url": "https://coursera.org", "duration": "8 hours", "level": "Beginner", "text": "Improve your business communication, presentation, and negotiation skills."}
            ]
            
            texts = [c["text"] for c in sample_courses]
            metadatas = [{k: v for k, v in c.items() if k != "text"} for c in sample_courses]
            ids = [str(uuid.uuid4()) for _ in sample_courses]
            
            self.vector_store.add_texts(texts, metadatas, ids)
            logger.info("Database seeded successfully!")
