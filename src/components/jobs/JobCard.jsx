import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineBookmark,
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
  HiOutlineBriefcase,
} from "react-icons/hi2";

import { useState } from "react";
import toast from "react-hot-toast";

import { usePortal } from "../../context/PortalContext";

const JobCard = ({ job, showSaveButton = true }) => {
  const { openApplyModal, hasApplied } = usePortal();
  const [saved, setSaved] = useState(false);

  const jobId = job?._id || job?.id;
  const applied = hasApplied(jobId);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSaved(!saved);

    toast.success(
      saved
        ? "Removed from saved jobs"
        : "Job saved successfully"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -10,
      }}
      className="group relative overflow-hidden rounded-[34px] border border-slate-200/70 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
    >
      {/* TOP IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={
            job?.banner ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
          }
          alt={job?.company}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* FEATURED BADGE */}
        <div className="absolute left-5 top-5">
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-xl">
            <HiOutlineSparkles className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold text-white">
              Featured Job
            </span>
          </div>
        </div>

        {/* SAVE BUTTON */}
        {showSaveButton && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSave}
            className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-xl transition ${
              saved
                ? "bg-cyan-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <HiOutlineBookmark
              className={`h-5 w-5 ${
                saved ? "fill-current" : ""
              }`}
            />
          </motion.button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative p-6">
        {/* COMPANY */}
        <div className="-mt-16 flex items-end justify-between">
          {/* LOGO */}
          <motion.div
            whileHover={{
              rotate: 4,
              scale: 1.05,
            }}
            className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl"
          >
            <img
              src={
                job?.logo ||
                `https://ui-avatars.com/api/?name=${job?.company}&background=0f172a&color=fff`
              }
              alt={job?.company}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* MATCH SCORE */}
          <div className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-white shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-cyan-100">
              AI Match
            </p>

            <h3 className="text-2xl font-black">
              {job?.match || "92"}%
            </h3>
          </div>
        </div>

        {/* TITLE */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 transition group-hover:text-cyan-600">
              {job?.title}
            </h2>

            <HiOutlineCheckBadge className="h-5 w-5 text-cyan-500" />
          </div>

          <div className="mt-3 flex items-center gap-2 text-slate-600">
            <HiOutlineBuildingOffice2 className="h-5 w-5 text-cyan-500" />

            <span className="font-medium">
              {job?.company}
            </span>
          </div>
        </div>

        {/* TAGS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700">
            {job?.jobType || "Full Time"}
          </div>

          <div className="rounded-2xl bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700">
            {job?.experienceLevel || "Mid Level"}
          </div>

          <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
            Remote Friendly
          </div>

          <div className="rounded-2xl bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700">
            Urgent Hiring
          </div>
        </div>

        {/* JOB INFO */}
        <div className="mt-7 grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <HiOutlineMapPin className="h-4 w-4 text-cyan-500" />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Location
              </span>
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              {job?.location || "Remote"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-500" />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Salary
              </span>
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              {job?.salary || "$80k - $120k"}
            </p>
          </motion.div>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-7 line-clamp-3 text-sm leading-7 text-slate-600">
          {job?.description}
        </p>

        {/* SKILLS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(job?.skills || [
            "React",
            "Node.js",
            "MongoDB",
          ]).map((skill, index) => (
            <span
              key={index}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <HiOutlineClock className="h-4 w-4 text-cyan-500" />

            <span>
              Apply before{" "}
              {job?.deadline
                ? new Date(
                    job.deadline
                  ).toLocaleDateString()
                : "Dec 30"}
            </span>
          </div>

          <Link to={`/jobs/${job?._id}`}>
            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={(event) => {
                event.preventDefault();
                openApplyModal(job);
              }}
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
            >
              <HiOutlineBriefcase className="h-5 w-5" />

              {applied ? "Applied" : "Apply Now"}

              <motion.div
                animate={{
                  x: [0, 4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
              >
                <HiOutlineArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;