"""
Test script for Quiz Generation with Ollama
"""
import asyncio
import sys
sys.path.insert(0, '.')

from app.intelligence.generators.quiz_generator import QuizGenerator
from app.schemas import DifficultyLevel
from app.dependencies import get_llm_provider

async def test_quiz_generation():
    print("🧪 Testing Quiz Generation with Ollama Mistral...")
    print("=" * 60)
    
    # Initialize quiz generator with Ollama
    llm = get_llm_provider()
    generator = QuizGenerator(llm=llm)
    
    # Test parameters
    job_description = """
    We are looking for a Python Backend Developer with experience in FastAPI and REST APIs.
    The candidate should be comfortable with databases, async programming, and testing.
    """
    
    required_skills = ["Python", "FastAPI", "REST APIs", "Async Programming"]
    
    print(f"\n📋 Job Description: {job_description.strip()}")
    print(f"🎯 Required Skills: {', '.join(required_skills)}")
    print(f"📊 Difficulty: INTERMEDIATE")
    print(f"❓ Number of Questions: 5")
    print("\n⏳ Generating quiz... (this may take 30-60 seconds)\n")
    
    try:
        questions = await generator.generate(
            job_description=job_description,
            required_skills=required_skills,
            difficulty_level=DifficultyLevel.INTERMEDIATE,
            num_questions=5
        )
        
        print(f"✅ Successfully generated {len(questions)} questions!\n")
        print("=" * 60)
        
        for i, q in enumerate(questions, 1):
            print(f"\n📝 Question {i} ({q.type.value} - {q.skill})")
            print(f"   Difficulty: {q.difficulty.value}")
            print(f"\n   {q.text}")
            print(f"\n   Options:")
            for j, option in enumerate(q.options):
                marker = "✓" if j == q.correct_answer else " "
                print(f"      [{marker}] {j}. {option}")
            print(f"\n   💡 Explanation: {q.explanation}")
            print("-" * 60)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_quiz_generation())
    sys.exit(0 if success else 1)
