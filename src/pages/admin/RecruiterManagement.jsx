import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineCheckBadge,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineNoSymbol,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineEnvelope,
  HiOutlineBriefcase,
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineXMark,
} from "react-icons/hi2";

import { userService } from "../../services/user_service";
import { companyService } from "../../services/company_service";
import { jobService } from "../../services/jobService";
import Modal from "../../components/common/Modal";

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  useEffect(() => {
    refresh();

    const reload = () => refresh();
    window.addEventListener("storage", reload);
    window.addEventListener("companies-updated", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("companies-updated", reload);
    };
  }, []);

  const refresh = () => {
    setRecruiters(userService.getUsersByRole("recruiter") || []);
    setCompanies(companyService.getAllCompanies() || []);
    setSelectedRecruiter(null);
  };

  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((recruiter) => {
      const query = search.toLowerCase();

      return (
        recruiter?.name?.toLowerCase().includes(query) ||
        recruiter?.email?.toLowerCase().includes(query) ||
        recruiter?.company?.toLowerCase().includes(query)
      );
    });
  }, [recruiters, search]);

  const recruiterStats = {
    totalRecruiters: recruiters.length,

    verifiedRecruiters: recruiters.filter(
      (r) => r.isVerified
    ).length,

    suspendedRecruiters: recruiters.filter(
      (r) => r.status === "Suspended"
    ).length,

    activeRecruiters: recruiters.filter(
      (r) => r.status !== "Suspended"
    ).length,
  };

  const handleVerifyRecruiter = (id) => {
    try {
      userService.approveRecruiter(id);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuspend = (id) => {
    try {
      if (userService.suspendUser) {
        userService.suspendUser(id);
      } else {
        userService.toggleUserBlock(id);
      }

      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    try {
      userService.deleteUser(id);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyCompany = (companyId) => {
    if (!companyId) return;

    try {
      companyService.verifyCompany(companyId);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromoteCompany = (companyId) => {
    if (!companyId) return;

    try {
      companyService.updateCompany(companyId, {
        featured: true,
      });

      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-linear-to-br
          from-slate-950
          via-slate-900
          to-black
          p-8
          shadow-2xl
        "
      >
        {/* GLOW EFFECTS */}

        <div
          className="
            absolute
            left-0
            top-0
            h-[280px]
            w-[280px]
            rounded-full
            bg-cyan-500/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-[260px]
            w-[260px]
            rounded-full
            bg-violet-500/20
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT */}

            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-400/20
                  bg-cyan-500/10
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-cyan-300
                "
              >
                <HiOutlineSparkles className="h-4 w-4" />

                Recruiter Control Center
              </div>

              <h1
                className="
                  mt-5
                  text-5xl
                  font-black
                  text-white
                "
              >
                Recruiter
                <span
                  className="
                    bg-linear-to-r
                    from-cyan-400
                    to-blue-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  {" "}
                  Management
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-3xl
                  text-lg
                  leading-8
                  text-slate-300
                "
              >
                Manage recruiters, verify companies,
                monitor job publishers, approve accounts,
                suspend suspicious activities and control
                your hiring ecosystem with futuristic admin tools.
              </p>
            </div>

            {/* RIGHT STATS */}

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Recruiters",
                  value: recruiterStats.totalRecruiters,
                  icon: HiOutlineUsers,
                  color: "from-cyan-500 to-blue-600",
                },

                {
                  label: "Verified",
                  value: recruiterStats.verifiedRecruiters,
                  icon: HiOutlineCheckBadge,
                  color: "from-emerald-500 to-green-600",
                },

                {
                  label: "Suspended",
                  value: recruiterStats.suspendedRecruiters,
                  icon: HiOutlineNoSymbol,
                  color: "from-red-500 to-rose-600",
                },

                {
                  label: "Active",
                  value: recruiterStats.activeRecruiters,
                  icon: HiOutlineBolt,
                  color: "from-violet-500 to-fuchsia-600",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      scale: 1.04,
                      y: -5,
                    }}
                    className="
                      rounded-4xl
                      border
                      border-white/10
                      bg-white/5
                      p-5
                      backdrop-blur-xl
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          {item.label}
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">
                          {item.value}
                        </h2>
                      </div>

                      <div
                        className={`
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-linear-to-br
                          ${item.color}
                        `}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN SECTION */}

      <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        {/* LEFT */}

        <div className="space-y-6">
          {/* SEARCH */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-4xl
              border
              border-white/10
              bg-slate-950/70
              p-5
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div
                className="
                  flex
                  flex-1
                  items-center
                  gap-3
                  rounded-[1.3rem]
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-4
                "
              >
                <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search recruiter, email or company..."
                  className="
                    w-full
                    bg-transparent
                    text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />
              </div>

              <div
                className="
                  rounded-[1.3rem]
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-4
                  text-sm
                  text-slate-300
                "
              >
                {filteredRecruiters.length} recruiters found
              </div>
            </div>
          </motion.div>

          {/* RECRUITERS */}

          <div className="space-y-5">
            {filteredRecruiters.map(
              (recruiter, index) => {
                const recruiterCompanies =
                  companyService.getCompaniesByRecruiter(
                    recruiter.id
                  ) || [];

                const recruiterJobs =
                  jobService.getJobsByRecruiter(
                    recruiter.id
                  ) || [];

                return (
                  <motion.div
                    key={recruiter.id}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    className="
                      relative
                      overflow-hidden
                      rounded-4xl
                      border
                      border-white/10
                      bg-slate-950/70
                      p-6
                      shadow-xl
                      backdrop-blur-xl
                    "
                  >
                    {/* CARD GLOW */}

                    <div
                      className="
                        absolute
                        right-0
                        top-0
                        h-40
                        w-40
                        rounded-full
                        bg-cyan-500/10
                        blur-3xl
                      "
                    />

                    <div className="relative z-10">
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        {/* LEFT */}

                        <div className="flex items-start gap-5">
                          <motion.div whileHover={{ scale: 1.02 }} className="relative">
                            <img
                              src={recruiter.profileImage || recruiter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name || 'Recruiter')}`}
                              alt={recruiter.name}
                              className="h-16 w-16 rounded-xl object-cover border border-white/10 shadow-lg"
                            />
                          </motion.div>

                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {recruiter.name}
                            </h2>

                            <div className="mt-2 flex items-center gap-2 text-slate-400">
                              <HiOutlineEnvelope className="h-4 w-4" />

                              {recruiter.email}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span
                                className={`
                                  rounded-full
                                  px-4
                                  py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    recruiter.isVerified
                                      ? "bg-emerald-500/20 text-emerald-200"
                                      : "bg-yellow-500/20 text-yellow-200"
                                  }
                                `}
                              >
                                {recruiter.isVerified
                                  ? "Verified"
                                  : "Pending"}
                              </span>

                              <span
                                className={`
                                  rounded-full
                                  px-4
                                  py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    recruiter.status ===
                                    "Suspended"
                                      ? "bg-red-500/20 text-red-200"
                                      : "bg-cyan-500/20 text-cyan-200"
                                  }
                                `}
                              >
                                {recruiter.status ||
                                  "Active"}
                              </span>

                              <span
                                className="
                                  rounded-full
                                  bg-violet-500/20
                                  px-4
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-violet-200
                                "
                              >
                                {
                                  recruiterCompanies.length
                                }{" "}
                                Companies
                              </span>

                              <span
                                className="
                                  rounded-full
                                  bg-orange-500/20
                                  px-4
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-orange-200
                                "
                              >
                                {recruiterJobs.length} Jobs
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRecruiter(recruiter)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                            title="View recruiter"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {!recruiter.isVerified && (
                            <button
                              onClick={() => handleVerifyRecruiter(recruiter.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-400 transition"
                            >
                              <HiOutlineCheckBadge className="h-4 w-4" />
                              <span className="hidden sm:inline">Verify</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSuspend(recruiter.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-400 transition"
                          >
                            <HiOutlineNoSymbol className="h-4 w-4" />
                            <span className="hidden sm:inline">Suspend</span>
                          </button>

                          <button
                            onClick={() => handleDelete(recruiter.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-400 transition"
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">
          {/* INFO PANEL */}

          <div
            className="
              rounded-4xl
              border
              border-white/10
              bg-slate-950/70
              p-6
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-linear-to-br
                  from-cyan-500
                  to-blue-600
                "
              >
                <HiOutlineShieldCheck className="h-7 w-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-cyan-300">
                  Recruiter Insights
                </p>

                <h2 className="text-xl font-bold text-white">
                  Moderation Center
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Verify trusted recruiters",
                "Approve company profiles",
                "Track recruiter job activity",
                "Suspend suspicious accounts",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-2xl
                    bg-white/5
                    px-4
                    py-4
                    text-sm
                    text-slate-300
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* SELECTED RECRUITER */}

          {/* Details open in modal for a cleaner workflow */}
        </div>
      </div>

      <AnimatePresence>
        {selectedRecruiter && (
          <Modal
            isOpen={Boolean(selectedRecruiter)}
            onClose={() => setSelectedRecruiter(null)}
            title={`${selectedRecruiter.name} • ${selectedRecruiter.company || 'Recruiter'}`}
            size="xl"
            footer={
              <>
                {!selectedRecruiter.isVerified && (
                  <button
                    onClick={() => handleVerifyRecruiter(selectedRecruiter.id)}
                    className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleSuspend(selectedRecruiter.id)}
                  className="rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400"
                >
                  Suspend
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedRecruiter.id);
                    setSelectedRecruiter(null);
                  }}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  Delete
                </button>
              </>
            }
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Recruiter Overview
                  </h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-300">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Email</p>
                      <p className="mt-1 text-white">{selectedRecruiter.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Company</p>
                      <p className="mt-1 text-white">
                        {selectedRecruiter.company || 'No company linked'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Status</p>
                      <p className="mt-1 text-white">{selectedRecruiter.status || 'Active'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Verified</p>
                      <p className="mt-1 text-white">{selectedRecruiter.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Metrics
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/5 p-4">
                      <p className="text-xs uppercase text-slate-500">Companies</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {companyService.getCompaniesByRecruiter(selectedRecruiter.id)?.length || 0}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4">
                      <p className="text-xs uppercase text-slate-500">Jobs Posted</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {jobService.getJobsByRecruiter(selectedRecruiter.id)?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Linked Companies
                  </h3>
                  <div className="mt-4 space-y-3">
                    {companyService.getCompaniesByRecruiter(selectedRecruiter.id)?.map((company) => (
                      <div
                        key={company.id}
                        className="rounded-3xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="font-semibold text-white">{company.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{company.industry || 'Technology'}</p>
                      </div>
                    ))}
                    {!companyService.getCompaniesByRecruiter(selectedRecruiter.id)?.length && (
                      <p className="text-sm text-slate-400">No linked companies found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruiterManagement;