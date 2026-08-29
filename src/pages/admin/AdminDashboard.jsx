import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineArrowTrendingUp,
  HiOutlineBuildingOffice2,
  HiOutlineCamera,
} from 'react-icons/hi2';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';

import { useAuth } from '../../context/AuthContext';
import {
  getApplications,
  getCurrentUser,
  getJobs,
  getNotifications,
  getUsers,
} from '../../services/storage_service';

const metricCards = [
  {
    label: 'Total Users',
    key: 'totalUsers',
    icon: HiOutlineUsers,
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    label: 'Active Recruiters',
    key: 'activeRecruiters',
    icon: HiOutlineBuildingOffice2,
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    label: 'Total Candidates',
    key: 'totalCandidates',
    icon: HiOutlineUserCircle,
    accent: 'from-emerald-500 to-green-500',
  },
  {
    label: 'Total Jobs',
    key: 'totalJobs',
    icon: HiOutlineBriefcase,
    accent: 'from-orange-500 to-amber-500',
  },
  {
    label: 'Applications',
    key: 'totalApplications',
    icon: HiOutlineClipboardDocumentList,
    accent: 'from-rose-500 to-pink-500',
  },
  {
    label: 'Interviews',
    key: 'interviewsScheduled',
    icon: HiOutlineCheckCircle,
    accent: 'from-cyan-400 to-teal-500',
  },
  {
    label: 'Hiring Success',
    key: 'successRate',
    icon: HiOutlineArrowTrendingUp,
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    label: 'Revenue',
    key: 'revenue',
    icon: HiOutlineSparkles,
    accent: 'from-fuchsia-500 to-violet-500',
  },
];

const chartData = [
  { month: 'Jan', users: 210, jobs: 118, applications: 184 },
  { month: 'Feb', users: 250, jobs: 132, applications: 206 },
  { month: 'Mar', users: 290, jobs: 156, applications: 248 },
  { month: 'Apr', users: 338, jobs: 196, applications: 320 },
  { month: 'May', users: 392, jobs: 224, applications: 374 },
  { month: 'Jun', users: 430, jobs: 251, applications: 415 },
];

const statusData = [
  { name: 'Shortlisted', value: 28 },
  { name: 'Interview', value: 19 },
  { name: 'Hired', value: 12 },
  { name: 'Pending', value: 41 },
];

const activityFeed = [
  {
    id: 'a1',
    title: 'New recruiter verified',
    description:
      'Northstar Labs passed verification and is now live.',
    time: '7 min ago',
  },
  {
    id: 'a2',
    title: 'High-value application spike',
    description:
      'Applications grew 19% ahead of the weekly benchmark.',
    time: '22 min ago',
  },
  {
    id: 'a3',
    title: 'Fraud scan completed',
    description:
      'AI moderation flagged 3 suspicious job posts.',
    time: '1 hr ago',
  },
  {
    id: 'a4',
    title: 'Profile completion improved',
    description:
      'Candidate profiles improved by 8% this week.',
    time: '3 hr ago',
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [adminData, setAdminData] = useState(user || {});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    refreshDashboard();

    const handleStorageUpdate = () => {
      refreshDashboard();
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [user]);

  const refreshDashboard = () => {
    const currentUser = user || getCurrentUser();

    if (currentUser) {
      setAdminData(currentUser);
    }

    setUsers(getUsers() || []);
    setJobs(getJobs() || []);
    setApplications(getApplications() || []);
    setNotifications(getNotifications() || []);
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;

    const activeRecruiters = users.filter(
      (user) =>
        user.role === 'recruiter' &&
        !user.isBlocked
    ).length;

    const totalCandidates = users.filter(
      (user) => user.role === 'candidate'
    ).length;

    const totalApplications = applications.length;

    const interviewsScheduled = Math.max(
      12,
      Math.round(totalApplications * 0.27)
    );

    const successRate = Math.max(
      78,
      Math.round(82 + totalApplications * 0.01)
    );

    const revenue = new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }
    ).format(320000 + totalApplications * 1250);

    return {
      totalUsers,
      activeRecruiters,
      totalCandidates,
      totalJobs: jobs.length,
      totalApplications,
      interviewsScheduled,
      successRate,
      revenue,
    };
  }, [applications, jobs, users]);

  // PROFILE IMAGE UPDATE
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const avatar = reader.result;
      const updatedData = { avatar, profileImage: avatar };
      updateUser(updatedData);
      setAdminData((prev) => ({ ...prev, ...updatedData }));
      toast.success('Admin profile updated successfully');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen space-y-5">

      {/* BACKGROUND BLUR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-5">

        <PageHeader
          title="Admin dashboard"
          subtitle="Manage users, jobs, notifications and platform health from one unified control center."
          icon={HiOutlineChartBar}
          actions={
            <button
              onClick={() => refreshDashboard()}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Refresh data
            </button>
          }
        />

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 p-5 shadow-lg"
        >

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* PROFILE IMAGE */}
              <div className="relative">

                <img
                  src={
                    adminData?.avatar ||
                    'https://ui-avatars.com/api/?name=Admin'
                  }
                  alt="admin"
                  className="h-20 w-20 rounded-lg object-cover border-2 border-cyan-400 shadow-md"
                />

                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-600 transition">

                  <HiOutlineCamera className="h-4 w-4 text-white" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="hidden"
                  />

                </label>
              </div>

              {/* TEXT */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  Welcome,
                  {' '}
                  {adminData?.name || 'Admin'}
                </h1>

                <p className="mt-1 text-xs text-slate-300">
                  Manage platform, data & users
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  <div className="rounded-lg bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">
                    {adminData?.email ||
                      'admin@hirehub.com'}
                  </div>

                  <div className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">
                    Super Admin
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid gap-2 sm:grid-cols-2">

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm text-slate-300">
                  Active Alerts
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <h2 className="text-4xl font-black">
                    {notifications.length}
                  </h2>

                  <HiOutlineBell className="h-8 w-8 text-cyan-300" />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm text-slate-300">
                  AI Safety Score
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <h2 className="text-4xl font-black text-emerald-300">
                    98%
                  </h2>

                  <HiOutlineShieldCheck className="h-8 w-8 text-emerald-300" />
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="col-span-2 rounded-4xl bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.45)]">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Users', description: 'Review pending accounts', action: () => navigate('/admin/users') },
                { label: 'Jobs', description: 'Inspect current listings', action: () => navigate('/admin/jobs') },
                { label: 'Reports', description: 'Open platform reports', action: () => navigate('/admin/reports') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-cyan-400/40 hover:bg-slate-900"
                >
                  <p className="text-base font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="rounded-4xl bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.25)]">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin indicators</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Current alerts</p>
                <p className="mt-2 text-3xl font-bold text-white">{notifications.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Platform health</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">98%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* METRIC CARDS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {metricCards.map((card, index) => {

            const Icon = card.icon;

            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-300">
                      {card.label}
                    </p>

                    <h2 className="mt-4 text-3xl font-black">
                      {card.label === 'Revenue'
                        ? stats.revenue
                        : stats[card.key]}
                    </h2>
                  </div>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-linear-to-br ${card.accent}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
                  <HiOutlineArrowTrendingUp className="h-4 w-4" />
                  +12% this month
                </div>

              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <Card className="rounded-4xl bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Platform growth</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Hiring growth & engagement</h3>
              </div>
              <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-300">Live metrics</div>
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#22c55e"
                    fill="url(#usersGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="jobs"
                    stroke="#38bdf8"
                    fill="url(#jobsGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#a855f7"
                    fill="url(#applicationsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid gap-4">
            <Card className="rounded-4xl bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.25)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Hiring pipeline</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Application status</h3>
                </div>
                <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-300">Pipeline</div>
              </div>

              <div className="mt-6 h-72 flex flex-col gap-4">
                <div className="flex flex-col justify-center gap-3">
                  {(() => {
                    const total = statusData.reduce((s, it) => s + it.value, 0) || 1;
                    const colors = ['#f97316', '#22c55e', '#38bdf8', '#6366f1'];

                    return statusData.map((item, idx) => {
                      const pct = Math.round((item.value / total) * 100);
                      return (
                        <div key={item.name} className="flex items-center gap-4">
                          <div className="w-2 h-8 rounded-full" style={{ background: colors[idx] }} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-300">{item.name}</div>
                              <div className="text-sm font-semibold text-white">{pct}%</div>
                            </div>
                            <div className="mt-2 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: colors[idx] }} />
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="mt-2 grid gap-2">
                  {statusData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: ['#f97316', '#22c55e', '#38bdf8', '#6366f1'][i] }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="rounded-4xl bg-slate-950/90 p-6 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.25)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Activity feed</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Recent platform events</h3>
                </div>
                <HiOutlineSparkles className="h-7 w-7 text-cyan-300" />
              </div>

              <div className="mt-6 space-y-4">
                {activityFeed.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{activity.title}</p>
                        <p className="mt-2 text-sm text-slate-400">{activity.description}</p>
                      </div>
                      <span className="whitespace-nowrap rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;