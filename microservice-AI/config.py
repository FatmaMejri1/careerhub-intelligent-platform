import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY non trouvée")

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    PORT = int(os.getenv('FLASK_PORT', 5001))

    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')