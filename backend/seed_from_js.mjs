import "dotenv/config";
import { MongoClient } from "mongodb";
import { mockUsers } from "../src/data/users.js";
import { mockJobs } from "../src/data/jobs.js";
import { mockApplications } from "../src/data/applications.js";
import { mockCompanies } from "../src/data/companies.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "hirehub";

async function run() {
  const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(MONGO_DB);

  console.log("Seeding users...", mockUsers.length);
  for (const u of mockUsers) {
    const filter = { id: u.id };
    await db.collection("users").updateOne(filter, { $set: u }, { upsert: true });
  }

  console.log("Seeding jobs...", mockJobs.length);
  for (const j of mockJobs) {
    const id = j.id || j._id || (`job-${Date.now()}-${Math.random().toString(36).slice(2,6)}`);
    const { _id, ...rest } = j;
    const doc = { ...rest, id };
    await db.collection("jobs").updateOne({ id: id }, { $set: doc }, { upsert: true });
  }

  console.log("Seeding applications...", mockApplications.length);
  for (const a of mockApplications) {
    const { _id, ...rest } = a;
    const id = a.id || rest.id || (`app-${Date.now()}-${Math.random().toString(36).slice(2,6)}`);
    const doc = { ...rest, id };
    await db.collection("applications").updateOne({ id: id }, { $set: doc }, { upsert: true });
  }

  console.log("Seeding companies...", mockCompanies.length);
  for (const c of mockCompanies) {
    const id = c.id || (`company-${Date.now()}-${Math.random().toString(36).slice(2,6)}`);
    const doc = { ...c, id };
    await db.collection("companies").updateOne({ id: id }, { $set: doc }, { upsert: true });
  }

  console.log("Seed from JS complete.");
  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
