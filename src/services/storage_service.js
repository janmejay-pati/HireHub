import { mockApplications } from '../data/applications';
import { mockUsers } from '../data/users';

// Storage service for localStorage operations
export const STORAGE_KEYS = {
  USERS: 'hirehub_users',
  JOBS: 'hirehub_jobs',
  APPLICATIONS: 'hirehub_applications',
  COMPANIES: 'hirehub_companies',
  CURRENT_USER: 'hirehub_current_user',
  NOTIFICATIONS: 'hirehub_notifications',
  REPORTS: 'hirehub_reports',
  INTERVIEWS: 'hirehub_interviews',
  SAVED_JOBS: 'hirehub_saved_jobs',
  ACTIVITY_LOGS: 'hirehub_activity_logs',
  MESSAGES: 'hirehub_messages',
  VERIFICATIONS: 'hirehub_verifications',
  RESET_REQUESTS: 'hirehub_reset_requests',
  AUTH_LOGS: 'hirehub_auth_logs',
  SECURITY_LOGS: 'hirehub_security_logs',
  REMEMBER_ME: 'hirehub_remember_me',
  SETTINGS: 'hirehub_settings',
  CANDIDATE_PROFILE: 'hirehub_candidate_profile',
  CANDIDATE_RESUME: 'hirehub_candidate_resume',
  RECRUITER_PROFILE: 'hirehub_recruiter_profiles',
  ADMIN_PROFILE: 'hirehub_admin_profiles',
  TOKEN: 'hirehub_token'
};

const safeJsonParse = (value, defaultValue) => {
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Failed to parse storage value:', error);
    return defaultValue;
  }
};

export const normalizeImageUrl = (value, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const isRemoteOrDataImage =
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/');

  if (isRemoteOrDataImage) {
    return trimmed;
  }

  return trimmed.includes('.') || trimmed.includes('/') ? trimmed : fallback;
};

const sanitizeUserRecord = (user) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  return {
    ...user,
    avatar: normalizeImageUrl(user.avatar, user.profileImage || ''),
    profileImage: normalizeImageUrl(user.profileImage, user.avatar || ''),
  };
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return safeJsonParse(item, defaultValue);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const getFromSessionStorage = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return safeJsonParse(item, defaultValue);
  } catch (error) {
    console.error(`Error reading from sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:8000/api';

const persistToMongo = async (key, value) => {
  try {
    const baseUrl = apiBaseUrl;
    if (!baseUrl || baseUrl.includes('undefined')) return false;

    await fetch(`${baseUrl}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });

    return true;
  } catch (error) {
    console.warn('Mongo sync failed, falling back to local storage:', error);
    return false;
  }
};

export const saveToStorage = (key, value) => {
  try {
    const normalizedValue = Array.isArray(value)
      ? value.map((item) => sanitizeUserRecord(item))
      : typeof value === 'object' && value !== null
      ? sanitizeUserRecord(value)
      : value;

    localStorage.setItem(key, JSON.stringify(normalizedValue));
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }

    if (typeof window !== 'undefined') {
      const shouldSyncMongo = import.meta.env?.VITE_USE_MONGO !== 'false';
      if (shouldSyncMongo) {
        void persistToMongo(key, normalizedValue);
      }
    }

    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

export const saveToSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  } catch (error) {
    console.error(`Error writing to sessionStorage key "${key}":`, error);
    return false;
  }
};

const saveDataByMode = (key, value, remember = true) => {
  if (remember) {
    const saved = saveToStorage(key, value);
    removeFromSessionStorage(key);
    return saved;
  }

  const saved = saveToSessionStorage(key, value);
  removeFromStorage(key);
  return saved;
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

export const removeFromSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from sessionStorage key "${key}":`, error);
    return false;
  }
};

export const saveData = (key, value) => saveToStorage(key, value);
export const getData = (key, defaultValue = []) => getFromStorage(key, defaultValue);

const removeDataFromAllStorages = (key) => {
  removeFromStorage(key);
  removeFromSessionStorage(key);
};

export const addItem = (key, item, idField = 'id') => {
  const items = getFromStorage(key, []);
  const newItem = {
    ...item,
    [idField]: item[idField] || `${key}-${Date.now()}`,
    createdAt: item.createdAt || new Date().toISOString()
  };
  items.push(newItem);
  saveToStorage(key, items);
  return newItem;
};

export const updateItem = (key, id, updates, idField = 'id') => {
  const items = getFromStorage(key, []);
  const index = items.findIndex((item) => item[idField] === id);
  if (index === -1) {
    throw new Error(`${key} item not found`);
  }
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  saveToStorage(key, items);
  return items[index];
};

export const deleteItem = (key, id, idField = 'id') => {
  const items = getFromStorage(key, []);
  const filtered = items.filter((item) => item[idField] !== id);
  saveToStorage(key, filtered);
  return filtered;
};

export const getUsers = () => getFromStorage(STORAGE_KEYS.USERS, []);
export const setUsers = (users) => saveToStorage(STORAGE_KEYS.USERS, users);

export const getJobs = () => getFromStorage(STORAGE_KEYS.JOBS, []);
export const setJobs = (jobs) => saveToStorage(STORAGE_KEYS.JOBS, jobs);

export const getApplications = () => getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
export const setApplications = (applications) => saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);

export const getCompanies = () => getFromStorage(STORAGE_KEYS.COMPANIES, []);
export const setCompanies = (companies) => saveToStorage(STORAGE_KEYS.COMPANIES, companies);

export const getNotifications = () => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
export const setNotifications = (notifications) => saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);

export const getReports = () => getFromStorage(STORAGE_KEYS.REPORTS, []);
export const setReports = (reports) => saveToStorage(STORAGE_KEYS.REPORTS, reports);

export const getSettings = () => getFromStorage(STORAGE_KEYS.SETTINGS, {
  theme: 'dark',
  maintenanceMode: false,
  emailNotifications: true,
  autoApproveJobs: false,
  autoBlockSpam: false
});
export const setSettings = (settings) => saveToStorage(STORAGE_KEYS.SETTINGS, settings);

export const getInterviews = () => getFromStorage(STORAGE_KEYS.INTERVIEWS, []);
export const setInterviews = (interviews) => saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);

export const getRecruiterProfiles = () => getFromStorage(STORAGE_KEYS.RECRUITER_PROFILE, {});
export const setRecruiterProfiles = (profiles) => saveToStorage(STORAGE_KEYS.RECRUITER_PROFILE, profiles);

export const getAdminProfiles = () => getFromStorage(STORAGE_KEYS.ADMIN_PROFILE, {});
export const setAdminProfiles = (profiles) => saveToStorage(STORAGE_KEYS.ADMIN_PROFILE, profiles);

export const getSavedJobs = () => getFromStorage(STORAGE_KEYS.SAVED_JOBS, []);
export const setSavedJobs = (savedJobs) => saveToStorage(STORAGE_KEYS.SAVED_JOBS, savedJobs);

export const getActivityLogs = () => getFromStorage(STORAGE_KEYS.ACTIVITY_LOGS, []);
export const setActivityLogs = (activityLogs) => saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, activityLogs);

export const getMessages = () => getFromStorage(STORAGE_KEYS.MESSAGES, []);
export const setMessages = (messages) => saveToStorage(STORAGE_KEYS.MESSAGES, messages);

export const getVerifications = () => getFromStorage(STORAGE_KEYS.VERIFICATIONS, []);
export const setVerifications = (verifications) => saveToStorage(STORAGE_KEYS.VERIFICATIONS, verifications);

export const getResetRequests = () => getFromStorage(STORAGE_KEYS.RESET_REQUESTS, []);
export const setResetRequests = (requests) => saveToStorage(STORAGE_KEYS.RESET_REQUESTS, requests);

export const getAuthLogs = () => getFromStorage(STORAGE_KEYS.AUTH_LOGS, []);
export const setAuthLogs = (logs) => saveToStorage(STORAGE_KEYS.AUTH_LOGS, logs);

export const getSecurityLogs = () => getFromStorage(STORAGE_KEYS.SECURITY_LOGS, []);
export const setSecurityLogs = (logs) => saveToStorage(STORAGE_KEYS.SECURITY_LOGS, logs);

export const getCurrentUser = () => {
  const sessionUser = getFromSessionStorage(STORAGE_KEYS.CURRENT_USER, null);
  if (sessionUser) return sessionUser;
  return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user, remember = null) => {
  const sessionUser = getFromSessionStorage(STORAGE_KEYS.CURRENT_USER, null);
  const shouldRemember =
    remember !== null
      ? remember
      : sessionUser !== null
      ? false
      : true;

  return saveDataByMode(STORAGE_KEYS.CURRENT_USER, user, shouldRemember);
};

export const clearCurrentUser = () => removeDataFromAllStorages(STORAGE_KEYS.CURRENT_USER);

export const getToken = () => {
  const sessionToken = getFromSessionStorage(STORAGE_KEYS.TOKEN, null);
  if (sessionToken) return sessionToken;
  return getFromStorage(STORAGE_KEYS.TOKEN, null);
};

export const setToken = (token, remember = true) =>
  saveDataByMode(STORAGE_KEYS.TOKEN, token, remember);

export const clearToken = () => removeDataFromAllStorages(STORAGE_KEYS.TOKEN);

export const getRememberMe = () => getFromStorage(STORAGE_KEYS.REMEMBER_ME, false);
export const setRememberMe = (value) => saveToStorage(STORAGE_KEYS.REMEMBER_ME, value);

export const addAuthLog = (log) => {
  const logs = getAuthLogs();
  saveToStorage(STORAGE_KEYS.AUTH_LOGS, [log, ...logs]);
};

export const addSecurityLog = (log) => {
  const logs = getSecurityLogs();
  saveToStorage(STORAGE_KEYS.SECURITY_LOGS, [log, ...logs]);
};

export const addResetRequest = (request) => {
  const requests = getResetRequests();
  saveToStorage(STORAGE_KEYS.RESET_REQUESTS, [request, ...requests]);
};

export const ensureDefaultAdmin = () => {
  const users = getUsers();
  const hasAdmin = users.some((user) => ['admin', 'super_admin'].includes(user.role));
  const adminExists = users.some((user) => user.email === 'admin@hirehub.com');

  if (!hasAdmin) {
    const defaultAdmin = {
      id: 'admin-1',
      name: 'Default Admin',
      email: 'admin@hirehub.com',
      password: 'admin123',
      role: 'admin',
      profileImage: '',
      bio: 'Platform administrator with full access to HireHub.',
      skills: ['Platform Management', 'Moderation'],
      education: [],
      experience: [],
      resume: '',
      isBlocked: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
      profileCompletion: 100
    };

    const nextUsers = [...users, defaultAdmin];
    saveToStorage(STORAGE_KEYS.USERS, nextUsers);
    return nextUsers;
  }

  if (!adminExists) {
    const defaultAdmin = {
      id: 'admin-1',
      name: 'Default Admin',
      email: 'admin@hirehub.com',
      password: 'admin123',
      role: 'admin',
      profileImage: '',
      bio: 'Platform administrator with full access to HireHub.',
      skills: ['Platform Management', 'Moderation'],
      education: [],
      experience: [],
      resume: '',
      isBlocked: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
      profileCompletion: 100
    };

    saveToStorage(STORAGE_KEYS.USERS, [...users, defaultAdmin]);
    return [...users, defaultAdmin];
  }

  return users;
};

export const initializeStorage = () => {
  if (getUsers().length === 0) {
    setUsers(mockUsers);
  }

  ensureDefaultAdmin();

  if (getApplications().length === 0) {
    setApplications(mockApplications);
  }

  if (getNotifications().length === 0) {
    setNotifications([]);
  }

  if (getReports().length === 0) {
    setReports([]);
  }

  if (getInterviews().length === 0) {
    setInterviews([]);
  }

  if (getSavedJobs().length === 0) {
    setSavedJobs([]);
  }

  if (getFromStorage(STORAGE_KEYS.CANDIDATE_PROFILE, null) === null) {
    saveToStorage(STORAGE_KEYS.CANDIDATE_PROFILE, {});
  }

  if (getFromStorage(STORAGE_KEYS.CANDIDATE_RESUME, null) === null) {
    saveToStorage(STORAGE_KEYS.CANDIDATE_RESUME, {});
  }

  if (getActivityLogs().length === 0) {
    setActivityLogs([]);
  }

  if (getMessages().length === 0) {
    setMessages([]);
  }

  if (getVerifications().length === 0) {
    setVerifications([]);
  }
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeFromStorage(key);
  });
};
