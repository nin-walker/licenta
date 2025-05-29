from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) # Permite request-uri de la frontend-ul Angular

# Calea către fișierul JSON cu datele mock
DATA_FILE = os.path.join(app.root_path, 'data', 'landmarks.json')

@app.route('/')
def home():
    return "Backend Roamio is working!"

@app.route('/api/landmarks', methods=['GET'])
def get_landmarks():
    """
    Returnează toate obiectivele din mock database.
    """
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON"}), 500

@app.route('/static/images/<filename>')
def serve_image(filename):
    """Servește fișierele imagine din folderul static/images."""
    return send_from_directory('static/images', filename)

if __name__ == '__main__':
    os.makedirs(os.path.join(app.root_path, 'data'), exist_ok=True)
    os.makedirs(os.path.join(app.root_path, 'static', 'images'), exist_ok=True)

    app.run(debug=True, port=5000)