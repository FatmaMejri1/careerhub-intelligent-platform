import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

with open("test_log.txt", "w", encoding="utf-8") as f:
    f.write(f"Testing key: {api_key[:5]}...{api_key[-5:]}\n")

    genai.configure(api_key=api_key)

    try:
        # Try a model that WAS in the list
        model_name = 'gemini-2.0-flash'
        f.write(f"Trying model: {model_name}\n")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello! Are you working?")
        f.write("✅ Success!\n")
        f.write(f"Response: {response.text}\n")
    except Exception as e:
        f.write(f"❌ Error with {model_name}: {e}\n")
