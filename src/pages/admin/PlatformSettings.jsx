import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineLockClosed,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { getUsers, getJobs, getApplications } from "../../services/storage_service";

const Toggle = ({ enabled, setEnabled }) => (
  <button
    role="switch"
    aria-checked={enabled}
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex items-center h-6 w-12 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${enabled ? "bg-emerald-500" : "bg-slate-600"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-0"}`}
    />
  </button>
);

const PlatformSettings = () => {
  const defaultSettings = {
    security: true,
    emailNotify: true,
    jobApproval: true,
    autoBlock: false,
  };

  const [security, setSecurity] = useState(defaultSettings.security);
  const [emailNotify, setEmailNotify] = useState(defaultSettings.emailNotify);
  const [jobApproval, setJobApproval] = useState(defaultSettings.jobApproval);
  const [autoBlock, setAutoBlock] = useState(defaultSettings.autoBlock);
  const [summary, setSummary] = useState({ users: 0, jobs: 0, applications: 0, reports: 0 });

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("hirehub_settings")) || defaultSettings;
    setSecurity(settings.security);
    setEmailNotify(settings.emailNotify);
    setJobApproval(settings.jobApproval);
    setAutoBlock(settings.autoBlock);

    const users = getUsers();
    const jobs = getJobs();
    const applications = getApplications();

    setSummary({ users: users.length, jobs: jobs.length, applications: applications.length, reports: JSON.parse(localStorage.getItem("hirehub_reports") || "[]").length });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hirehub_settings",
      JSON.stringify({ security, emailNotify, jobApproval, autoBlock })
    );
  }, [security, emailNotify, jobApproval, autoBlock]);

  const settings = [
    { title: "Security Control", desc: "Enable platform-wide security protection & fraud detection", icon: HiOutlineShieldCheck, state: security, setState: setSecurity, color: "from-emerald-500 to-teal-500" },
    { title: "Email Notifications", desc: "Send alerts for new users, jobs, and reports", icon: HiOutlineBell, state: emailNotify, setState: setEmailNotify, color: "from-blue-500 to-cyan-500" },
    { title: "Job Auto Approval", desc: "Automatically approve trusted recruiter job posts", icon: HiOutlineBriefcase, state: jobApproval, setState: setJobApproval, color: "from-purple-500 to-pink-500" },
    { title: "Auto User Blocking", desc: "Automatically block suspicious or spam accounts", icon: HiOutlineLockClosed, state: autoBlock, setState: setAutoBlock, color: "from-red-500 to-orange-500" },
  ];

  return (
    <section className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">
        <h1 className="text-4xl font-black text-white">Platform Settings</h1>
        <p className="mt-3 text-slate-400">Control security, moderation, notifications, and platform behavior through a localStorage-backed settings panel.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {settings.map((item, index) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ scale: 1.02 }} className="rounded-4xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-linear-to-br ${item.color} text-white`}><item.icon className="h-6 w-6" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
              <Toggle enabled={item.state} setEnabled={item.setState} />
            </div>
            <div className="mt-6 text-xs text-slate-500">Status: <span className={item.state ? 'text-emerald-400' : 'text-red-400'}>{item.state ? 'Enabled' : 'Disabled'}</span></div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6"><HiOutlineCog6Tooth className="text-cyan-400 h-6 w-6" /><h2 className="text-2xl font-bold text-white">Admin Control Center</h2></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'System Status', value: 'All Systems Operational', color: 'text-emerald-400' },
            { label: 'Active Moderators', value: '5 Online', color: 'text-white' },
            { label: 'Pending Reports', value: `${summary.reports} Items`, color: 'text-yellow-400' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-800 p-5">
              <p className="text-slate-400 text-sm">{item.label}</p>
              <p className={`mt-2 font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Total Users', value: summary.users },
            { label: 'Active Jobs', value: summary.jobs },
            { label: 'Applications', value: summary.applications },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-800 p-5">
              <p className="text-slate-400 text-sm">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PlatformSettings;
