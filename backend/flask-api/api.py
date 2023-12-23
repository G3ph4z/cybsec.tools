from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
import os
import json
import sys
import requests


app = Flask(__name__)
#CORS(app)
CORS(app, resources={
    r"/api/*": {
        "origins": "https://cybsec.tools",
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


dbname = "cybsec"
collection_name = "tools"

def get_database(db_name: str):
   CONNECTION_STRING = os.environ.get('MONGODB_CONNECTION_STRING')
   print(f"Connection string: {CONNECTION_STRING}", file=sys.stdout)
   client = MongoClient(CONNECTION_STRING)
   return client[db_name]


def get_items(collection_name: str, page: int, limit: int):
    db = get_database(dbname)
    skipped = (page - 1) * limit

    cursor = db[collection_name].find().skip(skipped).limit(limit)

    items_list = [item for item in cursor]
    return items_list


def validate_tool(tool):
    if 'name' not in tool or 'tags' not in tool:
        return False
    return True


def sanitize_tool(tool):
    sanitized_tool = {}
    for key, value in tool.items():
        if isinstance(value, str):
            sanitized_tool[key] = value.strip()
        else:
            sanitized_tool[key] = value
    return sanitized_tool


def convert_objectid_to_string(items_list):
    for item in items_list:
        item['_id'] = str(item['_id'])
    return items_list


@app.route('/lists', methods=['GET'])
def get_lists():
    db = get_database(dbname)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    tags = request.args.get('tags')
    mitre_cat = request.args.get('mitre_cat')

    query = {}
    if tags:
        query['tags'] = {'$in': tags.split(',')}
    if mitre_cat:
        query['mitre_cat'] = {'$in': mitre_cat.split(',')}

    skipped = (page - 1) * limit
    cursor = db[collection_name].find(query).skip(skipped).limit(limit)
    total_items = db[collection_name].count_documents(query)

    paginated_items = [item for item in cursor]
    paginated_items = convert_objectid_to_string(paginated_items)

    return jsonify({
        'total_items': total_items,
        'page': page,
        'limit': limit,
        'items': paginated_items
    })


@app.route('/tags', methods=['GET'])
def get_tags():
    db = get_database(dbname)

    cursor = db[collection_name].find()

    tags = set()
    for tool in cursor:
        if 'tags' in tool:
            tags.update(tool['tags'])

    return jsonify({'tags': list(tags)})


@app.route('/submit', methods=['POST'])
def submit_tool():
    tool = request.get_json()
    recaptcha_response = tool.pop('g-recaptcha-response', None)

    if recaptcha_response is None:
        return jsonify({'error': 'No reCAPTCHA response'}), 400

    recaptcha_secret = 'secret'
    recaptcha_verify_url = 'https://www.google.com/recaptcha/api/siteverify'

    recaptcha_data = {
        'secret': recaptcha_secret,
        'response': recaptcha_response
    }

    recaptcha_server_response = requests.post(recaptcha_verify_url, data=recaptcha_data)
    recaptcha_result = recaptcha_server_response.json()

    if not recaptcha_result['success']:
        return jsonify({'error': 'Invalid reCAPTCHA'}), 400

    if not validate_tool(tool):
        return jsonify({'error': 'Invalid tool data'}), 400

    sanitized_tool = sanitize_tool(tool)

    db = get_database(dbname)
    collection_name = 'tools' 
    db[collection_name].insert_one(sanitized_tool)

    return jsonify({'message': 'Tool submitted successfully'}), 201


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)