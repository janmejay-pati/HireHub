import { getJobs, setJobs } from "./storage_service";

const jobCategories = [
  "Frontend",
  "Backend",
  "MERN",
  "Java",
  "Python",
  "DevOps",
  "Cloud",
  "AI/ML",
  "Data Science",
  "UI/UX",
  "Product",
  "QA",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Internship",
  "Remote",
  "Full Stack",
];

const publicStatuses = ["published", "approved", "active", "open"];

const images = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
];

const categorySkills = {
  Frontend: ["React", "JavaScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "MongoDB"],
  MERN: ["MongoDB", "Express", "React", "Node.js"],
  Java: ["Java", "Spring Boot", "MySQL"],
  Python: ["Python", "Django", "REST API"],
  DevOps: ["Docker", "Kubernetes", "CI/CD"],
  Cloud: ["AWS", "Azure", "Cloud"],
  "AI/ML": ["Python", "TensorFlow", "Machine Learning"],
  "Data Science": ["SQL", "Python", "Power BI"],
  "UI/UX": ["Figma", "Wireframing", "Prototyping"],
  Product: ["Product Strategy", "Agile", "Analytics"],
  QA: ["Manual Testing", "Selenium", "Bug Reporting"],
  Sales: ["Communication", "CRM", "Lead Generation"],
  Marketing: ["SEO", "Google Ads", "Social Media"],
  HR: ["Recruitment", "Screening", "Onboarding"],
  Finance: ["Excel", "Accounting", "Finance"],
  Internship: ["HTML", "CSS", "JavaScript"],
  Remote: ["React", "Git", "Remote Work"],
  "Full Stack": ["React", "Node.js", "MongoDB"],
};

const categoryTitles = {
  Frontend: [
    "Frontend Developer",
    "React Developer",
    "Vue.js Developer",
    "Angular Developer",
    "UI Developer",
    "Frontend Engineer",
    "JavaScript Developer",
    "Web UI Engineer",
  ],
  Backend: [
    "Backend Developer",
    "Node.js Developer",
    "Express Developer",
    "API Developer",
    "Server-side Engineer",
    "Backend Engineer",
    "Microservices Developer",
    "REST API Developer",
  ],
  MERN: [
    "MERN Stack Developer",
    "Full MERN Developer",
    "React Node Developer",
    "MongoDB Developer",
    "MERN Engineer",
    "MERN Software Engineer",
    "Full Stack MERN Engineer",
    "Senior MERN Developer",
  ],
  Java: [
    "Java Developer",
    "Spring Boot Developer",
    "Java Backend Engineer",
    "Enterprise Java Developer",
    "Java Software Engineer",
    "Java Full Stack Developer",
    "J2EE Developer",
    "Core Java Developer",
  ],
  Python: [
    "Python Developer",
    "Django Developer",
    "Flask Developer",
    "Automation Engineer",
    "Python Backend Engineer",
    "Data Python Developer",
    "FastAPI Developer",
    "Python Software Engineer",
  ],
  DevOps: [
    "DevOps Engineer",
    "CI/CD Engineer",
    "Docker Engineer",
    "Kubernetes Engineer",
    "Infrastructure Engineer",
    "Build Engineer",
    "Cloud DevOps Engineer",
    "Release Engineer",
  ],
  Cloud: [
    "Cloud Engineer",
    "AWS Engineer",
    "Azure Engineer",
    "Google Cloud Engineer",
    "Cloud Support Engineer",
    "Cloud Infrastructure Engineer",
    "Cloud Architect",
    "Cloud Administrator",
  ],
  "AI/ML": [
    "AI Engineer",
    "ML Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Machine Learning Developer",
    "AI Research Engineer",
    "Generative AI Engineer",
  ],
  "Data Science": [
    "Data Scientist",
    "Data Analyst",
    "BI Analyst",
    "Analytics Engineer",
    "Data Engineer",
    "Power BI Developer",
    "Business Analyst",
    "SQL Analyst",
  ],
  "UI/UX": [
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Interaction Designer",
    "Visual Designer",
    "UI/UX Designer",
    "Figma Designer",
    "Creative Designer",
  ],
  Product: [
    "Product Manager",
    "Associate Product Manager",
    "Technical Product Manager",
    "Product Analyst",
    "Product Owner",
    "Senior Product Manager",
    "Product Executive",
    "Growth Product Manager",
  ],
  QA: [
    "QA Tester",
    "Automation Tester",
    "Manual Tester",
    "QA Engineer",
    "Software Tester",
    "SDET",
    "Quality Engineer",
    "Test Automation Engineer",
  ],
  Sales: [
    "Sales Executive",
    "Business Development Executive",
    "Sales Manager",
    "Inside Sales Executive",
    "Account Executive",
    "Client Relationship Executive",
    "Sales Consultant",
    "Business Development Manager",
  ],
  Marketing: [
    "Digital Marketing Executive",
    "SEO Executive",
    "Social Media Manager",
    "Performance Marketer",
    "Content Marketing Executive",
    "Growth Marketer",
    "Marketing Associate",
    "Marketing Manager",
  ],
  HR: [
    "HR Recruiter",
    "HR Executive",
    "Talent Acquisition Executive",
    "HR Manager",
    "Recruitment Specialist",
    "People Operations Executive",
    "HR Coordinator",
    "Talent Acquisition Manager",
  ],
  Finance: [
    "Finance Analyst",
    "Financial Analyst",
    "Accounts Executive",
    "Finance Manager",
    "Billing Executive",
    "Accounts Manager",
    "Investment Analyst",
    "Finance Associate",
  ],
  Internship: [
    "React Intern",
    "Frontend Intern",
    "Backend Intern",
    "Software Intern",
    "Web Development Intern",
    "MERN Intern",
    "Java Intern",
    "Python Intern",
  ],
  Remote: [
    "Remote React Developer",
    "Remote Backend Developer",
    "Remote MERN Developer",
    "Remote Full Stack Developer",
    "Remote UI Designer",
    "Remote QA Engineer",
    "Remote Python Developer",
    "Remote Java Developer",
  ],
  "Full Stack": [
    "Full Stack Developer",
    "Full Stack Engineer",
    "Software Engineer",
    "MERN Full Stack Developer",
    "React Node Developer",
    "Senior Full Stack Developer",
    "Java Full Stack Developer",
    "Python Full Stack Developer",
  ],
};

const companies = [
  "TechNova",
  "CodeCraft",
  "StackSoft",
  "EnterpriseHub",
  "PyWorks",
  "CloudBridge",
  "DataPulse",
  "PixelStudio",
  "GrowthHive",
  "BuildStack",
];

const locations = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Remote",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Bhubaneswar",
  "Noida",
  "Gurgaon",
];

const salaries = [
  "₹3 LPA - ₹6 LPA",
  "₹4 LPA - ₹8 LPA",
  "₹5 LPA - ₹10 LPA",
  "₹6 LPA - ₹12 LPA",
  "₹8 LPA - ₹16 LPA",
];

const experienceLevels = [
  "Fresher",
  "0-2 Years",
  "1-3 Years",
  "2-4 Years",
  "3-5 Years",
  "5+ Years",
  "Senior",
  "Lead",
];

const normalizeText = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

const getJobCategory = (job = {}) =>
  String(
    job.jobCategory ||
      job.category ||
      job.domain ||
      job.selectedCategory ||
      job.department ||
      job.jobDomain ||
      job.roleCategory ||
      "General"
  ).trim();

const createId = () =>
  `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createDeadline = (days = 30) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const notifyJobsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jobs-updated"));
  }
};

const createDemoJobs = () => {
  const jobs = [];

  jobCategories.forEach((category, categoryIndex) => {
    const titles = categoryTitles[category] || [];

    titles.forEach((title, index) => {
      const id = `demo-${category
        .toLowerCase()
        .replaceAll("/", "-")
        .replaceAll(" ", "-")}-${index + 1}`;

      jobs.push({
        _id: id,
        id,
        title,
        company: companies[(categoryIndex + index) % companies.length],
        location: locations[(categoryIndex + index) % locations.length],
        salary: salaries[index % salaries.length],
        jobType:
          category === "Internship"
            ? "Internship"
            : category === "Remote"
            ? "Remote"
            : "Full-time",
        type:
          category === "Internship"
            ? "Internship"
            : category === "Remote"
            ? "Remote"
            : "Full-time",
        workMode:
          category === "Remote"
            ? "Remote"
            : index % 3 === 0
            ? "Remote"
            : index % 2 === 0
            ? "Hybrid"
            : "On-site",
        experienceLevel: experienceLevels[index % experienceLevels.length],
        experience: experienceLevels[index % experienceLevels.length],
        jobCategory: category,
        category,
        description: `${title} role at ${
          companies[(categoryIndex + index) % companies.length]
        }. Work on real projects, improve skills, and collaborate with a professional team.`,
        skills: categorySkills[category] || ["Communication", "Teamwork"],
        requirements: [
          `Good knowledge of ${category}`,
          "Basic project experience",
          "Good communication skills",
        ],
        status: index === 0 ? "Approved" : "Published",
        featured: index === 0,
        urgent: index === 1,
        hiringCount: index + 1,
        companyLogo:
          "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        companyBanner: images[index % images.length],
        image: images[index % images.length],
        postedBy: "system",
        recruiterId: "system",
        createdByRole: "system",
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        deadline: createDeadline(25 + index),
      });
    });
  });

  return jobs;
};

const normalizeJob = (job = {}) => {
  const id = job._id || job.id || createId();
  const category = getJobCategory(job);

  return {
    ...job,
    _id: id,
    id,
    title: String(job.title || job.jobTitle || "Untitled Job").trim(),
    company: String(job.company || job.companyName || "Unknown Company").trim(),
    location: String(job.location || job.city || "Remote").trim(),
    salary: String(job.salary || job.package || "Negotiable").trim(),

    jobType: String(job.jobType || job.type || "Full-time").trim(),
    type: String(job.jobType || job.type || "Full-time").trim(),

    workMode: String(job.workMode || job.mode || "Remote").trim(),

    experienceLevel: String(
      job.experienceLevel || job.experience || "Fresher"
    ).trim(),
    experience: String(job.experienceLevel || job.experience || "Fresher").trim(),

    jobCategory: category,
    category,

    description: String(job.description || job.jobDescription || "").trim(),

    skills: Array.isArray(job.skills)
      ? job.skills
      : typeof job.skills === "string"
      ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [],

    requirements: Array.isArray(job.requirements)
      ? job.requirements
      : typeof job.requirements === "string"
      ? job.requirements.split(",").map((item) => item.trim()).filter(Boolean)
      : [],

    status: job.status || "Published",
    featured: Boolean(job.featured),
    urgent: Boolean(job.urgent),
    hiringCount: Number(job.hiringCount || job.openings || 1),

    companyLogo:
      job.companyLogo ||
      job.logo ||
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    logo:
      job.companyLogo ||
      job.logo ||
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",

    companyBanner: job.companyBanner || job.image || images[0],
    image: job.image || job.companyBanner || images[0],

    postedBy: job.postedBy || job.createdBy || "system",
    recruiterId: job.recruiterId || job.postedBy || job.createdBy || "",
    createdByRole: job.createdByRole || "",

    createdAt: job.createdAt || new Date().toISOString(),
    updatedAt: job.updatedAt || new Date().toISOString(),
    deadline: job.deadline || createDeadline(30),
  };
};

const seedJobsIfEmpty = () => {
  const jobs = getJobs();

  if (!Array.isArray(jobs) || jobs.length === 0) {
    const demoJobs = createDemoJobs().map(normalizeJob);
    setJobs(demoJobs);
    return demoJobs;
  }

  const normalizedJobs = jobs.map(normalizeJob);
  setJobs(normalizedJobs);
  return normalizedJobs;
};

const getSyncedJobs = () => seedJobsIfEmpty();

const saveSyncedJobs = (jobs) => {
  const normalizedJobs = jobs.map(normalizeJob);
  setJobs(normalizedJobs);
  notifyJobsUpdated();
  return normalizedJobs;
};

const applyFilters = (jobs, filters = {}) => {
  let filteredJobs = Array.isArray(jobs) ? [...jobs] : [];

  if (filters.category && filters.category !== "All") {
    filteredJobs = filteredJobs.filter((job) => {
      const jobCategory = normalizeText(getJobCategory(job));
      const selectedCategory = normalizeText(filters.category);

      return jobCategory === selectedCategory;
    });
  }

  if (filters.location && filters.location !== "All") {
    filteredJobs = filteredJobs.filter((job) =>
      normalizeText(job.location).includes(normalizeText(filters.location))
    );
  }

  if (filters.jobType && filters.jobType !== "All") {
    filteredJobs = filteredJobs.filter(
      (job) =>
        normalizeText(job.jobType || job.type) === normalizeText(filters.jobType)
    );
  }

  if (filters.type && filters.type !== "All") {
    filteredJobs = filteredJobs.filter(
      (job) => normalizeText(job.jobType || job.type) === normalizeText(filters.type)
    );
  }

  if (filters.workMode && filters.workMode !== "All") {
    filteredJobs = filteredJobs.filter(
      (job) => normalizeText(job.workMode) === normalizeText(filters.workMode)
    );
  }

  if (filters.experienceLevel && filters.experienceLevel !== "All") {
    filteredJobs = filteredJobs.filter(
      (job) =>
        normalizeText(job.experienceLevel || job.experience) ===
        normalizeText(filters.experienceLevel)
    );
  }

  if (filters.experience && filters.experience !== "All") {
    filteredJobs = filteredJobs.filter(
      (job) =>
        normalizeText(job.experienceLevel || job.experience) ===
        normalizeText(filters.experience)
    );
  }

  if (filters.postedBy) {
    filteredJobs = filteredJobs.filter(
      (job) =>
        String(job.postedBy) === String(filters.postedBy) ||
        String(job.recruiterId) === String(filters.postedBy)
    );
  }

  if (filters.search) {
    const searchTerm = normalizeText(filters.search);

    filteredJobs = filteredJobs.filter(
      (job) =>
        normalizeText(job.title).includes(searchTerm) ||
        normalizeText(job.company).includes(searchTerm) ||
        normalizeText(job.description).includes(searchTerm) ||
        normalizeText(job.location).includes(searchTerm) ||
        normalizeText(getJobCategory(job)).includes(searchTerm)
    );
  }

  return filteredJobs;
};

export const jobService = {
  seedJobsIfEmpty,

  getAllJobs: (filters = {}) => {
    const jobs = getSyncedJobs();
    return applyFilters(jobs, filters);
  },

  getJobById: (id) => {
    const jobs = getSyncedJobs();

    return jobs.find(
      (job) => String(job._id) === String(id) || String(job.id) === String(id)
    );
  },

  createJob: (jobData = {}) => {
    const jobs = getSyncedJobs();
    const id = jobData._id || jobData.id || createId();

    const newJob = normalizeJob({
      ...jobData,
      _id: id,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: jobData.deadline || createDeadline(30),
      status: jobData.status || "Published",
    });

    const updatedJobs = [newJob, ...jobs];
    saveSyncedJobs(updatedJobs);

    return newJob;
  },

  updateJob: (id, updates) => {
    const jobs = getSyncedJobs();

    const jobIndex = jobs.findIndex(
      (job) => String(job._id) === String(id) || String(job.id) === String(id)
    );

    if (jobIndex === -1) {
      throw new Error("Job not found");
    }

    jobs[jobIndex] = normalizeJob({
      ...jobs[jobIndex],
      ...updates,
      _id: jobs[jobIndex]._id,
      id: jobs[jobIndex].id,
      updatedAt: new Date().toISOString(),
    });

    saveSyncedJobs(jobs);

    return jobs[jobIndex];
  },

  deleteJob: (id) => {
    const jobs = getSyncedJobs();

    const jobIndex = jobs.findIndex(
      (job) => String(job._id) === String(id) || String(job.id) === String(id)
    );

    if (jobIndex === -1) {
      throw new Error("Job not found");
    }

    const deletedJob = jobs.splice(jobIndex, 1)[0];

    saveSyncedJobs(jobs);

    return deletedJob;
  },

  getJobsByRecruiter: (recruiterId) => {
    const jobs = getSyncedJobs();

    return jobs.filter(
      (job) =>
        String(job.postedBy) === String(recruiterId) ||
        String(job.recruiterId) === String(recruiterId)
    );
  },

  getPublicJobs: (filters = {}) => {
    const jobs = getSyncedJobs();

    const publicJobs = jobs.filter((job) =>
      publicStatuses.includes(String(job.status || "").toLowerCase())
    );

    return applyFilters(publicJobs, filters);
  },

  approveJob: (id) => jobService.updateJob(id, { status: "Approved" }),

  rejectJob: (id) => jobService.updateJob(id, { status: "Rejected" }),

  toggleFeaturedJob: (id) => {
    const job = jobService.getJobById(id);

    if (!job) {
      throw new Error("Job not found");
    }

    return jobService.updateJob(id, {
      featured: !job.featured,
    });
  },

  toggleUrgentJob: (id) => {
    const job = jobService.getJobById(id);

    if (!job) {
      throw new Error("Job not found");
    }

    return jobService.updateJob(id, {
      urgent: !job.urgent,
    });
  },

  getJobStats: () => {
    const jobs = getSyncedJobs();

    const typeCounts = jobs.reduce((acc, job) => {
      acc[job.jobType] = (acc[job.jobType] || 0) + 1;
      return acc;
    }, {});

    const levelCounts = jobs.reduce((acc, job) => {
      acc[job.experienceLevel] = (acc[job.experienceLevel] || 0) + 1;
      return acc;
    }, {});

    return {
      total: jobs.length,
      active: jobs.filter((job) =>
        publicStatuses.includes(String(job.status || "").toLowerCase())
      ).length,
      pending: jobs.filter(
        (job) => String(job.status || "").toLowerCase() === "pending"
      ).length,
      rejected: jobs.filter(
        (job) => String(job.status || "").toLowerCase() === "rejected"
      ).length,
      featured: jobs.filter((job) => job.featured).length,
      urgent: jobs.filter((job) => job.urgent).length,
      byType: typeCounts,
      byLevel: levelCounts,
    };
  },

  searchJobs: (query) => {
    const jobs = getSyncedJobs();

    if (!query) return jobs;

    return applyFilters(jobs, { search: query });
  },

  getRecentJobs: (limit = 10) => {
    const jobs = getSyncedJobs();

    return [...jobs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  fetchJobs: async (filters = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const jobs = jobService.getAllJobs(filters);

      return {
        success: true,
        data: jobs,
        count: jobs.length,
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch jobs",
      };
    }
  },

  fetchJobDetails: async (jobId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const job = jobService.getJobById(jobId);

      if (!job) {
        return {
          success: false,
          message: "Job not found",
        };
      }

      return {
        success: true,
        data: job,
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch job details",
      };
    }
  },

  postJob: async (jobData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const newJob = jobService.createJob(jobData);

      return {
        success: true,
        data: newJob,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to post job",
      };
    }
  },
};

export const fetchJobs = jobService.fetchJobs;
export const fetchJobDetails = jobService.fetchJobDetails;
export const postJob = jobService.postJob;
export const deleteJob = jobService.deleteJob;