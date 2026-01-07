import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model_name = "gemini-2.5-flash"
print(f"Testing {model_name} with key {api_key[:5]}...")

try:
    model = genai.GenerativeModel(model_name)
    start = time.time()
    response = model.generate_content("Say Hello")
    duration = time.time() - start
    print(f"✅ Success! ({duration:.2f}s)")
    print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")
