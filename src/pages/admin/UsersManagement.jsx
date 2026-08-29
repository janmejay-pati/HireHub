import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineNoSymbol,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { userService } from "../../services/user_service";
import { profileService } from "../../services/profile_service";
import { applicationService } from "../../services/application_service";
import Modal from "../../components/common/Modal";

const roleLabels = {
  admin: "Admin",
  recruiter: "Recruiter",
  candidate: "Candidate",
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase();

      const matchesSearch = `${user.name} ${user.email}`
        .toLowerCase()
        .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    recruiters: users.filter((u) => u.role === "recruiter").length,
    candidates: users.filter((u) => u.role === "candidate").length,
    blocked: users.filter((u) => u.isBlocked).length,
  }), [users]);

  const handleToggleBlock = (id) => {
    userService.toggleUserBlock(id);
    refreshUsers();

    toast.success("User status updated");
  };

  const handleDelete = (id) => {
    userService.deleteUser(id);
    refreshUsers();
    setSelectedUser(null);

    toast.success("User deleted");
  };

  const handleApproveRecruiter = (id) => {
    userService.approveRecruiter(id);

    refreshUsers();

    toast.success("Recruiter approved");
  };

  const handleCandidateStatus = (id, status) => {
    userService.updateCandidateApproval(id, status);

    refreshUsers();

    toast.success(`Candidate marked as ${status}`);
  };

  const selectedProfile =
    selectedUser?.role === "candidate"
      ? profileService.getCandidateProfile(selectedUser.id)
      : null;

  const candidateApplications =
    selectedUser?.role === "candidate"
      ? applicationService.getApplicationsByCandidate(selectedUser.id)
      : [];

  return (
    <div className="space-y-8">

      {/* HERO SECTION */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-linear-to-br
          from-slate-950
          via-slate-900
          to-black
          p-8
        "
      >

        {/* BACKGROUND GLOW */}

        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between min-w-0">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300">
              <HiOutlineShieldCheck className="h-4 w-4" />
              Admin Control Center
            </div>

            <h1 className="mt-5 text-5xl font-black text-white">
              User Management
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-slate-300">
              Manage candidates, recruiters, approvals,
              resumes, applications and account moderation.
            </p>
          </div>

          {/* STATS */}

          <div className="grid gap-4 sm:grid-cols-2">

            {[
              {
                label: "Total Users",
                value: stats.total,
                icon: HiOutlineUsers,
              },
              {
                label: "Candidates",
                value: stats.candidates,
                icon: HiOutlineUserCircle,
              },
              {
                label: "Recruiters",
                value: stats.recruiters,
                icon: HiOutlineBuildingOffice2,
              },
              {
                label: "Blocked",
                value: stats.blocked,
                icon: HiOutlineNoSymbol,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  key={item.label}
                  className="
                    rounded-3xl
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

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* FILTERS */}

      <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">

            <HiOutlineMagnifyingGlass className="h-5 w-5 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users..."
              className="
                w-full
                bg-transparent
                text-white
                outline-none
              "
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="
              rounded-[20px]
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              text-white
            "
          >
            <option value="all">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">

        {/* USERS LIST */}

        <div className="space-y-5">

          {filteredUsers.map((user, index) => (

            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
              className="
                group
                rounded-4xl
                border
                border-white/10
                bg-slate-950/90
                p-6
                backdrop-blur-xl
              "
            >

              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between min-w-0">

                {/* USER INFO */}

                <div className="flex items-center gap-5 min-w-0">

                  <div className="relative">
                    <img
                      src={user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`}
                      alt={user.name}
                      className="h-16 w-16 rounded-lg object-cover border border-white/10 shadow-sm"
                    />
                  </div>

                  <div className="min-w-0">

                    <h2 className="text-xl font-bold text-white">
                      {user.name || "Unnamed User"}
                    </h2>

                    <div className="mt-1 flex items-center gap-2 text-slate-400">
                      <HiOutlineEnvelope className="h-4 w-4" />
                      {user.email}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200">
                        {roleLabels[user.role]}
                      </span>

                      <span className={`rounded-full px-3 py-1 text-xs ${
                        user.isBlocked
                          ? "bg-red-500/20 text-red-200"
                          : "bg-emerald-500/20 text-emerald-100"
                      }`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>

                      {user.role === "candidate" && (
                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200">
                          {user.approvalStatus || "Pending"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                    title="View details"
                  >
                    <HiOutlineEye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  {user.role === 'candidate' && (
                    <>
                      <button
                        onClick={() => handleCandidateStatus(user.id, 'Approved')}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-500/30 transition"
                        title="Approve candidate"
                      >
                        <HiOutlineCheckCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Approve</span>
                      </button>

                      <button
                        onClick={() => handleCandidateStatus(user.id, 'Rejected')}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-100 hover:bg-red-500/30 transition"
                        title="Reject candidate"
                      >
                        <HiOutlineXCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </>
                  )}

                  {user.role === 'recruiter' && !user.isVerified && (
                    <button
                      onClick={() => handleApproveRecruiter(user.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500/70 px-4 py-2 text-sm text-white hover:bg-blue-500 transition"
                      title="Verify recruiter"
                    >
                      <HiOutlineCheckBadge className="h-4 w-4" />
                      <span className="hidden sm:inline">Verify</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleBlock(user.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-4 py-2 text-sm text-amber-100 hover:bg-amber-500/30 transition"
                    title={user.isBlocked ? 'Activate user' : 'Suspend user'}
                  >
                    <HiOutlineNoSymbol className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.isBlocked ? 'Activate' : 'Suspend'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/70 px-4 py-2 text-sm text-white hover:bg-red-600 transition"
                    title="Delete user"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DETAILS MODAL */}

        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={selectedUser?.name || 'User Details'}
          size="xl"
          footer={
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="rounded-2xl bg-slate-900/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          }
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="mt-2 text-white">{selectedUser.email}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="mt-2 text-white">{roleLabels[selectedUser.role]}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="mt-2 text-white">{selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                </div>
              </div>

              {selectedUser.role === 'candidate' && selectedProfile && (
                <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center gap-2">
                    <HiOutlineAcademicCap className="h-5 w-5 text-cyan-300" />
                    <h3 className="text-lg font-semibold text-white">Candidate Profile</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Skills</p>
                      <p className="mt-2 text-slate-200">
                        {selectedProfile.skills?.map((skill) =>
                          typeof skill === 'string' ? skill : skill?.name || ''
                        ).filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Experience</p>
                      <p className="mt-2 text-slate-200">{selectedProfile.experience?.length || 0} positions</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Education</p>
                      <p className="mt-2 text-slate-200">{selectedProfile.education?.length || 0} entries</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Projects</p>
                      <p className="mt-2 text-slate-200">{selectedProfile.projects?.length || 0}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Resume</p>
                      {selectedProfile.resumeUrl ? (
                        <a
                          href={selectedProfile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-3 text-sm text-cyan-100"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                          View Resume
                        </a>
                      ) : (
                        <p className="mt-2 text-slate-400">Resume not uploaded</p>
                      )}
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Applied Jobs</p>
                      <p className="mt-2 text-slate-200">{candidateApplications.length} records</p>
                    </div>
                  </div>

                  {candidateApplications.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {candidateApplications.map((job) => (
                        <div key={job.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                              <p className="mt-1 text-sm text-slate-400">{job.company}</p>
                            </div>
                            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100">{job.status}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1"><HiOutlineBuildingOffice2 className="h-3.5 w-3.5" />{job.company}</span>
                            <span className="inline-flex items-center gap-1"><HiOutlineMapPin className="h-3.5 w-3.5" />{job.location}</span>
                            <span className="inline-flex items-center gap-1"><HiOutlineCalendarDays className="h-3.5 w-3.5" />{new Date(job.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedUser.role === 'recruiter' && (
                <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="h-5 w-5 text-cyan-300" />
                    <h3 className="text-lg font-semibold text-white">Recruiter Details</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Verification</p>
                      <p className="mt-2 text-slate-200">{selectedUser.isVerified ? 'Verified' : 'Pending'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Company</p>
                      <p className="mt-2 text-slate-200">{selectedUser.companyName || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Website</p>
                      <p className="mt-2 text-slate-200">{selectedUser.website || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Applications</p>
                      <p className="mt-2 text-slate-200">{candidateApplications.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UsersManagement;