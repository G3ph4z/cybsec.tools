from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
import os
import json
import sys

# Flask related settings
app = Flask(__name__)
CORS(app)

# For DB management
dbname = ""
collection_name = ""

def get_database(db_name: str):
   CONNECTION_STRING = os.environ.get('MONGODB_CONNECTION_STRING')
   client = MongoClient(CONNECTION_STRING)
   return client[db_name]


def get_items(collection_name):
    item_details = collection_name.find({})
    items_list = [item for item in item_details]
    json_items = json_util.dumps(items_list, indent=4)
    return json.loads(json_items)


#===========================================================================

@app.route('/lists', methods=['GET'])
def get_lists():
    return jsonify(get_items(collection_name=collection_name))


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()

    if 'name' in data:
        new_list = {"id": len(lists) + 1, "name": data['name']}
        lists.append(new_list)
        return jsonify({"message": "List submitted successfully", "list": new_list}), 201
    else:
        return jsonify({"message": "Name not provided in the request"}), 400


if __name__ == '__main__':
    dbname = get_database('cybsec')
    collection_name = dbname["tools"]
    app.run(host="0.0.0.0", port=5000, debug=True)
