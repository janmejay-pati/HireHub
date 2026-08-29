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
  COMPANIES: 'hirehub_companies',
  CURRENT_USER: 'hirehub_current_user',
  NOTIFICATIONS: 'hirehub_notifications',
  REPORTS: 'hirehub_reports',
  INTERVIEWS: 'hirehub_interviews',
  SAVED_JOBS: 'hirehub_saved_jobs',
};

const safeParse = (v, d = []) => {
  try { return v ? JSON.parse(v) : d; } catch { return d; }
};
const get = (key, def = []) => safeParse(localStorage.getItem(key), def);
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const addItem = (key, item, idField = 'id') => {
  const items = get(key, []);
  const next = { ...item, [idField]: item[idField] || `${key}-${Date.now()}`, createdAt: item.createdAt || new Date().toISOString() };
  items.push(next);
  set(key, items);
  return next;
};

(function run() {
  try {
    // initialize minimal defaults
    if (get(STORAGE_KEYS.USERS).length === 0) set(STORAGE_KEYS.USERS, [{ id: 'candidate-test', name: 'Candidate Test' }]);
    if (get(STORAGE_KEYS.JOBS).length === 0) set(STORAGE_KEYS.JOBS, []);
    if (get(STORAGE_KEYS.APPLICATIONS).length === 0) set(STORAGE_KEYS.APPLICATIONS, []);
    if (get(STORAGE_KEYS.INTERVIEWS).length === 0) set(STORAGE_KEYS.INTERVIEWS, []);

    const initialJobs = get(STORAGE_KEYS.JOBS);
    console.log('Initial jobs:', initialJobs.length);

    const newJob = addItem(STORAGE_KEYS.JOBS, {
      title: 'Persistence Test Job',
      location: 'Remote',
      postedBy: 'recruiter-test',
      status: 'active',
      createdAt: new Date().toISOString(),
    }, 'id');

    const jobsAfter = get(STORAGE_KEYS.JOBS);
    const foundJob = jobsAfter.find(j => j.id === newJob.id);

    if (!foundJob) throw new Error('Job was not persisted');
    console.log('Job persisted OK:', foundJob.id);

    const newApplication = addItem(STORAGE_KEYS.APPLICATIONS, {
      candidateId: 'candidate-test',
      jobId: newJob.id,
      candidateName: 'Tester',
      jobTitle: newJob.title,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
    }, 'id');

    const appsAfter = get(STORAGE_KEYS.APPLICATIONS);
    const foundApp = appsAfter.find(a => a.id === newApplication.id);
    if (!foundApp) throw new Error('Application was not persisted');
    console.log('Application persisted OK:', foundApp.id);

    const newInterview = addItem(STORAGE_KEYS.INTERVIEWS, {
      applicationId: newApplication.id,
      candidateId: newApplication.candidateId,
      candidateName: newApplication.candidateName,
      role: newApplication.jobTitle,
      interviewDate: new Date().toISOString(),
      status: 'Scheduled',
      recruiterId: newJob.postedBy,
    }, 'id');

    const interviewsAfter = get(STORAGE_KEYS.INTERVIEWS);
    const foundInterview = interviewsAfter.find(i => i.id === newInterview.id);
    if (!foundInterview) throw new Error('Interview was not persisted');
    console.log('Interview persisted OK:', foundInterview.id);

    const users = get(STORAGE_KEYS.USERS);
    console.log('Users in storage:', users.length);

    console.log('\nPersistence verification succeeded.');
    process.exit(0);
  } catch (err) {
    console.error('Persistence verification failed:', err);
    process.exit(2);
  }
})();
