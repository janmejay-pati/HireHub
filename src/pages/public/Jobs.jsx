import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import {
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

import { usePortal } from "../../context/PortalContext";
import { jobService } from "../../services/jobService";

const jobDomains = [
  "Frontend", "Backend", "MERN", "Java", "Python", "DevOps", "Cloud",
  "AI/ML", "Data Science", "UI/UX", "Product", "QA", "Sales", "Marketing",
  "HR", "Finance", "Internship", "Remote", "Full Stack",
];

const filterOptions = {
  jobType: ["All", "Full-time", "Part-time", "Internship", "Remote", "Contract"],
  experience: ["All", "Fresher", "0-2 Years", "1-3 Years", "2-4 Years", "3-5 Years", "5+ Years", "Senior", "Lead"],
  workMode: ["All", "Remote", "Hybrid", "On-site"],
  location: ["All", "Bangalore", "Hyderabad", "Pune", "Remote", "Mumbai", "Delhi", "Chennai", "Bhubaneswar", "Noida", "Gurgaon"],
};

const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200";
const defaultLogo = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";

const titlesByCategory = {
  Frontend: ["React Developer", "Next.js Developer", "Frontend Engineer", "JavaScript Developer"],
  Backend: ["Backend Developer", "Node.js Developer", "API Developer", "Express Developer"],
  MERN: ["MERN Stack Developer", "React Node Developer", "MongoDB Developer", "Full Stack MERN Developer"],
  Java: ["Java Developer", "Spring Boot Developer", "Core Java Developer", "Java Backend Engineer"],
  Python: ["Python Developer", "Django Developer", "Flask Developer", "FastAPI Developer"],
  DevOps: ["DevOps Engineer", "Docker Engineer", "Kubernetes Engineer", "CI/CD Engineer"],
  Cloud: ["Cloud Engineer", "AWS Engineer", "Azure Engineer", "Cloud Administrator"],
  "AI/ML": ["AI Engineer", "ML Engineer", "NLP Engineer", "Computer Vision Engineer"],
  "Data Science": ["Data Scientist", "Data Analyst", "Data Engineer", "Power BI Developer"],
  "UI/UX": ["UI Designer", "UX Designer", "Product Designer", "Figma Designer"],
  Product: ["Product Manager", "Product Analyst", "Product Owner", "Growth Product Manager"],
  QA: ["QA Tester", "QA Engineer", "Automation Tester", "Manual Tester"],
  Sales: ["Sales Executive", "Sales Manager", "Business Development Executive", "Account Executive"],
  Marketing: ["Digital Marketing Executive", "SEO Executive", "Social Media Manager", "Content Marketer"],
  HR: ["HR Recruiter", "HR Executive", "Talent Acquisition Executive", "HR Manager"],
  Finance: ["Finance Analyst", "Accounts Executive", "Financial Analyst", "Finance Manager"],
  Internship: ["React Intern", "MERN Intern", "Java Intern", "Web Development Intern"],
  Remote: ["Remote React Developer", "Remote Backend Developer", "Remote QA Engineer", "Remote Python Developer"],
  "Full Stack": ["Full Stack Developer", "Full Stack Engineer", "React Node Developer", "Software Engineer"],
};

const companies = ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Accenture", "Deloitte"];
const locations = ["Bangalore", "Hyderabad", "Pune", "Bhubaneswar", "Chennai", "Noida", "Mumbai", "Remote"];
const salaries = ["₹3 LPA - ₹6 LPA", "₹4 LPA - ₹8 LPA", "₹5 LPA - ₹10 LPA", "₹6 LPA - ₹12 LPA"];
const images = [
  defaultImage,
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
];

const skillsByCategory = {
  Frontend: ["React", "JavaScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "MongoDB"],
  MERN: ["MongoDB", "Express", "React", "Node.js"],
  Java: ["Java", "Spring Boot", "MySQL"],
  Python: ["Python", "Django", "REST API"],
  DevOps: ["Docker", "Kubernetes", "CI/CD"],
  Cloud: ["AWS", "Azure", "Linux"],
  "AI/ML": ["Python", "TensorFlow", "ML"],
  "Data Science": ["Python", "SQL", "Power BI"],
  "UI/UX": ["Figma", "Wireframing", "Prototype"],
  Product: ["Agile", "Product Strategy", "Analytics"],
  QA: ["Selenium", "Manual Testing", "Bug Reporting"],
  Sales: ["CRM", "Communication", "Lead Generation"],
  Marketing: ["SEO", "Google Ads", "Social Media"],
  HR: ["Recruitment", "Screening", "Onboarding"],
  Finance: ["Excel", "Accounting", "Finance"],
  Internship: ["HTML", "CSS", "JavaScript"],
  Remote: ["Git", "Communication", "Remote Work"],
  "Full Stack": ["React", "Node.js", "MongoDB"],
};

const demoJobs = jobDomains.flatMap((cat, catIndex) =>
  titlesByCategory[cat].map((title, index) => ({
    id: `demo-${cat.replaceAll("/", "-").replaceAll(" ", "-")}-${index + 1}`,
    _id: `demo-${cat.replaceAll("/", "-").replaceAll(" ", "-")}-${index + 1}`,
    title,
    company: companies[(catIndex + index) % companies.length],
    category: cat,
    jobCategory: cat,
    jobType: cat === "Internship" ? "Internship" : cat === "Remote" ? "Remote" : "Full-time",
    type: cat === "Internship" ? "Internship" : cat === "Remote" ? "Remote" : "Full-time",
    workMode: cat === "Remote" ? "Remote" : index % 2 === 0 ? "Hybrid" : "On-site",
    experienceLevel: index === 0 ? "Fresher" : index === 1 ? "0-2 Years" : index === 2 ? "1-3 Years" : "2-4 Years",
    experience: index === 0 ? "Fresher" : index === 1 ? "0-2 Years" : index === 2 ? "1-3 Years" : "2-4 Years",
    location: cat === "Remote" ? "Remote" : locations[(catIndex + index) % locations.length],
    salary: salaries[index % salaries.length],
    skills: skillsByCategory[cat],
    image: images[index % images.length],
    companyBanner: images[index % images.length],
    logo: defaultLogo,
    companyLogo: defaultLogo,
    description: `${title} role in ${cat}. Work on real projects, improve your skills, and grow with a professional team.`,
    status: "Published",
  }))
);

const normalize = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

const Jobs = () => {
  const { openApplyModal, hasApplied } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "All");
  const [experience, setExperience] = useState(searchParams.get("experience") || "All");
  const [workMode, setWorkMode] = useState(searchParams.get("workMode") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "All");

  const mapJobForDisplay = (job) => ({
    ...job,
    _id: job._id || job.id,
    id: job.id || job._id,
    title: job.title || "Untitled Job",
    company: job.company || "Unknown Company",
    experience: job.experienceLevel || job.experience || "Fresher",
    type: job.jobType || job.type || "Full-time",
    jobType: job.jobType || job.type || "Full-time",
    workMode: job.workMode || "Hybrid",
    location: job.location || "Remote",
    salary: job.salary || "Negotiable",
    category: job.jobCategory || job.category || job.domain || "General",
    image: job.image || job.companyBanner || defaultImage,
    logo: job.companyLogo || job.logo || defaultLogo,
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "Professional job opportunity.",
  });

  const loadJobs = useCallback(() => {
    const publicJobs = jobService.getPublicJobs();
    const safeJobs = Array.isArray(publicJobs) && publicJobs.length > 0 ? publicJobs : demoJobs;
    setJobs(safeJobs.map(mapJobForDisplay));
  }, []);

  useEffect(() => {
    loadJobs();

    window.addEventListener("storage", loadJobs);
    window.addEventListener("jobs-updated", loadJobs);

    return () => {
      window.removeEventListener("storage", loadJobs);
      window.removeEventListener("jobs-updated", loadJobs);
    };
  }, [loadJobs]);

  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
    setJobType(searchParams.get("jobType") || "All");
    setExperience(searchParams.get("experience") || "All");
    setWorkMode(searchParams.get("workMode") || "All");
    setLocation(searchParams.get("location") || "All");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const syncParams = useCallback(
    (updates = {}) => {
      const next = { search, category, jobType, experience, workMode, location, ...updates };
      const params = new URLSearchParams();

      if (next.search?.trim()) params.set("search", next.search.trim());
      if (next.category !== "All") params.set("category", next.category);
      if (next.jobType !== "All") params.set("jobType", next.jobType);
      if (next.experience !== "All") params.set("experience", next.experience);
      if (next.workMode !== "All") params.set("workMode", next.workMode);
      if (next.location !== "All") params.set("location", next.location);

      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    },
    [search, category, jobType, experience, workMode, location, searchParams, setSearchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => syncParams({ search }), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const updateCategory = (value) => {
    setCategory(value);
    syncParams({ category: value });
  };

  const updateFilter = (key, value) => {
    if (key === "jobType") setJobType(value);
    if (key === "experience") setExperience(value);
    if (key === "workMode") setWorkMode(value);
    if (key === "location") setLocation(value);
    syncParams({ [key]: value });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobCat = normalize(job.category);
      const selectedCat = normalize(category);

      const matchesCategory = category === "All" || jobCat === selectedCat;

      const matchesSearch =
        !search ||
        normalize(job.title).includes(normalize(search)) ||
        normalize(job.company).includes(normalize(search)) ||
        normalize(job.location).includes(normalize(search)) ||
        normalize(job.category).includes(normalize(search));

      const matchesType = jobType === "All" || normalize(job.jobType) === normalize(jobType);
      const matchesExp = experience === "All" || normalize(job.experience) === normalize(experience);
      const matchesMode = workMode === "All" || normalize(job.workMode) === normalize(workMode);
      const matchesLocation = location === "All" || normalize(job.location) === normalize(location);

      return matchesCategory && matchesSearch && matchesType && matchesExp && matchesMode && matchesLocation;
    });
  }, [jobs, search, category, jobType, experience, workMode, location]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-(--bg)">
      <div className="absolute left-0 top-0 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-(--border) bg-(--surface) p-8 backdrop-blur-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <HiOutlineSparkles className="h-4 w-4" />
            AI Powered Jobs
          </div>

          <h1 className="mt-6 text-4xl font-black text-(--text) md:text-5xl">
            Find Your
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Dream Career
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-(--muted)">
            Explore modern jobs across frontend, backend, MERN, AI/ML, cloud,
            design, finance, HR, marketing and more.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-(--border) bg-(--surface) px-4 py-4 shadow-lg shadow-cyan-500/5">
            <HiOutlineMagnifyingGlass className="h-5 w-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by title, company, location or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-(--text) outline-none placeholder:text-(--muted)"
            />
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {Object.entries(filterOptions).map(([key, values]) => (
            <div key={key}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--muted)">
                {key === "jobType" ? "Job Type" : key}
              </p>
              <select
                value={{ jobType, experience, workMode, location }[key]}
                onChange={(e) => updateFilter(key, e.target.value)}
                className="hover-glow w-full rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none"
              >
                {values.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => updateCategory("All")}
            className={`hover-glow rounded-full px-5 py-2 text-sm font-semibold transition ${
              category === "All"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-(--surface) text-(--muted) hover:bg-white hover:text-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
            }`}
          >
            All
          </button>

          {jobDomains.map((item) => (
            <button
              key={item}
              onClick={() => updateCategory(item)}
              className={`hover-glow rounded-full px-5 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-(--surface) text-(--muted) hover:bg-white hover:text-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--text)">
              {category === "All" ? "All Jobs" : `${category} Jobs`}
            </h2>
            <p className="text-sm text-(--muted)">
              Showing {filteredJobs.length} job opportunities
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 md:flex">
            <HiOutlineBriefcase className="h-4 w-4" />
            Professional Listings
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-3xl border border-(--border) bg-(--surface) p-10 text-center"
          >
            <HiOutlineBuildingOffice2 className="mx-auto h-12 w-12 text-cyan-400" />
            <h3 className="mt-4 text-xl font-bold text-(--text)">No jobs found</h3>
            <p className="mt-2 text-(--muted)">
              Try another search keyword or select a different category.
            </p>
          </motion.div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id || job.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ delay: index * 0.02 }}
                  className="card-hover-glow group overflow-hidden rounded-4xl border border-(--border) bg-(--surface) backdrop-blur-2xl"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={job.image}
                      alt={job.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white">
                      {job.category}
                    </div>
                  </div>

                  <div className="min-w-0 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={job.logo} alt={job.company} className="h-10 w-10 rounded-xl bg-white p-1" />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-(--text)">{job.title}</h3>
                        <p className="truncate text-xs text-(--muted)">{job.company}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-(--muted)">
                      <div className="flex items-center gap-2">
                        <HiOutlineMapPin className="h-4 w-4 text-cyan-400" /> {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-400" /> {job.salary}
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="h-4 w-4 text-orange-400" /> {job.experience}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="hover-glow flex-1 rounded-xl bg-white/10 py-2 text-xs text-(--text) transition hover:bg-white hover:text-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => openApplyModal(job)}
                        className="hover-glow flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-2 text-xs font-semibold text-white"
                      >
                        {hasApplied(job._id || job.id) ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-white/10 bg-slate-900"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>

              <div className="relative h-56">
                <img src={selectedJob.image} alt={selectedJob.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img src={selectedJob.logo} alt={selectedJob.company} className="h-14 w-14 rounded-2xl bg-white p-2" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-slate-400">{selectedJob.company}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">Description</h3>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    {selectedJob.description}
                  </p>
                </div>

                <button
                  onClick={() => openApplyModal(selectedJob)}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white"
                >
                  {hasApplied(selectedJob._id || selectedJob.id) ? "Applied" : "Apply Job"}
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

export default Jobs;