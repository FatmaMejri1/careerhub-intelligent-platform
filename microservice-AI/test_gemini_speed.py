import os
import sys
import asyncio
# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.llm.providers.gemini_provider import GeminiProvider
import time

async def test_gemini_speed():
    print("--- TEST GOOGLE GEMINI (CLOUD) ---")
    
    api_key = settings.gemini_api_key
    model = settings.gemini_model
    
    if not api_key:
        # Try to load from env directly as fallback
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        
    if not api_key:
        print("❌ Error: GEMINI_API_KEY is missing in settings or .env")
        return

    print(f"Model: {model}")
    print(f"Key: {api_key[:5]}...{api_key[-5:]}")
    
    # Try different model names
    models_to_try = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro"
    ]
    
    for model_name in models_to_try:
        print(f"\nTrying model: {model_name}...")
        try:
            provider = GeminiProvider(api_key=api_key, model=model_name)
            
            print("Sending request...")
            start_time = time.time()
            response = await provider.generate("Hello, are you working?")
            duration = time.time() - start_time
            
            print(f"Time Taken: {duration:.2f} seconds")
            print(f"✅ SUCCESS with {model_name}!\nResponse: {response}")
            
            # If success, update config or inform user
            return
            
        except Exception as e:
            print(f"❌ Failed with {model_name}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini_speed())
