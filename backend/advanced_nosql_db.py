import json
from pathlib import Path
import uuid
import re
from datetime import datetime
import threading
import time

class AdvancedNoSQLDB:
    def __init__(self, db_name):
        self.db_name = db_name
        self.db_path = Path(f"{db_name}.json")
        self.data = self._load_data()
        self.indexes = {}
        self.lock = threading.Lock()
        self.subscribers = {}

    def _load_data(self):
        if self.db_path.exists():
            with open(self.db_path, 'r') as f:
                return json.load(f)
        return {}

    def _save_data(self):
        with open(self.db_path, 'w') as f:
            json.dump(self.data, f, indent=2)

    def create_index(self, collection, field):
        if collection not in self.indexes:
            self.indexes[collection] = {}
        self.indexes[collection][field] = {}
        for doc_id, doc in self.data.get(collection, {}).items():
            value = doc.get(field)
            if value not in self.indexes[collection][field]:
                self.indexes[collection][field][value] = set()
            self.indexes[collection][field][value].add(doc_id)

    def insert(self, collection, document):
        with self.lock:
            if collection not in self.data:
                self.data[collection] = {}
            doc_id = str(uuid.uuid4())
            document['_id'] = doc_id
            document['_created_at'] = datetime.now().isoformat()
            document['_updated_at'] = document['_created_at']
            self.data[collection][doc_id] = document
            self._update_indexes(collection, doc_id, document)
            self._save_data()
            self._notify_subscribers(collection, 'insert', doc_id, document)
        return doc_id

    def find(self, collection, query=None, sort=None, limit=None):
        results = []
        if collection in self.data:
            results = list(self.data[collection].values())
            if query:
                results = self._apply_query(results, query)
            if sort:
                results = self._apply_sort(results, sort)
            if limit:
                results = results[:limit]
        return results

    def _apply_query(self, documents, query):
        def match_condition(doc, field, condition):
            if field not in doc:
                return False
            if isinstance(condition, dict):
                for op, value in condition.items():
                    if op == '$gt':
                        return doc[field] > value
                    elif op == '$lt':
                        return doc[field] < value
                    elif op == '$regex':
                        return re.search(value, doc[field]) is not None
            else:
                return doc[field] == condition
            return False

        return [doc for doc in documents if all(match_condition(doc, field, condition) for field, condition in query.items())]

    def _apply_sort(self, documents, sort_spec):
        return sorted(documents, key=lambda x: [x.get(field, '') for field, _ in sort_spec], reverse=any(order == -1 for _, order in sort_spec))

    def update(self, collection, doc_id, update_data):
        with self.lock:
            if collection in self.data and doc_id in self.data[collection]:
                document = self.data[collection][doc_id]
                for key, value in update_data.items():
                    if key.startswith('$'):
                        self._apply_update_operator(document, key, value)
                    else:
                        document[key] = value
                document['_updated_at'] = datetime.now().isoformat()
                self._update_indexes(collection, doc_id, document)
                self._save_data()
                self._notify_subscribers(collection, 'update', doc_id, document)
                return True
        return False

    def _apply_update_operator(self, document, operator, value):
        if operator == '$inc':
            for field, inc_value in value.items():
                document[field] = document.get(field, 0) + inc_value
        elif operator == '$push':
            for field, push_value in value.items():
                if field not in document:
                    document[field] = []
                document[field].append(push_value)

    def delete(self, collection, doc_id):
        with self.lock:
            if collection in self.data and doc_id in self.data[collection]:
                document = self.data[collection].pop(doc_id)
                self._remove_from_indexes(collection, doc_id, document)
                self._save_data()
                self._notify_subscribers(collection, 'delete', doc_id, None)
                return True
        return False

    def _update_indexes(self, collection, doc_id, document):
        if collection in self.indexes:
            for field, index in self.indexes[collection].items():
                value = document.get(field)
                if value is not None:
                    if value not in index:
                        index[value] = set()
                    index[value].add(doc_id)

    def _remove_from_indexes(self, collection, doc_id, document):
        if collection in self.indexes:
            for field, index in self.indexes[collection].items():
                value = document.get(field)
                if value is not None and value in index:
                    index[value].discard(doc_id)

    def subscribe(self, collection, callback):
        if collection not in self.subscribers:
            self.subscribers[collection] = set()
        subscriber_id = str(uuid.uuid4())
        self.subscribers[collection].add((subscriber_id, callback))
        return subscriber_id

    def unsubscribe(self, collection, subscriber_id):
        if collection in self.subscribers:
            self.subscribers[collection] = {(sid, cb) for sid, cb in self.subscribers[collection] if sid != subscriber_id}

    def _notify_subscribers(self, collection, operation, doc_id, document):
        if collection in self.subscribers:
            for _, callback in self.subscribers[collection]:
                callback(operation, doc_id, document)

# Usage example
if __name__ == "__main__":
    db = AdvancedNoSQLDB("advanced_db")

    # Create index
    db.create_index("users", "age")

    # Insert
    user_id = db.insert("users", {"name": "John Doe", "age": 30, "email": "john@example.com"})
    print(f"Inserted user with ID: {user_id}")

    # Find with query and sort
    users = db.find("users", {"age": {"$gt": 25}}, sort=[("name", 1)], limit=10)
    print(f"Found users: {users}")

    # Update with operators
    db.update("users", user_id, {"$inc": {"age": 1}, "$push": {"skills": "Python"}})
    updated_user = db.find("users", {"name": "John Doe"})[0]
    print(f"Updated user: {updated_user}")

    # Subscribe to changes
    def on_change(operation, doc_id, document):
        print(f"Change detected: {operation} on document {doc_id}")

    subscriber_id = db.subscribe("users", on_change)

    # Delete
    db.delete("users", user_id)

    # Unsubscribe
    db.unsubscribe("users", subscriber_id)