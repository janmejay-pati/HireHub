import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchJobDetails } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";
import { usePortal } from "../../context/PortalContext";
import { applicationService } from "../../services/application_service";

import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineBookmark,
  HiOutlineShare,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openApplyModal, hasApplied } = usePortal();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      const response = await fetchJobDetails(id);

      if (response.success) {
        setJob(response.data);
      }

      setLoading(false);
    };

    loadJob();
  }, [id]);

  useEffect(() => {
    if (job && user?.role === "candidate") {
      const application = applicationService
        .getApplicationsByCandidate(user.id)
        .find((app) => app.jobId === job._id);
      setExistingApplication(application || null);
    }
  }, [job, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="h-14 w-14 rounded-full border-4 border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900">
            Job Not Found
          </h2>

          <p className="mt-3 text-slate-500">
            The job you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-14">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-white/30 bg-white/80 shadow-[0_10px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl"
        >
          {/* COVER */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={
                job?.banner ||
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
              }
              alt={job?.company}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            {/* ACTIONS */}
            <div className="absolute right-6 top-6 flex items-center gap-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 backdrop-blur-xl transition ${
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
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-white backdrop-blur-xl transition hover:bg-white/30">
                <HiOutlineShare className="h-5 w-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-5">
                  {/* LOGO */}
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotate: 3,
                    }}
                    className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/30 bg-white shadow-xl"
                  >
                    <img
                      src={
                        job?.logo ||
                        `https://ui-avatars.com/api/?name=${job.company}&background=0ea5e9&color=fff`
                      }
                      alt={job.company}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <div className="rounded-full bg-cyan-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-100 backdrop-blur-xl">
                        {job.jobType}
                      </div>

                      <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-100 backdrop-blur-xl">
                        Hiring Now
                      </div>
                    </div>

                    <h1 className="text-4xl font-black text-white md:text-5xl">
                      {job.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <HiOutlineBuildingOffice2 className="h-5 w-5 text-cyan-300" />
                        {job.company}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiOutlineMapPin className="h-5 w-5 text-cyan-300" />
                        {job.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="h-5 w-5 text-cyan-300" />
                        Apply before{" "}
                        {new Date(
                          job.deadline
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* APPLY BUTTON */}
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() => {
                    if (existingApplication) {
                      navigate('/candidate/applications');
                      return;
                    }

                    openApplyModal(job);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-cyan-500/30"
                >
                  {existingApplication || hasApplied(job?._id) ? 'View Application' : 'Apply Now'}
                  <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="grid gap-8 p-8 lg:grid-cols-3 lg:p-10">
            {/* LEFT */}
            <div className="space-y-8 lg:col-span-2">
              {/* ABOUT */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                    <HiOutlineBriefcase className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Job Overview
                    </h2>

                    <p className="text-sm text-slate-500">
                      Detailed description about the role
                    </p>
                  </div>
                </div>

                <p className="leading-8 text-slate-600">
                  {job.description}
                </p>
              </motion.div>

              {/* REQUIREMENTS */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* REQUIREMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-4xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <h3 className="mb-6 text-xl font-bold text-slate-900">
                    Requirements
                  </h3>

                  <div className="space-y-4">
                    {job.requirements?.length > 0 ? (
                      job.requirements.map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 transition"
                        >
                          <div className="mt-1 rounded-full bg-cyan-100 p-1 text-cyan-600">
                            <HiOutlineCheckBadge className="h-4 w-4" />
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {item}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-500">
                        No requirements available.
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* RESPONSIBILITIES */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-4xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <h3 className="mb-6 text-xl font-bold text-slate-900">
                    Responsibilities
                  </h3>

                  <div className="space-y-4">
                    {job.responsibilities?.length > 0 ? (
                      job.responsibilities.map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 transition"
                        >
                          <div className="mt-1 rounded-full bg-emerald-100 p-1 text-emerald-600">
                            <HiOutlineCheckBadge className="h-4 w-4" />
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {item}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-500">
                        No responsibilities available.
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              {/* QUICK INFO */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-4xl border border-slate-100 bg-white p-7 shadow-sm"
              >
                <h3 className="mb-6 text-xl font-bold text-slate-900">
                  Quick Info
                </h3>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <HiOutlineCurrencyDollar className="h-6 w-6 text-emerald-500" />

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Salary
                        </p>

                        <h4 className="font-bold text-slate-900">
                          {job.salary}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <HiOutlineBriefcase className="h-6 w-6 text-cyan-500" />

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Experience
                        </p>

                        <h4 className="font-bold text-slate-900">
                          {job.experienceLevel}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <HiOutlineSparkles className="h-6 w-6 text-purple-500" />

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          AI Match
                        </p>

                        <h4 className="font-bold text-cyan-600">
                          92% Match
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* COMPANY CARD */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-4xl border border-slate-100 bg-linear-to-br from-cyan-500 to-blue-600 p-7 text-white shadow-xl"
              >
                <h3 className="text-2xl font-bold">
                  About Company
                </h3>

                <p className="mt-4 text-sm leading-7 text-cyan-50">
                  {job.company} is hiring talented professionals
                  to build next-generation digital experiences.
                </p>

                <button className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-cyan-600 transition hover:scale-105">
                  Visit Company
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobDetails;