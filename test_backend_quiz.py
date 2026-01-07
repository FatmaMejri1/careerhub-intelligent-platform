"""
Test Backend Quiz Generation Endpoint
"""
import requests
import json

BACKEND_URL = "http://localhost:9099"

print("\n" + "="*70)
print("  TESTING BACKEND QUIZ GENERATION")
print("="*70)

# Test data (same format as frontend sends)
quiz_request = {
    "title": "UX/UI Designer",
    "description": "Looking for a UX/UI Designer with experience in Figma and Adobe XD"
}

print("\n📤 Sending Request to Backend:")
print(json.dumps(quiz_request, indent=2))

try:
    response = requests.post(
        f"{BACKEND_URL}/api/quiz/generate",
        json=quiz_request,
        timeout=30
    )
    
    print(f"\n✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Response Structure:")
        print(f"   - title: {data.get('title')}")
        print(f"   - timeLimit: {data.get('timeLimit')}")
        print(f"   - questions count: {len(data.get('questions', []))}")
        
        print(f"\n📝 Full Response:")
        print(json.dumps(data, indent=2))
        
        # Check first question structure
        if data.get('questions'):
            q = data['questions'][0]
            print(f"\n🔍 First Question Structure:")
            print(f"   - question: {q.get('question')[:50] if q.get('question') else 'None'}...")
            print(f"   - options count: {len(q.get('options', []))}")
            print(f"   - correctOptionIndex: {q.get('correctOptionIndex')}")
            print(f"   - skillArea: {q.get('skillArea')}")
            print(f"   - difficulty: {q.get('difficulty')}")
            print(f"   - explanation: {q.get('explanation')[:50] if q.get('explanation') else 'None'}...")
    else:
        print(f"\n❌ Error Response:")
        print(response.text)
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

print("\n" + "="*70 + "\n")
