import { getJobs, getFromStorage, saveToStorage } from "./storage_service";
import { userService } from "./user_service";
import { mockJobs } from "../data/jobs";

const RECRUITER_PROFILE_KEY = "hirehub_recruiter_profiles";
const RECRUITER_ACTIONS_KEY = "hirehub_recruiter_actions";

const defaultCandidateSeed = [
  {
    id: "candidate-1",
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    experience: "4 years",
    education: "B.S. Computer Science",
    expectedSalary: "$130k - $150k",
    location: "San Francisco, CA",
    availability: "Available in 2 weeks",
    matchScore: 96,
    profileImage: "https://i.pravatar.cc/150?img=1",
    summary:
      "Frontend engineer focused on high-quality UX, performance, and scalable React architecture for modern SaaS teams.",
    skills: ["React", "TypeScript", "Node.js", "Design Systems", "Next.js"],
    resumeAvailable: true,
    status: "Qualified",
    resumePreview: {
      summary:
        "Frontend engineer with 4 years of experience building product-grade dashboards, design systems, and conversion-focused experiences for fast-moving B2B products.",
      experience: [
        { title: "Frontend Developer", company: "TechCorp Inc.", duration: "2022 - Present" },
        { title: "React Engineer", company: "Northstar Labs", duration: "2020 - 2022" },
      ],
      education: [
        { degree: "Bachelor of Computer Science", school: "University of Technology" },
      ],
      certifications: ["AWS Certified Cloud Practitioner", "React Advanced Patterns"],
      projects: [
        "Led migration to a modular design system that improved component reuse by 32%.",
        "Optimized application performance with code-splitting and lazy-loaded interactions.",
      ],
    },
    projects: [
      { title: "AI Dashboard", role: "Lead Frontend Engineer", description: "Built a real-time analytics dashboard for enterprise hiring teams." },
    ],
    activity: [
      { label: "Applied", time: "2 days ago", detail: "Senior Frontend Developer at TechCorp" },
      { label: "Reviewed", time: "Today", detail: "Resume and portfolio shared" },
    ],
    appliedJobs: ["Senior Frontend Developer", "Product Design Lead"],
  },
  {
    id: "candidate-2",
    name: "Sarah Chen",
    title: "Product Designer",
    experience: "5 years",
    education: "MFA Interaction Design",
    expectedSalary: "$110k - $130k",
    location: "New York, NY",
    availability: "Available now",
    matchScore: 93,
    profileImage: "https://i.pravatar.cc/150?img=8",
    summary:
      "Design strategist with a strong portfolio in user research, systems thinking, and accessible product experiences.",
    skills: ["Figma", "Research", "UX Strategy", "Prototyping", "Accessibility"],
    resumeAvailable: true,
    status: "Shortlisted",
    resumePreview: {
      summary:
        "Product designer blending research, storyboarding, and prototyping to turn complex customer journeys into intuitive experiences for SaaS products.",
      experience: [
        { title: "Product Designer", company: "DesignStudio", duration: "2021 - Present" },
        { title: "UX Designer", company: "Aster Labs", duration: "2018 - 2021" },
      ],
      education: [
        { degree: "Master of Fine Arts", school: "Design Institute" },
      ],
      certifications: ["Google UX Design Certified", "Accessibility Specialist"],
      projects: [
        "Redesigned onboarding flow, boosting activation by 28%.",
        "Introduced design tokens and governance for cross-functional teams.",
      ],
    },
    projects: [
      { title: "Hiring Intelligence Suite", role: "Lead Product Designer", description: "Designed research workflows and dashboards for recruiter analytics." },
    ],
    activity: [
      { label: "Applied", time: "5 days ago", detail: "Product Designer at DesignStudio" },
      { label: "Saved", time: "Today", detail: "Marked for follow-up by recruiter" },
    ],
    appliedJobs: ["Product Designer", "UX Researcher"],
  },
  {
    id: "candidate-3",
    name: "Jordan Patel",
    title: "Go Engineer",
    experience: "3 years",
    education: "B.S. Software Engineering",
    expectedSalary: "$125k - $145k",
    location: "Austin, TX",
    availability: "Available in 3 weeks",
    matchScore: 91,
    profileImage: "https://i.pravatar.cc/150?img=12",
    summary:
      "Back-end engineer with a focus on scalable microservices, cloud operations, and high-throughput APIs.",
    skills: ["Go", "Docker", "Kubernetes", "AWS", "Terraform"],
    resumeAvailable: true,
    status: "Reviewing",
    resumePreview: {
      summary:
        "Backend engineer with a proven record of shipping resilient APIs, optimizing deployments, and building production-grade cloud infrastructure.",
      experience: [
        { title: "Backend Engineer", company: "CloudTech Solutions", duration: "2022 - Present" },
        { title: "Platform Engineer", company: "Axiom Stack", duration: "2020 - 2022" },
      ],
      education: [
        { degree: "Bachelor of Software Engineering", school: "State Technical University" },
      ],
      certifications: ["AWS Solutions Architect", "Certified Kubernetes Administrator"],
      projects: [
        "Automated release pipelines that cut deployment failures by 40%.",
        "Built observability stack for critical services with SLO-based alerting.",
      ],
    },
    projects: [
      { title: "Cloud Ops Automation", role: "Engineer", description: "Automated infrastructure rollout and incident response." },
    ],
    activity: [
      { label: "Applied", time: "1 week ago", detail: "DevOps Engineer at CloudTech" },
      { label: "Interview", time: "Today", detail: "Scheduling call with recruiter" },
    ],
    appliedJobs: ["DevOps Engineer", "Backend Engineer"],
  },
];

const getDefaultRecruiterProfile = (user = {}) => ({
  name: user.name || "Recruiter",
  email: user.email || "",
  phone: user.phone || "",
  bio: user.bio || "Talent advisor with a focus on high-converting hiring pipelines and exceptional candidate experience.",
  companyName: user.companyName || "HireHub Studio",
  companyWebsite: user.companyWebsite || "https://hirehub.example",
  companySize: user.companySize || "51 - 200",
  linkedin: user.linkedin || "",
  location: user.location || "Remote",
  industry: user.industry || "Technology",
  hiringPreferences: user.hiringPreferences || "React, product design, cloud, data, customer success leadership",
  preferredSkills: user.preferredSkills || ["React", "TypeScript", "Figma", "AWS", "Leadership"],
  profilePhoto: user.profileImage || "https://i.pravatar.cc/150?img=20",
  companyLogo: user.companyLogo || "",
  companyBanner: user.companyBanner || "",
  notifications: user.notifications || {
    emailAlerts: true,
    browserAlerts: true,
    weeklyDigest: true,
    smsUpdates: false,
  },
  security: user.security || {
    twoFactor: true,
    autoLock: true,
    auditLogs: true,
  },
  verification: user.isVerified ? "Verified by admin" : "Pending verification",
  featured: Boolean(user.featured),
  completion: user.profileCompletion || 68,
});

const ensureProfileMap = () => getFromStorage(RECRUITER_PROFILE_KEY, {});

const saveProfileMap = (profiles) => saveToStorage(RECRUITER_PROFILE_KEY, profiles);

const ensureActionList = () => getFromStorage(RECRUITER_ACTIONS_KEY, []);

const saveActionList = (actions) => saveToStorage(RECRUITER_ACTIONS_KEY, actions);

const createAction = (userId, candidateId, actionType, details = {}) => ({
  id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  userId,
  candidateId,
  actionType,
  timestamp: new Date().toISOString(),
  details,
});

const enrichCandidate = (candidate, recruiterProfile = {}) => {
  const preferredSkills = recruiterProfile.preferredSkills || ["React", "TypeScript", "Figma", "AWS", "Leadership"];
  const overlap = candidate.skills.filter((skill) => preferredSkills.includes(skill)).length;
  const score = Math.max(82, Math.min(99, candidate.matchScore + overlap * 2));

  return {
    ...candidate,
    matchScore: score,
    recruiterNotes: candidate.recruiterNotes || "",
    saved: Boolean(candidate.saved),
  };
};

export const recruiterService = {
  getRecruiterProfile: (userId) => {
    const profiles = ensureProfileMap();
    if (profiles[userId]) {
      return profiles[userId];
    }

    const user = userService.getUserById(userId) || {};
    const profile = getDefaultRecruiterProfile(user);
    profiles[userId] = profile;
    saveProfileMap(profiles);
    return profile;
  },

  saveRecruiterProfile: (userId, updates = {}) => {
    const profiles = ensureProfileMap();
    const current = recruiterService.getRecruiterProfile(userId);
    const nextProfile = {
      ...current,
      ...updates,
      completion: Math.max(60, Math.min(100, updates.completion || current.completion || 68)),
    };
    profiles[userId] = nextProfile;
    saveProfileMap(profiles);

    const user = userService.getUserById(userId);
    if (user) {
      userService.updateUser(userId, {
        name: updates.name || user.name,
        email: updates.email || user.email,
        phone: updates.phone || user.phone,
        bio: updates.bio || user.bio,
        profileImage: updates.profilePhoto || user.profileImage,
        companyName: updates.companyName || user.companyName,
        companyWebsite: updates.companyWebsite || user.companyWebsite,
        companySize: updates.companySize || user.companySize,
        linkedin: updates.linkedin || user.linkedin,
        location: updates.location || user.location,
        industry: updates.industry || user.industry,
        hiringPreferences: updates.hiringPreferences || user.hiringPreferences,
        profileCompletion: nextProfile.completion,
        featured: nextProfile.featured,
        isVerified: user.isVerified,
      });
    }

    return nextProfile;
  },

  getRecruiterJobs: (userId) => {
    const savedJobs = getJobs();
    const recruiterJobs = savedJobs.length > 0 ? savedJobs.filter((job) => job.postedBy === userId) : mockJobs.filter((job) => job.postedBy === userId);

    if (recruiterJobs.length > 0) {
      return recruiterJobs;
    }

    return mockJobs.filter((job) => job.postedBy === userId || job.postedBy === "recruiter-1");
  },

  getCandidateDirectory: (userId) => {
    const profile = recruiterService.getRecruiterProfile(userId);
    return defaultCandidateSeed.map((candidate) => enrichCandidate(candidate, profile));
  },

  getCandidateById: (candidateId, userId) => {
    const directory = recruiterService.getCandidateDirectory(userId);
    return directory.find((candidate) => candidate.id === candidateId) || null;
  },

  recordCandidateAction: (userId, candidateId, actionType, details = {}) => {
    const actions = ensureActionList();
    const nextAction = createAction(userId, candidateId, actionType, details);
    actions.unshift(nextAction);
    saveActionList(actions);
    return nextAction;
  },

  getCandidateActions: (userId) => {
    return ensureActionList().filter((action) => action.userId === userId).slice(0, 20);
  },

  getDashboardMetrics: (userId) => {
    const actions = recruiterService.getCandidateActions(userId);
    const profileViews = actions.filter((action) => action.actionType === "view_profile").length;
    const resumeDownloads = actions.filter((action) => action.actionType === "download_resume").length;
    const shortlisted = actions.filter((action) => action.actionType === "shortlist").length;
    const interviews = actions.filter((action) => action.actionType === "schedule_interview").length;

    return {
      profileViews: profileViews + 128,
      resumeDownloads: resumeDownloads + 64,
      shortlisted: shortlisted + 12,
      interviews: interviews + 8,
    };
  },

  getMonthlyHiringData: () => [
    { month: "Jan", hires: 2, apps: 12 },
    { month: "Feb", hires: 3, apps: 18 },
    { month: "Mar", hires: 4, apps: 22 },
    { month: "Apr", hires: 5, apps: 21 },
    { month: "May", hires: 6, apps: 28 },
    { month: "Jun", hires: 4, apps: 24 },
  ],

  getSkillDistribution: () => [
    { label: "React", value: 28 },
    { label: "Design", value: 18 },
    { label: "Cloud", value: 22 },
    { label: "Data", value: 16 },
    { label: "Leadership", value: 16 },
  ],

  getHiringFunnel: () => [
    { label: "Applied", value: 138 },
    { label: "Reviewed", value: 92 },
    { label: "Shortlisted", value: 41 },
    { label: "Interview", value: 14 },
    { label: "Hired", value: 6 },
  ],
};
