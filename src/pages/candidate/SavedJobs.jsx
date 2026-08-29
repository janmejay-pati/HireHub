import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineBookmark,
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineTrash,
  HiOutlineArrowRight
} from "react-icons/hi2";

import { usePortal } from "../../context/PortalContext";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import PageHeader from "../../components/common/PageHeader";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const SavedJobs = () => {
  const navigate = useNavigate();
  const { openApplyModal, hasApplied } = usePortal();
  const { savedJobs, unsaveJob, loading } = useSavedJobs();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");

  useEffect(() => {
    setFilteredJobs(savedJobs);
  }, [savedJobs]);

  const applyFilters = () => {
    let filtered = savedJobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        String(job.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(job.company).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCompany) {
      filtered = filtered.filter(job =>
        String(job.company).toLowerCase().includes(filterCompany.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterCompany, savedJobs]);

  const removeSavedJob = (id) => {
    unsaveJob(id);
    toast.success("Job removed from saved jobs");
  };

  const companies = useMemo(
    () => [...new Set(savedJobs.map((job) => job.company || "Unknown"))],
    [savedJobs]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved Jobs"
        subtitle={`You have ${savedJobs.length} saved opportunities`}
        icon={HiOutlineBookmark}
      />

      <GlassCard className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCompany("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                !filterCompany
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              All Companies
            </button>
            {companies.map((company) => (
              <button
                key={company}
                onClick={() => setFilterCompany(filterCompany === company ? "" : company)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterCompany === company
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {loading ? (
        <GlassCard className="p-8 text-center">Loading saved jobs...</GlassCard>
      ) : filteredJobs.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <HiOutlineBookmark className="mx-auto h-12 w-12 text-slate-500" />
          <h2 className="mt-4 text-xl font-bold text-white">No saved jobs yet</h2>
          <p className="mt-2 text-sm text-slate-400">Save jobs from the marketplace to see them here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id || job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:scale-[1.01] transition-transform relative overflow-hidden">
                {job.featured && (
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: 2, duration: 2 }}
                  >
                   
                  </motion.div>
                )}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-6">
                    <img
                      src={job.logo || job.companyLogo || "https://via.placeholder.com/64"}
                      alt={job.company || "Company"}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-700"
                    />

                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold text-white">{job.title || job.jobTitle || "Job opportunity"}</h3>
                        <span className="rounded-full bg-slate-800/70 px-3 py-1 text-sm text-slate-300">
                          {job.location || "Remote"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{job.company || "HireHub"}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
                        <span>{job.jobType || job.workMode || "Full Time"}</span>
                        <span>{job.salary || job.compensation || "Competitive"}</span>
                        <span>{job.experienceLevel || job.experience || "Mid Level"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => openApplyModal(job)} className="rounded-3xl bg-cyan-600 hover:bg-cyan-700">
                      Apply
                    </Button>
                    <Button onClick={() => removeSavedJob(job._id || job.id)} className="rounded-3xl bg-white/5 text-white hover:bg-white/10">
                      <HiOutlineTrash className="mr-2 h-5 w-5" /> Remove
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;