import os

file_path = ".env"
if os.path.exists(file_path):
    with open(file_path, "r") as f:
        content = f.read()
        print("--- .env debug ---")
        for line in content.splitlines():
            if line.startswith("GEMINI_API_KEY"):
                key_value = line.split("=")[1].strip()
                print(f"Key found in file: {key_value[:5]}...{key_value[-5:]}")
else:
    print(".env file not found!")
