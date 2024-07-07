import os
import requests
from datetime import datetime
import psycopg2
from dotenv import load_dotenv
import uuid
# Load environment variables from .env file
load_dotenv()

# Function to get database connection
def get_db_connection():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    return conn

# Function to log API hit
def log_api_hit(request_id, request_type, request_time, payload, content_type, ip_address, os, user_agent):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO api_hits (request_id, request_type, request_time, payload, content_type, ip_address, os, user_agent)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (request_id, request_type, request_time, payload, content_type, ip_address, os, user_agent))
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise  # Raise the error to handle it in the caller function



# Function to retrieve weather data from OpenWeatherMap API
def get_weather(city, request_info):
    start_time = datetime.now()
    try:
        response = requests.get(f'http://api.openweathermap.org/data/3.0weather?q={city}&appid={os.getenv("OPENWEATHERMAP_API_KEY")}')
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

        # Log the API hit
        log_api_hit(
            request_id=request_info['request_id'],
            request_type='GET',
            request_time=start_time,
            payload=request_info['payload'],
            content_type=request_info['content_type'],
            ip_address=request_info['ip_address'],
            os=request_info['os'],
            user_agent=request_info['user_agent']
        )

        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error accessing OpenWeatherMap API: {e}")
        return {'error': 'An error occurred during the request to OpenWeatherMap API'}

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return {'error': 'An error occurred while accessing the database'}

    except Exception as e:
        print(f"Unexpected error: {e}")
        return {'error': 'An unexpected error occurred'}
