import json, os
DB_PATH = "database.json"

def read_db():
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f: json.dump({}, f)
    with open(DB_PATH, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)