import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineFolder,
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineFire,
  HiOutlineCamera,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profile_service";
import { applicationService } from "../../services/application_service";

import SkillModal from "../../components/candidate/SkillModal";
import ExperienceModal from "../../components/candidate/ExperienceModal";
import EducationModal from "../../components/candidate/EducationModal";
import CertificationModal from "../../components/candidate/CertificationModal";
import ProjectModal from "../../components/candidate/ProjectModal";

const emptyProfile = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    bio: "",
    profileImage: "",
  },
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  lastUpdated: "",
};

// ─── tiny animated stat card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.03 }}
    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-5 backdrop-blur-sm"
  >
    <Icon className={`h-6 w-6 ${color}`} />
    <span className="mt-1 text-2xl font-black text-white">{value}</span>
    <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
  </motion.div>
);

// ─── section wrapper card ────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, onAdd, children }) => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/8 px-2.5 py-1 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/15"
      >
        <HiOutlinePlus className="h-3 w-3" />
        Add
      </button>
    </div>
    {children}
  </div>
);

// ─── individual section item ─────────────────────────────────────────────────
const SectionItem = ({ item, onRemove, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    whileHover={{ x: 3 }}
    className="group flex items-start justify-between gap-3 rounded-xl border border-white/[0.05] bg-slate-950/50 p-3"
  >
    <div>
      <p className="text-sm font-semibold text-slate-200">
        {item.name || item.title || item.degree}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        {item.company || item.institution || item.techStack || item.issuer}
      </p>
    </div>
    <button
      onClick={onRemove}
      className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/8 px-2.5 py-1 text-xs font-medium text-red-400 opacity-0 transition group-hover:opacity-100"
    >
      Remove
    </button>
  </motion.div>
);

// ════════════════════════════════════════════════════════════════════════════
const MyProfile = () => {
  const { user, candidateProfile, updateCandidateProfile } = useAuth();

  const [profileData, setProfileData] = useState(emptyProfile);
  const [resumeData, setResumeData] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: "", item: null });

  useEffect(() => {
    if (candidateProfile) {
      setProfileData(candidateProfile);
    } else if (user?.id) {
      setProfileData(profileService.getCandidateProfile(user.id));
    }
  }, [candidateProfile, user]);

  useEffect(() => {
    if (user?.id) setResumeData(profileService.getResumeData(user.id));
  }, [user?.id]);

  const saveProfile = (next) => {
    const updated = { ...next, lastUpdated: new Date().toISOString() };
    setProfileData(updated);
    updateCandidateProfile(updated);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handlePersonalChange = (field, value) =>
    saveProfile({ ...profileData, personal: { ...profileData.personal, [field]: value } });

  // ── PROFILE IMAGE ────────────────────────────────────────────────────────
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      saveProfile({ ...profileData, personal: { ...profileData.personal, profileImage: reader.result } });
      toast.success("Profile picture updated ✨");
    };
    reader.readAsDataURL(file);
  };

  const applications = user?.id
    ? applicationService.getApplicationsByCandidate(user.id)
    : [];

  const profileStrength = useMemo(() => {
    let s = 0;
    if (profileData.personal.firstName) s += 10;
    if (profileData.personal.email) s += 10;
    if (profileData.personal.bio) s += 15;
    if (profileData.skills.length > 0) s += 15;
    if (profileData.experience.length > 0) s += 15;
    if (profileData.education.length > 0) s += 10;
    if (profileData.projects.length > 0) s += 10;
    if (profileData.certifications.length > 0) s += 5;
    if (resumeData) s += 10;
    return Math.min(100, s);
  }, [profileData, resumeData]);

  const saveSectionItem = (type, item) => {
    const col = profileData[type] || [];
    const exists = col.some((e) => e.id === item.id);
    const updated = exists ? col.map((e) => (e.id === item.id ? item : e)) : [item, ...col];
    saveProfile({ ...profileData, [type]: updated });
    toast.success(`${type} updated ✨`);
  };

  const removeSectionItem = (type, id) => {
    saveProfile({ ...profileData, [type]: profileData[type].filter((i) => i.id !== id) });
    toast.success("Removed successfully");
  };

  const openModal = (type, item = null) => setModalState({ isOpen: true, type, item });
  const closeModal = () => setModalState({ isOpen: false, type: "", item: null });

  if (!user) return null;

  const { personal, skills, experience, education, certifications, projects } = profileData;
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || "Candidate";

  const ringOffset = 440 - (440 * profileStrength) / 100;

  const sections = [
    { title: "Skills",          type: "skills",          icon: HiOutlineBolt,         data: skills },
    { title: "Experience",      type: "experience",      icon: HiOutlineBriefcase,    data: experience },
    { title: "Education",       type: "education",       icon: HiOutlineAcademicCap,  data: education },
    { title: "Certifications",  type: "certifications",  icon: HiOutlineTrophy,       data: certifications },
    { title: "Projects",        type: "projects",        icon: HiOutlineFolder,       data: projects },
  ];

  return (
    <div className="relative min-h-screen space-y-6 overflow-hidden bg-[#030712] p-4 md:p-6">

      {/* ── ambient blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-violet-500/[0.07] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/[0.05] blur-[90px]"
        />
      </div>

      <div className="relative z-10 space-y-6">

        {/* PAGE HEADER */}
        <PageHeader
          title="My Profile"
          subtitle="Build a modern professional identity for recruiters"
          icon={HiOutlineUser}
        />

        {/* ══════════════════════════════════════════════════════════════
            HERO CARD
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-violet-500/[0.05] p-6 md:p-8">

            {/* subtle grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT — avatar + info */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                {/* ── PROFILE PICTURE ── */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="relative shrink-0 self-start"
                >
                  {/* glowing ring */}
                  <div className="absolute -inset-[3px] rounded-[22px] bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 opacity-60 blur-[6px]" />

                  {/* image box */}
                  <div className="relative h-28 w-28 overflow-hidden rounded-[20px] border-2 border-white/10 bg-slate-900 shadow-2xl md:h-32 md:w-32">
                    {personal.profileImage ? (
                      <img
                        src={personal.profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <HiOutlineUser className="h-12 w-12 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* camera upload button — bottom right */}
                  <label
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
                    title="Change profile photo"
                  >
                    <HiOutlineCamera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImage}
                    />
                  </label>
                </motion.div>

                {/* name / role / bio / chips */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black leading-none text-white md:text-4xl">
                      {fullName}
                    </h1>
                    <motion.span
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    >
                      <HiOutlineSparkles className="h-6 w-6 text-cyan-400" />
                    </motion.span>
                  </div>

                  <p className="mt-1 text-sm font-medium text-cyan-400/80">MERN Stack Developer</p>

                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
                    {personal.bio || "Add a professional bio to stand out from recruiters."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { icon: HiOutlineEnvelope, text: personal.email || "Email" },
                      { icon: HiOutlinePhone,    text: personal.phone || "Phone" },
                      { icon: HiOutlineMapPin,   text: personal.location || "Location" },
                      ...(personal.portfolio
                        ? [{ icon: HiOutlineGlobeAlt, text: personal.portfolio }]
                        : []),
                    ].map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                      >
                        <Icon className="h-3.5 w-3.5 text-cyan-400" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT — stat cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:w-56">
                <StatCard icon={HiOutlineBriefcase}  value={applications.length}    label="Applied"    delay={0.1}  color="text-cyan-400" />
                <StatCard icon={HiOutlineBolt}        value={skills.length}          label="Skills"     delay={0.15} color="text-violet-400" />
                <StatCard icon={HiOutlineFolder}      value={projects.length}        label="Projects"   delay={0.2}  color="text-emerald-400" />
                <StatCard icon={HiOutlineFire}        value={`${profileStrength}%`}  label="Score"      delay={0.25} color="text-orange-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            PERSONAL INFO  +  PROFILE STRENGTH
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">

          {/* ── Personal information form ── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Personal Information</h2>
                <p className="mt-1 text-xs text-slate-500">Manage your professional details</p>
              </div>
              <motion.span
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <HiOutlineSparkles className="h-8 w-8 text-cyan-400/60" />
              </motion.span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={personal.firstName}
                onChange={(e) => handlePersonalChange("firstName", e.target.value)}
              />
              <Input
                label="Last Name"
                value={personal.lastName}
                onChange={(e) => handlePersonalChange("lastName", e.target.value)}
              />
              <Input
                label="Email"
                value={personal.email}
                onChange={(e) => handlePersonalChange("email", e.target.value)}
              />
              <Input
                label="Phone"
                value={personal.phone}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
              />
              <Input
                label="Location"
                value={personal.location}
                onChange={(e) => handlePersonalChange("location", e.target.value)}
              />
              <Input
                label="Portfolio URL"
                value={personal.portfolio}
                onChange={(e) => handlePersonalChange("portfolio", e.target.value)}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Professional Bio
              </label>
              <textarea
                rows={5}
                value={personal.bio}
                onChange={(e) => handlePersonalChange("bio", e.target.value)}
                placeholder="Tell recruiters about your skills, experience, and goals…"
                className="w-full rounded-xl border border-white/[0.07] bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* ── Profile strength ring ── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Profile Strength</h2>
                <p className="mt-1 text-xs text-slate-500">Improve your visibility</p>
              </div>
              <HiOutlineArrowTrendingUp className="h-8 w-8 text-cyan-400/60" />
            </div>

            {/* SVG ring */}
            <div className="flex justify-center">
              <div className="relative h-44 w-44">
                <svg className="-rotate-90" viewBox="0 0 160 160" width="100%" height="100%">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                  <motion.circle
                    cx="80" cy="80" r="70"
                    stroke="url(#profileGrad)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: ringOffset }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop stopColor="#06b6d4" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{profileStrength}%</span>
                  <span className="mt-1 text-xs text-slate-500">Complete</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              {[
                "Add more projects",
                "Upload certifications",
                "Complete your bio",
                "Add portfolio links",
              ].map((tip) => (
                <motion.div
                  key={tip}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5"
                >
                  <HiOutlineSparkles className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <span className="text-xs text-slate-400">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTIONS GRID
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid gap-5 lg:grid-cols-2">
          {sections.map((sec) => (
            <SectionCard
              key={sec.title}
              icon={sec.icon}
              title={sec.title}
              onAdd={() => openModal(sec.type)}
            >
              {sec.data.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] bg-slate-950/40 py-6 text-center text-xs text-slate-600">
                  No {sec.title.toLowerCase()} added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {sec.data.map((item, idx) => (
                    <SectionItem
                      key={item.id}
                      item={item}
                      index={idx}
                      onRemove={() => removeSectionItem(sec.type, item.id)}
                    />
                  ))}
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════ */}
      <SkillModal
        isOpen={modalState.isOpen && modalState.type === "skills"}
        onClose={closeModal}
        onSave={(item) => saveSectionItem("skills", item)}
        initialData={modalState.item}
      />
      <ExperienceModal
        isOpen={modalState.isOpen && modalState.type === "experience"}
        onClose={closeModal}
        onSave={(item) => saveSectionItem("experience", item)}
        initialData={modalState.item}
      />
      <EducationModal
        isOpen={modalState.isOpen && modalState.type === "education"}
        onClose={closeModal}
        onSave={(item) => saveSectionItem("education", item)}
        initialData={modalState.item}
      />
      <CertificationModal
        isOpen={modalState.isOpen && modalState.type === "certifications"}
        onClose={closeModal}
        onSave={(item) => saveSectionItem("certifications", item)}
        initialData={modalState.item}
      />
      <ProjectModal
        isOpen={modalState.isOpen && modalState.type === "projects"}
        onClose={closeModal}
        onSave={(item) => saveSectionItem("projects", item)}
        initialData={modalState.item}
      />
    </div>
  );
};

export default MyProfile;