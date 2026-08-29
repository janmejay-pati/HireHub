const STORAGE_KEY = "hirehub_db";

export const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : {
        users: [],
        jobs: [],
        recruiters: [],
        reports: [],
      };
};

export const saveDB = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};