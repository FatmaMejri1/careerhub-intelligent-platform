import requests
import json
import time

def test_local_mistral():
    print("--- TEST OLLAMA LOCAL (Mistral 7B) ---")
    url = "http://localhost:11434/api/generate"
    
    payload = {
        "model": "mistral",
        "prompt": "Say 'Hello' in French.",
        "stream": False
    }

    print("Sending request to Local Ollama...")
    start_time = time.time()
    
    try:
        response = requests.post(url, json=payload, timeout=120) # Timeout long car c'est local
        duration = time.time() - start_time
        
        print(f"Status: {response.status_code}")
        print(f"Time Taken: {duration:.2f} seconds")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {result.get('response', 'No content')}")
            
            if duration > 10:
                print("\n⚠️  WARNING: Generation is VERY SLOW.")
                print("Your hardware might not be powerful enough for Mistral 7B.")
                print("Consider using a lighter model like 'gemma:2b' or 'qwen:0.5b'.")
        else:
            print(f"❌ Error: {response.text}")

    except Exception as e:
        print(f"❌ Connection Failed: {str(e)}")
        print("Is Ollama running? Run 'ollama serve' in another terminal.")

if __name__ == "__main__":
    test_local_mistral()
