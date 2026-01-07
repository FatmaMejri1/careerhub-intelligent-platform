"""
Test Quiz Generation Endpoint
"""
import requests
import json

BASE_URL = "http://localhost:5000"

print("\n" + "="*70)
print("  TESTING QUIZ GENERATION")
print("="*70)

# Test data
quiz_request = {
    "job_description": "UX/UI Designer with experience in Figma and Adobe XD",
    "required_skills": ["UX/UI", "Designer", "Figma"],
    "candidate_level": "intermediate",
    "num_questions": 4
}

print("\n📤 Sending Request:")
print(json.dumps(quiz_request, indent=2))

try:
    response = requests.post(
        f"{BASE_URL}/api/quiz/generate",
        json=quiz_request,
        timeout=30
    )
    
    print(f"\n✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Response Structure:")
        print(f"   - quiz_id: {data.get('quiz_id')}")
        print(f"   - time_limit: {data.get('time_limit')}")
        print(f"   - questions count: {len(data.get('questions', []))}")
        print(f"   - generated_at: {data.get('generated_at')}")
        
        print(f"\n📝 Full Response:")
        print(json.dumps(data, indent=2))
        
        # Check first question structure
        if data.get('questions'):
            q = data['questions'][0]
            print(f"\n🔍 First Question Structure:")
            print(f"   - id: {q.get('id')}")
            print(f"   - type: {q.get('type')}")
            print(f"   - skill: {q.get('skill')}")
            print(f"   - text: {q.get('text')[:50]}...")
            print(f"   - options count: {len(q.get('options', []))}")
            print(f"   - correct_answer: {q.get('correct_answer')}")
            print(f"   - difficulty: {q.get('difficulty')}")
    else:
        print(f"\n❌ Error Response:")
        print(response.text)
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

print("\n" + "="*70 + "\n")
