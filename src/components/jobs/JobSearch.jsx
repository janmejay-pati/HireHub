import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiMagnifyingGlass,
  HiMapPin,
  HiSparkles,
  HiFire,
  HiAdjustmentsHorizontal,
  HiArrowTrendingUp,
} from "react-icons/hi2";

const JobSearch = ({
  onSearch,
  placeholder = "Search jobs, companies, skills...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch({
      search: searchTerm,
      location,
    });
  };

  const trendingSearches = [
    "Frontend Developer",
    "UI/UX Designer",
    "Remote Jobs",
    "AI Engineer",
    "Product Manager",
    "DevOps Engineer",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-10 ${className}`}
    >
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-5 py-2"
            >
              <HiSparkles className="h-5 w-5 text-cyan-600" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                AI Powered Search
              </span>
            </motion.div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
              Find Your
              <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Dream Job
              </span>
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
              Explore premium opportunities from top companies with
              intelligent AI matching, advanced filtering, and real-time hiring.
            </p>
          </div>

          {/* LIVE JOBS CARD */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex items-center gap-5 rounded-4xl border border-white/20 bg-white/90 px-8 py-6 shadow-[0_15px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <HiFire className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900">
                24K+
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Live Openings
              </p>
            </div>
          </motion.div>
        </div>

        {/* SEARCH CONTAINER */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[36px] border border-white/20 bg-white/90 p-5 shadow-[0_10px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_320px_auto]">
            {/* SEARCH INPUT */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="group relative"
            >
              <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2">
                <HiMagnifyingGlass className="h-6 w-6 text-slate-400 transition group-focus-within:text-cyan-500" />
              </div>

              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </motion.div>

            {/* LOCATION */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="group relative"
            >
              <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2">
                <HiMapPin className="h-6 w-6 text-slate-400 transition group-focus-within:text-cyan-500" />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </motion.div>

            {/* SEARCH BUTTON */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 px-8 py-4 font-semibold text-white shadow-2xl shadow-cyan-500/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <HiMagnifyingGlass className="h-5 w-5" />

                Search Jobs
              </span>

              <div className="absolute inset-0 translate-y-full bg-linear-to-r from-cyan-400 to-blue-500 transition duration-500 group-hover:translate-y-0" />
            </motion.button>
          </div>

          {/* TRENDING */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500">
              <HiAdjustmentsHorizontal className="h-5 w-5" />

              <span className="text-sm font-semibold">
                Trending Searches
              </span>
            </div>

            {trendingSearches.map((item, index) => (
              <motion.button
                key={item}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  y: -3,
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSearchTerm(item);
                  setActiveTag(item);

                  onSearch({
                    search: item,
                    location,
                  });
                }}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                  activeTag === item
                    ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </motion.form>

        {/* STATS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              value: "10K+",
              label: "Companies Hiring",
              icon: HiSparkles,
            },
            {
              value: "98%",
              label: "AI Match Accuracy",
              icon: HiArrowTrendingUp,
            },
            {
              value: "2M+",
              label: "Active Candidates",
              icon: HiFire,
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                }}
                className="group rounded-4xl border border-white/20 bg-white/80 p-7 shadow-[0_10px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900">
                      {item.value}
                    </h3>

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default JobSearch;