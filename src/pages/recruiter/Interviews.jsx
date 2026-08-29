import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineBellAlert,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";

import { applicationService } from "../../services/application_service";
import { interviewService } from "../../services/interview_service";
import { notificationService } from "../../services/notification_service";
import { userService } from "../../services/user_service";
import ScheduleInterviewModal from "../../components/recruiter/ScheduleInterviewModal";

const domainQuestions = {
  Frontend: [
    "Explain React Virtual DOM.",
    "Difference between useEffect and useMemo?",
    "What is Tailwind CSS?",
    "Explain component lifecycle.",
  ],
  Backend: [
    "Explain REST API architecture.",
    "What is JWT authentication?",
    "Difference between SQL and NoSQL?",
    "Explain middleware in Node.js.",
  ],
  Fullstack: [
    "Explain MERN stack architecture.",
    "How do you optimize full-stack applications?",
    "Explain authentication flow.",
  ],
  UIUX: [
    "Explain design systems.",
    "What is user-centered design?",
    "Difference between UX and UI?",
  ],
  DevOps: [
    "What is Docker?",
    "Explain CI/CD pipeline.",
    "What is Kubernetes?",
  ],
};

const buildInterviewCandidate = (application) => {
  const candidate = userService.getUserById(application.candidateId) || {
    name: application.candidateName || "Candidate",
    email: application.email || "",
    phone: application.phone || "+91 9876543210",
    location: application.location || "Remote",
    profileImage: "",
  };

  return {
    id: application.applicationId || application.id,
    candidateName: candidate.name || application.candidateName || "Candidate",
    email: candidate.email || application.email || "",
    phone: candidate.phone || application.phone || "+91 9876543210",
    location: candidate.location || application.location || "Remote",
    role: application.jobTitle || "Open Role",
    company: application.company || "HireHub",
    domain: application.domain || (application.jobTitle?.toLowerCase().includes("design") ? "UIUX" : application.jobTitle?.toLowerCase().includes("backend") ? "Backend" : application.jobTitle?.toLowerCase().includes("devops") ? "DevOps" : application.jobTitle?.toLowerCase().includes("frontend") ? "Frontend" : "Fullstack"),
    experience: application.experience || "2+ years",
    skills: application.skills || ["Communication", "Problem solving"],
    status: application.status || "Applied",
    resume: candidate.resume || application.resume || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    profileImage: candidate.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || "Candidate")}&background=0f172a&color=fff`,
  };
};

const Interviews = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState(null);

  const refreshPipeline = () => {
    const applicationsToLoad = user?.id && user?.role === 'recruiter'
      ? applicationService.getApplicationsByRecruiter(user.id)
      : applicationService.getAllApplications();
    setApplications(applicationsToLoad.map(buildInterviewCandidate));
    setInterviews(interviewService.getAllInterviews());
  };

  const loadNotifications = () => {
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  };

  useEffect(() => {
    refreshPipeline();
    loadNotifications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      return (
        application.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        application.role.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [applications, search]);

  const updateApplicationStatus = (id, status) => {
    applicationService.updateApplicationStatus(id, status, `Status updated to ${status}`);
    setApplications((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelectedCandidate((current) => current?.id === id ? { ...current, status } : current);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }
    toast.success(`Candidate moved to ${status}.`);
  };

  const shortlistedCount = applications.filter((application) => application.status === "Shortlisted").length;
  const interviewCount = interviews.filter((interview) => interview.status === "Scheduled").length;
  const upcomingInterviews = interviews.filter((interview) => new Date(interview.interviewDate) >= new Date()).length;
  const completionRate = interviews.length
    ? Math.round((interviews.filter((interview) => interview.status === "Completed").length / interviews.length) * 100)
    : 0;

  const scheduleInterview = (candidate) => {
    const interview = interviewService.createInterview({
      candidateId: candidate.id,
      candidateName: candidate.candidateName,
      role: candidate.role,
      company: candidate.company,
      domain: candidate.domain,
      interviewDate: new Date().toISOString(),
      mode: "Video",
      questions: domainQuestions[candidate.domain] || [],
      status: "Scheduled",
      recruiterId: user?.id || null,
      applicationId: candidate.id,
    });

    updateApplicationStatus(candidate.id, "Interview");
    setInterviews(interviewService.getAllInterviews());
    setSelectedCandidate({ ...candidate, status: "Interview" });
    notificationService.createNotification({
      type: "interview",
      title: `Interview scheduled for ${candidate.candidateName}`,
      message: `${candidate.candidateName} has been scheduled for a ${candidate.domain} interview.`,
      relatedId: interview.id,
      recipientId: user?.id || null,
    });
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }
    setNotifications(notificationService.getAllNotifications(user?.id || null));
    toast.success(`Interview scheduled for ${candidate.candidateName}.`);
  };

  const openScheduleModal = (candidate) => {
    setCandidateToSchedule(candidate);
    setScheduleOpen(true);
  };

  const handleScheduled = (interview) => {
    setInterviews(interviewService.getAllInterviews());
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="h-6 w-6 text-cyan-400" />
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Interview Center</p>
              </div>

              <h1 className="mt-4 text-4xl font-black text-white">Recruiter Interview Dashboard</h1>

              <p className="mt-4 max-w-3xl text-slate-300">
                Review applicants, schedule interviews, assign domain-based questions, and keep the hiring pipeline moving.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                { label: "Applications", value: applications.length },
                { label: "Interviews", value: interviews.length },
                { label: "Shortlisted", value: shortlistedCount },
                { label: "Upcoming", value: upcomingInterviews },
                { label: "Completion", value: `${completionRate}%` },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{item.value}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates or roles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-white outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <HiOutlineBellAlert className="h-6 w-6 text-cyan-300" />
              <div>
                <h2 className="text-lg font-bold text-white">Interview notifications</h2>
                <p className="text-sm text-slate-400">Latest recruiter actions and scheduled touchpoints.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {notifications.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  No notifications yet. Schedule an interview to populate the feed.
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
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <HiOutlineChartBar className="h-6 w-6 text-cyan-300" />
              <div>
                <h2 className="text-lg font-bold text-white">Pipeline readout</h2>
                <p className="text-sm text-slate-400">Closing the loop between screening and interviews.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Scheduled interviews</p>
                <p className="mt-2 text-2xl font-bold text-white">{interviewCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Upcoming sessions</p>
                <p className="mt-2 text-2xl font-bold text-white">{upcomingInterviews}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Shortlisted candidates</p>
                <p className="mt-2 text-2xl font-bold text-white">{shortlistedCount}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Completion rate</p>
                <p className="mt-2 text-2xl font-bold text-white">{completionRate}%</p>
              </div>
            </div>
          </div>

          {filteredApplications.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <img src={candidate.profileImage} alt={candidate.candidateName} className="h-20 w-20 rounded-3xl object-cover" />

                  <div>
                    <h2 className="text-2xl font-bold text-white">{candidate.candidateName}</h2>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-1"><HiOutlineBriefcase className="h-4 w-4" />{candidate.role}</span>
                      <span className="inline-flex items-center gap-1"><HiOutlineMapPin className="h-4 w-4" />{candidate.location}</span>
                      <span className="inline-flex items-center gap-1"><HiOutlineClock className="h-4 w-4" />{candidate.experience}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setSelectedCandidate(candidate)} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">View Profile</button>
                  <button onClick={() => updateApplicationStatus(candidate.id, "Shortlisted")} className="rounded-2xl bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30">Shortlist</button>
                  <button onClick={() => { setCandidateToSchedule(candidate); setScheduleOpen(true); }} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">Schedule</button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current Status</p>
                  <p className="mt-2 text-lg font-bold text-white">{candidate.status}</p>
                </div>
                <div className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300">{candidate.domain}</div>
              </div>
            </motion.div>
          ))}

          {scheduleOpen && (
            <ScheduleInterviewModal
              open={scheduleOpen}
              onClose={() => setScheduleOpen(false)}
              candidate={candidateToSchedule}
              applicationId={candidateToSchedule?.id}
              recruiterId={user?.id}
              onScheduled={(i) => { setScheduleOpen(false); setInterviews(interviewService.getAllInterviews()); setNotifications(notificationService.getAllNotifications(user?.id || null)); }}
            />
          )}
        </div>

        <div className="space-y-6">
          {selectedCandidate ? (
            <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <img src={selectedCandidate.profileImage} alt={selectedCandidate.candidateName} className="h-20 w-20 rounded-3xl object-cover" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCandidate.candidateName}</h2>
                  <p className="text-slate-400">{selectedCandidate.role}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300"><HiOutlineEnvelope className="h-5 w-5 text-cyan-400" />{selectedCandidate.email}</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300"><HiOutlinePhone className="h-5 w-5 text-cyan-400" />{selectedCandidate.phone}</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300"><HiOutlineBriefcase className="h-5 w-5 text-cyan-400" />Applied For: {selectedCandidate.role}</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-slate-300"><HiOutlineClipboardDocumentCheck className="h-5 w-5 text-cyan-400" />Domain: {selectedCandidate.domain}</div>
                </div>
                <a href={selectedCandidate.resume} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-semibold text-white transition hover:bg-cyan-600">
                  <HiOutlineDocumentText className="h-5 w-5" />View Resume
                </a>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <HiOutlineStar className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Suggested Interview Questions</h3>
                </div>
                <div className="space-y-3">
                  {(domainQuestions[selectedCandidate.domain] || []).map((question, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{question}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl text-slate-300">Select a candidate to inspect profile details and prepare the interview.</div>
          )}

          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <HiOutlineCalendarDays className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Scheduled Interviews</h2>
            </div>

            <div className="mt-5 space-y-4">
              {interviews.length === 0 ? (
                <p className="text-sm text-slate-400">No interviews scheduled yet.</p>
              ) : (
                interviews.map((interview) => (
                  <div key={interview.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{interview.candidateName}</h3>
                        <p className="mt-1 text-sm text-slate-400">{interview.role}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">{interview.status}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                      <HiOutlineVideoCamera className="h-4 w-4" />
                      {new Date(interview.interviewDate).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interviews;
