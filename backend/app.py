from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from advanced_nosql_db import AdvancedNoSQLDB
import json
from collections import Counter

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
    return jsonify({"error": "Document not found"}), 404

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

@app.route('/<collection>/analyze', methods=['GET'])
def analyze_data(collection):
    documents = db.find(collection, {})
    
    if not documents:
        return jsonify({"error": "No documents found in the collection"}), 404

    # Basic analysis
    num_documents = len(documents)
    fields = set()
    for doc in documents:
        fields.update(doc.keys())
    
    field_types = {}
    for field in fields:
        field_types[field] = Counter(type(doc.get(field)).__name__ for doc in documents if field in doc)
    
    # Calculate average document size
    total_size = sum(len(json.dumps(doc)) for doc in documents)
    avg_size = total_size / num_documents

    # Identify potential indexes
    potential_indexes = [field for field, types in field_types.items() if 'str' in types or 'int' in types]

    analysis = {
        "num_documents": num_documents,
        "fields": list(fields),
        "field_types": field_types,
        "avg_document_size": avg_size,
        "potential_indexes": potential_indexes
    }

    # Generate a simple recommendation
    recommendation = generate_recommendation(analysis)

    return jsonify({"analysis": analysis, "recommendation": recommendation})

def generate_recommendation(analysis):
    recommendations = []

    if analysis["num_documents"] > 1000 and not analysis["potential_indexes"]:
        recommendations.append("Consider adding indexes to improve query performance.")
    
    if analysis["avg_document_size"] > 1000000:  # 1MB
        recommendations.append("Large average document size detected. Consider optimizing document structure.")
    
    if len(analysis["fields"]) > 20:
        recommendations.append("High number of fields detected. Consider reviewing schema design for optimization.")

    if recommendations:
        return " ".join(recommendations)
    else:
        return "No specific recommendations at this time. The collection structure looks good."


if __name__ == '__main__':
    app.run(debug=True)