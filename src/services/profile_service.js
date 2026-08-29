import { getFromStorage, saveToStorage, setCurrentUser, STORAGE_KEYS } from './storage_service';
import { userService } from './user_service';

const getProfileStore = () => getFromStorage(STORAGE_KEYS.CANDIDATE_PROFILE, {});
const setProfileStore = (profiles) => saveToStorage(STORAGE_KEYS.CANDIDATE_PROFILE, profiles);
const getResumeStore = () => getFromStorage(STORAGE_KEYS.CANDIDATE_RESUME, {});
const setResumeStore = (resumeMap) => saveToStorage(STORAGE_KEYS.CANDIDATE_RESUME, resumeMap);
const getAdminProfileStore = () => getFromStorage(STORAGE_KEYS.ADMIN_PROFILE, {});
const setAdminProfileStore = (profiles) => saveToStorage(STORAGE_KEYS.ADMIN_PROFILE, profiles);

const buildDefaultCandidateProfile = (user = {}) => ({
  personal: {
    firstName: user.name?.split(' ')[0] || '',
    lastName: user.name?.split(' ').slice(1).join(' ') || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    website: user.website || '',
    linkedIn: user.linkedIn || '',
    github: user.github || '',
    portfolio: user.portfolio || '',
    bio: user.bio || '',
    profileImage: user.profileImage || '',
  },
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  lastUpdated: new Date().toISOString(),
});

const buildDefaultAdminProfile = (user = {}) => ({
  fullName: user.name || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || 'admin',
  bio: user.bio || 'Platform administrator specializing in operations, compliance and marketplace health.',
  address: user.address || 'Headquarters, Remote',
  profileImage: user.profileImage || user.avatar || '',
  linkedIn: user.linkedIn || '',
  website: user.website || '',
  twitter: user.twitter || '',
  status: user.status || (user.isBlocked ? 'Suspended' : 'Active'),
  joinedDate: user.createdAt || new Date().toISOString(),
  skills: user.skills || ['Operations', 'Compliance', 'Team Leadership'],
  profileCompletion: user.profileCompletion || 68,
  updatedAt: new Date().toISOString(),
});

export const profileService = {
  getCandidateProfile: (userId) => {
    const profiles = getProfileStore();
    if (!userId) return buildDefaultCandidateProfile();

    if (profiles[userId]) {
      return profiles[userId];
    }

    const user = userService.getUserById(userId) || {};
    const defaultProfile = buildDefaultCandidateProfile(user);
    profiles[userId] = defaultProfile;
    setProfileStore(profiles);
    return defaultProfile;
  },

  saveCandidateProfile: (userId, profile) => {
    if (!userId) return null;
    const profiles = getProfileStore();
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };

    profiles[userId] = updatedProfile;
    setProfileStore(profiles);
    return updatedProfile;
  },

  deleteCandidateProfile: (userId) => {
    if (!userId) return null;
    const profiles = getProfileStore();
    delete profiles[userId];
    setProfileStore(profiles);
    return {};
  },

  getResumeData: (userId) => {
    const resumes = getResumeStore();
    return resumes[userId] || null;
  },

  saveResumeData: (userId, resume) => {
    if (!userId) return null;
    const resumes = getResumeStore();
    const updatedResume = {
      ...resume,
      uploadDate: resume.uploadDate || new Date().toISOString(),
    };
    resumes[userId] = updatedResume;
    setResumeStore(resumes);
    return updatedResume;
  },

  deleteResumeData: (userId) => {
    if (!userId) return null;
    const resumes = getResumeStore();
    delete resumes[userId];
    setResumeStore(resumes);
    return null;
  },

  getAdminProfile: (userId) => {
    const profiles = getAdminProfileStore();
    if (!userId) return buildDefaultAdminProfile({});

    if (profiles[userId]) {
      return profiles[userId];
    }

    const user = userService.getUserById(userId) || {};
    const defaultProfile = buildDefaultAdminProfile(user);
    profiles[userId] = defaultProfile;
    setAdminProfileStore(profiles);
    return defaultProfile;
  },

  saveAdminProfile: function (userId, profile) {
    if (!userId) return null;
    const profiles = getAdminProfileStore();
    const updatedProfile = {
      ...profiles[userId],
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    profiles[userId] = updatedProfile;
    setAdminProfileStore(profiles);
    return updatedProfile;
  },

  saveAdminProfileAndCurrentUser: function (userId, profile) {
    const updatedProfile = this.saveAdminProfile(userId, profile);

    const user = userService.getUserById(userId);
    if (user) {
      const updatedUser = userService.updateUser(userId, {
        name: profile.fullName || user.name,
        email: profile.email || user.email,
        phone: profile.phone || user.phone,
        profileImage: profile.profileImage || user.profileImage,
        avatar: profile.profileImage || user.avatar,
        bio: profile.bio || user.bio,
        website: profile.website || user.website,
        linkedIn: profile.linkedIn || user.linkedIn,
        twitter: profile.twitter || user.twitter,
        address: profile.address || user.address,
        profileCompletion: profile.profileCompletion || user.profileCompletion,
      });
      setCurrentUser(updatedUser);
    }

    return updatedProfile;
  },
};
