import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineXMark,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineDocumentText,
  HiOutlinePlayCircle,
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const services = [
  {
    id: 1,
    title: "Premium Job Search",
    short: "Find verified jobs worldwide.",
    description:
      "Explore premium opportunities with AI-powered recommendations.",
    icon: HiOutlineMagnifyingGlass,
    color: "from-cyan-500 to-blue-600",
    route: "/jobs",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop",
    features: ["AI Matching", "Verified Jobs", "Remote Roles"],
  },

  {
    id: 2,
    title: "Resume Builder",
    short: "Create ATS-friendly resumes.",
    description: "Build professional resumes with modern templates.",
    icon: HiOutlineDocumentText,
    color: "from-violet-500 to-purple-600",
    route: "/candidate/resume-builder",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop",
    features: ["ATS Resume", "PDF Export", "Templates"],
  },

  {
    id: 3,
    title: "Interview Prep",
    short: "Practice real interviews.",
    description: "Mock interviews and coding challenges.",
    icon: HiOutlinePlayCircle,
    color: "from-emerald-500 to-teal-600",
    route: "/candidate/practice",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
    features: ["Mock Tests", "Coding", "HR Rounds"],
  },

  {
    id: 4,
    title: "Career Guidance",
    short: "AI career roadmap.",
    description: "Personalized career growth suggestions.",
    icon: HiOutlineAcademicCap,
    color: "from-orange-500 to-red-600",
    route: "/jobs",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1400&auto=format&fit=crop",
    features: ["Roadmap", "Skills", "AI Advice"],
  },

  {
    id: 5,
    title: "Remote Jobs",
    short: "Work from anywhere.",
    description: "Global remote job opportunities.",
    icon: HiOutlineGlobeAlt,
    color: "from-pink-500 to-rose-600",
    route: "/jobs",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
    features: ["Remote", "Flexible", "Global"],
  },

  {
    id: 6,
    title: "Recruitment Tools",
    short: "AI hiring system.",
    description: "Smart recruitment dashboard.",
    icon: HiOutlineUserGroup,
    color: "from-yellow-500 to-amber-600",
    route: "/recruiter/dashboard",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    features: ["Hiring AI", "ATS", "Analytics"],
  },

  {
    id: 7,
    title: "Companies",
    short: "Explore top companies.",
    description: "Find MNCs & startups.",
    icon: HiOutlineBuildingOffice2,
    color: "from-indigo-500 to-blue-700",
    route: "/companies",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    features: ["Top Firms", "Insights", "Salaries"],
  },

  {
    id: 8,
    title: "Analytics",
    short: "Track applications.",
    description: "Monitor job performance.",
    icon: HiOutlineChartBar,
    color: "from-sky-500 to-cyan-600",
    route: "/candidate/dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    features: ["Reports", "Stats", "Growth"],
  },
];

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState(null);

  const handleNavigate = (route) => {
    if (route.startsWith("/candidate") && !user) {
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-(--bg) py-20">

        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-87.5 w-[350px] rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-87.5 w-[350px] rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          {/* HERO */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              <HiOutlineSparkles />
              Premium Career Services
            </div>

            <h1 className="mt-6 text-5xl font-black text-white">
              Smart Career{" "}
              <span className="text-cyan-400">Services</span>
            </h1>
          </div>

          {/* GRID */}
          <div className="mt-14 flex flex-wrap justify-center gap-6">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="w-[280px] overflow-hidden rounded-2xl border border-(--border) bg-(--surface) backdrop-blur-xl"
                >

                  {/* IMAGE */}
                  <div className="relative h-[120px] overflow-hidden">
                    <img
                      src={service.image}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div
                      className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r ${service.color}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h2 className="text-lg font-bold text-white">
                      {service.title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-300">
                      {service.short}
                    </p>

                    {/* FEATURES */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setSelectedService(service)}
                        className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-2 text-xs text-white"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleNavigate(service.route)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                      >
                        <HiOutlineArrowRight />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>
      </section>

      {/* MODAL (UNCHANGED LOGIC) */}
      <AnimatePresence>
        {selectedService && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div className="w-full max-w-3xl rounded-2xl bg-[var(--surface-strong)] p-6 text-(--text)">

              <button
                onClick={() => setSelectedService(null)}
                className="absolute right-5 top-5"
              >
                <HiOutlineXMark />
              </button>

              <h2 className="text-3xl font-bold">
                {selectedService.title}
              </h2>

              <p className="mt-4 text-slate-300">
                {selectedService.description}
              </p>

              <button
                onClick={() => handleNavigate(selectedService.route)}
                className="mt-6 w-full rounded-xl bg-cyan-500 py-3"
              >
                Explore
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;