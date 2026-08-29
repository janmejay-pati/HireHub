import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlinePlus,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineArrowRight
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { jobService } from "../../services/jobService";
import { notificationService } from "../../services/notification_service";

import PageHeader from "../../components/common/PageHeader";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const PostJob = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobCategory: "",
    location: "",
    locationType: "on-site",
    description: "",
    responsibilities: "",
    requirements: "",
    salary: "",
    salaryRange: "negotiable",
    experienceLevel: "mid-level",
    jobType: "full-time",
    skills: [],
    skillInput: "",
    benefits: [],
    benefitInput: ""
  });

  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setSavedJobs([]);
      return;
    }

    const loadSavedJobs = () => {
      setSavedJobs(jobService.getJobsByRecruiter(user.id));
    };

    loadSavedJobs();

    const reload = () => loadSavedJobs();
    window.addEventListener("storage", reload);
    window.addEventListener("jobs-updated", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("jobs-updated", reload);
    };
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // =========================
  // Skills
  // =========================

  const addSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput],
        skillInput: ""
      });
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  // =========================
  // Benefits
  // =========================

  const addBenefit = () => {
    if (formData.benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, formData.benefitInput],
        benefitInput: ""
      });
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    });
  };

  // =========================
  // Navigation
  // =========================

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // =========================
  // Publish Job
  // =========================

  const handlePublish = () => {
    if (!user?.id) {
      toast.error("Sign in as a recruiter to publish jobs.");
      return;
    }

    const newJob = jobService.createJob({
      ...formData,
      title: formData.jobTitle || formData.title,
      postedBy: user.id,
      recruiterId: user.id,
      createdByRole: "recruiter",
      company: user.company || user.companyName || user.employer || "HireHub",
      companyLogo: user.profileImage || "",
      companyBanner: user.banner || "",
      status: "Published",
      workMode: formData.locationType || "Remote",
      jobCategory: formData.jobCategory || "General",
      jobType: formData.jobType || "Full-time",
      type: formData.jobType || "Full-time",
      experienceLevel: formData.experienceLevel || "Mid",
      hiringCount: 1,
    });

    const recruiterJobs = jobService.getJobsByRecruiter(user.id);
    setSavedJobs(recruiterJobs);
    try {
      notificationService.createNotification({
        type: 'job',
        title: 'Job posted',
        message: `${newJob.jobTitle || newJob.title} at ${newJob.company} is now live`,
        relatedId: newJob._id
      });
    } catch (e) {
      // ignore
    }

    toast.success("Job posted successfully!");
    resetForm();
  };

  // =========================
  // Save Draft
  // =========================

  const saveDraft = () => {
    if (!user?.id) {
      toast.error("Sign in as a recruiter to save drafts.");
      return;
    }

    jobService.createJob({
      ...formData,
      title: formData.jobTitle || formData.title,
      postedBy: user.id,
      recruiterId: user.id,
      createdByRole: "recruiter",
      company: user.company || user.companyName || user.employer || "HireHub",
      companyLogo: user.profileImage || "",
      companyBanner: user.banner || "",
      status: "draft",
      workMode: formData.locationType || "Remote",
      jobCategory: formData.jobCategory || "General",
      jobType: formData.jobType || "Full-time",
      type: formData.jobType || "Full-time",
      experienceLevel: formData.experienceLevel || "Mid",
      hiringCount: 1,
    });

    const recruiterJobs = jobService.getJobsByRecruiter(user.id);
    setSavedJobs(recruiterJobs);
    try {
      notificationService.createNotification({
        type: 'job-draft',
        title: 'Draft saved',
        message: `${formData.jobTitle || 'Draft job'} saved as draft`,
      });
    } catch (e) {}

    toast.success("Draft saved successfully.");
  };

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      jobCategory: "",
      location: "",
      locationType: "on-site",
      description: "",
      responsibilities: "",
      requirements: "",
      salary: "",
      salaryRange: "negotiable",
      experienceLevel: "mid-level",
      jobType: "full-time",
      skills: [],
      skillInput: "",
      benefits: [],
      benefitInput: ""
    });

    setCurrentStep(1);
  };

  // =========================
  // Step Validation
  // =========================

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.jobTitle &&
          formData.jobCategory &&
          formData.location
        );

      case 2:
        return (
          formData.description &&
          formData.responsibilities &&
          formData.requirements
        );

      case 3:
        return (
          formData.salary &&
          formData.jobType &&
          formData.experienceLevel
        );

      case 4:
        return formData.skills.length > 0;

      case 5:
        return true;

      default:
        return false;
    }
  };

  const steps = [
    {
      number: 1,
      label: "Job Basics",
      icon: HiOutlineBriefcase
    },
    {
      number: 2,
      label: "Description",
      icon: HiOutlineDocumentText
    },
    {
      number: 3,
      label: "Compensation",
      icon: HiOutlineCurrencyDollar
    },
    {
      number: 4,
      label: "Skills",
      icon: HiOutlineTag
    },
    {
      number: 5,
      label: "Publish",
      icon: HiOutlineCheckCircle
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Post New Job"
        subtitle="Create and publish a professional job listing"
        icon={HiOutlinePlus}
      />

      {/* Stepper */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;

            const active = currentStep === step.number;
            const completed = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex items-center flex-1"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all
                    ${
                      active
                        ? "bg-cyan-500 text-white"
                        : completed
                        ? "bg-green-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p
                    className={`mt-2 text-xs font-medium
                    ${
                      active
                        ? "text-cyan-400"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full
                    ${
                      completed
                        ? "bg-green-500"
                        : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <GlassCard className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Job Basics
                  </h2>

                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Job Title
                    </label>

                    <Input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Senior React Developer"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Category
                    </label>

                    <select
                      name="jobCategory"
                      value={formData.jobCategory}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                    >
                      <option value="">Select</option>
                      <option value="engineering">
                        Engineering
                      </option>
                      <option value="design">
                        Design
                      </option>
                      <option value="marketing">
                        Marketing
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Location
                    </label>

                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Bhubaneswar, Odisha"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-3">
                      Work Type
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      {["on-site", "remote", "hybrid"].map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                locationType: type
                              })
                            }
                            className={`py-3 rounded-xl capitalize border
                            ${
                              formData.locationType === type
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                                : "bg-slate-800/50 border-slate-700 text-slate-400"
                            }`}
                          >
                            {type}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <GlassCard className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Job Description
                  </h2>

                  <textarea
                    name="description"
                    rows={5}
                    placeholder="Describe the role..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                  />

                  <textarea
                    name="responsibilities"
                    rows={4}
                    placeholder="Responsibilities..."
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                  />

                  <textarea
                    name="requirements"
                    rows={4}
                    placeholder="Requirements..."
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                  />
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <GlassCard className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Compensation
                  </h2>

                  <Input
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="$80,000 - $120,000"
                  />

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                  >
                    <option value="full-time">
                      Full Time
                    </option>
                    <option value="part-time">
                      Part Time
                    </option>
                    <option value="contract">
                      Contract
                    </option>
                  </select>

                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white"
                  >
                    <option value="entry">
                      Entry Level
                    </option>
                    <option value="mid-level">
                      Mid Level
                    </option>
                    <option value="senior">
                      Senior
                    </option>
                  </select>
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="space-y-6">

                  {/* Skills */}
                  <GlassCard className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Skills
                    </h2>

                    <div className="flex gap-2">
                      <Input
                        name="skillInput"
                        value={formData.skillInput}
                        onChange={handleInputChange}
                        placeholder="React"
                      />

                      <Button
                        variant="secondary"
                        onClick={addSkill}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center gap-2"
                        >
                          {skill}

                          <button
                            onClick={() =>
                              removeSkill(index)
                            }
                          >
                            <HiOutlineXMark />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Benefits */}
                  <GlassCard className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Benefits
                    </h2>

                    <div className="flex gap-2">
                      <Input
                        name="benefitInput"
                        value={formData.benefitInput}
                        onChange={handleInputChange}
                        placeholder="Health Insurance"
                      />

                      <Button
                        variant="secondary"
                        onClick={addBenefit}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {formData.benefits.map(
                        (benefit, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 flex items-center gap-2"
                          >
                            {benefit}

                            <button
                              onClick={() =>
                                removeBenefit(index)
                              }
                            >
                              <HiOutlineXMark />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Preview Job
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {formData.jobTitle}
                      </h3>

                      <p className="text-cyan-400 mt-2">
                        {formData.location}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Description
                      </h4>

                      <p className="text-slate-300">
                        {formData.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Skills
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Salary
                      </h4>

                      <p className="text-slate-300">
                        {formData.salary}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <GlassCard className="p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">
              Job Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-400">Title</p>
                <p className="text-white">
                  {formData.jobTitle || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Location</p>
                <p className="text-white">
                  {formData.location || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Salary</p>
                <p className="text-white">
                  {formData.salary || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Skills</p>
                <p className="text-white">
                  {formData.skills.length} Added
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="secondary"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex-1"
              >
                <HiOutlineArrowLeft className="h-4 w-4" />
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className="flex-1"
                >
                  <HiOutlineArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Publish
                </Button>
              )}
            </div>

            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={saveDraft}
            >
              Save Draft
            </Button>
          </GlassCard>

          {/* Posted Jobs */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Recently Posted Jobs
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {savedJobs.length > 0 ? (
                savedJobs
                  .slice()
                  .reverse()
                  .map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-700"
                    >
                      <h4 className="text-white font-medium">
                        {job.jobTitle}
                      </h4>

                      <p className="text-sm text-cyan-400 mt-1">
                        {job.location}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-slate-400 capitalize">
                          {job.jobType}
                        </span>

                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                          Published
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No jobs posted yet
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PostJob;