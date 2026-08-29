import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { jobService } from "../../services/jobService";
import { userService } from "../../services/user_service";
import { applicationService } from "../../services/application_service";

const initialJobForm = {
  title: "",
  company: "",
  companyLogo: "",
  companyBanner: "",
  location: "",
  salary: "",
  jobType: "Full-time",
  workMode: "Remote",
  experienceLevel: "Mid",
  jobCategory: "General",
  responsibilities: "",
  requirements: "",
  benefits: "",
  deadline: "",
  hiringCount: 1,
  featured: false,
  urgent: false,
  postedBy: "",
  description: "",
};

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(initialJobForm);

  useEffect(() => {
    refresh();

    // Listen for storage changes
    const handleStorageChange = () => {
      refresh();
    };

    const reloadJobs = () => handleStorageChange();
    window.addEventListener("storage", reloadJobs);
    window.addEventListener("jobs-updated", reloadJobs);
    return () => {
      window.removeEventListener("storage", reloadJobs);
      window.removeEventListener("jobs-updated", reloadJobs);
    };
  }, []);

  const refresh = () => {
    setJobs(jobService.getAllJobs());
    setRecruiters(userService.getUsersByRole("recruiter"));
  };

  const jobStats = useMemo(() => jobService.getJobStats(), [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (statusFilter === "Pending") return job.status === "Pending";
        if (statusFilter === "Approved") return job.status === "Approved";
        if (statusFilter === "Rejected") return job.status === "Rejected";
        if (statusFilter === "Featured") return job.featured;
        if (statusFilter === "Urgent") return job.urgent;
        return true;
      })
      .filter((job) => {
        const query = search.toLowerCase();
        return (
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
        );
      });
  }, [jobs, search, statusFilter]);

  const openCreateJob = () => {
    setFormValues({
      ...initialJobForm,
      postedBy: recruiters[0]?.id || "recruiter-1",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
    setIsEditing(false);
    setFormOpen(true);
  };

  const openEditJob = (job) => {
    setSelectedJob(job);
    setFormValues({
      title: job.title || "",
      company: job.company || "",
      companyLogo: job.companyLogo || "",
      companyBanner: job.companyBanner || "",
      location: job.location || "",
      salary: job.salary || "",
      jobType: job.jobType || "Full-time",
      workMode: job.workMode || "Remote",
      experienceLevel: job.experienceLevel || "Mid",
      jobCategory: job.jobCategory || "General",
      responsibilities: job.responsibilities || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      deadline: job.deadline ? job.deadline.slice(0, 10) : new Date().toISOString().slice(0, 10),
      hiringCount: job.hiringCount || 1,
      featured: job.featured || false,
      urgent: job.urgent || false,
      postedBy: job.postedBy || recruiters[0]?.id || "recruiter-1",
      description: job.description || "",
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedJob(null);
    setFormValues(initialJobForm);
  };

  const handleSaveJob = () => {
    const payload = {
      ...formValues,
      hiringCount: Number(formValues.hiringCount),
      featured: Boolean(formValues.featured),
      urgent: Boolean(formValues.urgent),
      status: isEditing ? selectedJob.status : "Published",
      recruiterId: formValues.postedBy,
      createdByRole: "admin",
    };

    if (isEditing && selectedJob) {
      jobService.updateJob(selectedJob._id, payload);
    } else {
      jobService.createJob(payload);
    }

    refresh();
    closeForm();
  };

  const updateField = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = (jobId) => {
    jobService.approveJob(jobId);
    refresh();
  };

  const handleReject = (jobId) => {
    jobService.rejectJob(jobId);
    refresh();
  };

  const handleFeature = (jobId) => {
    jobService.toggleFeaturedJob(jobId);
    refresh();
  };

  const handleUrgent = (jobId) => {
    jobService.toggleUrgentJob(jobId);
    refresh();
  };

  const handleDelete = (jobId) => {
    jobService.deleteJob(jobId);
    refresh();
  };

  return (
    <section className="space-y-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-linear-to-r from-slate-900 to-slate-800 p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Jobs Moderation Panel</h1>
            <p className="mt-2 text-slate-400">Review, approve, feature, and manage every job posting on HireHub.</p>
          </div>
          <button
            onClick={openCreateJob}
            className="inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 font-semibold text-white shadow-2xl transition hover:brightness-110"
          >
            <HiOutlinePlus className="h-5 w-5" />
            Add Job
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total Jobs", value: jobStats.total, accent: "from-cyan-500 to-blue-500" },
          { title: "Pending", value: jobStats.pending, accent: "from-yellow-500 to-orange-500" },
          { title: "Approved", value: jobStats.active, accent: "from-emerald-500 to-green-500" },
          { title: "Featured", value: jobStats.featured, accent: "from-violet-500 to-purple-500" },
        ].map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{item.title}</p>
                <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.accent} text-white`}>
                <HiOutlineSparkles className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-lg">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-12 py-3 text-white outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {['All', 'Pending', 'Approved', 'Rejected', 'Featured', 'Urgent'].map((label) => (
            <button
              key={label}
              onClick={() => setStatusFilter(label)}
              className={`rounded-xl px-4 py-2 text-sm transition ${statusFilter === label ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{job.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{job.company} • {job.location}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : job.status === 'Rejected' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  {job.status || 'Pending'}
                </span>
                {job.featured && <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">Featured</span>}
                {job.urgent && <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-300">Urgent</span>}
              </div>
            </div>
            <p className="mt-4 text-slate-400 line-clamp-3">{job.description || 'No job description provided.'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">{job.jobType}</span>
              <span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">{job.experienceLevel}</span>
              <span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">{job.workMode}</span>
              <span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">{job.salary}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setSelectedJob(job)} className="rounded-xl bg-blue-500/20 px-4 py-2 text-blue-300 transition hover:bg-blue-500/30"><HiOutlineEye className="inline h-4 w-4" /> View</button>
              <button onClick={() => openEditJob(job)} className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-300 transition hover:bg-cyan-500/30"><HiOutlinePencilSquare className="inline h-4 w-4" /> Edit</button>
              <button onClick={() => handleApprove(job._id)} className="rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-300 transition hover:bg-emerald-500/30"><HiOutlineCheckCircle className="inline h-4 w-4" /> Approve</button>
              <button onClick={() => handleReject(job._id)} className="rounded-xl bg-yellow-500/20 px-4 py-2 text-yellow-300 transition hover:bg-yellow-500/30"><HiOutlineArrowPath className="inline h-4 w-4" /> Reject</button>
              <button onClick={() => handleFeature(job._id)} className="rounded-xl bg-violet-500/20 px-4 py-2 text-violet-300 transition hover:bg-violet-500/30"><HiOutlineStar className="inline h-4 w-4" /> Feature</button>
              <button onClick={() => handleUrgent(job._id)} className="rounded-xl bg-rose-500/20 px-4 py-2 text-rose-300 transition hover:bg-rose-500/30"><HiOutlineSparkles className="inline h-4 w-4" /> Urgent</button>
              <button onClick={() => handleDelete(job._id)} className="rounded-xl bg-red-500/20 px-4 py-2 text-red-300 transition hover:bg-red-500/30"><HiOutlineTrash className="inline h-4 w-4" /> Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl rounded-3xl bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedJob.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="rounded-2xl bg-white/5 px-4 py-3 text-slate-300 transition hover:bg-white/10"><HiOutlineXMark className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="mt-2 text-slate-200">{selectedJob.description}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Responsibilities</p>
                  <p className="mt-2 text-slate-200">{selectedJob.responsibilities || 'No responsibilities added.'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Requirements</p>
                  <p className="mt-2 text-slate-200">{selectedJob.requirements || 'No requirements added.'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">Benefits</p>
                  <p className="mt-2 text-slate-200">{selectedJob.benefits || 'No benefits added.'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl overflow-y-auto rounded-4xl bg-slate-950 p-8 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">{isEditing ? 'Edit Job' : 'Create Job'}</h2>
                <p className="text-slate-400">Fill in the job entry and publish it to the platform.</p>
              </div>
              <button onClick={closeForm} className="rounded-2xl bg-white/5 px-4 py-3 text-slate-300 transition hover:bg-white/10">Close</button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Job Title
                <input value={formValues.title} onChange={(e) => updateField('title', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Company Name
                <input value={formValues.company} onChange={(e) => updateField('company', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Location
                <input value={formValues.location} onChange={(e) => updateField('location', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Salary Range
                <input value={formValues.salary} onChange={(e) => updateField('salary', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Job Type
                <select value={formValues.jobType} onChange={(e) => updateField('jobType', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  {['Full-time','Part-time','Contract','Remote'].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Work Mode
                <select value={formValues.workMode} onChange={(e) => updateField('workMode', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  {['Remote','On-site','Hybrid'].map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Experience Level
                <select value={formValues.experienceLevel} onChange={(e) => updateField('experienceLevel', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  {['Junior','Mid','Senior','Lead'].map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Deadline
                <input type="date" value={formValues.deadline} onChange={(e) => updateField('deadline', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Hiring Count
                <input type="number" value={formValues.hiringCount} onChange={(e) => updateField('hiringCount', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" min="1" />
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Recruiter
                <select value={formValues.postedBy} onChange={(e) => updateField('postedBy', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  {recruiters.map((recruiter) => (
                    <option key={recruiter.id} value={recruiter.id}>{recruiter.name || recruiter.email}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Description
                <textarea value={formValues.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Responsibilities
                <textarea value={formValues.responsibilities} onChange={(e) => updateField('responsibilities', e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Requirements
                <textarea value={formValues.requirements} onChange={(e) => updateField('requirements', e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Benefits
                <textarea value={formValues.benefits} onChange={(e) => updateField('benefits', e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
                Skills (comma separated)
                <input value={formValues.skills || ""} onChange={(e) => updateField('skills', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
              </label>
              <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
                <label className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
                  <input type="checkbox" checked={formValues.featured} onChange={(e) => updateField('featured', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-500" /> Featured Job
                </label>
                <label className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
                  <input type="checkbox" checked={formValues.urgent} onChange={(e) => updateField('urgent', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-800 text-rose-500" /> Urgent Role
                </label>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={handleSaveJob} className="rounded-2xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:bg-cyan-600">Save Job</button>
              <button onClick={closeForm} className="rounded-2xl bg-white/5 px-6 py-4 text-slate-200 transition hover:bg-white/10">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default JobsManagement;
