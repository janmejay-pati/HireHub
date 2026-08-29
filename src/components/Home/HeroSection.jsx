// HeroSection.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineBriefcase,
} from "react-icons/hi2";

// ThemeToggle import removed; toggle is provided in Navbar and Settings

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-950 pb-24 pt-32">
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-30"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-business-team-working-1561088647209?download=1080p"
            type="video/mp4"
          />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-900/85 to-slate-950"></div>
      </div>

      {/* GLOW EFFECTS */}
      <div className="absolute left-0 top-0 h-112.5 w-112.5 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-125 w-125 rounded-full bg-violet-500/20 blur-3xl"></div>

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* ANIMATED PARTICLES */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute left-[10%] top-[20%] h-5 w-5 rounded-full bg-cyan-400/40 blur-sm"
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute right-[15%] top-[30%] h-6 w-6 rounded-full bg-blue-500/40 blur-sm"
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute bottom-[20%] left-[30%] h-4 w-4 rounded-full bg-violet-500/40 blur-sm"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 backdrop-blur-xl"
            >
              <HiOutlineSparkles className="h-5 w-5" />
              AI Powered Career Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="mt-8 text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Build Your
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Dream Career
              </span>
              <br />
              With Smart Hiring
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg leading-8 text-slate-300"
            >
              Discover premium jobs, connect with top recruiters,
              explore career opportunities and get hired faster with
              our modern AI-powered recruitment platform.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-5"
            >
              <button
                onClick={() => navigate("/jobs")}
                className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
              >
                Explore Jobs
                <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate("/companies")}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/30"
              >
                Browse Companies
              </button>
            </motion.div>

            {/* ThemeToggle moved to Navbar and Settings to avoid duplicates */}

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-14 grid gap-5 sm:grid-cols-3"
            >
              {[
                {
                  icon: HiOutlineBriefcase,
                  value: "25K+",
                  label: "Live Jobs",
                },
                {
                  icon: HiOutlineUsers,
                  value: "18K+",
                  label: "Candidates",
                },
                {
                  icon: HiOutlineBuildingOffice2,
                  value: "2.5K+",
                  label: "Companies",
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.08]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <item.icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-3xl font-black text-white">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
                alt="Team"
                className="h-162.5 w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/20 to-transparent"></div>

              {/* FLOAT CARD */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute left-6 top-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <HiOutlineCheckBadge className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      95% Success
                    </h3>

                    <p className="text-sm text-slate-300">
                      Hiring match accuracy
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* BOTTOM CARD */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-6 right-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                    <HiOutlineUsers className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      18K+ Candidates
                    </h3>

                    <p className="text-sm text-slate-300">
                      Trusted professionals
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;