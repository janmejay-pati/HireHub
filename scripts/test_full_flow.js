const memoryStorage = new Map();
global.localStorage = {
  getItem(key) { return memoryStorage.has(key) ? memoryStorage.get(key) : null; },
  setItem(key, value) { memoryStorage.set(key, String(value)); },
  removeItem(key) { memoryStorage.delete(key); },
  clear() { memoryStorage.clear(); },
  key(index) { return Array.from(memoryStorage.keys())[index] ?? null; },
  get length() { return memoryStorage.size; },
};

const STORAGE_KEYS = {
  USERS: 'hirehub_users',
  JOBS: 'hirehub_jobs',
  APPLICATIONS: 'hirehub_applications',
  INTERVIEWS: 'hirehub_interviews',
  NOTIFICATIONS: 'hirehub_notifications',
};

const safeParse = (v, d = []) => {
  try { return v ? JSON.parse(v) : d; } catch { return d; }
};
const get = (k) => safeParse(localStorage.getItem(k), []);
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const add = (k, item) => { const arr = get(k); const next = { ...item, id: item.id || `${k}-${Date.now()}` }; arr.push(next); set(k, arr); return next; };
const update = (k, id, updates) => { const arr = get(k); const idx = arr.findIndex(x => x.id === id); if (idx === -1) throw new Error('not found'); arr[idx] = { ...arr[idx], ...updates }; set(k, arr); return arr[idx]; };
const del = (k, id) => { const arr = get(k).filter(x => x.id !== id); set(k, arr); return arr; };

(async function run() {
  try {
    // seed
    if (get(STORAGE_KEYS.USERS).length === 0) set(STORAGE_KEYS.USERS, [{ id: 'r1', name: 'Recruiter One', role: 'recruiter' }, { id: 'c1', name: 'Candidate One', role: 'candidate' }]);

    // Create job
    const job = add(STORAGE_KEYS.JOBS, { title: 'Full Flow Job', postedBy: 'r1', status: 'active' });
    console.log('created job', job.id);

    // Update job
    const updatedJob = update(STORAGE_KEYS.JOBS, job.id, { status: 'closed', title: 'Updated Job' });
    console.log('updated job', updatedJob.status);

    // Create application
    const app = add(STORAGE_KEYS.APPLICATIONS, { candidateId: 'c1', jobId: job.id, candidateName: 'Candidate One', status: 'Applied' });
    console.log('created application', app.id);

    // Update application
    const updatedApp = update(STORAGE_KEYS.APPLICATIONS, app.id, { status: 'Shortlisted' });
    console.log('updated application', updatedApp.status);

    // Schedule interview
    const interview = add(STORAGE_KEYS.INTERVIEWS, { applicationId: app.id, candidateId: 'c1', role: 'Engineer', recruiterId: 'r1', status: 'Scheduled' });
    console.log('created interview', interview.id);

    // Update interview
    const updatedInterview = update(STORAGE_KEYS.INTERVIEWS, interview.id, { status: 'Completed' });
    console.log('updated interview', updatedInterview.status);

    // Delete application
    del(STORAGE_KEYS.APPLICATIONS, app.id);
    if (get(STORAGE_KEYS.APPLICATIONS).find(x => x.id === app.id)) throw new Error('delete failed');
    console.log('deleted application OK');

    // Delete interview
    del(STORAGE_KEYS.INTERVIEWS, interview.id);
    if (get(STORAGE_KEYS.INTERVIEWS).find(x => x.id === interview.id)) throw new Error('interview delete failed');
    console.log('deleted interview OK');

    // Delete job
    del(STORAGE_KEYS.JOBS, job.id);
    if (get(STORAGE_KEYS.JOBS).find(x => x.id === job.id)) throw new Error('job delete failed');
    console.log('deleted job OK');

    console.log('\nFull flow test succeeded.');
    process.exit(0);
  } catch (err) {
    console.error('Full flow test failed:', err);
    process.exit(2);
  }
})();
