import requests
import time
import os
import sys

# Add parent directory to path to import settings
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.config import settings

def test_huggingface_speed():
    print("--- TEST HUGGING FACE INFERENCE API ---")
    
    # Check if key is available
    api_key = settings.huggingface_api_key
    if not api_key:
        # Fallback to check env var purely
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv("HUGGINGFACE_API_KEY")
        
    if not api_key:
        print("❌ Error: HUGGINGFACE_API_KEY is missing in .env")
        return

    model = "mistralai/Mistral-7B-Instruct-v0.3"
    url = f"https://router.huggingface.co/models/{model}"
    
    print(f"URL: {url}")
    print(f"Key: {api_key[:4]}...{api_key[-4:]}")
    
    headers = {"Authorization": f"Bearer {api_key}"}
    
    # Mistral format prompt
    prompt = "[INST] Should I use Linux or Windows for embedded development? Answer in 1 sentence. [/INST]"
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 100,
            "return_full_text": False
        }
    }

    print("\nSending request to Hugging Face Cloud...")
    start_time = time.time()
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        duration = time.time() - start_time
        
        print(f"Status: {response.status_code}")
        print(f"Time Taken: {duration:.2f} seconds")
        
        if response.status_code == 200:
            result = response.json()
            # HF API returns a list of objects usually
            text = result[0]["generated_text"] if isinstance(result, list) else str(result)
            print(f"\n✅ SUCCESS!\nResponse: {text}")
        else:
            print(f"\n❌ Error: {response.text}")
            if "loading" in response.text.lower():
                print("Note: Model is loading on HF servers (Cold Start). Try again in 30 seconds.")

    except Exception as e:
        print(f"❌ Connection Failed: {str(e)}")

if __name__ == "__main__":
    test_huggingface_speed()
