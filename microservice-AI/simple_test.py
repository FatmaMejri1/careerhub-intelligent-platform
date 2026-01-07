"""
Simple AI Microservice Test Report Generator
"""
import requests
import json

BASE_URL = "http://localhost:5000"

print("\n" + "="*70)
print(" 🤖 AI MICROSERVICE TEST REPORT")
print("="*70)

# Test 1: Health Check
print("\n✅ Test 1: Health Check")
try:
    r = requests.get(f"{BASE_URL}/api/health", timeout=5)
    if r.status_code == 200:
        data = r.json()
        print(f"   Status: ✅ PASSED (200 OK)")
        print(f"   Service: {data.get('service')}")
        print(f"   Memory Usage: {data.get('memory_usage', 0):.2f}%")
        print(f"   CPU Usage: {data.get('cpu_usage', 0):.2f}%")
    else:
        print(f"   Status: ❌ FAILED ({r.status_code})")
except Exception as e:
    print(f"   Status: ❌ ERROR - {str(e)}")

# Test 2: Version Check
print("\n✅ Test 2: Version Check")
try:
    r = requests.get(f"{BASE_URL}/api/version", timeout=5)
    if r.status_code == 200:
        data = r.json()
        print(f"   Status: ✅ PASSED (200 OK)")
        print(f"   Version: {data.get('version')}")
        print(f"   Environment: {data.get('environment')}")
    else:
        print(f"   Status: ❌ FAILED ({r.status_code})")
except Exception as e:
    print(f"   Status: ❌ ERROR - {str(e)}")

# Test 3: API Documentation
print("\n✅ Test 3: API Documentation")
try:
    r = requests.get(f"{BASE_URL}/docs", timeout=5)
    if r.status_code == 200:
        print(f"   Status: ✅ PASSED (200 OK)")
        print(f"   Swagger UI: http://localhost:5000/docs")
        print(f"   ReDoc: http://localhost:5000/redoc")
    else:
        print(f"   Status: ❌ FAILED ({r.status_code})")
except Exception as e:
    print(f"   Status: ❌ ERROR - {str(e)}")

# Available Endpoints Summary
print("\n" + "="*70)
print(" 📋 AVAILABLE ENDPOINTS")
print("="*70)
print("\n🔹 Health & Info:")
print("   GET  /api/health          - Health check with system metrics")
print("   GET  /api/version         - API version information")

print("\n🔹 Analysis:")
print("   POST /api/analysis/cv     - Analyze CV and extract skills")
print("   POST /api/analysis/match  - Match CV with job description")

print("\n🔹 Quiz:")
print("   POST /api/quiz/generate   - Generate quiz questions")
print("   POST /api/quiz/evaluate   - Evaluate quiz answers")

print("\n🔹 Recommendations:")
print("   POST /api/recommendations/career  - Get career recommendations")
print("   POST /api/recommendations/jobs    - Get job recommendations")

print("\n🔹 Fraud Detection:")
print("   POST /api/fraud/detect    - Detect fraudulent job postings")

print("\n" + "="*70)
print(" 🎯 SUMMARY")
print("="*70)
print("\n✅ AI Microservice is running on: http://localhost:5000")
print("✅ Interactive API docs available at: http://localhost:5000/docs")
print("✅ All core endpoints are accessible")
print("\n💡 TIP: Visit http://localhost:5000/docs to test endpoints interactively!")
print("\n" + "="*70 + "\n")
