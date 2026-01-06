import requests
import time
import json

url = "http://127.0.0.1:8000/api/quiz/generate"
payload = {
    "job_description": "Ingénieur Embedded Linux: Développement et intégration de systèmes Linux embarqué, Kernel, Drivers, U-Boot",
    "required_skills": ["Linux embarqué", "C/C++", "Kernel Linux", "Drivers", "U-Boot", "Yocto"],
    "candidate_level": "intermediate",
    "num_questions": 4
}

print(f"Testing quiz generation speed for: {payload['job_description']}")
print("Sending request...")

start_time = time.time()
try:
    response = requests.post(url, json=payload, timeout=300)
    end_time = time.time()
    
    duration = end_time - start_time
    print(f"\n--- Result ---")
    print(f"Status Code: {response.status_code}")
    print(f"Total Time: {duration:.2f} seconds")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Number of questions generated: {len(data.get('questions', []))}")
        print("\nFirst Question Sample:")
        if data.get('questions'):
            q = data['questions'][0]
            print(f"Q: {q.get('text')}")
            print(f"Skills: {q.get('skill')}")
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Request failed: {str(e)}")
