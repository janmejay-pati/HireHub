import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineBellAlert,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineUsers,
} from "react-icons/hi2";

import Button from "../../components/common/Button";
import GlassCard from "../../components/common/GlassCard";
import { useAuth } from "../../context/AuthContext";
import { applicationService } from "../../services/application_service";
import { companyService } from "../../services/company_service";
import { jobService } from "../../services/jobService";
import { notificationService } from "../../services/notification_service";

const defaultCompany = {
  name: "HireHub Studio",
  industry: "Technology",
  location: "Remote",
  size: "51 - 200",
  website: "https://hirehub.example",
  email: "careers@hirehub.example",
  description: "A trusted hiring partner focused on fast-moving startups and enterprise teams. Our recruiter brand lives at the intersection of people, technology, and culture.",
  hiringFocus: "Frontend, product design, cloud, and customer-facing engineering roles",
  benefits: ["Flexible work", "Learning budget", "Wellness stipend", "Top-tier mentorship"],
  values: ["People-first", "High ownership", "Inclusive culture", "Outcome-driven"],
  logo: "",
};

const CompanyProfile = () => {
  const { user, updateUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState(defaultCompany);
  const [notifications, setNotifications] = useState([]);

  const loadCompany = () => {
    const recruiterCompanies = companyService.getCompaniesByRecruiter(user?.id);
    const selectedCompany = recruiterCompanies[0] || null;

    if (selectedCompany) {
      setCompany(selectedCompany);
      setFormData({
        name: selectedCompany.name || defaultCompany.name,
        industry: selectedCompany.industry || defaultCompany.industry,
        location: selectedCompany.location || defaultCompany.location,
        size: selectedCompany.size || defaultCompany.size,
        website: selectedCompany.website || defaultCompany.website,
        email: selectedCompany.email || user?.email || defaultCompany.email,
        description: selectedCompany.description || defaultCompany.description,
        hiringFocus: selectedCompany.hiringFocus || defaultCompany.hiringFocus,
        benefits: selectedCompany.benefits || defaultCompany.benefits,
        values: selectedCompany.values || defaultCompany.values,
        logo: selectedCompany.logo || defaultCompany.logo,
      });
      return;
    }

    setCompany(null);
    setFormData({
      ...defaultCompany,
      email: user?.email || defaultCompany.email,
    });
  };

  useEffect(() => {
    loadCompany();

    const reload = () => loadCompany();
    window.addEventListener("storage", reload);
    window.addEventListener("companies-updated", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("companies-updated", reload);
    };
  }, [user?.id, user?.email]);

  useEffect(() => {
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  }, [user?.id]);

  const stats = useMemo(() => {
    const recruiterJobs = jobService.getAllJobs({ postedBy: user?.id }).filter((job) => job.postedBy === user?.id);
    const applications = applicationService.getAllApplications().filter((application) => recruiterJobs.some((job) => job._id === application.jobId));

    return [
      { label: "Open roles", value: recruiterJobs.length, icon: HiOutlineBriefcase },
      { label: "Applications", value: applications.length, icon: HiOutlineUsers },
      { label: "Hired", value: applications.filter((application) => application.status === "Hired").length, icon: HiOutlineSparkles },
    ];
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Sign in to update your company profile.");
      return;
    }

    const payload = {
      ...formData,
      recruiterId: user.id,
      postedBy: user.id,
      createdByRole: "recruiter",
      status: company?.status || "Published",
      type: company?.type || "IT",
      department: company?.department || "Development",
      business: company?.business || "Product Based",
      experience: company?.experience || "Mid Level",
      employees: formData.size || company?.employees || "N/A",
      jobs: company?.jobs || "0 Open Jobs",
      verified: Boolean(user.isVerified),
      updatedAt: new Date().toISOString(),
    };

    if (company?.id) {
      companyService.updateCompany(company.id, payload);
    } else {
      companyService.createCompany(payload);
    }

    loadCompany();

    updateUser({
      companyName: payload.name,
      companyWebsite: payload.website,
      companySize: payload.size,
      location: payload.location,
      industry: payload.industry,
      bio: payload.description,
      hiringPreferences: payload.hiringFocus,
      profileImage: payload.logo,
    });

    setCompany({ ...company, ...payload });
    notificationService.createNotification({
      type: "company",
      title: "Company profile updated",
      message: `${payload.name} is now synced with the recruiter workspace.`,
      relatedId: user?.id,
    });
    setNotifications(notificationService.getAllNotifications(user?.id || null));
    toast.success("Company profile updated successfully.");
  };

  const hiringMomentum = stats[1].value > 0 ? Math.round((stats[2].value / stats[1].value) * 100) : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <HiOutlineBuildingOffice2 className="h-7 w-7 text-cyan-300" />
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Brand Studio</p>
          </div>
          <h1 className="mt-4 text-4xl font-black text-white">Company Profile</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Keep your employer brand polished and aligned with the roles you are hiring for. Every update instantly syncs to your recruiter profile and company metadata.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">{stat.value}</h2>
                </div>
                <Icon className="h-8 w-8 text-cyan-300" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <GlassCard className="p-7">
          <div className="flex items-center gap-3">
            <HiOutlineSparkles className="h-6 w-6 text-cyan-300" />
            <h2 className="text-2xl font-bold text-white">Employer Profile</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Company name
              <input name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300">
              Industry
              <input name="industry" value={formData.industry} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300">
              Location
              <input name="location" value={formData.location} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300">
              Team size
              <input name="size" value={formData.size} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300">
              Website
              <input name="website" value={formData.website} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300">
              Contact email
              <input name="email" value={formData.email} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Hiring focus
              <input name="hiringFocus" value={formData.hiringFocus} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Company description
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            </label>
          </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSave}>Save company profile</Button>
              <Button variant="secondary" onClick={() => setFormData(defaultCompany)}>Reset</Button>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-center gap-3">
              <HiOutlineChartBar className="h-6 w-6 text-cyan-300" />
              <div>
                <h2 className="text-xl font-bold text-white">Hiring momentum</h2>
                <p className="text-sm text-slate-400">Signals that show how your employer brand is converting interest.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Open roles</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats[0].value}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Application rate</p>
                <p className="mt-2 text-2xl font-bold text-white">{hiringMomentum}%</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Interviews / hires</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats[2].value}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Tracked applications</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats[1].value}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-7">
          <div className="flex items-center gap-3">
            <HiOutlineGlobeAlt className="h-6 w-6 text-cyan-300" />
            <h2 className="text-2xl font-bold text-white">Brand snapshot</h2>
          </div>

          <div className="mt-6 rounded-4xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">{formData.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-cyan-200"><HiOutlineMapPin className="h-4 w-4" />Location</div>
                <p className="mt-2 text-white">{formData.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-cyan-200"><HiOutlineBuildingOffice2 className="h-4 w-4" />Size</div>
                <p className="mt-2 text-white">{formData.size}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Hiring focus</p>
              <p className="mt-2 text-white">{formData.hiringFocus}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Website</p>
              <p className="mt-2 text-white">{formData.website}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white">Benefits</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.benefits.map((benefit) => (
                <span key={benefit} className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{benefit}</span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white">Core values</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.values.map((value) => (
                <span key={value} className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">{value}</span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <HiOutlineBellAlert className="h-6 w-6 text-cyan-300" />
              <div>
                <h3 className="text-lg font-bold text-white">Recruiter notifications</h3>
                <p className="text-sm text-slate-400">Recent workspace updates for your company profile.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {notifications.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  No notifications yet. Saving your profile will add the latest activity here.
                </p>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CompanyProfile;
