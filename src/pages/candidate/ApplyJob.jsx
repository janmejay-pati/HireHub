import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import GlassCard from "../../components/common/GlassCard";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { jobService } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";
import { usePortal } from "../../context/PortalContext";
import { userService } from "../../services/user_service";

const ApplyJob = () => {
  const { jobId, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { submitApplication, hasApplied } = usePortal();

  const selectedJobId = jobId || id;

  const [job, setJob] = useState(null);
  const [recruiterDetails, setRecruiterDetails] = useState(null);
  const [matchingSkills, setMatchingSkills] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    resume: "",
    resumeFile: null,
    coverLetter: "",
    expectedSalary: "",
    experience: "",
    skills: "",
    portfolioLink: "",
    linkedIn: "",
    availability: "Immediately",
    terms: false,
  });

  useEffect(() => {
    const fromState = location.state || {};

    const resolvedJob =
      selectedJobId && selectedJobId !== "preview"
        ? jobService.getJobById(selectedJobId)
        : null;

    const fallbackJob = resolvedJob || {
      _id: fromState.jobId || fromState._id || selectedJobId || "preview-job",
      id: fromState.jobId || fromState.id || selectedJobId || "preview-job",

      title: fromState.jobTitle || fromState.title || "Custom Opportunity",
      company: fromState.company || "HireHub",

      logo: fromState.logo || fromState.companyLogo || "",
      companyLogo: fromState.companyLogo || fromState.logo || "",
      image: fromState.image || "",

      location: fromState.location || "Remote",
      salary: fromState.salary || "Competitive",

      description:
        fromState.description ||
        "Apply using the details below and we will connect you with the recruiter.",

      companyDescription:
        fromState.companyDescription ||
        `${fromState.company || "This company"} is hiring for this role.`,

      requirements: Array.isArray(fromState.requirements)
        ? fromState.requirements
        : [
            "Upload a valid resume.",
            "Fill all required candidate details.",
            "Provide correct skills and contact profile links.",
            "Accept the Terms & Privacy Policy before applying.",
          ],

      skills: Array.isArray(fromState.skills) ? fromState.skills : [],

      jobType: fromState.jobType || "Full-time",
      experienceLevel: fromState.experienceLevel || "Mid Level",
      jobCategory: fromState.jobCategory || fromState.category || "General",

      postedBy: fromState.postedBy || "recruiter-unknown",

      deadline:
        fromState.deadline ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setJob(fallbackJob);

    const candidate = user ? userService.getUserById(user.id) || user : null;
    const foundRecruiter =
      userService.getUserById(fallbackJob.postedBy) || null;

    const candidateSkills = Array.isArray(candidate?.skills)
      ? candidate.skills
      : String(candidate?.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

    const jobSkills = Array.isArray(fallbackJob.skills)
      ? fallbackJob.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];

    const companyLogo =
      fallbackJob.companyLogo ||
      fallbackJob.logo ||
      foundRecruiter?.companyLogo ||
      foundRecruiter?.logo ||
      foundRecruiter?.avatar ||
      "";

    setRecruiterDetails(foundRecruiter);

    setCompanyDetails({
      name: fallbackJob.company,
      logo: companyLogo,
      domain: fallbackJob.jobCategory || fallbackJob.jobType || "General",
      description:
        fallbackJob.companyDescription ||
        `${fallbackJob.company} is a trusted company hiring for modern engineering teams.`,
    });

    setMatchingSkills(
      jobSkills.filter((skill) => candidateSkills.includes(skill)).slice(0, 6)
    );

    if (user) {
      setFormData((prev) => ({
        ...prev,
        resume: candidate?.resume || prev.resume,
        expectedSalary: candidate?.expectedSalary || prev.expectedSalary,
        experience:
          candidate?.experience && candidate.experience.length > 0
            ? `${candidate.experience[0].title} at ${candidate.experience[0].company}`
            : prev.experience,
        skills: candidateSkills.length ? candidateSkills.join(", ") : prev.skills,
        linkedIn: candidate?.linkedIn || candidate?.website || prev.linkedIn,
        portfolioLink: candidate?.portfolioLink || prev.portfolioLink,
      }));
    }

    setLoading(false);
  }, [location.state, selectedJobId, user]);

  const recruiter = job?.postedBy ? userService.getUserById(job.postedBy) : null;

  const companyLogo =
    job?.companyLogo ||
    job?.logo ||
    companyDetails?.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      job?.company || companyDetails?.name || "Company"
    )}&background=0891b2&color=ffffff`;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        resume: file.name,
        resumeFile: file,
      }));
    }
  };

  const openPreview = (event) => {
    event.preventDefault();

    if (!formData.resumeFile) return;

    try {
      const url = URL.createObjectURL(formData.resumeFile);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Preview error", error);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!job) {
      toast.error("Job details are not available.");
      return;
    }

    if (!formData.resume && !formData.resumeFile) {
      toast.error("Please upload your resume before applying.");
      return;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms & Privacy Policy.");
      return;
    }

    if (hasApplied(job._id || job.id)) {
      toast.success("You already applied to this role.");
      navigate("/candidate/applications");
      return;
    }

    setSubmitting(true);

    try {
      const finalApplicationData = {
        ...formData,
        appliedAt: new Date().toISOString(),
        applicationStatus: "Submitted",
      };

      await submitApplication(job, finalApplicationData);

      toast.success("Application submitted successfully.");
      navigate("/candidate/applications");
    } catch (error) {
      toast.error(error.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <GlassCard className="mx-auto max-w-4xl p-6 text-center sm:p-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Job not found
        </h2>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          The role you selected is unavailable or has been removed.
        </p>
        <Button onClick={() => navigate("/candidate/jobs")}>
          Browse active roles
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 lg:space-y-8">
      <PageHeader
        title="Apply for Job"
        subtitle="Complete your application and submit it to the recruiter."
        icon={HiOutlineBriefcase}
        actions={
          <Button variant="secondary" onClick={() => navigate("/candidate/jobs")}>
            Back to Jobs
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:gap-8">
        <div className="space-y-6 lg:space-y-8">
          <GlassCard className="overflow-hidden p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-7"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-cyan-400/30 bg-white p-2 shadow-lg shadow-cyan-500/10 sm:h-20 sm:w-20">
                    <img
                      src={companyLogo}
                      alt={`${job.company} logo`}
                      className="h-full w-full rounded-2xl object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">
                      {job.jobType}
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                      {job.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400 sm:text-base">
                      {job.company} • {job.location}
                    </p>
                  </div>
                </div>

                <div className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 lg:w-auto lg:min-w-44">
                  <p className="font-semibold text-slate-100">Recruiter</p>
                  <p className="mt-1 truncate">
                    {recruiter?.name || recruiterDetails?.name || "Talent Team"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard icon={HiOutlineMapPin} label={job.location} />
                <InfoCard
                  icon={HiOutlineCurrencyDollar}
                  label={job.salary || "Competitive salary"}
                  iconClass="text-emerald-400"
                />
                <InfoCard
                  icon={HiOutlineClock}
                  label={new Date(job.deadline).toLocaleDateString()}
                  iconClass="text-blue-400"
                />
                <InfoCard
                  icon={HiOutlineSparkles}
                  label={job.experienceLevel || "Mid Level"}
                  iconClass="text-cyan-300"
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniStat
                  title="Domain"
                  value={
                    companyDetails?.domain ||
                    job.jobCategory ||
                    job.jobType ||
                    "General"
                  }
                />
                <MiniStat
                  title="Company"
                  value={companyDetails?.name || job.company}
                />
                <MiniStat
                  title="Recruiter"
                  value={
                    recruiterDetails?.name || recruiter?.name || "Hiring Team"
                  }
                />
              </div>

              <div className="mt-6 rounded-3xl border border-white/5 bg-slate-900/70 p-5">
                <h3 className="text-sm font-semibold text-white">
                  Company Details
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {companyDetails?.description}
                </p>
              </div>

              <div className="mt-6 rounded-3xl border border-white/5 bg-slate-900/70 p-5">
                <h3 className="text-sm font-semibold text-white">
                  Job Description
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {job.description}
                </p>
              </div>

              {(job.requirements || []).length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">
                    Requirements
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(job.requirements || []).slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded-3xl border border-white/5 bg-slate-900/80 px-4 py-4 text-sm text-slate-300"
                      >
                        <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(job.skills || []).length > 0 && (
                <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-500/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Required Skills
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(job.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-200 sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchingSkills.length > 0 && (
                <div className="mt-6 rounded-3xl border border-emerald-400/10 bg-emerald-500/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                    Your Matching Skills
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </GlassCard>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <GlassCard className="space-y-6 p-4 sm:p-6 lg:p-8">
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Candidate Information
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Fill the required details before applying.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Resume <span className="text-rose-400">*</span>
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFile}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 outline-none file:mr-3 file:rounded-full file:border-0 file:bg-cyan-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-200 hover:border-cyan-500/50"
                  />

                  {formData.resume && (
                    <p className="mt-2 truncate text-xs text-slate-400 sm:text-sm">
                      Selected: {formData.resume}
                    </p>
                  )}

                  {formData.resumeFile && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={openPreview}
                        className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 sm:text-sm"
                      >
                        Preview
                      </button>

                      <a
                        href={URL.createObjectURL(formData.resumeFile)}
                        download={formData.resume}
                        className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 sm:text-sm"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>

                <Field label="Expected Salary">
                  <Input
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    placeholder="e.g. ₹8L - ₹12L"
                  />
                </Field>

                <Field label="Total Experience">
                  <Input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2 years / Fresher"
                  />
                </Field>

                <Field label="LinkedIn Profile">
                  <Input
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Skills">
                    <Input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, JavaScript, Node.js"
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Portfolio URL">
                    <Input
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                      placeholder="https://portfolio.example.com"
                    />
                  </Field>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-6 p-4 sm:p-6 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      Cover Letter
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Tell the recruiter why you are the right fit.
                    </p>
                  </div>

                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={8}
                    className="w-full resize-none rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    placeholder="Write a short introduction for your application..."
                  />
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
                  <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 p-4">
                    <HiOutlineDocumentText className="h-6 w-6 shrink-0 text-cyan-400" />
                    <div>
                      <p className="text-sm text-slate-400">
                        Application Summary
                      </p>
                      <p className="font-semibold text-white">
                        Your application will be sent to recruiter.
                      </p>
                    </div>
                  </div>

                  <SummaryItem
                    title="Availability"
                    value={formData.availability}
                  />
                  <SummaryItem
                    title="Recruiter"
                    value={recruiter?.name || "Talent Team"}
                  />
                  <SummaryItem title="Status" value="Ready to submit" />

                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="font-semibold text-white">Verified Role</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <HiOutlineShieldCheck className="h-4 w-4 text-cyan-400" />
                      Trusted opportunity
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label
                  htmlFor="terms"
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="h-3.5 w-3.5 rounded border-slate-600 text-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />

                  <span>I agree to the Terms & Privacy Policy.</span>
                </label>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl py-3 text-sm font-semibold"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      Apply Now
                      <HiOutlineArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </GlassCard>
          </form>
        </div>

        <GlassCard className="h-fit space-y-6 p-4 sm:p-6 lg:sticky lg:top-24 lg:p-8">
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 ring-1 ring-cyan-400/20">
              <img
                src={companyLogo}
                alt={`${job.company} logo`}
                className="h-full w-full rounded-xl object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold text-white">
                {companyDetails?.name || job.company}
              </p>
              <p className="truncate text-sm text-slate-400">
                {companyDetails?.domain || "Hiring Company"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="font-semibold text-white">Company Details</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {companyDetails?.description}
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-400">
            <SideInfo
              title="Company"
              value={companyDetails?.name || job.company}
              icon={HiOutlineBuildingOffice2}
            />
            <SideInfo
              title="Domain"
              value={
                companyDetails?.domain ||
                job.jobCategory ||
                job.jobType ||
                "General"
              }
            />
            <SideInfo
              title="Hiring recruiter"
              value={recruiterDetails?.name || recruiter?.name || "Talent Team"}
            />
          </div>

          <div className="grid gap-3">
            {[
              "Resume required",
              "Candidate details required",
              "Recruiter review after apply",
              "Application visible in Applied Jobs",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-4 text-sm text-slate-300"
              >
                <HiOutlineChatBubbleLeftRight className="h-5 w-5 shrink-0 text-cyan-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                Resume Preview
              </h3>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 h-[75vh] overflow-hidden rounded-xl">
              <iframe
                src={previewUrl}
                className="h-full w-full rounded-lg"
                title="resume-preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, iconClass = "text-cyan-400" }) => (
  <div className="flex min-h-16 items-center gap-3 rounded-3xl border border-white/5 bg-slate-900/80 px-4 py-4 text-sm text-slate-300">
    <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
    <span className="truncate">{label}</span>
  </div>
);

const MiniStat = ({ title, value }) => (
  <div className="rounded-3xl border border-white/5 bg-slate-900/80 px-4 py-4 text-slate-300">
    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-xs">
      {title}
    </p>
    <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="mb-3 block text-sm font-semibold text-slate-300">
      {label}
    </label>
    {children}
  </div>
);

const SummaryItem = ({ title, value }) => (
  <div className="rounded-3xl bg-slate-900/80 p-4">
    <p className="font-semibold text-white">{title}</p>
    <p className="mt-1 text-sm text-slate-400">{value}</p>
  </div>
);

const SideInfo = ({ title, value, icon: Icon }) => (
  <div>
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
      {Icon && <Icon className="h-4 w-4" />}
      {title}
    </p>
    <p className="mt-2 truncate text-white">{value}</p>
  </div>
);

export default ApplyJob;