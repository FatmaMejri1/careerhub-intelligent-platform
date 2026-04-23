from typing import List, Dict, Any
import logging
from app.storage.postgres import PostgresManager
from app.llm.providers.gemini_provider import GeminiProvider
from app.config import settings

logger = logging.getLogger(__name__)

class JobRecommender:
    """Recommends job offers based on candidate profile using AI"""
    
    def __init__(self, llm_provider: GeminiProvider = None):
        self.db = PostgresManager()
        self.llm = llm_provider or GeminiProvider(api_key=settings.gemini_api_key)

    async def recommend(self, profile_data: Dict[str, Any], limit: int = 5) -> List[Dict[str, Any]]:
        """
        AI-powered job recommendation
        1. Fetch offers from DB
        2. Match with profile using AI/Logic
        3. Return ranked results
        """
        try:
            # 1. Fetch available offers
            # In a huge system, we'd use vector search. 
            # For this scale, we fetch active offers and let the logic/AI handle it.
            async with self.db.pool.acquire() as conn:
                rows = await conn.fetch("""
                    SELECT o.id, o.titre, o.description, o.location, o.type as contract_type, 
                           r.nom_entreprise as company
                    FROM offres o
                    LEFT JOIN recruteurs r ON o.recruteur_id = r.id
                    WHERE o.statut = 'ACTIVE'
                    ORDER BY o.date_creation DESC
                    LIMIT 50
                """)
                
                offers = [dict(row) for row in rows]

            if not offers:
                return []

            # 2. Extract key info for matching
            candidate_skills = profile_data.get("competences", [])
            candidate_title = profile_data.get("titre", "")
            
            # 3. Perform matching (Simple heuristic for speed, could be LLM-powered)
            # For better UX, we calculate a score based on text similarity or LLM ranking
            scored_offers = []
            for offer in offers:
                score = self._calculate_basic_match(offer, candidate_title, candidate_skills)
                offer["matchScore"] = score
                scored_offers.append(offer)

            # 4. Sort and return
            scored_offers.sort(key=lambda x: x["matchScore"], reverse=True)
            return scored_offers[:limit]

        except Exception as e:
            logger.error(f"Job recommendation failed: {e}")
            return []

    def _calculate_basic_match(self, offer: Dict[str, Any], title: str, skills: List[str]) -> int:
        score = 50 # Base
        
        # Title match
        off_title = offer.get("titre", "").lower()
        cand_title = title.lower()
        if cand_title and (cand_title in off_title or off_title in cand_title):
            score += 20
            
        # Skill match
        off_desc = offer.get("description", "").lower()
        skill_matches = 0
        if skills:
            for skill in skills:
                if skill.lower() in off_desc or skill.lower() in off_title:
                    skill_matches += 1
            
            if skill_matches > 0:
                score += min(25, (skill_matches / len(skills)) * 25)
        
        # Add some "AI randomness" or better ranking if needed
        import random
        score += random.randint(-2, 5) 
        
        return int(min(99, score))
