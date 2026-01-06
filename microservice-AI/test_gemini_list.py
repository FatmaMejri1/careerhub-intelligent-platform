import os
import sys
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def list_available_models():
    print("--- LISTING AVAILABLE GEMINI MODELS ---")
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ CRITICAL: No API key found in .env")
        return

    print(f"Key found: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    
    try:
        print("Fetching models from Google...")
        models = list(genai.list_models())
        
        found_any = False
        print("\nAvailable Generative Models:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ {m.name}")
                found_any = True
                
        if not found_any:
            print("⚠️ Key is valid but no generative models found. Check Google AI Studio settings.")
        else:
            print("\n✅ PICK ONE OF THE ABOVE FOR YOUR .env FILE")
            
    except Exception as e:
        print(f"❌ Error listing models: {e}")

if __name__ == "__main__":
    list_available_models()
