import os
import sys
from dotenv import load_dotenv

# Force reload of .env
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(override=True)

def debug_env():
    print("--- DEBUG CONFIGURATION ---")
    key = os.getenv("GEMINI_API_KEY")
    
    if not key:
        print("❌ GEMINI_API_KEY is EMPTY or MISSING in .env")
        return

    print(f"Raw Key Length: {len(key)}")
    print(f"First 5 chars: '{key[:5]}'")
    print(f"Last 5 chars: '{key[-5:]}'")
    
    # Check for invisible characters
    if " " in key:
        print("❌ WARNING: The key contains SPACES! Remove them.")
    if "\n" in key or "\r" in key:
        print("❌ WARNING: The key contains NEWLINES! Remove them.")
    if '"' in key or "'" in key:
        print("⚠️ NOTE: The key contains QUOTES. This might be intended but verify.")
        
    print(f"Model: {os.getenv('GEMINI_MODEL')}")

if __name__ == "__main__":
    debug_env()
