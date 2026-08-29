import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { recruiterService } from "../../services/recruiter_service";

const fieldClasses =
  "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-400";

const cardStyle = {
  borderColor: "var(--border)",
  background: "var(--surface)",
  boxShadow: "var(--shadow)",
};

const RecruiterSettings = () => {
  const { user, updateUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    notifications: {
      emailAlerts: true,
      browserAlerts: true,
      weeklyDigest: true,
      smsUpdates: false,
    },
    security: {
      twoFactor: true,
      autoLock: true,
      auditLogs: true,
    },
    password: "",
  });

  useEffect(() => {
    if (!user) return;

    const nextProfile = recruiterService.getRecruiterProfile(user.id);

    setProfile(nextProfile);

    setForm((prev) => ({
      ...prev,
      notifications: nextProfile.notifications || prev.notifications,
      security: nextProfile.security || prev.security,
    }));
  }, [user]);

  const handlePreferenceToggle = (group, key) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key],
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    const nextProfile = await recruiterService.saveRecruiterProfile(user.id, {
      ...profile,
      notifications: form.notifications,
      security: form.security,
    });

    setProfile(nextProfile);

    updateUser({});
    refreshUser();

    window.dispatchEvent(new Event("storage"));

    toast.success("Settings saved successfully");
  };

  const handlePasswordUpdate = () => {
    if (!form.password) {
      toast.error("Please enter a new password");
      return;
    }

    updateUser({ password: form.password });

    toast.success("Password updated");
    setForm((prev) => ({ ...prev, password: "" }));
  };

  if (!profile) {
    return (
      <div className="rounded-3xl border p-6" style={cardStyle}>
        <p style={{ color: "var(--text)" }}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 ">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border p-5"
        style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(6,182,212,.04), rgba(99,102,241,.03))", boxShadow: "var(--shadow)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-slate-500">Manage your account, notifications and security.</p>
          </div>

          <div className="min-w-[220px]">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, rgb(6,182,212), rgb(99,102,241))" }}
            >
              Save Settings
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.6fr]">
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border p-5" style={cardStyle}>
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineBell className="h-5 w-5 text-violet-300" />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Notifications</h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["emailAlerts", "Email Alerts"],
                ["browserAlerts", "Browser Notifications"],
                ["weeklyDigest", "Weekly Digest"],
                ["smsUpdates", "SMS Updates"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handlePreferenceToggle("notifications", key)}
                  className="flex w-full items-center justify-between rounded-2xl border px-4 py-3"
                  style={{ borderColor: "var(--border)", background: "var(--surface-strong)" }}
                >
                  <span className="text-sm" style={{ color: "var(--text)" }}>{label}</span>

                  <div className={`h-3 w-3 rounded-full ${form.notifications[key] ? "bg-emerald-400" : "bg-slate-500"}`} />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border p-5" style={cardStyle}>
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineShieldCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Security</h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["twoFactor", "Two Factor Authentication"],
                ["autoLock", "Auto Lock"],
                ["auditLogs", "Audit Logs"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handlePreferenceToggle("security", key)}
                  className="flex w-full items-center justify-between rounded-2xl border px-4 py-3"
                  style={{ borderColor: "var(--border)", background: "var(--surface-strong)" }}
                >
                  <span className="text-sm" style={{ color: "var(--text)" }}>{label}</span>
                  <div className={`h-3 w-3 rounded-full ${form.security[key] ? "bg-emerald-400" : "bg-slate-500"}`} />
                </button>
              ))}

              <div className="mt-5">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New password"
                  className={fieldClasses}
                  style={{ background: "var(--surface-strong)", color: "var(--text)", borderColor: "var(--border)" }}
                />

                <motion.button whileTap={{ scale: 0.97 }} onClick={handlePasswordUpdate} className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "linear-gradient(135deg, rgba(244,114,182,.18), rgba(251,191,36,.18))", color: "var(--text)" }}>
                  Update Password
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border p-5" style={cardStyle}>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Account</h3>
            <p className="text-sm text-slate-500 mt-2">Manage account-level preferences and access.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSettings;
