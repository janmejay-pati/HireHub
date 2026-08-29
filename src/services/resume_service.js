import { getFromStorage, saveToStorage, getJobs } from './storage_service';
import { INITIAL_RESUME } from '../utils/resumeBuilderConfig';
import { userService } from './user_service';

const RESUME_KEY = 'hirehub_resume_library';
const RESUME_DRAFT_KEY = 'hirehub_resume_builder_data';

const buildDefaultAnalytics = () => ({
  profileViews: 0,
  recruiterDownloads: 0,
  interviewRequests: 0,
  applicationConversionRate: 0,
});

const normalizeSkills = (skills = []) =>
  (skills || [])
    .map((skill) => (typeof skill === 'string' ? skill.trim() : skill?.name?.trim()))
    .filter(Boolean);

const calculateCompletion = (resume = {}) => {
  const personal = resume.personal || {};
  const checks = [
    Boolean(personal.fullName),
    Boolean(personal.email),
    Boolean(personal.jobTitle),
    Boolean(personal.summary),
    (resume.experience || []).length > 0,
    (resume.education || []).length > 0,
    (resume.skills || []).length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const calculateATSSuggestions = (resume = {}) => {
  const skills = normalizeSkills(resume.skills);
  const suggestions = [];

  if (!resume.personal?.summary || resume.personal.summary.length < 140) {
    suggestions.push('Strengthen your summary with outcome-based metrics and keywords.');
  }

  if (skills.length < 5) {
    suggestions.push('Add 5-7 role-relevant skills to improve ATS keyword coverage.');
  }

  if (!(resume.experience || []).length) {
    suggestions.push('Add work experience to show measurable impact and relevance.');
  }

  if (!(resume.education || []).length) {
    suggestions.push('Include educational background for recruiter confidence.');
  }

  if (!suggestions.length) {
    suggestions.push('Your resume is strong—keep the keywords and metrics updated for each role.');
  }

  return suggestions.slice(0, 4);
};

const calculateATScore = (resume = {}) => {
  const skills = normalizeSkills(resume.skills);
  const summaryLength = resume.personal?.summary?.trim()?.length || 0;
  const experienceCount = (resume.experience || []).length;
  const projectCount = (resume.projects || []).length;

  let score = 65;
  if (skills.length >= 5) score += 8;
  if (skills.length >= 8) score += 5;
  if (summaryLength >= 140) score += 8;
  if (experienceCount >= 1) score += 5;
  if (projectCount >= 1) score += 4;
  if ((resume.certifications || []).length) score += 2;

  return Math.min(98, score);
};

const normalizeResume = (resume = {}, userId = '') => {
  const base = {
    ...INITIAL_RESUME,
    ...(resume || {}),
    personal: {
      ...INITIAL_RESUME.personal,
      ...((resume?.personal) || {}),
    },
    skills: resume?.skills || INITIAL_RESUME.skills,
    experience: resume?.experience || INITIAL_RESUME.experiences,
    education: resume?.education || INITIAL_RESUME.education,
    projects: resume?.projects || INITIAL_RESUME.projects,
    certifications: resume?.certifications || INITIAL_RESUME.certifications,
    languages: resume?.languages || INITIAL_RESUME.languages,
    achievements: resume?.achievements || INITIAL_RESUME.achievements,
    socials: {
      ...INITIAL_RESUME.socials,
      ...((resume?.socials) || {}),
    },
    analytics: {
      ...buildDefaultAnalytics(),
      ...((resume?.analytics) || {}),
    },
    template: resume?.template || 'Modern Professional',
    mode: resume?.mode || 'dark',
    accentColor: resume?.accentColor || '#06b6d4',
    fontFamily: resume?.fontFamily || 'Inter, sans-serif',
    sidebarStyle: resume?.sidebarStyle || 'right',
    visibility: resume?.visibility || 'public',
    sectionOrder: resume?.sectionOrder || [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'achievements',
      'socials',
    ],
    completion: calculateCompletion(resume),
    atsScore: calculateATScore(resume),
    aiSuggestions: calculateATSSuggestions(resume),
    lastSaved: resume?.lastSaved || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: userId || resume?.userId || '',
    id: resume?.id || `resume-${Date.now()}`,
  };

  return base;
};

const getResumeLibrary = () => getFromStorage(RESUME_KEY, []);
const setResumeLibrary = (library) => saveToStorage(RESUME_KEY, library);

const getDraft = () => getFromStorage(RESUME_DRAFT_KEY, null);

const getUserResumeList = (userId) => {
  const library = getResumeLibrary();
  return library.filter((resume) => resume.userId === userId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const resumeService = {
  getDraft,
  saveDraft: (resume) => saveToStorage(RESUME_DRAFT_KEY, resume),
  getLatestResumeByUser: (userId) => {
    const usersResumes = getUserResumeList(userId);
    return usersResumes[0] || null;
  },
  getResumeById: (id) => {
    const library = getResumeLibrary();
    return library.find((resume) => resume.id === id) || null;
  },
  getAllResumes: () => getResumeLibrary(),
  getResumesByUser: (userId) => getUserResumeList(userId),
  saveResume: (userId, resumeData) => {
    const library = getResumeLibrary();
    const normalized = normalizeResume(resumeData, userId);
    const index = library.findIndex((item) => item.id === normalized.id);

    if (index === -1) {
      library.push(normalized);
    } else {
      library[index] = normalized;
    }

    setResumeLibrary(library);
    return normalized;
  },
  deleteResume: (id) => {
    const library = getResumeLibrary();
    const filtered = library.filter((resume) => resume.id !== id);
    setResumeLibrary(filtered);
    return filtered;
  },
  duplicateResume: (id, userId) => {
    const target = resumeService.getResumeById(id);
    if (!target) return null;

    const cloned = normalizeResume({
      ...target,
      id: `resume-${Date.now()}`,
      name: `${target.personal?.fullName || 'Candidate'} Copy`,
      title: target.personal?.jobTitle || 'Resume',
      visibility: target.visibility || 'public',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      analytics: buildDefaultAnalytics(),
    }, userId);

    return resumeService.saveResume(userId, cloned);
  },
  updateVisibility: (id, visibility) => {
    const library = getResumeLibrary();
    const target = library.find((resume) => resume.id === id);
    if (!target) return null;

    target.visibility = visibility;
    target.updatedAt = new Date().toISOString();
    setResumeLibrary(library);
    return target;
  },
  updateAnalytics: (id, updates = {}) => {
    const library = getResumeLibrary();
    const target = library.find((resume) => resume.id === id);
    if (!target) return null;

    target.analytics = {
      ...buildDefaultAnalytics(),
      ...target.analytics,
      ...updates,
    };
    target.updatedAt = new Date().toISOString();
    setResumeLibrary(library);
    return target;
  },
  getResumeSnapshotForCandidate: (userId, fallback = {}) => {
    const resume = resumeService.getLatestResumeByUser(userId);
    const user = userService.getUserById(userId) || {};

    if (!resume) {
      const skills = normalizeSkills(fallback.skills || user.skills || []);
      return {
        resumeId: null,
        resumeAvailable: false,
        name: fallback.name || user.name || 'Candidate',
        title: fallback.title || user.title || 'Professional',
        location: fallback.location || user.location || 'Remote',
        summary: fallback.summary || user.bio || 'Resume is not ready. Create a premium resume to unlock recruiter visibility.',
        skills,
        experience: fallback.experience || user.experience || [],
        education: fallback.education || user.education || [],
        projects: fallback.projects || [],
        certifications: fallback.certifications || [],
        languages: fallback.languages || [],
        achievements: fallback.achievements || [],
        socials: fallback.socials || {},
        profileImage: fallback.profileImage || user.profileImage || '',
        visibility: 'private',
        matchScore: fallback.matchScore || 68,
        analytics: buildDefaultAnalytics(),
      };
    }

    return {
      resumeId: resume.id,
      resumeAvailable: true,
      name: resume.personal?.fullName || user.name || 'Candidate',
      title: resume.personal?.jobTitle || fallback.title || 'Professional',
      location: resume.personal?.location || user.location || 'Remote',
      summary: resume.personal?.summary || fallback.summary || user.bio || '',
      skills: normalizeSkills(resume.skills),
      experience: resume.experience || [],
      education: resume.education || [],
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      languages: resume.languages || [],
      achievements: resume.achievements || [],
      socials: resume.socials || {},
      profileImage: resume.personal?.profileImage || user.profileImage || '',
      visibility: resume.visibility,
      matchScore: resume.matchScore || 80,
      analytics: resume.analytics || buildDefaultAnalytics(),
      template: resume.template,
      atsScore: resume.atsScore,
      completion: resume.completion,
    };
  },
  getRecommendedJobs: (userId) => {
    const jobList = getJobs();
    const resume = resumeService.getLatestResumeByUser(userId);
    if (!resume) return [];

    const skillSet = new Set(normalizeSkills(resume.skills).map((skill) => skill.toLowerCase()));

    const rankedJobs = jobList
      .map((job) => {
        const jobSkills = (job.skills || []).map((skill) => String(skill).toLowerCase());
        const overlap = jobSkills.filter((skill) => skillSet.has(skill)).length;
        const match = jobSkills.length ? Math.round((overlap / jobSkills.length) * 100) : 0;
        return { ...job, matchScore: match };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    return rankedJobs;
  },
  getAdminResumeAnalytics: () => {
    const library = getResumeLibrary();
    const templates = library.reduce((acc, resume) => {
      acc[resume.template] = (acc[resume.template] || 0) + 1;
      return acc;
    }, {});

    const usedSkills = library.flatMap((resume) => normalizeSkills(resume.skills));
    const skillCounts = usedSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const totalDownloads = library.reduce((sum, resume) => sum + (resume.analytics?.recruiterDownloads || 0), 0);

    return {
      totalResumes: library.length,
      publicResumes: library.filter((resume) => resume.visibility === 'public').length,
      privateResumes: library.filter((resume) => resume.visibility === 'private').length,
      totalDownloads,
      topTemplates: Object.entries(templates)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      topSkills,
    };
  },
};

export const getTrendingResumeSuggestions = (resume) => {
  const base = normalizeSkills(resume?.skills || []);
  const suggestions = [
    'Add metrics like “increased activation by 31%” to make the summary stronger.',
    'Include recruiter-friendly keywords such as collaboration, strategy, analytics, and ownership.',
    'Highlight a portfolio or GitHub link to increase trust and recruiter clicks.',
  ];

  if (base.length < 6) {
    suggestions.unshift('Expand your skills section with 6-8 high-impact keywords for your target role.');
  }

  return suggestions;
};
