import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTrendingUp,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineWifi,
} from "react-icons/hi2";

// ThemeToggle handled in Navbar and Settings - removed duplicate import
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profile_service";
import ProfileCard from "../../components/ui/ProfileCard";

const fieldClasses =
  "w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400";

const AdminProfile = () => {
  const { user, refreshUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "admin",
    bio: "",
    address: "",
    website: "",
    linkedIn: "",
    twitter: "",
    profileImage: "",
    status: "Active",
    joinedDate: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;
    const adminProfile = profileService.getAdminProfile(user.id);
    setProfile(adminProfile);
    setForm({
      fullName: adminProfile.fullName || user.name || "",
      email: adminProfile.email || user.email || "",
      phone: adminProfile.phone || user.phone || "",
      role: adminProfile.role || user.role || "admin",
      bio: adminProfile.bio || "",
      address: adminProfile.address || "",
      website: adminProfile.website || "",
      linkedIn: adminProfile.linkedIn || "",
      twitter: adminProfile.twitter || "",
      profileImage: adminProfile.profileImage || user.profileImage || user.avatar || "",
      status: adminProfile.status || (user.isBlocked ? "Suspended" : "Active"),
      joinedDate: adminProfile.joinedDate || user.createdAt || new Date().toISOString(),
      password: "",
    });
  }, [user]);

  const profileCompletion = useMemo(() => {
    const items = [
      form.fullName,
      form.email,
      form.phone,
      form.bio,
      form.address,
      form.website,
      form.linkedIn,
      form.profileImage,
    ];
    const filled = items.filter(Boolean).length;
    return Math.min(100, Math.round((filled / items.length) * 100));
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        profileImage: reader.result,
      }));
      toast.success("Profile image uploaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  // Immediately persist uploaded image so navbar/sidebar/dashboard update
  const handleImmediateUpload = (img) => {
    setForm((current) => ({ ...current, profileImage: img }));
    if (!user) return;
    const updatedProfile = profileService.saveAdminProfileAndCurrentUser(user.id, {
      profileImage: img,
      fullName: form.fullName || user.name,
      email: form.email || user.email,
    });
    // refresh auth context and broadcast storage event
    refreshUser();
    window.dispatchEvent(new Event('storage'));
    toast.success('Profile image saved and applied across the app.');
    setProfile(updatedProfile);
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    const updatedProfile = profileService.saveAdminProfileAndCurrentUser(user.id, {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      bio: form.bio,
      address: form.address,
      website: form.website,
      linkedIn: form.linkedIn,
      twitter: form.twitter,
      profileImage: form.profileImage,
      status: form.status,
      joinedDate: form.joinedDate,
      profileCompletion,
    });

    setProfile(updatedProfile);
    refreshUser();
    window.dispatchEvent(new Event("storage"));
    toast.success("Admin profile updated successfully.");
    setSaving(false);
  };

  const handlePasswordUpdate = () => {
    if (!form.password) {
      toast.error("Please enter a new password.");
      return;
    }

    updateUser({ password: form.password });
    toast.success("Password update saved locally.");
    setForm((current) => ({ ...current, password: "" }));
  };

  if (!user || !profile) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-300">
        <p>Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Admin profile</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Enterprise admin control</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage your platform identity, security settings, team presence, and brand details from one premium dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* ThemeToggle available in Navbar and Settings */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </motion.button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl border border-slate-800 bg-slate-950/90 p-8 shadow-[0_40px_120px_-60px_rgba(14,116,144,0.45)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Personal details</p>
              <h2 className="text-2xl font-bold text-white">Your admin identity</h2>
            </div>
            <div>
              <ProfileCard
                user={{ name: form.fullName || user.name, email: form.email, profileImage: form.profileImage }}
                onUpload={handleImmediateUpload}
              />

              <div className="mt-4 grid gap-2">
                <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Account</p>
                  <p className="mt-2 font-semibold text-white">{form.status}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Member since</p>
                  <p className="mt-2 font-semibold text-white">{new Date(form.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-900/95 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Profile completion</p>
                <p className="mt-2 text-3xl font-bold text-white">{profileCompletion}%</p>
              </div>
              <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200">
                Premium admin panel
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-850">
              <div
                className="h-3 rounded-full bg-linear-to-r from-cyan-400 via-blue-400 to-violet-500 transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">Full name</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={fieldClasses}
                placeholder="Jane admin"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">Email address</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className={fieldClasses}
                placeholder="admin@hirehub.com"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={fieldClasses}
                placeholder="+1 (555) 123-4567"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-slate-400">Role</span>
              <input
                name="role"
                value={form.role}
                readOnly
                className={fieldClasses}
              />
            </label>
            <label className="space-y-2 text-sm sm:col-span-2">
              <span className="text-slate-400">Bio / About</span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className={fieldClasses}
                placeholder="Describe your admin responsibilities and platform vision."
              />
            </label>
            <label className="space-y-2 text-sm sm:col-span-2">
              <span className="text-slate-400">Address</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={fieldClasses}
                placeholder="Remote / Headquarters location"
              />
            </label>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-4xl border border-slate-800 bg-slate-950/90 p-6 shadow-[0_32px_80px_-50px_rgba(13,148,136,0.65)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Quick stats</p>
                <h3 className="mt-2 text-xl font-bold text-white">Account snapshot</h3>
              </div>
              <HiOutlineShieldCheck className="h-8 w-8 text-cyan-300" />
            </div>

            <div className="mt-6 grid gap-4">
              {[
                { label: "Signed in", value: new Date(form.joinedDate).toLocaleDateString(), icon: HiOutlineClock },
                { label: "Status", value: form.status, icon: HiOutlineCheckCircle },
                { label: "Team Growth", value: "+14% this month", icon: HiOutlineArrowTrendingUp },
                { label: "Operations", value: "Platform health", icon: HiOutlineBriefcase },
              ].map((card) => (
                <div key={card.label} className="rounded-3xl bg-slate-900/80 p-4 text-slate-300 transition hover:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <card.icon className="h-5 w-5 text-cyan-300" />
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-slate-800 bg-slate-950/90 p-6">
            <div className="flex items-center gap-3 text-slate-100">
              <HiOutlineUserCircle className="h-5 w-5 text-cyan-300" />
              <p className="text-sm font-semibold">Profile branding</p>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block text-sm text-slate-400">
                Profile image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"
                />
              </label>
              <div className="grid gap-4">
                {form.profileImage && (
                  <img
                    src={form.profileImage}
                    alt="Admin preview"
                    className="h-32 w-full rounded-3xl object-cover shadow-[0_24px_80px_-50px_rgba(14,116,144,0.75)]"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-800 bg-slate-950/90 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Social & security</p>
            <div className="mt-4 grid gap-4">
              <label className="space-y-2 text-sm">
                <span className="text-slate-400">Website</span>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className={fieldClasses}
                  placeholder="https://admin.example"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-400">LinkedIn</span>
                <input
                  name="linkedIn"
                  value={form.linkedIn}
                  onChange={handleChange}
                  className={fieldClasses}
                  placeholder="https://linkedin.com/in/admin"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-400">Twitter</span>
                <input
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  className={fieldClasses}
                  placeholder="@adminprofile"
                />
              </label>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-sm font-semibold text-white">Change password</p>
                <p className="mt-1 text-sm text-slate-500">Update your local security credentials quickly.</p>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="New password"
                  className={`${fieldClasses} mt-4`}
                />
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePasswordUpdate}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Update password
                </motion.button>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default AdminProfile;
