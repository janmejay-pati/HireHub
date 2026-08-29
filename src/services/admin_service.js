import { getDB, saveDB } from "../data/db";

// USERS
export const addUser = (user) => {
  const db = getDB();
  db.users.push({ ...user, id: Date.now(), blocked: false });
  saveDB(db);
};

export const blockUser = (id) => {
  const db = getDB();
  db.users = db.users.map((u) =>
    u.id === id ? { ...u, blocked: !u.blocked } : u
  );
  saveDB(db);
};

export const deleteUser = (id) => {
  const db = getDB();
  db.users = db.users.filter((u) => u.id !== id);
  saveDB(db);
};

// RECRUITERS
export const verifyRecruiter = (id) => {
  const db = getDB();
  db.recruiters = db.recruiters.map((r) =>
    r.id === id ? { ...r, verified: true } : r
  );
  saveDB(db);
};

// JOBS
export const deleteJob = (id) => {
  const db = getDB();
  db.jobs = db.jobs.filter((j) => j.id !== id);
  saveDB(db);
};