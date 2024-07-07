import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables from .env file
load_dotenv()

# Get the database URL from environment variables
database_url = os.getenv('DATABASE_URL')

# Parse the URL to extract connection parameters
result = urlparse(database_url)
username = result.username
password = result.password
database = result.path[1:]
hostname = result.hostname
port = result.port

def verify_db_connection():
    try:
        # Attempt to connect to the database
        conn = psycopg2.connect(
            dbname=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        print("Database connection successful")
        
        # Optionally, execute a simple query to ensure the connection is fully functional
        cur = conn.cursor()
        cur.execute("SELECT 1")
        result = cur.fetchone()
        print("Query executed successfully, result:", result)
        
        # Close the cursor and connection
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database connection error: {e}")

if __name__ == "__main__":
    verify_db_connection()
