import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "hirehub")


def get_client():
    return MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)


def seed():
    client = get_client()
    db = client[MONGO_DB]

    now = datetime.utcnow().isoformat()

    users = [
        {
            "id": "candidate-1",
            "name": "Alex Johnson",
            "email": "alex.johnson@email.com",
            "password": "password123",
            "role": "candidate",
            "profileImage": "",
            "bio": "Passionate frontend developer.",
            "skills": ["React", "TypeScript"],
            "education": [],
            "experience": [],
            "resume": "",
            "createdAt": now,
        },
        {
            "id": "recruiter-1",
            "name": "Michael Rodriguez",
            "email": "michael.rodriguez@techcorp.com",
            "password": "password123",
            "role": "recruiter",
            "createdAt": now,
        },
        {
            "id": "admin-1",
            "name": "David Wilson",
            "email": "david.wilson@hirehub.com",
            "password": "password123",
            "role": "admin",
            "createdAt": now,
        },
    ]

    jobs = [
        {
            "id": "job-1",
            "title": "Backend Engineer",
            "company": "TechNova",
            "location": "Remote",
            "salary": "₹8 LPA - ₹16 LPA",
            "jobCategory": "Backend",
            "description": "Build scalable backend APIs.",
            "skills": ["Node.js", "MongoDB"],
            "createdAt": now,
        },
    ]

    applications = [
        {
            "id": "app-1",
            "jobId": "job-1",
            "candidateId": "candidate-1",
            "status": "applied",
            "createdAt": now,
        }
    ]

    # Upsert users
    for u in users:
        db.users.update_one({"id": u["id"]}, {"$set": u}, upsert=True)

    # Upsert jobs
    for j in jobs:
        db.jobs.update_one({"id": j["id"]}, {"$set": j}, upsert=True)

    # Upsert applications
    for a in applications:
        db.applications.update_one({"id": a["id"]}, {"$set": a}, upsert=True)

    print("Seed complete: users=%d jobs=%d applications=%d" % (len(users), len(jobs), len(applications)))


if __name__ == "__main__":
    seed()
