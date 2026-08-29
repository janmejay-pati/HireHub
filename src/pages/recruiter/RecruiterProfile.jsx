import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  HiOutlineBell,
  HiOutlineBuildingOffice2,
  HiOutlineCamera,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineLockClosed,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUser,
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

const RecruiterProfile = () => {
  const { user, refreshUser, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    linkedin: "",
    location: "",
    industry: "",
    hiringPreferences: "",
    profilePhoto: "",
    companyLogo: "",
    companyBanner: "",
    password: "",

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
  });

  useEffect(() => {
    if (!user) return;

    const nextProfile = recruiterService.getRecruiterProfile(user.id);

    setProfile(nextProfile);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: nextProfile.phone || "",
      bio: nextProfile.bio || "",
      companyName: nextProfile.companyName || "",
      companyWebsite: nextProfile.companyWebsite || "",
      companySize: nextProfile.companySize || "",
      linkedin: nextProfile.linkedin || "",
      location: nextProfile.location || "",
      industry: nextProfile.industry || "",
      hiringPreferences: nextProfile.hiringPreferences || "",
      profilePhoto: nextProfile.profilePhoto || user.profileImage || "",
      companyLogo: nextProfile.companyLogo || "",
      companyBanner: nextProfile.companyBanner || "",
      password: "",

      notifications: nextProfile.notifications || {
        emailAlerts: true,
        browserAlerts: true,
        weeklyDigest: true,
        smsUpdates: false,
      },

      security: nextProfile.security || {
        twoFactor: true,
        autoLock: true,
        auditLogs: true,
      },
    });
  }, [user]);

  const profileCompletion = useMemo(() => {
    const fields = [
      form.name,
      form.email,
      form.phone,
      form.companyName,
      form.location,
      form.bio,
      form.linkedin,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.min(100, completed * 14);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceToggle = (group, key) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key],
      },
    }));
  };

  const handleFile = (fieldName) => (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        [fieldName]: reader.result,
      }));

      toast.success("Image uploaded successfully");
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;

    const nextProfile = await recruiterService.saveRecruiterProfile(
      user.id,
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        companySize: form.companySize,
        linkedin: form.linkedin,
        location: form.location,
        industry: form.industry,
        hiringPreferences: form.hiringPreferences,
        profilePhoto: form.profilePhoto,
        companyLogo: form.companyLogo,
        companyBanner: form.companyBanner,
        notifications: form.notifications,
        security: form.security,
        completion: profileCompletion,
      }
    );

    updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      profileImage: form.profilePhoto,
      avatar: form.profilePhoto,
      companyName: form.companyName,
      companyWebsite: form.companyWebsite,
      companySize: form.companySize,
      linkedin: form.linkedin,
      location: form.location,
      industry: form.industry,
      hiringPreferences: form.hiringPreferences,
      profileCompletion: profileCompletion,
    });

    setProfile(nextProfile);

    refreshUser();

    window.dispatchEvent(new Event("storage"));

    toast.success("Profile updated successfully");
  };

  const handlePasswordUpdate = () => {
    if (!form.password) {
      toast.error("Please enter a new password");
      return;
    }

    updateUser({
      password: form.password,
    });

    toast.success("Password updated");
  };

  if (!profile) {
    return (
      <div
        className="rounded-3xl border p-6"
        style={cardStyle}
      >
        <p style={{ color: "var(--text)" }}>
          Loading recruiter profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border p-5"
        style={{
          borderColor: "var(--border)",
          background:
            "linear-gradient(135deg, rgba(6,182,212,.10), rgba(99,102,241,.08))",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  form.profilePhoto ||
                  "https://ui-avatars.com/api/?name=Recruiter"
                }
                alt="Profile"
                className="h-20 w-20 rounded-3xl object-cover border border-white/10"
              />

              <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-cyan-500 p-2 text-white shadow-lg">
                <HiOutlineCamera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFile("profilePhoto")}
                />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="h-5 w-5 text-cyan-300" />

                <span
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ color: "var(--muted)" }}
                >
                  Recruiter Profile
                </span>
              </div>

              <h1
                className="mt-2 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                {form.name || "Recruiter"}
              </h1>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--muted)" }}
              >
                {form.companyName || "Company not added"}
              </p>
            </div>
          </div>

          <div className="min-w-[220px]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>
                Profile Completion
              </span>

              <span
                className="font-semibold"
                style={{ color: "var(--text)" }}
              >
                {profileCompletion}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, rgb(6,182,212), rgb(99,102,241))",
              }}
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* MAIN */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        {/* LEFT */}
        <div className="space-y-5">
          {/* PERSONAL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border p-5"
            style={cardStyle}
          >
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineUser className="h-5 w-5 text-cyan-300" />

              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Personal Information
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Email
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm md:col-span-2"
                style={{ color: "var(--muted)" }}
              >
                Bio
                <textarea
                  rows={4}
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>
            </div>
          </motion.div>

          {/* COMPANY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border p-5"
            style={cardStyle}
          >
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineBuildingOffice2 className="h-5 w-5 text-violet-300" />

              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Company Information
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Company Name
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Company Size
                <input
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Website
                <input
                  name="companyWebsite"
                  value={form.companyWebsite}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Industry
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>

              <label
                className="text-sm md:col-span-2"
                style={{ color: "var(--muted)" }}
              >
                Hiring Preferences
                <textarea
                  rows={3}
                  name="hiringPreferences"
                  value={form.hiringPreferences}
                  onChange={handleChange}
                  className={fieldClasses}
                  style={{
                    background: "var(--surface-strong)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </label>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* COMPANY LOGO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center gap-2">
              <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-300" />

              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Brand Assets
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <label
                className="block text-sm"
                style={{ color: "var(--muted)" }}
              >
                Company Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile("companyLogo")}
                  className="mt-2 block w-full text-sm"
                />
              </label>

              {form.companyLogo && (
                <img
                  src={form.companyLogo}
                  alt="Logo"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10"
                />
              )}
            </div>
          </motion.div>

          {/* NOTIFICATIONS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center gap-2">
              <HiOutlineBell className="h-5 w-5 text-violet-300" />

              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Notifications
              </h2>
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
                  onClick={() =>
                    handlePreferenceToggle("notifications", key)
                  }
                  className="flex w-full items-center justify-between rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-strong)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {label}
                  </span>

                  <div
                    className={`h-3 w-3 rounded-full ${
                      form.notifications[key]
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* SECURITY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="h-5 w-5 text-emerald-300" />

              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                Security
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["twoFactor", "Two Factor Authentication"],
                ["autoLock", "Auto Lock"],
                ["auditLogs", "Audit Logs"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() =>
                    handlePreferenceToggle("security", key)
                  }
                  className="flex w-full items-center justify-between rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-strong)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {label}
                  </span>

                  <div
                    className={`h-3 w-3 rounded-full ${
                      form.security[key]
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-5">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New password"
                className={fieldClasses}
                style={{
                  background: "var(--surface-strong)",
                  color: "var(--text)",
                  borderColor: "var(--border)",
                }}
              />

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePasswordUpdate}
                className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(244,114,182,.18), rgba(251,191,36,.18))",
                  color: "var(--text)",
                }}
              >
                Update Password
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;