"""
Test script for AI Microservice endpoints
Tests all available endpoints to ensure they're working correctly
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health():
    """Test the health check endpoint"""
    print_section("Testing Health Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"✅ Status Code: {response.status_code}")
        print(f"📊 Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_cv_analysis():
    """Test CV analysis endpoint"""
    print_section("Testing CV Analysis Endpoint")
    try:
        # Sample CV text
        cv_data = {
            "cv_text": """
            John Doe
            Software Engineer
            
            Experience:
            - 5 years as Full Stack Developer at Tech Corp
            - Worked with Python, Java, JavaScript
            - Led team of 3 developers
            
            Education:
            - Master's in Computer Science
            - Bachelor's in Software Engineering
            
            Skills:
            Python, Java, JavaScript, React, Spring Boot, Docker, AWS
            """
        }
        
        response = requests.post(f"{BASE_URL}/api/analysis/cv", json=cv_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Analysis Result:")
            print(f"   - Skills Extracted: {len(result.get('skills', []))} skills")
            print(f"   - Experience Level: {result.get('experience_level', 'N/A')}")
            print(f"   - Recommendations: {len(result.get('recommendations', []))} items")
        else:
            print(f"⚠️  Response: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_job_matching():
    """Test job matching endpoint"""
    print_section("Testing Job Matching Endpoint")
    try:
        match_data = {
            "cv_text": "Python developer with 3 years experience in Django and Flask",
            "job_description": "Looking for Python developer with Django experience"
        }
        
        response = requests.post(f"{BASE_URL}/api/analysis/match", json=match_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Match Score: {result.get('match_score', 'N/A')}%")
            print(f"   - Matching Skills: {result.get('matching_skills', [])}")
        else:
            print(f"⚠️  Response: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_quiz_generation():
    """Test quiz generation endpoint"""
    print_section("Testing Quiz Generation Endpoint")
    try:
        quiz_data = {
            "domain": "Python Programming",
            "difficulty": "intermediate",
            "num_questions": 5
        }
        
        response = requests.post(f"{BASE_URL}/api/quiz/generate", json=quiz_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Quiz Generated:")
            print(f"   - Number of Questions: {len(result.get('questions', []))}")
            print(f"   - Domain: {result.get('domain', 'N/A')}")
            print(f"   - Difficulty: {result.get('difficulty', 'N/A')}")
        else:
            print(f"⚠️  Response: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_recommendations():
    """Test career recommendations endpoint"""
    print_section("Testing Career Recommendations Endpoint")
    try:
        rec_data = {
            "profile": {
                "skills": ["Python", "JavaScript", "React"],
                "experience_years": 3,
                "education": "Bachelor's in Computer Science"
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/recommendations/career", json=rec_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Recommendations:")
            print(f"   - Number of Suggestions: {len(result.get('recommendations', []))}")
        else:
            print(f"⚠️  Response: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_fraud_detection():
    """Test fraud detection endpoint"""
    print_section("Testing Fraud Detection Endpoint")
    try:
        fraud_data = {
            "job_posting": {
                "title": "Software Engineer",
                "description": "Great opportunity! Work from home! Earn $10000 per week! No experience needed!",
                "company": "QuickMoney Inc",
                "salary": "10000 USD/week"
            }
        }
        
        response = requests.post(f"{BASE_URL}/api/fraud/detect", json=fraud_data)
        print(f"✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Fraud Analysis:")
            print(f"   - Risk Score: {result.get('risk_score', 'N/A')}")
            print(f"   - Is Suspicious: {result.get('is_suspicious', 'N/A')}")
            print(f"   - Red Flags: {result.get('red_flags', [])}")
        else:
            print(f"⚠️  Response: {response.text}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "🚀 " * 20)
    print("  AI MICROSERVICE ENDPOINT TESTING")
    print("🚀 " * 20)
    print(f"\nTesting AI Service at: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        "Health Check": test_health(),
        "CV Analysis": test_cv_analysis(),
        "Job Matching": test_job_matching(),
        "Quiz Generation": test_quiz_generation(),
        "Career Recommendations": test_recommendations(),
        "Fraud Detection": test_fraud_detection()
    }
    
    # Summary
    print_section("TEST SUMMARY")
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:.<40} {status}")
    
    print(f"\n{'='*60}")
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    print(f"{'='*60}\n")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! AI Microservice is working correctly!")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
