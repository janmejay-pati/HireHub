import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  HiOutlineChartBar,
  HiOutlinePlus,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCamera ,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineBolt,
} from "react-icons/hi2";

import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { applicationService } from "../../services/application_service";
import { interviewService } from "../../services/interview_service";
import { jobService } from "../../services/jobService";
import { recruiterService } from "../../services/recruiter_service";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [recruiterProfile, setRecruiterProfile] = useState(null);

  const profileImage =
    user?.profileImage ||
    user?.avatar ||
    recruiterProfile?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Recruiter"
    )}`;

  useEffect(() => {
    if (!user) return;

    const loadProfile = () => {
      setRecruiterProfile(recruiterService.getRecruiterProfile(user.id));
    };

    loadProfile();

    const handleStorageUpdate = () => {
      loadProfile();
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [user]);

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextProfile = recruiterService.saveRecruiterProfile(user.id, {
        profilePhoto: reader.result,
      });

      setRecruiterProfile(nextProfile);
      refreshUser();
      window.dispatchEvent(new Event('storage'));
      toast.success('Recruiter profile image updated successfully.');
    };
    reader.readAsDataURL(file);
  };

  const recentJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      postedDate: "2026-05-12",
      views: 234,
      applicants: 42,
      hired: 2,
      interviews: 6,
      status: "active",
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "Remote",
      postedDate: "2026-05-10",
      views: 189,
      applicants: 35,
      hired: 1,
      interviews: 4,
      status: "published",
    },
    {
      id: 3,
      title: "Product Manager",
      location: "New York, NY",
      postedDate: "2026-05-08",
      views: 156,
      applicants: 28,
      hired: 0,
      interviews: 3,
      status: "closed",
    },
  ];

  const [jobList, setJobList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadRecruiterData = () => {
      const jobs = jobService.getJobsByRecruiter(user.id);
      setJobList(jobs.length ? jobs : recentJobs);
      setApplicationList(applicationService.getApplicationsByRecruiter(user.id));
      setInterviewList(
        interviewService
          .getAllInterviews()
          .filter((interview) => interview.recruiterId === user.id)
      );
    };

    loadRecruiterData();

    const handleStorageUpdate = () => {
      loadRecruiterData();
    };

    const reload = () => handleStorageUpdate();
    window.addEventListener('storage', reload);
    window.addEventListener('jobs-updated', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('jobs-updated', reload);
    };
  }, [user?.id]);

  const jobsToDisplay = jobList.length > 0 ? jobList : recentJobs;

  const activeStatuses = ["active", "published"];

  const stats = {
    totalJobs: jobsToDisplay.length,

    activeJobs: jobsToDisplay.filter((job) =>
      activeStatuses.includes((job.status || "").toLowerCase())
    ).length,

    totalApplications: applicationList.length,

    hired: applicationList.filter((app) =>
      ["hired"].includes((app.status || "").toLowerCase())
    ).length,

    profileViews: jobsToDisplay.reduce((sum, job) => sum + (job.views || 0), 0),

    totalInterviews: interviewList.length,
  };

  const applicationStatus = [
    {
      name: "Applied",
      value: 120,
      color: "#3b82f6",
    },
    {
      name: "Reviewed",
      value: 85,
      color: "#f59e0b",
    },
    {
      name: "Shortlisted",
      value: 32,
      color: "#a855f7",
    },
    {
      name: "Interview",
      value: 8,
      color: "#06b6d4",
    },
    {
      name: "Hired",
      value: 2,
      color: "#10b981",
    },
  ];

  const applicationTrend = [
    { month: "Jan", applications: 15, hired: 1 },
    { month: "Feb", applications: 22, hired: 2 },
    { month: "Mar", applications: 28, hired: 3 },
    { month: "Apr", applications: 35, hired: 4 },
    { month: "May", applications: 42, hired: 3 },
    { month: "Jun", applications: 40, hired: 2 },
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: "Alex Johnson",
      position: "Senior Frontend Developer",
      status: "Interview",
      appliedDate: "2026-05-13",
      rating: 4.5,
    },
    {
      id: 2,
      candidateName: "Sarah Smith",
      position: "Backend Engineer",
      status: "Shortlisted",
      appliedDate: "2026-05-12",
      rating: 4.2,
    },
    {
      id: 3,
      candidateName: "Mike Chen",
      position: "UI/UX Designer",
      status: "Applied",
      appliedDate: "2026-05-11",
      rating: 3.8,
    },
  ];

  const topCandidates = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Frontend Developer",
      skills: ["React", "Node.js", "TypeScript"],
      matchScore: 94,
    },
    {
      id: 2,
      name: "Emily Davis",
      position: "Product Manager",
      skills: ["Leadership", "Analytics", "Strategy"],
      matchScore: 91,
    },
    {
      id: 3,
      name: "Sarah Smith",
      position: "Backend Engineer",
      skills: ["Python", "AWS", "Docker"],
      matchScore: 88,
    },
  ];

  const quickActions = [
    {
      label: "Post Job",
      icon: HiOutlinePlus,
      path: "/recruiter/post-job",
      color:
        "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      label: "Manage Jobs",
      icon: HiOutlineBriefcase,
      path: "/recruiter/manage-jobs",
      color:
        "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Applications",
      icon: HiOutlineDocumentText,
      path: "/recruiter/applicants",
      color:
        "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Interviews",
      icon: HiOutlineUsers,
      path: "/recruiter/interviews",
      color:
        "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
      case "published":
        return {
          bg: "bg-emerald-500/20",
          text: "text-emerald-400",
        };

      case "closed":
        return {
          bg: "bg-red-500/20",
          text: "text-red-400",
        };

      case "interview":
        return {
          bg: "bg-cyan-500/20",
          text: "text-cyan-400",
        };

      case "shortlisted":
        return {
          bg: "bg-violet-500/20",
          text: "text-violet-400",
        };

      default:
        return {
          bg: "bg-slate-500/20",
          text: "text-slate-400",
        };
    }
  };

  const getRating = (rating) => {
    return (
      "★".repeat(Math.floor(rating)) +
      (rating % 1 >= 0.5 ? "✪" : "")
    );
  };

  return (
    <motion.div
      className="min-h-screen space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HERO */}
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div
    variants={itemVariants}
    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl"
  >
    <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl"></div>

    <div className="relative z-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT CONTENT */}
        <div className="flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            <HiOutlineBolt className="h-4 w-4" />
            AI Hiring Insights
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Welcome Back, {user?.name || "Recruiter"} 👋
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage jobs, review applicants and streamline your hiring process.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/recruiter/post-job")}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
            >
              <HiOutlinePlus className="h-4 w-4" />
              Post Job
            </button>

            <button
              onClick={() => navigate("/recruiter/profile")}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              alt="Recruiter"
              className="h-16 w-16 rounded-2xl border-2 border-cyan-500 object-cover"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-white">
                {user?.name || "Recruiter"}
              </h3>

              <p className="truncate text-sm text-slate-400">
                {user?.email}
              </p>

              <p className="mt-1 text-xs text-cyan-400">
                {recruiterProfile?.companyName ||
                  "Recruitment Manager"}
              </p>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700">
            <HiOutlineCamera className="h-4 w-4" />
            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImage}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* COMPACT STATS */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Jobs",
            value: stats.activeJobs,
            icon: HiOutlineBriefcase,
            color: "text-cyan-400",
            bg: "bg-cyan-500/20",
          },
          {
            label: "Applications",
            value: stats.totalApplications,
            icon: HiOutlineDocumentText,
            color: "text-blue-400",
            bg: "bg-blue-500/20",
          },
          {
            label: "Interviews",
            value: stats.totalInterviews,
            icon: HiOutlineUsers,
            color: "text-violet-400",
            bg: "bg-violet-500/20",
          },
          {
            label: "Hired",
            value: stats.hired,
            icon: HiOutlineCheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-500/20",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  {item.label}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  {item.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}
              >
                <item.icon
                  className={`h-6 w-6 ${item.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
</motion.div>
      {/* QUICK ACTIONS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">
              Quick Actions
            </h2>

            <p className="text-slate-400">
              Manage recruitment faster
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                onClick={() =>
                  navigate(action.path)
                }
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className={`group overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br ${action.color} p-6 text-left`}
              >
                <div
                  className={`mb-5 inline-flex rounded-2xl bg-white/10 p-4 ${action.iconColor}`}
                >
                  <action.icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {action.label}
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  Access {action.label.toLowerCase()}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* CHARTS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* TREND */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Hiring Analytics
                  </h3>

                  <p className="text-sm text-slate-400">
                    Monthly hiring performance
                  </p>
                </div>

                <div className="flex items-center gap-2 text-emerald-400">
                  <HiOutlineChartBar className="h-5 w-5" />
                  +15%
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={applicationTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                    />

                    <YAxis stroke="#94a3b8" />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border:
                          "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "14px",
                      }}
                    />

                    <Legend />

                    <Bar
                      dataKey="applications"
                      fill="#06b6d4"
                      radius={[8, 8, 0, 0]}
                    />

                    <Bar
                      dataKey="hired"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* PIE */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">
                  Hiring Pipeline
                </h3>

                <p className="text-sm text-slate-400">
                  Candidate status overview
                </p>
              </div>

              <div className="h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={applicationStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={115}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                    >
                      {applicationStatus.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.color}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border:
                          "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "14px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* TOP CANDIDATES */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="h-6 w-6 text-yellow-400" />

                <h2 className="text-2xl font-bold text-white">
                  Top Candidates
                </h2>
              </div>

              <p className="mt-2 text-slate-400">
                Recommended profiles for your jobs
              </p>
            </div>

            <Button
              onClick={() =>
                navigate("/recruiter/applicants")
              }
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              View All
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {topCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-transparent p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                    <HiOutlineUsers className="h-7 w-7" />
                  </div>

                  <div className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm font-bold text-emerald-400">
                    {candidate.matchScore}% Match
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {candidate.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {candidate.position}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="mt-6 w-full rounded-xl bg-cyan-600 py-3 font-medium text-white transition hover:bg-cyan-700">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* RECENT JOBS + APPLICATIONS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* JOBS */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Recent Jobs
                </h3>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(
                      "/recruiter/manage-jobs"
                    )
                  }
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {jobsToDisplay.slice(0, 3).map((job) => {
                  const colors = getStatusColor(
                    job.status
                  );

                  return (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white">
                            {job.title}
                          </h4>

                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                            <HiOutlineBuildingOffice2 className="h-4 w-4" />
                            {job.location}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-cyan-400">
                              <HiOutlineEye className="h-4 w-4" />
                              {job.views} Views
                            </div>

                            <div className="text-blue-400">
                              {job.applicants ||
                                job.applications}{" "}
                              Applications
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}`}
                        >
                          {job.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* APPLICATIONS */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Recent Applications
                </h3>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(
                      "/recruiter/applicants"
                    )
                  }
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app) => {
                  const colors = getStatusColor(
                    app.status
                  );

                  return (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white">
                            {app.candidateName}
                          </h4>

                          <p className="mt-1 text-sm text-slate-400">
                            {app.position}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 text-slate-400">
                              <HiOutlineCalendarDays className="h-4 w-4" />
                              {new Date(
                                app.appliedDate
                              ).toLocaleDateString()}
                            </div>

                            <div className="font-medium text-yellow-400">
                              {getRating(app.rating)}{" "}
                              {app.rating}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}`}
                        >
                          {app.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecruiterDashboard;