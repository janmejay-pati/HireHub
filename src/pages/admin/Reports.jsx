import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCloudArrowDown,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingUp,
  HiOutlineDocumentChartBar,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { getUsers, getJobs, getReports, setReports } from "../../services/storage_service";
import { userService } from "../../services/user_service";
import { jobService } from "../../services/jobService";

const Reports = () => {
  const [stats, setStats] = useState({ users: 0, recruiters: 0, jobs: 0, reports: 0 });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const users = getUsers();
    const jobs = getJobs();
    let reportsData = getReports();

    if (!reportsData || reportsData.length === 0) {
      reportsData = [
        { id: "rep-1", type: "Fake Job", company: "Unknown Corp", status: "Pending", date: "2 hours ago" },
        { id: "rep-2", type: "Spam Recruiter", company: "Fake Solutions", status: "Resolved", date: "1 day ago" },
        { id: "rep-3", type: "Inappropriate Content", company: "ABC Hiring", status: "Investigating", date: "3 days ago" },
      ];
      setReports(reportsData);
    }

    setRecentReports(reportsData);
    setStats({
      users: users.length,
      recruiters: users.filter((u) => u.role === "recruiter").length,
      jobs: jobs.length,
      reports: reportsData.length,
    });
  }, []);

  const statusStyles = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Investigating: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };

  const handleResolve = (reportId) => {
    const updatedReports = recentReports.map((report) =>
      report.id === reportId ? { ...report, status: "Resolved" } : report
    );
    setReports(updatedReports);
    setRecentReports(updatedReports);
  };

  const handleDelete = (reportId) => {
    const filtered = recentReports.filter((report) => report.id !== reportId);
    setReports(filtered);
    setRecentReports(filtered);
    setStats((prev) => ({ ...prev, reports: filtered.length }));
  };

  const resolvedCount = recentReports.filter((report) => report.status === "Resolved").length;

  return (
    <section className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">HireHub Analytics</p>
            <h1 className="mt-4 text-5xl font-black text-white">Reports & Analytics</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">Monitor platform activity, detect suspicious recruiters, analyze hiring trends, and manage system reports with localStorage persistence.</p>
          </div>
          <button className="inline-flex items-center gap-3 rounded-2xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:scale-105">
            <HiOutlineCloudArrowDown className="text-xl" />
            Export Reports
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total Users", value: stats.users, icon: HiOutlineUsers, color: "from-cyan-500/20 to-blue-500/20" },
          { title: "Recruiters", value: stats.recruiters, icon: HiOutlineBuildingOffice2, color: "from-violet-500/20 to-fuchsia-500/20" },
          { title: "Jobs Posted", value: stats.jobs, icon: HiOutlineBriefcase, color: "from-emerald-500/20 to-green-500/20" },
          { title: "Reports", value: stats.reports, icon: HiOutlineExclamationTriangle, color: "from-red-500/20 to-orange-500/20" },
        ].map((card, index) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -6 }} className={`rounded-4xl border border-white/10 bg-linear-to-br ${card.color} p-6 shadow-2xl backdrop-blur-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">{card.title}</p>
                <h2 className="mt-4 text-4xl font-black text-white">{card.value}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <card.icon className="text-3xl text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 rounded-4xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-400">Platform Growth</p>
              <h2 className="mt-2 text-3xl font-bold text-white">User & Job Analytics</h2>
            </div>
            <div className="rounded-2xl bg-cyan-500/20 p-4 text-cyan-400"><HiOutlineChartBar className="text-3xl" /></div>
          </div>

          <div className="mt-10 flex h-75 items-end justify-between gap-4">
            {[40, 65, 50, 90, 70, 110, 85].map((height, index) => (
              <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * 0.1, duration: 0.5 }} className="w-full rounded-t-3xl bg-linear-to-t from-cyan-500 to-blue-500" />
            ))}
          </div>

          <div className="mt-5 flex justify-between text-sm text-slate-500">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (<span key={day}>{day}</span>))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400">Platform Health</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Excellent</h3>
              </div>
              <HiOutlineShieldCheck className="text-5xl text-emerald-400" />
            </div>
            <div className="mt-6 space-y-4">
              {[{ label: 'Recruiter Trust', value: '92%' }, { label: 'Spam Detection', value: '87%' }, { label: 'User Activity', value: '96%' }].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm text-slate-300"><span>{item.label}</span><span>{item.value}</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: item.value }} className="h-full rounded-full bg-cyan-500" /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3"><HiOutlineArrowTrendingUp className="text-3xl text-cyan-400" /><div><h3 className="text-xl font-bold text-white">Weekly Insights</h3><p className="text-sm text-slate-400">Platform activity overview</p></div></div>
            <div className="mt-6 space-y-4">{['+22% new recruiters', '+41% active candidates', '+18% job applications', '12 reports resolved'].map((item) => (<div key={item} className="rounded-2xl bg-slate-800 p-4 text-slate-300">{item}</div>))}</div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-4xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <div><p className="text-cyan-400">Moderation Center</p><h2 className="mt-2 text-3xl font-bold text-white">Recent Reports</h2></div>
          <HiOutlineDocumentChartBar className="text-4xl text-cyan-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-800"><tr>{['Report Type','Company','Status','Reported','Actions'].map((head) => (<th key={head} className="px-6 py-5 text-left text-sm font-semibold text-slate-300">{head}</th>))}</tr></thead>
            <tbody>
              {recentReports.map((report) => (
                <motion.tr key={report.id} whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }} className="border-t border-white/5">
                  <td className="px-6 py-5 text-white">{report.type}</td>
                  <td className="px-6 py-5 text-slate-300">{report.company}</td>
                  <td className="px-6 py-5"><span className={`rounded-full border px-4 py-2 text-xs font-semibold ${statusStyles[report.status]}`}>{report.status}</span></td>
                  <td className="px-6 py-5 text-slate-400">{report.date}</td>
                  <td className="px-6 py-5 flex gap-2"><button onClick={() => handleResolve(report.id)} className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500 hover:text-white"><HiOutlineCheckCircle className="inline h-4 w-4" /> Resolve</button><button onClick={() => handleDelete(report.id)} className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500 hover:text-white"><HiOutlineTrash className="inline h-4 w-4" /> Delete</button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default Reports;
