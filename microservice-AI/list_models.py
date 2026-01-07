import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

with open("models_list.txt", "w", encoding="utf-8") as f:
    f.write(f"Testing key: {api_key[:5]}...{api_key[-5:]}\n")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
        print("Success written to models_list.txt")
    except Exception as e:
        f.write(f"❌ Error: {e}\n")
        print(f"Error listing models: {e}")
