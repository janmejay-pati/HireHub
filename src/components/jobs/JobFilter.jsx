import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineChevronDown,
} from "react-icons/hi2";

const JobFilter = ({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  const experienceLevels = [
    "Entry",
    "Mid",
    "Senior",
    "Lead",
    "Executive",
  ];

  const locations = [
    "Remote",
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Delhi NCR",
    "Pune",
  ];

  const activeFiltersCount = Object.values(
    filters
  ).filter(
    (value) =>
      value &&
      value.toString().trim() !== ""
  ).length;

  const handleFilterChange = (
    key,
    value
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const FilterSelect = ({
    icon: Icon,
    label,
    value,
    options,
    filterKey,
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-cyan-500" />
        {label}
      </label>

      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) =>
            handleFilterChange(
              filterKey,
              e.target.value
            )
          }
          className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300"
        >
          <option value="">
            Select {label}
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <HiOutlineChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`relative overflow-hidden rounded-4xl border border-white/20 bg-white/80 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl ${className}`}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <HiOutlineAdjustmentsHorizontal className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Smart Filters
                </h2>

                <p className="text-sm text-slate-500">
                  Find your perfect job faster
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                className="flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700"
              >
                <HiOutlineSparkles className="h-4 w-4" />

                {activeFiltersCount} Active
              </motion.div>
            )}

            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              whileHover={{
                scale: 1.03,
              }}
              onClick={() =>
                setIsOpen(!isOpen)
              }
              className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition"
            >
              {isOpen
                ? "Hide Filters"
                : "Open Filters"}
            </motion.button>
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {jobTypes.map((type) => (
            <motion.button
              key={type}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  filters.jobType === type
                    ? ""
                    : type
                )
              }
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                filters.jobType === type
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-600"
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>

        {/* EXPANDED FILTERS */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="overflow-hidden"
            >
              <div className="mt-8 border-t border-slate-200 pt-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  <FilterSelect
                    icon={
                      HiOutlineBriefcase
                    }
                    label="Job Type"
                    value={
                      filters.jobType
                    }
                    options={jobTypes}
                    filterKey="jobType"
                  />

                  <FilterSelect
                    icon={
                      HiOutlineSparkles
                    }
                    label="Experience"
                    value={
                      filters.experienceLevel
                    }
                    options={
                      experienceLevels
                    }
                    filterKey="experienceLevel"
                  />

                  <FilterSelect
                    icon={HiOutlineMapPin}
                    label="Location"
                    value={
                      filters.location
                    }
                    options={locations}
                    filterKey="location"
                  />

                  {/* SALARY */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-500" />
                      Salary
                    </label>

                    <input
                      type="text"
                      placeholder="$50k - $120k"
                      value={
                        filters.salary ||
                        ""
                      }
                      onChange={(e) =>
                        handleFilterChange(
                          "salary",
                          e.target.value
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      AI Smart Matching
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Filters improve your
                      personalized job
                      recommendations.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={
                      clearFilters
                    }
                    className="flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <HiOutlineXMark className="h-5 w-5" />
                    Clear Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JobFilter;