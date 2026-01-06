import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
import requests
import json
import time

def test_openai_cloud_speed():
    print(f"--- TEST CLOUD CONFIGURATION (Via OpenAI Protocol) ---")
    print(f"BASE URL: {settings.openai_base_url}")
    print(f"MODEL: {settings.openai_model}")
    print(f"KEY PRESENT: {'Yes' if settings.openai_api_key else 'No'}")
    
    if not settings.openai_api_key:
        print("❌ Error: No OpenAI API Key found in settings.")
        return

    headers = {
        "Authorization": f"Bearer {settings.openai_api_key}",
        "Content-Type": "application/json"
    }
    
    # Standard OpenAI endpoint
    endpoint = f"{settings.openai_base_url}/chat/completions"
    
    payload = {
        "model": settings.openai_model,
        "messages": [{"role": "user", "content": "Hello! Give me a 1-sentence technical question about Linux."}],
        "stream": False,
        "temperature": 0.7
    }

    print(f"\nTesting Endpoint: {endpoint}")
    start_time = time.time()
    try:
        response = requests.post(endpoint, headers=headers, json=payload, timeout=30)
        duration = time.time() - start_time
        
        print(f"Status : {response.status_code}")
        print(f"Time : {duration:.2f} seconds")
        
        if response.status_code == 200:
            print("\n✅ SUCCÈS !")
            result = response.json()
            content = ""
            if "choices" in result and len(result["choices"]) > 0:
                content = result['choices'][0]['message']['content']
            else:
                content = str(result)
                
            print(f"Response: {content}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"Network Error: {str(e)}")

if __name__ == "__main__":
    test_openai_cloud_speed()
