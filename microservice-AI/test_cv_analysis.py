"""
Test script for CV Analysis with Gemini
"""
import asyncio
import sys
sys.path.insert(0, '.')

from app.intelligence.analyzers.cv_analyzer import CVAnalyzer
from app.dependencies import get_llm_provider

async def test_cv_analysis():
    print("🧪 Testing CV Analysis with Gemini...")
    print("=" * 60)
    
    # Initialize analyzer
    llm = get_llm_provider()
    analyzer = CVAnalyzer(llm=llm)
    
    # Sample CV Text (simulated)
    cv_text = """
    JHON DOE
    Senior Full Stack Developer
    
    PROFILE
    Experienced developer with 8 years in building scalable web applications.
    Specialized in Python, Django, and React.
    
    EXPERIENCE
    Senior Developer at TechCorp (2020-Present)
    - Led a team of 5 developers
    - Architected microservices using FastAPI and Docker
    - Optimized database queries improving performance by 40%
    
    Software Engineer at StartupInc (2016-2020)
    - Built REST APIs using Django Rest Framework
    - Developed frontend using React and Redux
    - Implemented CI/CD pipelines with Jenkins
    
    SKILLS
    - Languages: Python, JavaScript, SQL
    - Frameworks: FastAPI, Django, React, Vue.js
    - Tools: Docker, Kubernetes, AWS, Git
    - Databases: PostgreSQL, MongoDB, Redis
    """
    
    job_description = """
    We are looking for a Senior Python Developer with experience in FastAPI and Microservices.
    Knowledge of Docker and Cloud platforms (AWS) is required.
    React experience is a plus.
    """
    
    print(f"\n📄 Analyzing CV for Jhon Doe...")
    print("\n⏳ Processing... (this may take 30-60 seconds)\n")
    
    try:
        result = await analyzer.analyze(cv_text, job_description)
        
        print("✅ Analysis Complete!\n")
        print("=" * 60)
        print(f"👨‍💼 Experience Level: {result.get('experience_level')}")
        print(f"📅 Years of Experience: {result.get('years_experience')}")
        print(f"📝 Summary: {result.get('summary')}")
        print(f"🎯 Match Score: {result.get('match_score')}")
        
        print("\n🛠️ Extracted Skills:")
        for skill in result.get('extracted_skills', []):
            print(f"   - {skill['skill']} ({skill['level']}) - Confidence: {skill['confidence']}")
            
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_cv_analysis())
    sys.exit(0 if success else 1)
