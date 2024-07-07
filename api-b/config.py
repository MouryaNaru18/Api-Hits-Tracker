import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV')
    DATABASE_URL = os.getenv('DATABASE_URL')
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
