import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineBellAlert,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineFunnel,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineUserCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

import Button from "../../components/common/Button";
import GlassCard from "../../components/common/GlassCard";
import ResumeViewer from "../../components/common/ResumeViewer";
import { useAuth } from "../../context/AuthContext";
import { applicationService } from "../../services/application_service";
import { notificationService } from "../../services/notification_service";
import { userService } from "../../services/user_service";

const buildApplicant = (application) => {
  const candidate = userService.getUserById(application.candidateId) || {
    name: application.candidateName || "Candidate",
    email: application.email || "",
    phone: application.phone || "+91 9876543210",
    location: application.location || "Remote",
    bio: application.coverLetter || "Strong fit for the role and ready for the next step.",
    skills: application.skills || [],
    experience: application.experience || "2+ years",
    education: application.education || "Bachelor's degree",
    profileImage: "",
    availability: application.availability || "Available now",
  };

  const skillList = Array.isArray(candidate.skills) && candidate.skills.length > 0
    ? candidate.skills
    : Array.isArray(application.skills) && application.skills.length > 0
      ? application.skills
      : ["General", "Communication", "Problem solving"];

  return {
    id: application.applicationId || application.id,
    applicationId: application.applicationId || application.id,
    name: candidate.name || application.candidateName || "Candidate",
    email: candidate.email || application.email || "",
    phone: candidate.phone || application.phone || "+91 9876543210",
    location: candidate.location || application.location || "Remote",
    bio: candidate.bio || application.coverLetter || "Strong fit for the role and ready for the next step.",
    skills: skillList,
    experience: typeof candidate.experience === "string"
      ? candidate.experience
      : application.experience || "2+ years",
    education: typeof candidate.education === "string"
      ? candidate.education
      : application.education || "Bachelor's degree",
    appliedRole: application.jobTitle || "Open Role",
    company: application.company || "HireHub",
    status: application.status || "Applied",
    rating: application.rating || 4.7,
    profilePic: candidate.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || "Candidate")}&background=0f172a&color=fff`,
    resume: candidate.resume || application.resume || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    appliedDate: application.appliedDate || new Date().toISOString(),
    reviewed: Boolean(application.reviewed),
    matchScore: application.matchScore || 84 + Math.min(skillList.length, 12),
    availability: candidate.availability || application.availability || "Available now",
    summary: application.coverLetter || `A strong candidate for ${application.jobTitle || "the role"}.`,
    title: application.jobTitle || "Candidate",
    experienceList: Array.isArray(candidate.experience)
      ? candidate.experience
      : [{ title: application.experience || "Experience", company: application.company || "HireHub", duration: "Current" }],
    educationList: Array.isArray(candidate.education)
      ? candidate.education
      : [{ degree: application.education || "Bachelor's degree", school: application.company || "HireHub" }],
  };
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Hired":
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    case "Shortlisted":
      return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
    case "Interview":
      return "bg-violet-500/20 text-violet-200 border border-violet-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    default:
      return "bg-amber-500/20 text-amber-200 border border-amber-500/30";
  }
};

const Applicants = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const loadApplicants = () => {
    const allApps = user?.id && user?.role === 'recruiter'
      ? applicationService.getApplicationsByRecruiter(user.id)
      : applicationService.getAllApplications();
    const normalized = allApps.map(buildApplicant);
    setApplicants(normalized);
  };

  const loadNotifications = () => {
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  };

  useEffect(() => {
    loadApplicants();
    loadNotifications();
  }, [user?.id]);

  useEffect(() => {
    const handleStorage = () => {
      loadApplicants();
      loadNotifications();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase()) ||
        candidate.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || candidate.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, search, statusFilter]);

  const updateStatus = (id, nextStatus) => {
    applicationService.updateApplicationStatus(id, nextStatus, `Status updated to ${nextStatus}`);
    setApplicants((current) => current.map((app) => (app.id === id ? { ...app, status: nextStatus } : app)));
    setSelectedApplicant((current) => (current?.id === id ? { ...current, status: nextStatus } : current));

    const candidateName = applicants.find((app) => app.id === id)?.name || "Candidate";
    notificationService.createNotification({
      type: "pipeline",
      title: `Candidate moved to ${nextStatus}`,
      message: `${candidateName} is now in ${nextStatus} stage.`,
      relatedId: id,
      recipientId: user?.id || null,
    });
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }
    setNotifications(notificationService.getAllNotifications(user?.id || null));
    toast.success(`Candidate moved to ${nextStatus}.`);
  };

  const totalReviewed = applicants.filter((app) => app.reviewed).length;
  const shortlisted = applicants.filter((app) => app.status === "Shortlisted").length;
  const interviewReady = applicants.filter((app) => app.status === "Interview").length;
  const averageMatch = applicants.length
    ? Math.round(applicants.reduce((sum, app) => sum + (app.matchScore || 84), 0) / applicants.length)
    : 0;
  const conversionRate = applicants.length
    ? Math.round(((shortlisted + interviewReady + applicants.filter((app) => app.status === "Hired").length) / applicants.length) * 100)
    : 0;

  return (
    <div className="min-h-screen space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="h-6 w-6 text-cyan-400" />
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Recruitment Center</p>
            </div>
            <h1 className="mt-4 text-4xl font-black text-white">Applicant Pipeline</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Review live inbound applications, move top candidates through the funnel, and keep every update synced to the shared recruiter workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Total", value: applicants.length },
              { label: "Shortlisted", value: shortlisted },
              { label: "Reviewed", value: totalReviewed },
              { label: "Interview", value: interviewReady },
              { label: "Avg fit", value: `${averageMatch}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{stat.value}</h2>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-cyan-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
              <HiOutlineChartBar className="h-4 w-4" />
              Conversion rate: {conversionRate}%
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2">
              <HiOutlineCheckCircle className="h-4 w-4" />
              {applicants.filter((app) => app.status === "Hired").length} hired
            </span>
          </div>
        </div>
      </motion.div>

      <GlassCard className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicants, roles, or skills"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <HiOutlineFunnel className="h-5 w-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-white outline-none"
            >
              <option value="all" className="bg-slate-900">All stages</option>
              <option value="applied" className="bg-slate-900">Applied</option>
              <option value="reviewed" className="bg-slate-900">Reviewed</option>
              <option value="shortlisted" className="bg-slate-900">Shortlisted</option>
              <option value="interview" className="bg-slate-900">Interview</option>
              <option value="hired" className="bg-slate-900">Hired</option>
              <option value="rejected" className="bg-slate-900">Rejected</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <HiOutlineBellAlert className="h-6 w-6 text-cyan-300" />
              <div>
                <h2 className="text-lg font-bold text-white">Recruiter notification feed</h2>
                <p className="text-sm text-slate-400">Signals from the latest applicant actions.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {notifications.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  No notifications yet. Update a candidate or schedule an interview to start the feed.
                </p>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <HiOutlineChartBar className="h-6 w-6 text-cyan-300" />
              <div>
                <h2 className="text-lg font-bold text-white">Hiring intelligence</h2>
                <p className="text-sm text-slate-400">Fast-moving readiness indicators for the current pipeline.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Shortlist to interview</p>
                <p className="mt-2 text-2xl font-bold text-white">{interviewReady}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Qualified candidates</p>
                <p className="mt-2 text-2xl font-bold text-white">{shortlisted}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Avg fit score</p>
                <p className="mt-2 text-2xl font-bold text-white">{averageMatch}%</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Conversion rate</p>
                <p className="mt-2 text-2xl font-bold text-white">{conversionRate}%</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {filteredApplicants.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <HiOutlineDocumentText className="mx-auto h-12 w-12 text-slate-500" />
              <h2 className="mt-4 text-xl font-bold text-white">No applicants match the current filters</h2>
              <p className="mt-2 text-sm text-slate-400">Try a different search term or update the stage filter to review more candidates.</p>
            </GlassCard>
          ) : (
            filteredApplicants.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <GlassCard className="overflow-hidden border border-white/10 p-6 transition hover:border-cyan-500/40">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <img src={candidate.profilePic} alt={candidate.name} className="h-20 w-20 rounded-2xl object-cover" />
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(candidate.status)}`}>{candidate.status}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <span className="inline-flex items-center gap-1"><HiOutlineBriefcase className="h-4 w-4" />{candidate.appliedRole}</span>
                          <span className="inline-flex items-center gap-1"><HiOutlineMapPin className="h-4 w-4" />{candidate.location}</span>
                          <span className="inline-flex items-center gap-1"><HiOutlineStar className="h-4 w-4 text-yellow-300" />{candidate.rating.toFixed(1)}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => setSelectedApplicant(candidate)} className="bg-cyan-600 hover:bg-cyan-700">
                        <HiOutlineEye className="mr-2 h-5 w-5" />
                        View Profile
                      </Button>
                      <Button onClick={() => updateStatus(candidate.id, "Shortlisted")} className="bg-emerald-600 hover:bg-emerald-700">
                        <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                        Shortlist
                      </Button>
                      <Button onClick={() => updateStatus(candidate.id, "Rejected")} className="bg-red-600 hover:bg-red-700">
                        <HiOutlineXCircle className="mr-2 h-5 w-5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedApplicant ? (
            <motion.div
              key={selectedApplicant.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
            >
              <GlassCard className="sticky top-6 p-7">
                <div className="flex items-center gap-4">
                  <img src={selectedApplicant.profilePic} alt={selectedApplicant.name} className="h-24 w-24 rounded-[1.8rem] object-cover" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedApplicant.name}</h2>
                    <p className="mt-1 text-slate-400">{selectedApplicant.appliedRole}</p>
                    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(selectedApplicant.status)}`}>{selectedApplicant.status}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-cyan-300"><HiOutlineEnvelope className="h-5 w-5" />Email</div>
                    <p className="mt-2 text-sm text-slate-300">{selectedApplicant.email}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-cyan-300"><HiOutlinePhone className="h-5 w-5" />Phone</div>
                    <p className="mt-2 text-sm text-slate-300">{selectedApplicant.phone}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-cyan-300"><HiOutlineBriefcase className="h-5 w-5" />Experience</div>
                    <p className="mt-2 text-sm text-slate-300">{selectedApplicant.experience}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-cyan-300"><HiOutlineDocumentText className="h-5 w-5" />Summary</div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{selectedApplicant.bio}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-cyan-300"><HiOutlineClock className="h-5 w-5" />Availability</div>
                    <p className="mt-2 text-sm text-slate-300">{selectedApplicant.availability}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => { setResumeCandidate(selectedApplicant); setResumeOpen(true); }} className="bg-cyan-600 hover:bg-cyan-700">
                    <HiOutlineEye className="mr-2 h-5 w-5" />
                    View Resume
                  </Button>
                  <Button onClick={() => updateStatus(selectedApplicant.id, "Interview")} className="bg-violet-600 hover:bg-violet-700">
                    <HiOutlineClock className="mr-2 h-5 w-5" />
                    Schedule Interview
                  </Button>
                  <Button onClick={() => updateStatus(selectedApplicant.id, "Hired")} className="bg-emerald-600 hover:bg-emerald-700">
                    <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                    Mark Hired
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="flex min-h-[400px] items-center justify-center p-10">
              <div className="text-center">
                <HiOutlineUserCircle className="mx-auto h-20 w-20 text-slate-500" />
                <h2 className="mt-5 text-2xl font-bold text-white">Select an applicant</h2>
                <p className="mt-2 text-slate-400">Choose a candidate card to inspect full profile details and manage the next hiring step.</p>
              </div>
            </GlassCard>
          )}
        </AnimatePresence>
      </div>

      <ResumeViewer
        candidate={resumeCandidate}
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        onMarkReviewed={() => {
          if (!resumeCandidate) {
            return;
          }

          setApplicants((current) => current.map((app) => (app.id === resumeCandidate.id ? { ...app, reviewed: true } : app)));
          setSelectedApplicant((current) => (current?.id === resumeCandidate.id ? { ...current, reviewed: true } : current));
        }}
        reviewed={resumeCandidate?.reviewed || false}
      />
    </div>
  );
};

export default Applicants;
