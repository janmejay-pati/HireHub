import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineXMark,
  HiOutlinePaperClip,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineUserCircle,
  HiOutlineGlobeAlt,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { usePortal } from "../../context/PortalContext";

const initialForm = (user) => ({
  fullName: user?.name || "",
  email: user?.email || "",
  phone: "",
  resumeFile: null,
  resume: "",
  coverLetter: "",
  experience: "",
  skills: "",
  portfolio: "",
  github: "",
  linkedin: "",
  expectedSalary: "",
  availability: "Immediately",
});

const ApplyJobModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { submitApplication, closeApplyModal } = usePortal();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm(user));

  useEffect(() => {
    setFormData(initialForm(user));
    setStep(1);
  }, [user, isOpen]);

  const badgeText = useMemo(() => {
    return formData.availability === "Immediately" ? "Fast-track" : "Scheduled";
  }, [formData.availability]);

  if (!isOpen || !job) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      resumeFile: file,
      resume: file.name,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please complete your name, email, and phone fields.");
      return;
    }

    setLoading(true);

    try {
      await submitApplication(job, formData);
      setStep(2);
      onSuccess?.(formData);
    } catch (error) {
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData(initialForm(user));
    closeApplyModal();
    onClose?.();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="fixed left-1/2 top-1/2 z-50 w-full max-h-[92vh] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-4xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_40px_120px_rgba(14,165,233,0.25)] backdrop-blur-xl"
      >
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
            >
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                    <HiOutlineSparkles className="h-4 w-4" />
                    Premium Apply Flow
                  </div>
                  <h1 className="mt-4 text-3xl font-black text-white">
                    Apply for {job.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    {job.company} • {job.location} • {job.jobType}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <HiOutlineCalendarDays className="h-4 w-4" />
                    {badgeText}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-emerald-200">
                    <HiOutlineCurrencyDollar className="h-4 w-4" />
                    {job.salary}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Candidate Name
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="2 weeks">2 Weeks</option>
                      <option value="1 month">1 Month</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Resume Upload
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-cyan-400/40 bg-white/5 px-4 py-4 transition hover:border-cyan-300/70">
                      <HiOutlinePaperClip className="h-5 w-5 text-cyan-300" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {formData.resume || "Upload your resume"}
                        </p>
                        <p className="text-xs text-slate-400">PDF, DOC, DOCX</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Expected Salary
                    </label>
                    <input
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="₹ 12L - ₹15L"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell the recruiter why you are a great fit for this role."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Skills
                    </label>
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, JavaScript, UI Design"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Experience
                    </label>
                    <input
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="3 years"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Portfolio / GitHub
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <HiOutlineGlobeAlt className="h-4 w-4 text-cyan-200" />
                      <input
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="Portfolio"
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      GitHub
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <HiOutlineBriefcase className="h-4 w-4 text-cyan-200" />
                      <input
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="GitHub"
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      LinkedIn
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <HiOutlineUserCircle className="h-4 w-4 text-cyan-200" />
                      <input
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn"
                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="flex flex-col items-center justify-center px-4 py-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <HiOutlineCheckCircle className="h-10 w-10 text-emerald-400" />
              </motion.div>

              <h2 className="text-2xl font-black text-white">Application Submitted</h2>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                Your application for <span className="text-cyan-200">{job.title}</span> at <span className="text-cyan-200">{job.company}</span> is saved locally and ready for review.
              </p>

              <button
                onClick={handleClose}
                className="mt-8 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ApplyJobModal;