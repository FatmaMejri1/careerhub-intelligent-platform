import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")

with open("models_list_clean.txt", "w", encoding="utf-8") as f:
    f.write(f"Testing Key: {api_key[:5]}...{api_key[-5:]}\n")
    try:
        genai.configure(api_key=api_key)
        found = False
        for m in genai.list_models():
            found = True
            f.write(f"Model: {m.name}\n")
            f.write(f"Methods: {m.supported_generation_methods}\n")
            f.write("-" * 20 + "\n")
        
        if not found:
            f.write("No models found.\n")
            
    except Exception as e:
        f.write(f"Error: {e}\n")
