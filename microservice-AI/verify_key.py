import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

# Force reload of environment variables
load_dotenv(override=True)

import sys
import codecs
if sys.stdout.encoding != 'utf-8':
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in environment.")
    exit(1)

print(f"🔑 Testing Key: {api_key[:5]}...{api_key[-5:]}")

genai.configure(api_key=api_key)

models_to_test = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro']

for model_name in models_to_test:
    print(f"\n🤖 Testing Model: {model_name}")
    try:
        model = genai.GenerativeModel(model_name)
        start = time.time()
        response = model.generate_content("Reply with 'OK' if you can hear me.")
        duration = time.time() - start
        
        print(f"✅ Success! ({duration:.2f}s)")
        print(f"📝 Response: {response.text.strip()}")
        break # Stop after first success
    except Exception as e:
        print(f"❌ Failed: {str(e)}")
