from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from advanced_nosql_db import AdvancedNoSQLDB
import json

app = Flask(__name__, static_folder='static')
CORS(app)
db = AdvancedNoSQLDB("api_db")

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<collection>', methods=['POST'])
def insert_document(collection):
    data = request.json
    doc_id = db.insert(collection, data)
    return jsonify({"id": doc_id}), 201

@app.route('/<collection>', methods=['GET'])
def find_documents(collection):
    query = json.loads(request.args.get('query', '{}'))
    sort = json.loads(request.args.get('sort', '[]'))
    limit = request.args.get('limit', type=int)
    results = db.find(collection, query, sort, limit)
    return jsonify(results)

@app.route('/<collection>/<doc_id>', methods=['PUT'])
def update_document(collection, doc_id):
    data = request.json
    success = db.update(collection, doc_id, data)
    if success:
        return '', 204
    return '', 404

@app.route('/<collection>/<doc_id>', methods=['DELETE'])
def delete_document(collection, doc_id):
    success = db.delete(collection, doc_id)
    if success:
        return '', 204
    return '', 404

@app.route('/<collection>/index/<field>', methods=['POST'])
def create_index(collection, field):
    db.create_index(collection, field)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)