import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineXCircle,
  HiOutlineTrash,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { jobService } from "../../services/jobService";

import PageHeader from "../../components/common/PageHeader";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import CreateJobModal from "../../components/recruiter/CreateJobModal";
import EditJobModal from "../../components/recruiter/EditJobModal";
import { notificationService } from "../../services/notification_service";

const ManageJobs = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);

  // ================= LOAD JOBS =================
  const loadJobs = () => {
    if (!user?.id) {
      setJobs([]);
      return;
    }

    try {
      const recruiterJobs = jobService.getJobsByRecruiter(user.id) || [];

      // Ensure safe default values
      const normalizedJobs = recruiterJobs.map((job) => ({
        ...job,
        applicants: Number(job.applicants || 0),
        views: Number(job.views || 0),
        status: job.status || "draft",
        posted: job.posted || new Date().toISOString(),
      }));

      setJobs(normalizedJobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    loadJobs();

    const handleStorage = () => loadJobs();

    const reloadJobs = () => handleStorage();
    window.addEventListener("storage", reloadJobs);
    window.addEventListener("jobs-updated", reloadJobs);

    return () => {
      window.removeEventListener("storage", reloadJobs);
      window.removeEventListener("jobs-updated", reloadJobs);
    };
  }, [user?.id]);

  // ================= CREATE =================
  const handleCreated = (job) => {
    loadJobs();

    try {
      notificationService.createNotification({
        type: "job",
        title: "Job posted",
        message: `${job.title || "New job"} was posted successfully`,
        relatedId: job._id || job.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // ================= FILTER =================
  const filteredJobs = jobs.filter((job) => {
    const title = String(job.title || job.jobTitle || "").toLowerCase();

    const location = String(job.location || "").toLowerCase();

    const status = String(job.status || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    const matchSearch =
      title.includes(search) || location.includes(search);

    const matchStatus =
      filterStatus === "all" || status === filterStatus;

    return matchSearch && matchStatus;
  });

  // ================= DELETE =================
  const deleteJob = (id) => {
    const jobId = String(id);

    const jobObj = jobs.find(
      (j) => String(j._id || j.id) === jobId
    );

    if (!jobObj) return;

    const confirmDelete = window.confirm(
      `Delete job "${jobObj.title || "Untitled Job"}"?`
    );

    if (!confirmDelete) return;

    const backup = { ...jobObj };

    try {
      jobService.deleteJob(jobId);

      loadJobs();

      toast((t) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            Job deleted successfully
          </span>

          <div className="flex gap-2 mt-3">
            <button
              className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm"
              onClick={() => {
                jobService.createJob(backup);
                loadJobs();
                toast.dismiss(t.id);
              }}
            >
              Undo
            </button>

            <button
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete job");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleJobStatus = (id) => {
    const job = jobs.find(
      (item) => String(item._id || item.id) === String(id)
    );

    if (!job) return;

    const currentStatus = String(job.status).toLowerCase();

    const nextStatus =
      currentStatus === "active" ? "closed" : "active";

    try {
      jobService.updateJob(job._id || job.id, {
        status: nextStatus,
      });

      loadJobs();

      toast.success(`Job marked as ${nextStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // ================= STATUS COLORS =================
  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border border-green-500/50";

      case "closed":
        return "bg-red-500/20 text-red-400 border border-red-500/50";

      case "draft":
        return "bg-slate-500/20 text-slate-400 border border-slate-500/50";

      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  // ================= STATS =================
  const stats = [
    {
      label: "Active Listings",
      value: jobs.filter(
        (j) => String(j.status).toLowerCase() === "active"
      ).length,
      icon: HiOutlineCheckCircle,
      color: "text-green-400",
    },
    {
      label: "Total Applicants",
      value: jobs.reduce(
        (sum, j) => sum + Number(j.applicants || 0),
        0
      ),
      icon: HiOutlineUsers,
      color: "text-cyan-400",
    },
    {
      label: "Total Views",
      value: jobs.reduce(
        (sum, j) => sum + Number(j.views || 0),
        0
      ),
      icon: HiOutlineEye,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <PageHeader
        title="Manage Jobs"
        subtitle="Manage your job listings"
        icon={HiOutlineBriefcase}
      />

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      {stat.label}
                    </p>

                    <h2 className="text-3xl font-bold text-white">
                      {stat.value.toLocaleString()}
                    </h2>
                  </div>

                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH + FILTER */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Post Job
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "active", "closed", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                filterStatus === status
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              {status === "all"
                ? "All Jobs"
                : `${status} (${
                    jobs.filter(
                      (j) =>
                        String(j.status).toLowerCase() === status
                    ).length
                  })`}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard className="overflow-hidden">
        {filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Job
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Posted
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Applicants
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Views
                  </th>

                  <th className="px-6 py-4 text-left text-sm text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job, idx) => (
                  <motion.tr
                    key={job._id || job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700 hover:bg-slate-800/30 transition"
                  >
                    {/* JOB */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">
                          {job.title ||
                            job.jobTitle ||
                            "Untitled Job"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {job.jobType || "Full Time"}
                        </p>
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <HiOutlineMapPin className="h-4 w-4 text-slate-400" />

                        {job.location || "Remote"}
                      </div>
                    </td>

                    {/* POSTED */}
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="h-4 w-4 text-slate-400" />

                        {job.posted
                          ? new Date(
                              job.posted
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* APPLICANTS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <HiOutlineUsers className="h-4 w-4 text-cyan-400" />

                        {job.applicants || 0}
                      </div>
                    </td>

                    {/* VIEWS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <HiOutlineEye className="h-4 w-4 text-purple-400" />

                        {(job.views || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* EDIT */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedEdit(job);
                            setEditOpen(true);
                          }}
                          className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                        >
                          <HiOutlinePencilSquare className="h-4 w-4" />
                        </motion.button>

                        {/* STATUS */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleJobStatus(job._id || job.id)
                          }
                          className={`p-2 rounded-lg ${
                            String(job.status).toLowerCase() ===
                            "active"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {String(job.status).toLowerCase() ===
                          "active" ? (
                            <HiOutlineXCircle className="h-4 w-4" />
                          ) : (
                            <HiOutlineCheckCircle className="h-4 w-4" />
                          )}
                        </motion.button>

                        {/* DELETE */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            deleteJob(job._id || job.id)
                          }
                          className="p-2 rounded-lg bg-red-500/20 text-red-400"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-6 text-center">
            <HiOutlineBriefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-white mb-2">
              No jobs found
            </h3>

            <p className="text-slate-400 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "No jobs posted yet"}
            </p>

            <Button onClick={() => setCreateOpen(true)}>
              Post Your First Job
            </Button>
          </div>
        )}
      </GlassCard>

      {/* MODALS */}
      <CreateJobModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        recruiter={user}
        onCreated={handleCreated}
      />

      <EditJobModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        job={selectedEdit}
        onUpdated={() => loadJobs()}
      />
    </div>
  );
};

export default ManageJobs;