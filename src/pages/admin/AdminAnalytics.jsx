import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { getUsers, getJobs } from "../../services/storage_service";
import { applicationService } from "../../services/application_service";
import { resumeService } from "../../services/resume_service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const AdminAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(getUsers());
    setJobs(getJobs());
    setApplications(applicationService.getAllApplications());
    setTimeout(() => setLoading(false), 500);
  }, []);

  const appStats = useMemo(() => applicationService.getApplicationStats(), [applications]);

  const stats = [
    { title: "Total Users", value: users.length, icon: HiOutlineUsers, color: "from-cyan-500 to-blue-500" },
    { title: "Active Jobs", value: jobs.length, icon: HiOutlineBriefcase, color: "from-emerald-500 to-green-500" },
    { title: "Applications", value: applications.length, icon: HiOutlineDocumentText, color: "from-purple-500 to-pink-500" },
    { title: "Hired", value: appStats.hired, icon: HiOutlineCheckCircle, color: "from-orange-500 to-red-500" },
  ];

  const growthData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthlyUsers = months.map((month, idx) => ({
      month,
      users: users.length ? Math.round(users.length / 6 + idx * 20) : 0,
      jobs: jobs.length ? Math.round(jobs.length / 6 + idx * 10) : 0,
      apps: applications.length ? Math.round(applications.length / 6 + idx * 30) : 0,
    }));
    return monthlyUsers;
  }, [users, jobs, applications]);

  const roleDistribution = useMemo(() => {
    const candidateCount = users.filter((user) => user.role === "candidate").length;
    const recruiterCount = users.filter((user) => user.role === "recruiter").length;
    const adminCount = users.filter((user) => user.role === "admin").length;
    return [
      { name: "Candidates", value: candidateCount, color: "#06b6d4" },
      { name: "Recruiters", value: recruiterCount, color: "#8b5cf6" },
      { name: "Admins", value: adminCount, color: "#f59e0b" },
    ];
  }, [users]);

  const pipelineData = useMemo(() => [
    { name: "Applied", value: appStats.applied },
    { name: "Shortlisted", value: appStats.shortlisted },
    { name: "Interview", value: appStats.interview },
    { name: "Hired", value: appStats.hired },
  ], [appStats]);

  const resumeStats = useMemo(() => resumeService.getAdminResumeAnalytics(), []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-24 bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-28 bg-slate-800 rounded-3xl animate-pulse" />))}
        </div>
        <div className="h-75 bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-linear-to-r from-slate-900 to-slate-800 p-8">
        <h1 className="text-4xl font-bold">Platform Analytics</h1>
        <p className="mt-2 text-slate-400">Real-time hiring insights, growth trends & workforce intelligence powered by localStorage data.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -6 }} className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
              </div>
              <div className={`p-3 rounded-2xl bg-linear-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Resume library</p>
          <h2 className="mt-3 text-2xl font-semibold">Resume intelligence</h2>
          <div className="mt-5 space-y-3 text-slate-300">
            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
              <span>Total resumes</span>
              <span className="font-semibold text-white">{resumeStats.totalResumes}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
              <span>Public resumes</span>
              <span className="font-semibold text-white">{resumeStats.publicResumes}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
              <span>Private resumes</span>
              <span className="font-semibold text-white">{resumeStats.privateResumes}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
              <span>Downloads</span>
              <span className="font-semibold text-white">{resumeStats.totalDownloads}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Popular templates</p>
          <h2 className="mt-3 text-2xl font-semibold">Top resume designs</h2>
          <div className="mt-5 space-y-3">
            {resumeStats.topTemplates.map(([template, count]) => (
              <div key={template} className="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
                <span>{template}</span>
                <span className="font-semibold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Top skills</p>
          <h2 className="mt-3 text-2xl font-semibold">ATS keyword insights</h2>
          <div className="mt-5 grid gap-3">
            {resumeStats.topSkills.map(([skill, count]) => (
              <div key={skill} className="rounded-2xl bg-slate-800 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{skill}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold mb-4">Growth Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growthData}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, borderColor: '#334155' }} />
              <Area type="monotone" dataKey="users" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              <Area type="monotone" dataKey="jobs" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold mb-4">User Roles</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={roleDistribution} dataKey="value" outerRadius={100} label>
                {roleDistribution.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Hiring Pipeline</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pipelineData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, borderColor: '#334155' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
