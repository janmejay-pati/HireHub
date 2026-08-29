import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineBuildingOffice2,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineXMark,
  HiOutlineBriefcase,
} from "react-icons/hi2";

import PageHeader from "../../components/common/PageHeader";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";

import { applicationService } from "../../services/application_service";
import { useAuth } from "../../context/AuthContext";

/* ================= STATUS CONFIG ================= */

const statusConfig = {
  Applied: {
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    icon: HiOutlineDocumentText,
  },

  Reviewed: {
    color:
      "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    icon: HiOutlineEye,
  },

  Shortlisted: {
    color:
      "from-purple-500 to-pink-500",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    icon: HiOutlineCheckCircle,
  },

  Interview: {
    color:
      "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    icon:
      HiOutlineChatBubbleLeftRight,
  },

  Offered: {
    color:
      "from-green-500 to-emerald-500",
    bg: "bg-green-500/20",
    text: "text-green-400",
    icon: HiOutlineCheckCircle,
  },

  Rejected: {
    color: "from-red-500 to-rose-500",
    bg: "bg-red-500/20",
    text: "text-red-400",
    icon: HiOutlineXCircle,
  },
};

const statusOrder = [
  "Applied",
  "Reviewed",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
];

/* ================= JOB DETAILS MODAL ================= */

const JobDetailsModal = ({
  isOpen,
  onClose,
  job,
}) => {
  if (!job) return null;

  const config =
    statusConfig[job.status] ||
    statusConfig.Applied;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              type: "spring",
              damping: 20,
            }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#07111f]/95 shadow-[0_0_80px_rgba(0,255,255,0.12)]"
          >
            {/* BACKGROUND GLOW */}

            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

            {/* HEADER */}

            <div
              className={`relative overflow-hidden border-b border-white/10 bg-linear-to-r ${config.color}/10`}
            >
              <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  {/* LOGO */}

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                    className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br ${config.color} text-4xl font-black text-white shadow-2xl`}
                  >
                    {job.company
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </motion.div>

                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h2 className="text-4xl font-black text-white">
                        {job.jobTitle}
                      </h2>

                      <span
                        className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] ${config.bg} ${config.text}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-5 text-slate-300">
                      <div className="flex items-center gap-2">
                        <HiOutlineBuildingOffice2 className="h-5 w-5 text-cyan-400" />
                        {job.company}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiOutlineMapPin className="h-5 w-5 text-cyan-400" />
                        {job.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiOutlineCurrencyDollar className="h-5 w-5 text-cyan-400" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLOSE */}

                <motion.button
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                >
                  <HiOutlineXMark className="h-7 w-7" />
                </motion.button>
              </div>
            </div>

            {/* BODY */}

            <div className="max-h-[75vh] overflow-y-auto p-8">
              <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                {/* LEFT */}

                <div className="space-y-8">
                  <GlassCard className="p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-2xl bg-cyan-500/15 p-3">
                        <HiOutlineBriefcase className="h-6 w-6 text-cyan-400" />
                      </div>

                      <h3 className="text-2xl font-black text-white">
                        Job Description
                      </h3>
                    </div>

                    <p className="leading-relaxed text-slate-300">
                      {job.description ||
                        "We are looking for passionate developers who can build scalable and modern digital experiences."}
                    </p>
                  </GlassCard>

                  <GlassCard className="p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-2xl bg-purple-500/15 p-3">
                        <HiOutlineSparkles className="h-6 w-6 text-purple-400" />
                      </div>

                      <h3 className="text-2xl font-black text-white">
                        Responsibilities
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        "Build scalable web applications",
                        "Collaborate with product teams",
                        "Improve UI/UX performance",
                        "Write clean reusable code",
                        "Work with modern technologies",
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.08,
                          }}
                          className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4"
                        >
                          <div className="rounded-full bg-green-500/15 p-1">
                            <HiOutlineCheckCircle className="h-5 w-5 text-green-400" />
                          </div>

                          <p className="text-slate-300">
                            {item}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* RIGHT */}

                <div className="space-y-6">
                  <GlassCard className="p-7">
                    <h3 className="mb-6 text-2xl font-black text-white">
                      Job Info
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          label: "Job Type",
                          value:
                            job.type ||
                            "Full Time",
                        },

                        {
                          label: "Experience",
                          value:
                            "2+ Years",
                        },

                        {
                          label: "Applied On",
                          value:
                            new Date(
                              job.appliedDate
                            ).toLocaleDateString(),
                        },

                        {
                          label: "Work Mode",
                          value: "Remote",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{
                            scale: 1.02,
                          }}
                          className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-4"
                        >
                          <span className="text-slate-400">
                            {item.label}
                          </span>

                          <span className="font-semibold text-white">
                            {item.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* TIMELINE */}

                  <GlassCard className="p-7">
                    <h3 className="mb-6 text-2xl font-black text-white">
                      Application Progress
                    </h3>

                    <div className="space-y-5">
                      {statusOrder
                        .slice(0, 5)
                        .map(
                          (
                            step,
                            index
                          ) => (
                            <div
                              key={step}
                              className="flex items-center gap-4"
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                  statusOrder.indexOf(
                                    job.status
                                  ) >=
                                  index
                                    ? "bg-cyan-500 text-white"
                                    : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                <HiOutlineCheckCircle className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {step}
                                </p>

                                <p className="text-xs text-slate-500">
                                  Completed
                                </p>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="mt-10 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className={`rounded-2xl bg-linear-to-r ${config.color} px-8 py-4 font-semibold text-white shadow-2xl`}
                >
                  Track Application
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-slate-300"
                >
                  <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />
                  Open Job Page
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ================= MAIN COMPONENT ================= */

const AppliedJobs = () => {
  const { user } = useAuth();

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [viewMode, setViewMode] =
    useState("grid");

  const applications = useMemo(() => {
    if (!user) return [];

    return applicationService.getApplicationsByCandidate(
      user.id
    );
  }, [user]);

  const stats = {
    total: applications.length,

    active: applications.filter(
      (app) =>
        ![
          "Offered",
          "Rejected",
        ].includes(app.status)
    ).length,

    interviews:
      applications.filter(
        (app) =>
          app.status === "Interview"
      ).length,

    offers: applications.filter(
      (app) =>
        app.status === "Offered"
    ).length,
  };

  const withdrawApplication = (
    id
  ) => {
    applicationService.deleteApplication(
      id
    );

    toast.success(
      "Application withdrawn successfully."
    );

    window.location.reload();
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}

      <PageHeader
        title="Applied Jobs"
        subtitle="Track your applications with a modern interactive experience"
        icon={HiOutlineDocumentText}
        actions={
          <div className="flex gap-3">
            <Button
              variant={
                viewMode === "grid"
                  ? "primary"
                  : "secondary"
              }
              size="sm"
              onClick={() =>
                setViewMode("grid")
              }
            >
              Grid View
            </Button>

            <Button
              variant={
                viewMode === "list"
                  ? "primary"
                  : "secondary"
              }
              size="sm"
              onClick={() =>
                setViewMode("list")
              }
            >
              List View
            </Button>
          </div>
        }
      />

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label:
              "Applications",
            value: stats.total,
            icon:
              HiOutlineDocumentText,
            color:
              "from-blue-500 to-cyan-500",
          },

          {
            label: "Active",
            value: stats.active,
            icon:
              HiOutlineArrowTrendingUp,
            color:
              "from-cyan-500 to-blue-500",
          },

          {
            label:
              "Interviews",
            value:
              stats.interviews,
            icon:
              HiOutlineChatBubbleLeftRight,
            color:
              "from-purple-500 to-pink-500",
          },

          {
            label: "Offers",
            value: stats.offers,
            icon:
              HiOutlineCheckCircle,
            color:
              "from-green-500 to-emerald-500",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index * 0.1,
              }}
            >
              <GlassCard className="relative overflow-hidden p-6">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-10`}
                />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {item.label}
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-white">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`rounded-3xl bg-linear-to-br ${item.color} p-4`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* JOBS */}

      <div
        className={
          viewMode === "grid"
            ? "grid gap-8 md:grid-cols-2 xl:grid-cols-3"
            : "space-y-6"
        }
      >
        {applications.map(
          (job, index) => {
            const config =
              statusConfig[
                job.status
              ] ||
              statusConfig.Applied;

            const Icon =
              config.icon;

            return (
              <motion.div
                key={job.id}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <GlassCard className="group relative overflow-hidden rounded-4xl border border-white/10 p-6 transition-all duration-500 hover:border-cyan-500/30">
                  {/* GLOW */}

                  <div
                    className={`absolute inset-0 bg-linear-to-br ${config.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10`}
                  />

                  {/* TOP */}

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{
                          rotate: 6,
                          scale: 1.08,
                        }}
                        className={`flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br ${config.color} text-2xl font-black text-white shadow-2xl`}
                      >
                        {job.company
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </motion.div>

                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {job.jobTitle}
                        </h3>

                        <p className="mt-1 text-slate-400">
                          {job.company}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <HiOutlineMapPin className="h-4 w-4" />
                            {
                              job.location
                            }
                          </div>

                          <div className="flex items-center gap-1">
                            <HiOutlineClock className="h-4 w-4" />
                            {new Date(
                              job.appliedDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${config.bg} ${config.text}`}
                    >
                      {job.status}
                    </div>
                  </div>

                  {/* DESC */}

                  <p className="relative mt-6 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {job.description ||
                      "Modern opportunity with excellent growth and career progression."}
                  </p>

                  {/* SALARY */}

                  <div className="relative mt-5 flex items-center gap-2 text-cyan-400">
                    <HiOutlineCurrencyDollar className="h-5 w-5" />

                    <span className="font-semibold">
                      {job.salary}
                    </span>
                  </div>

                  {/* BUTTONS */}

                  <div className="relative mt-7 flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() =>
                        setSelectedJob(
                          job
                        )
                      }
                    >
                      View Details
                    </Button>

                    {[
                      "Applied",
                      "Reviewed",
                    ].includes(
                      job.status
                    ) && (
                      <Button
                        variant="danger"
                        onClick={() =>
                          withdrawApplication(
                            job.id
                          )
                        }
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          }
        )}
      </div>

      {/* EMPTY */}

      {applications.length ===
        0 && (
        <GlassCard className="py-20 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10">
            <HiOutlineDocumentText className="h-12 w-12 text-cyan-400" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-white">
            No Applications Yet
          </h2>

          <p className="mt-3 text-slate-400">
            Start applying to jobs
            and track them here.
          </p>
        </GlassCard>
      )}

      {/* MODAL */}

      <JobDetailsModal
        isOpen={!!selectedJob}
        onClose={() =>
          setSelectedJob(null)
        }
        job={selectedJob}
      />
    </div>
  );
};

export default AppliedJobs;