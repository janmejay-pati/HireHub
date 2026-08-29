import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import {
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineEye,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const Analytics = () => {
  const overviewStats = [
    {
      title: "Profile Views",
      value: "18.2K",
      growth: "+12.8%",
      icon: HiOutlineEye,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Applications",
      value: "4,860",
      growth: "+18.2%",
      icon: HiOutlineUsers,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Jobs Posted",
      value: "124",
      growth: "+6.4%",
      icon: HiOutlineBriefcase,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Successful Hires",
      value: "82",
      growth: "+21.7%",
      icon: HiOutlineCheckBadge,
      color: "from-orange-500 to-amber-600",
    },
  ];

  const hiringTrend = [
    { month: "Jan", applications: 320, hired: 24 },
    { month: "Feb", applications: 410, hired: 31 },
    { month: "Mar", applications: 520, hired: 38 },
    { month: "Apr", applications: 680, hired: 52 },
    { month: "May", applications: 740, hired: 61 },
    { month: "Jun", applications: 820, hired: 74 },
  ];

  const jobPerformance = [
    { role: "Frontend", applicants: 220 },
    { role: "Backend", applicants: 180 },
    { role: "UI/UX", applicants: 120 },
    { role: "AI/ML", applicants: 160 },
    { role: "DevOps", applicants: 90 },
  ];

  const candidatePipeline = [
    { name: "Applied", value: 420, color: "#06b6d4" },
    { name: "Reviewed", value: 260, color: "#8b5cf6" },
    { name: "Interview", value: 120, color: "#10b981" },
    { name: "Hired", value: 48, color: "#f59e0b" },
  ];

  const topPerformingJobs = [
    {
      title: "Senior Frontend Developer",
      applicants: 182,
      interviews: 36,
      hired: 8,
    },
    {
      title: "Backend Engineer",
      applicants: 146,
      interviews: 28,
      hired: 5,
    },
    {
      title: "AI Engineer",
      applicants: 124,
      interviews: 24,
      hired: 4,
    },
  ];

  return (
    <motion.section
      className="min-h-screen space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        {/* Glow */}
        <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="h-6 w-6 text-cyan-400" />
              <span className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Recruiter Insights
              </span>
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-tight text-white">
              Analytics Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Track candidate engagement, hiring conversion, interview
              performance, and recruitment growth in real time.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/20 p-4 text-cyan-400">
                <HiOutlineArrowTrendingUp className="h-8 w-8" />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Hiring Growth This Month
                </p>
                <h2 className="mt-1 text-4xl font-black text-white">
                  +28.4%
                </h2>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.title}</p>

                  <h2 className="mt-3 text-4xl font-black text-white">
                    {item.value}
                  </h2>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                    <HiOutlineArrowTrendingUp className="h-4 w-4" />
                    {item.growth}
                  </div>
                </div>

                <div
                  className={`rounded-2xl bg-linear-to-br ${item.color} p-4 text-white shadow-lg`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid gap-8 xl:grid-cols-2">
        {/* AREA CHART */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Hiring Performance
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Monthly application and hiring analytics
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
              <HiOutlineChartBar className="h-6 w-6" />
            </div>
          </div>

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrend}>
                <defs>
                  <linearGradient id="applications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="hired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#applications)"
                />

                <Area
                  type="monotone"
                  dataKey="hired"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#hired)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* PIE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Candidate Pipeline
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Application funnel overview
              </p>
            </div>

            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
              <HiOutlineUsers className="h-6 w-6" />
            </div>
          </div>

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={candidatePipeline}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {candidatePipeline.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* JOB PERFORMANCE */}
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        {/* BAR CHART */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Job Category Performance
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Most active job categories
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
              <HiOutlineBriefcase className="h-6 w-6" />
            </div>
          </div>

          <div className="h-85">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis dataKey="role" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="applicants"
                  fill="#06b6d4"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* TOP JOBS */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Top Performing Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Best converting job postings
              </p>
            </div>

            <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-400">
              <HiOutlineBuildingOffice2 className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-5">
            {topPerformingJobs.map((job, index) => (
              <motion.div
                key={job.title}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {job.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
                        {job.applicants} Applicants
                      </span>

                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300">
                        {job.interviews} Interviews
                      </span>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                        {job.hired} Hired
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-3 text-cyan-400">
                    <HiOutlineArrowTrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

     
    </motion.section>
  );
};

export default Analytics;