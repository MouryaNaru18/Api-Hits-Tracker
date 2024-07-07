from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import psycopg2
import http.client
from datetime import datetime
from urllib.parse import urlparse
from config import Config
from user_agents import parse  # Assuming you have installed 'user-agents' library

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for the Flask application

# Parse the database URL
database_url = app.config['DATABASE_URL']
result = urlparse(database_url)
username = result.username
password = result.password
database = result.path[1:]
hostname = result.hostname
port = result.port

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def get_browser_details(user_agent_string):
    user_agent = parse(user_agent_string)
    return {
        "browser": user_agent.browser.family,
        "browser_version": user_agent.browser.version_string,
        "platform": user_agent.os.family
    }

def log_api_hit(request):
    conn = get_db_connection()
    if conn is None:
        return  # Exit if connection failed
    
    cur = conn.cursor()
    
    # Extract browser details from user agent string
    user_agent_info = get_browser_details(request.user_agent.string)

    try:
        cur.execute("""
            INSERT INTO api_log (request_id, request_type, request_time, payload, content_type, ip_address, os, user_agent, browser, browser_version)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            request.headers.get('X-Request-Id', 'N/A'),
            request.method,
            datetime.utcnow(),
            request.data.decode('utf-8') if request.data else None,
            request.headers.get('Content-Type', 'N/A'),
            request.remote_addr,
            user_agent_info["platform"],
            request.user_agent.string,
            user_agent_info["browser"],
            user_agent_info["browser_version"]
        ))
        conn.commit()
        print("API hit logged successfully")
    except Exception as e:
        print(f"Error inserting API hit into database: {e}")

    cur.close()
    conn.close()

@app.route('/imdb-top-100', methods=['GET', 'POST'])
def get_imdb_top_100():
    log_api_hit(request)

    if request.method == 'GET':
        conn = http.client.HTTPSConnection("imdb-top-100-movies.p.rapidapi.com")
        headers = {
            'x-rapidapi-key': app.config['RAPIDAPI_KEY'],
            'x-rapidapi-host': "imdb-top-100-movies.p.rapidapi.com"
        }
        conn.request("GET", "/", headers=headers)
        res = conn.getresponse()
        data = res.read()
        print(f"User Agent String: {request.user_agent.string}")
        user_agent_info = get_browser_details(request.user_agent.string)
        print(f"Parsed User Agent Info: {user_agent_info}")
        return data.decode("utf-8")
    elif request.method == 'POST':
        # Handle POST request logic here if needed
        return jsonify({"message": "POST request received"})

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api-hits-data', methods=['GET'])
def api_hits_data():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cur = conn.cursor()
    cur.execute("SELECT * FROM api_log")
    results = cur.fetchall()
    cur.close()
    conn.close()

    logs = []
    for row in results:
        log = {
            'id': row[0],
            'request_id': row[1],
            'request_type': row[2],
            'request_time': row[3].strftime('%Y-%m-%d %H:%M:%S'),
            'payload': row[4],
            'content_type': row[5],
            'ip_address': row[6],
            'os': row[7],
            'user_agent': row[8],
            'browser': row[9],
            'browser_version': row[10]
        }
        logs.append(log)

    return jsonify(logs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
