import os
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "hirehub")

app = FastAPI(title="HireHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    database = client[MONGO_DB]
    database.command("ping")
    print("MongoDB connected successfully.")
except PyMongoError as exc:
    print(f"MongoDB connection warning: {exc}")
    client = None
    database = None


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/storage/{key}")
def get_storage_item(key: str) -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")

    item = database.storage.find_one({"key": key})
    if not item:
        return {"key": key, "value": None}
    return {"key": key, "value": item.get("value")}


@app.put("/api/storage/{key}")
def save_storage_item(key: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")

    value = payload.get("value")
    database.storage.update_one(
        {"key": key},
        {"$set": {"key": key, "value": value, "updatedAt": __import__("datetime").datetime.utcnow()}},
        upsert=True,
    )
    return {"key": key, "value": value, "saved": True}


@app.get("/api/users")
def list_users() -> List[Dict[str, Any]]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    return list(database.users.find({}, {"_id": 0}))


@app.post("/api/users")
def create_user(payload: Dict[str, Any]) -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    database.users.insert_one(payload)
    return payload


@app.get("/api/storage")
def list_storage_items(limit: Optional[int] = 100) -> List[Dict[str, Any]]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    return list(database.storage.find({}, {"_id": 0}).limit(limit))


@app.delete("/api/storage/{key}")
def delete_storage_item(key: str) -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    result = database.storage.delete_one({"key": key})
    return {"key": key, "deleted_count": result.deleted_count}


@app.get("/api/collections/{name}")
def list_collection(name: str, limit: Optional[int] = 100) -> List[Dict[str, Any]]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    collection = database[name]
    return list(collection.find({}, {"_id": 0}).limit(limit))


@app.post("/api/collections/{name}")
def insert_into_collection(name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    collection = database[name]
    collection.insert_one(payload)
    return payload


@app.put("/api/collections/{name}/{doc_id}")
def update_collection_item(name: str, doc_id: str, payload: Dict[str, Any], id_field: Optional[str] = "id") -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    collection = database[name]
    filter_query = {id_field: doc_id}
    result = collection.update_one(filter_query, {"$set": payload}, upsert=False)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": doc_id, "updated": True}


@app.delete("/api/collections/{name}/{doc_id}")
def delete_collection_item(name: str, doc_id: str, id_field: Optional[str] = "id") -> Dict[str, Any]:
    if database is None:
        raise HTTPException(status_code=503, detail="MongoDB is not available")
    collection = database[name]
    result = collection.delete_one({id_field: doc_id})
    return {"id": doc_id, "deleted_count": result.deleted_count}
