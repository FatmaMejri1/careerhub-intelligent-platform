"""
Test script for Course Recommendations using ChromaDB
"""
import asyncio
import sys
sys.path.insert(0, '.')

from app.intelligence.recommenders.course_recommender import CourseRecommender

async def test_recommendations():
    print("🧪 Testing Course Recommendations with ChromaDB...")
    print("=" * 60)
    
    # Initialize recommender (will auto-seed)
    print("⏳ Initializing Vector Store (loading model & seeding)...")
    recommender = CourseRecommender()
    
    # Test cases
    test_skills = ["Python", "AWS", "Communication"]
    job_context = "backend developer"
    
    print(f"\n🔍 Searching for courses related to: {test_skills}")
    print(f"Context: {job_context}")
    print("\n⏳ Processing...\n")
    
    try:
        recommendations = await recommender.recommend(test_skills, job_context)
        
        print("✅ Recommendations Generated!\n")
        print("=" * 60)
        
        for rec in recommendations:
            print(f"\n🎯 Skill: {rec['skill']}")
            print("-" * 30)
            
            for course in rec['courses']:
                print(f"   📚 {course['title']}")
                print(f"      Provider: {course['provider']} | Level: {course['level']}")
                print(f"      Score: {course['match_score']:.2f}")
                print(f"      Link: {course['link']}\n")
                
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_recommendations())
    sys.exit(0 if success else 1)
