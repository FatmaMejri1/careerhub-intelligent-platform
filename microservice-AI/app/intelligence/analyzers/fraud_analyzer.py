from typing import List, Dict, Any, Optional
from app.dependencies import get_llm_provider
import re
from loguru import logger

class FraudAnalyzer:
    """Analyzes profiles for potential fraud factors using AI and heuristics"""
    
    def __init__(self, llm=None):
        self.llm = llm or get_llm_provider()

    async def analyze(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze profile for fraud"""
        
        # 1. Heuristic Analysis (Fast)
        heuristics_result = self._run_heuristics(profile_data)
        
        # 2. AI Analysis (Deep)
        ai_prompt = self._create_fraud_prompt(profile_data, heuristics_result)
        logger.info(f"Requesting AI Fraud Analysis for {profile_data.get('full_name') or 'Unknown'}...")
        
        schema = {
            "type": "object",
            "properties": {
                "fraud_score": {"type": "integer", "minimum": 0, "maximum": 100},
                "is_suspicious": {"type": "boolean"},
                "ai_analysis": {"type": "string"},
                "evidence": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string"},
                            "value": {"type": "string"},
                            "severity": {"type": "string", "enum": ["low", "medium", "high"]}
                        },
                        "required": ["label", "value", "severity"]
                    }
                }
            },
            "required": ["fraud_score", "is_suspicious", "ai_analysis", "evidence"]
        }
        
        try:
            # Calculate heuristic score explicitly
            heuristic_score = self._calculate_heuristic_score(heuristics_result)
            
            result = await self.llm.generate_structured(ai_prompt, schema)
            
            # Combine scores
            ai_score = result.get("fraud_score", 0)
            final_fraud_score = max(heuristic_score, ai_score)
            
            # Return enriched response
            result["fraud_score"] = final_fraud_score
            result["heuristic_score"] = heuristic_score
            result["ai_fraud_score"] = ai_score
            
            return result
        except Exception as e:
            logger.error(f"Fraud analysis failed: {str(e)}")
            fallback = self._fallback_fraud_analysis(heuristics_result)
            fallback["heuristic_score"] = self._calculate_heuristic_score(heuristics_result)
            fallback["ai_fraud_score"] = 0
            return fallback

    def _calculate_heuristic_score(self, heuristics: List[Dict[str, Any]]) -> int:
        if not heuristics: return 0
        score = 0
        for h in heuristics:
            if h.get('severity') == 'high': score += 40
            elif h.get('severity') == 'medium': score += 20
            else: score += 5
        return min(score, 100)

    def _run_heuristics(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        evidence = []
        
        # Check URLs
        social_links = data.get('social_links') or []
        if isinstance(social_links, str): social_links = [social_links]
        
        if isinstance(social_links, list):
            for link in social_links:
                if link and isinstance(link, str) and not self._is_valid_url(link):
                    evidence.append({"label": "URL Invalide", "value": link, "severity": "medium"})
        
        # Check for suspicious patterns in experiences
        experiences = data.get('experiences') or []
        if isinstance(experiences, list):
            for exp in experiences:
                if not exp or not isinstance(exp, dict): continue
                company = exp.get('company', '')
                if company:
                    company_lower = company.lower()
                    if any(term in company_lower for term in ["fake", "test", "inconnu", "unknown", "lorem"]):
                        evidence.append({"label": "Entreprise Suspecte", "value": company, "severity": "high"})
                
                # Check for generic descriptions
                desc = exp.get('description', '')
                if desc and "lorem ipsum" in desc.lower():
                    evidence.append({"label": "Description Générique", "value": "Loreum Ipsum détecté", "severity": "high"})

        # Check for non-existent universities
        education = data.get('education') or []
        if isinstance(education, list):
            for edu in education:
                if not edu or not isinstance(edu, dict): continue
                uni = edu.get('school', '')
                if uni:
                    uni_lower = uni.lower()
                    if any(term in uni_lower for term in ["fake", "test", "inconnu"]):
                        evidence.append({"label": "Université Suspecte", "value": uni, "severity": "high"})
        
        return evidence

    def _is_valid_url(self, url: str) -> bool:
        if not url or url == "#": return True
        # Simple regex for URL validation
        regex = re.compile(
            r'^(?:http|ftp)s?://' 
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
            r'localhost|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
            r'(?::\d+)?'
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return re.match(regex, url) is not None

    def _create_fraud_prompt(self, profile_data: Dict[str, Any], heuristics: List[Dict[str, Any]]) -> str:
        # Extra safe member access to prevent 'NoneType' object is not subscriptable
        full_name = profile_data.get('full_name') or "Inconnu"
        social_links = profile_data.get('social_links') or []
        experiences = profile_data.get('experiences') or []
        education = profile_data.get('education') or []
        cv_text = profile_data.get('cv_text') or "Aucun texte de CV fourni"
        
        return f"""
        You are a fraud detection AI for a professional recruitment platform.
        Your task is to analyze a candidate profile and detect inconsistencies, fake data, or suspicious patterns.
        
        PROFILE DATA:
        Full Name: {full_name}
        Social Links: {social_links}
        Experiences: {experiences}
        Education: {education}
        
        CV Text Content: 
        {str(cv_text)[:1500]}
        
        KNOWN HEURISTIC RED FLAGS:
        {heuristics}
        
        GUIDELINES:
        1. Fraud Score: 0 (Safe) to 100 (High Risk).
        2. Red Flags: Unrealistic experience overlaps, non-existent major companies/universities, placeholder "Lorem Ipsum" text, unreachable social links.
        3. Analysis: Provide a 2-3 sentence summary of why the profile is or is not suspicious.
        """

    def _fallback_fraud_analysis(self, heuristics: List[Dict[str, Any]]) -> Dict[str, Any]:
        score = 15 if heuristics else 5
        if any(h['severity'] == 'high' for h in heuristics): score = 75
        elif any(h['severity'] == 'medium' for h in heuristics): score = 40
        
        return {
            "fraud_score": score,
            "is_suspicious": score > 50,
            "ai_analysis": "Analyse basée sur des règles prédéfinies (Red flags détectés).",
            "evidence": heuristics
        }
