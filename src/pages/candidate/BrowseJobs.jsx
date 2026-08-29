import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import { usePortal } from "../../context/PortalContext";
import { jobService } from "../../services/jobService";

// ==================== VALIDATIONS ====================

const validateJob = (job) => {
  if (!job || typeof job !== 'object') return false;
  if (!job.title || typeof job.title !== 'string' || String(job.title).trim() === '') return false;
  if (!job.company || typeof job.company !== 'string' || String(job.company).trim() === '') return false;
  if (!job.location || typeof job.location !== 'string' || String(job.location).trim() === '') return false;
  if (!job._id && !job.id) return false;
  return true;
};

const validateJobArray = (jobs) => {
  if (!Array.isArray(jobs)) return [];
  return jobs.filter(job => job && typeof job === 'object');
};

const mapJobForDisplay = (job) => {
  if (!validateJob(job)) return null;

  return {
    ...job,
    _id: job._id || job.id || `job-${Date.now()}`,
    id: job._id || job.id || `job-${Date.now()}`,
    title: String(job.title || '').trim(),
    company: String(job.company || '').trim(),
    location: String(job.location || '').trim(),
    salary: String(job.salary || 'Negotiable').trim(),
    experience: String(job.experienceLevel || job.experience || 'Mid').trim(),
    experienceLevel: String(job.experienceLevel || job.experience || 'Mid').trim(),
    type: String(job.jobType || job.type || 'Full-time').trim(),
    jobType: String(job.jobType || job.type || 'Full-time').trim(),
    category: String(job.jobCategory || job.category || 'General').trim(),
    jobCategory: String(job.jobCategory || job.category || 'General').trim(),
    description: String(job.description || '').trim(),
    image: String(job.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200').trim(),
    logo: String(job.companyLogo || job.logo || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg').trim(),
    companyLogo: String(job.companyLogo || job.logo || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg').trim(),
    skills: Array.isArray(job.skills) ? job.skills.map(s => String(s || '')).filter(s => s) : [],
    requirements: Array.isArray(job.requirements) ? job.requirements.map(r => String(r || '')).filter(r => r) : [],
    deadline: job.deadline ? String(job.deadline).trim() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: String(job.status || 'Published').trim(),
    postedBy: String(job.postedBy || ''),
  };
};

const jobCategories = [
  "All",
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

// ==================== COMPONENT ====================

const BrowseJobs = () => {
  const { hasApplied } = usePortal();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  // Load public jobs
  const loadJobs = () => {
    try {
      setIsLoading(true);
      const publicJobs = jobService.getPublicJobs();
      const validatedJobs = validateJobArray(publicJobs);
      setJobs(validatedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadJobs();
    };

    const reloadJobs = () => handleStorageChange();
    window.addEventListener("storage", reloadJobs);
    window.addEventListener("jobs-updated", reloadJobs);
    return () => {
      window.removeEventListener("storage", reloadJobs);
      window.removeEventListener("jobs-updated", reloadJobs);
    };
  }, []);

  const buildApplyJobData = (job) => {
    if (!validateJob(job)) return null;

    const mappedJob = mapJobForDisplay(job);
    if (!mappedJob) return null;

    const skillsText = (mappedJob.skills || []).join(", ");

    return {
      ...mappedJob,
      jobId: mappedJob._id,
      jobTitle: mappedJob.title,
      companyDescription:
        job.companyDescription ||
        `${mappedJob.company} is hiring for ${mappedJob.title}. This role is suitable for candidates skilled in ${
          skillsText || mappedJob.category
        }. The company is looking for candidates who can contribute to real-world projects and work in a professional team environment.`,
    };
  };

  const goToApplyPage = (job) => {
    if (!validateJob(job)) {
      console.error('Invalid job data');
      return;
    }

    const applyJobData = buildApplyJobData(job);
    if (!applyJobData) {
      console.error('Failed to prepare job application data');
      return;
    }

    navigate(`/candidate/apply/${applyJobData.jobId}`, {
      state: applyJobData,
    });
  };

  useEffect(() => {
    const currentCategory = searchParams.get("category");

    if (currentCategory) {
      setCategory(currentCategory);
    }
  }, [searchParams]);

  const updateCategory = (value) => {
    if (!value || typeof value !== 'string') return;

    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setSearchParams(params);
  };

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return [];

    return jobs
      .map(mapJobForDisplay)
      .filter(job => job !== null)
      .filter((job) => {
        if (!job) return false;

        const title = String(job?.title || "").toLowerCase();
        const company = String(job?.company || "").toLowerCase();
        const jobCategory = String(job?.category || "").toLowerCase();
        const search = String(searchTerm || "").toLowerCase();

        const matchesSearch =
          !search || title.includes(search) || company.includes(search);

        const matchesCategory =
          category === "All" || jobCategory === category.toLowerCase();

        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, category, jobs]);
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617]">
      <div className="absolute left-0 top-0 h-75 w-75 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-75 w-75 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600"
            alt="Jobs hero"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />

          <div className="relative z-10 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              <HiOutlineSparkles className="h-4 w-4" />
              AI Powered Career Platform
            </div>

            <h1 className="mt-6 text-4xl font-black text-white md:text-6xl">
              Find Your
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Dream Job
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Explore premium jobs from top tech companies with modern filters
              and beautiful UI.
            </p>

            <div className="mt-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-xl">
              <HiOutlineMagnifyingGlass className="h-5 w-5 text-cyan-400" />

              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(String(e.target.value || ''))}
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                aria-label="Search jobs"
              />
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap gap-3">
          {jobCategories.map((item) => (
            <button
              key={item}
              onClick={() => updateCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                category === item
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Total Jobs", value: filteredJobs?.length || 0 },
            { title: "Companies", value: "120+" },
            { title: "Remote Jobs", value: "45%" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-4xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl"
            >
              <p className="text-3xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl text-slate-300">No jobs found</p>
              <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredJobs.map((job, index) => {
                if (!job || !job._id) return null;

                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ delay: index * 0.04 }}
                    className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 backdrop-blur-xl"
                  >
                    {/* Job Image */}
                    <div className="relative h-35 overflow-hidden">
                      <img
                        src={job.image || ""}
                        alt={job.title || "Job"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Job Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.logo || ""}
                          alt={`${job.company || "Company"} logo`}
                          className="h-12 w-12 rounded-xl bg-white p-1 object-contain"
                          onError={(e) => {
                            e.target.src = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
                          }}
                        />

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-white">
                            {job.title || "Untitled"}
                          </h3>
                          <p className="truncate text-xs text-slate-400">
                            {job.company || "Unknown Company"}
                          </p>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="mt-4 space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <HiOutlineMapPin className="h-4 w-4 text-cyan-400" />
                          {job.location || "Location not specified"}
                        </div>

                        <div className="flex items-center gap-2">
                          <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-400" />
                          {job.salary || "Negotiable"}
                        </div>

                        <div className="flex items-center gap-2">
                          <HiOutlineClock className="h-4 w-4 text-orange-400" />
                          {job.experienceLevel || job.experience || "Experience not specified"}
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {job.skills.slice(0, 2).map((skill) => (
                            <span
                              key={String(skill)}
                              className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] text-cyan-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const jobData = buildApplyJobData(job);
                            if (jobData) {
                              setSelectedJob(jobData);
                            }
                          }}
                          className="flex-1 rounded-xl bg-white/10 py-2 text-xs text-white transition hover:bg-white/20"
                          aria-label={`View details for ${job.title}`}
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() => goToApplyPage(job)}
                          className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                          disabled={!validateJob(job)}
                          aria-label={`Apply for ${job.title}`}
                        >
                          {hasApplied(job._id) ? "Applied" : "Apply"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-white/10 bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
                aria-label="Close modal"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>

              {/* Job Image */}
              <div className="relative h-55">
                <img
                  src={selectedJob.image || ""}
                  alt={selectedJob.title || "Job"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Job Header */}
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedJob.logo || ""}
                    alt={`${selectedJob.company || "Company"} logo`}
                    className="h-16 w-16 rounded-2xl bg-white p-2 object-contain"
                    onError={(e) => {
                      e.target.src = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
                    }}
                  />

                  <div>
                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                      {selectedJob.title || "Untitled Job"}
                    </h2>
                    <p className="text-slate-400">{selectedJob.company || "Unknown Company"}</p>
                  </div>
                </div>

                {/* Location and Salary */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="text-white">{selectedJob.location || "Not specified"}</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-500">Salary</p>
                    <p className="text-white">{selectedJob.salary || "Negotiable"}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">
                    Company Details
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedJob.companyDescription || "No description available"}
                  </p>
                </div>

                {/* Requirements */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white">
                      Requirements
                    </h3>
                    <div className="mt-3 grid gap-2">
                      {selectedJob.requirements.map((item, index) => (
                        <p
                          key={index}
                          className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300"
                        >
                          {item || ""}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white">Skills</h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill) => (
                        <span
                          key={String(skill)}
                          className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => {
                    goToApplyPage(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:opacity-90"
                >
                  {hasApplied(selectedJob._id)
                    ? "Applied"
                    : "Apply Job"}

                  <HiOutlineArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BrowseJobs;

  