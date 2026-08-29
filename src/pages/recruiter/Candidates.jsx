import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBellAlert,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineCurrencyDollar,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineStar,
} from "react-icons/hi2";

import { applicationService } from "../../services/application_service";
import { useAuth } from "../../context/AuthContext";
import { jobService } from "../../services/jobService";
import { notificationService } from "../../services/notification_service";
import { userService } from "../../services/user_service";

const buildCandidate = (application) => {
  const user = userService.getUserById(application.candidateId) || {};
  const job = jobService.getJobById(application.jobId) || {};

  const skills = Array.isArray(user.skills) && user.skills.length > 0
    ? user.skills
    : Array.isArray(application.skills) && application.skills.length > 0
      ? application.skills
      : ["Communication", "Collaboration", "Problem solving"];

  return {
    id: application.applicationId || application.id,
    name: user.name || application.candidateName || "Candidate",
    email: user.email || application.email || "",
    phone: user.phone || application.phone || "+91 9876543210",
    location: user.location || application.location || "Remote",
    experience: user.experience || application.experience || "2+ years",
    expectedSalary: application.expectedSalary || job.salary || "Negotiable",
    education: user.education || application.education || "Bachelor's degree",
    preferredRole: application.jobTitle || job.title || "Open Role",
    jobType: job.jobType || "Full Time",
    profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || application.candidateName || "Candidate")}&background=0f172a&color=fff`,
    resume: user.resume || application.resume || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills,
    bio: user.bio || application.coverLetter || "High-potential candidate with strong communication and execution skills.",
    status: application.status || "Applied",
    rating: application.rating || 4.8,
  };
};

const Candidates = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const loadCandidates = () => {
    const applications = user?.role === "recruiter"
      ? applicationService.getApplicationsByRecruiter(user.id)
      : applicationService.getAllApplications();

    const mapped = applications.map(buildCandidate);
    setCandidates(mapped);
  };

  const loadNotifications = () => {
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  };

  useEffect(() => {
    loadCandidates();
    loadNotifications();

    const handleStorage = () => {
      loadCandidates();
      loadNotifications();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const query = search.toLowerCase();
      const matchesSearch =
        candidate.name.toLowerCase().includes(query) ||
        candidate.preferredRole.toLowerCase().includes(query) ||
        candidate.skills.join(" ").toLowerCase().includes(query);
      const matchesFilter = filter === "all" || candidate.jobType === filter;
      return matchesSearch && matchesFilter;
    });
  }, [candidates, search, filter]);

  const shortlistedCount = candidates.filter((candidate) => candidate.status === "Shortlisted").length;
  const interviewCount = candidates.filter((candidate) => candidate.status === "Interview").length;
  const avgRating = candidates.length
    ? (candidates.reduce((sum, candidate) => sum + (candidate.rating || 4.5), 0) / candidates.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Talent Pipeline</p>
              <h1 className="mt-4 text-5xl font-black text-white">Top Candidates</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                Review vetted candidates from your live applications and keep the pipeline aligned with recruiter actions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                { label: "Approved", value: candidates.filter((candidate) => candidate.status === "Hired" || candidate.status === "Shortlisted").length },
                { label: "Interview", value: interviewCount },
                { label: "Shortlisted", value: shortlistedCount },
                { label: "Total", value: candidates.length },
                { label: "Avg rating", value: avgRating },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{item.value}</h2>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role, or skills..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-slate-400" />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="bg-transparent text-white outline-none"
              >
                <option value="all" className="bg-slate-900">All Types</option>
                <option value="Full Time" className="bg-slate-900">Full Time</option>
                <option value="Part Time" className="bg-slate-900">Part Time</option>
                <option value="Remote" className="bg-slate-900">Remote</option>
                <option value="Internship" className="bg-slate-900">Internship</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <HiOutlineBellAlert className="h-6 w-6 text-cyan-300" />
            <div>
              <h2 className="text-lg font-bold text-white">Recruiter notification feed</h2>
              <p className="text-sm text-slate-400">Latest updates from the broader hiring workflow.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {notifications.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                No notifications yet. Candidate actions elsewhere will surface here automatically.
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
              <h2 className="text-lg font-bold text-white">Talent health</h2>
              <p className="text-sm text-slate-400">A compact signal view for candidate quality and progression.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Top rated</p>
              <p className="mt-2 text-2xl font-bold text-white">{avgRating}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">In interview</p>
              <p className="mt-2 text-2xl font-bold text-white">{interviewCount}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Shortlisted</p>
              <p className="mt-2 text-2xl font-bold text-white">{shortlistedCount}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Active candidates</p>
              <p className="mt-2 text-2xl font-bold text-white">{candidates.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredCandidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition"
          >
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-violet-500/5 opacity-0 transition duration-500 group-hover:opacity-100"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <img src={candidate.profileImage} alt={candidate.name} className="h-24 w-24 rounded-[1.8rem] object-cover ring-2 ring-cyan-500/30" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
                      <p className="mt-1 text-sm text-cyan-300">{candidate.preferredRole}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${candidate.status === "Hired" ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"}`}>{candidate.status}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1"><HiOutlineMapPin className="h-4 w-4" />{candidate.location}</span>
                    <span className="inline-flex items-center gap-1 text-yellow-300"><HiOutlineStar className="h-4 w-4" />{candidate.rating}</span>
                  </div>
                </div>
              </div>

              <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-slate-300">{candidate.bio}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">{skill}</span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400"><HiOutlineBriefcase className="h-4 w-4" />Experience</div>
                  <p className="mt-2 font-semibold text-white">{candidate.experience}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400"><HiOutlineCurrencyDollar className="h-4 w-4" />Salary</div>
                  <p className="mt-2 font-semibold text-white">{candidate.expectedSalary}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-linear-to-r from-cyan-500/10 to-violet-500/10 p-4">
                <div>
                  <p className="text-xs text-slate-400">Preferred Job Type</p>
                  <h3 className="mt-1 font-semibold text-white">{candidate.jobType}</h3>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-cyan-300"><HiOutlineCheckBadge className="h-6 w-6" /></div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setSelectedCandidate(candidate)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                  <HiOutlineEye className="h-5 w-5" />View Profile
                </button>
                <a href={candidate.resume} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />Resume
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="w-full lg:w-[320px]">
                  <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
                    <img src={selectedCandidate.profileImage} alt={selectedCandidate.name} className="h-40 w-40 rounded-4xl object-cover mx-auto" />
                    <div className="mt-5 text-center">
                      <h2 className="text-3xl font-black text-white">{selectedCandidate.name}</h2>
                      <p className="mt-2 text-cyan-300">{selectedCandidate.preferredRole}</p>
                    </div>
                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex items-center gap-3 text-slate-300"><HiOutlineEnvelope className="h-5 w-5 text-cyan-300" />{selectedCandidate.email}</div>
                      <div className="flex items-center gap-3 text-slate-300"><HiOutlinePhone className="h-5 w-5 text-cyan-300" />{selectedCandidate.phone}</div>
                      <div className="flex items-center gap-3 text-slate-300"><HiOutlineMapPin className="h-5 w-5 text-cyan-300" />{selectedCandidate.location}</div>
                      <div className="flex items-center gap-3 text-slate-300"><HiOutlineAcademicCap className="h-5 w-5 text-cyan-300" />{selectedCandidate.education}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center gap-2">
                      <HiOutlineSparkles className="h-6 w-6 text-yellow-300" />
                      <h2 className="text-2xl font-bold text-white">Candidate Overview</h2>
                    </div>
                    <p className="mt-5 leading-relaxed text-slate-300">{selectedCandidate.bio}</p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Experience</p>
                        <h3 className="mt-2 text-xl font-bold text-white">{selectedCandidate.experience}</h3>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Preferred Job</p>
                        <h3 className="mt-2 text-xl font-bold text-white">{selectedCandidate.jobType}</h3>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-white">Skills</h3>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {selectedCandidate.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <a href={selectedCandidate.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600">
                        <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />Open Resume
                      </a>
                      <button onClick={() => setSelectedCandidate(null)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Candidates;
