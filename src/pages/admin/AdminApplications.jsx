import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineInboxArrowDown,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi2";
import { useState, useEffect, useMemo } from 'react';

import TableComponent from '../../components/common/TableComponent';
import { applicationService } from '../../services/application_service';
import { userService } from '../../services/user_service';
import { jobService } from '../../services/jobService';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    setApplications(applicationService.getAllApplications());
    setLoading(false);
  };

  const handleStatusUpdate = (applicationId, newStatus) => {
    applicationService.updateApplicationStatus(applicationId, newStatus);
    loadApplications();
  };

  const handleDelete = (applicationId) => {
    applicationService.deleteApplication(applicationId);
    loadApplications();
  };

  const applicationsWithDetails = useMemo(() => {
    return applications.map((app) => {
      const candidate = userService.getUserById(app.candidate) || {};
      const job = jobService.getJobById(app.job) || {};

      return {
        ...app,
        candidateName: candidate.name || 'Unknown Candidate',
        candidateEmail: candidate.email || 'Unknown',
        jobTitle: job.title || 'Unknown Role',
        company: job.company || 'Unknown Company',
      };
    });
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applicationsWithDetails.filter((app) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        app.candidateName.toLowerCase().includes(query) ||
        app.candidateEmail.toLowerCase().includes(query) ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'All' || app.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applicationsWithDetails, search, filterStatus]);

  const applicationStats = useMemo(() => applicationService.getApplicationStats(), [applications]);

  const applicationColumns = [
    {
      key: 'candidateName',
      label: 'Candidate',
      render: (_, application) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{application.candidateName}</p>
          <p className="text-xs text-slate-500">{application.candidateEmail}</p>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      label: 'Role',
      render: (_, application) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{application.jobTitle}</p>
          <p className="text-xs text-slate-500">{application.company}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'Applied'
            ? 'bg-blue-100 text-blue-700'
            : value === 'Reviewed'
            ? 'bg-yellow-100 text-yellow-700'
            : value === 'Shortlisted'
            ? 'bg-purple-100 text-purple-700'
            : value === 'Interview'
            ? 'bg-orange-100 text-orange-700'
            : value === 'Hired'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-700'
        }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'appliedAt',
      label: 'Applied Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, application) => (
        <div className="flex flex-wrap gap-2">
          <select
            value={application.status}
            onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-sm text-white"
          >
            {['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            onClick={() => handleDelete(application.id)}
            className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: 'Total Applications',
      value: applicationStats.total,
      icon: HiOutlineDocumentText,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Applications',
      value: applicationStats.applied + applicationStats.reviewed,
      icon: HiOutlineClock,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Interviews Scheduled',
      value: applicationStats.interview,
      icon: HiOutlineUsers,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Hired',
      value: applicationStats.hired,
      icon: HiOutlineCheckCircle,
      color: 'from-emerald-500 to-green-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Applications Management</h1>
        <p className="text-slate-400 mt-2">Review and manage all job applications across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-4xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className={`rounded-2xl p-3 bg-linear-to-br ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-12 py-3 text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-300">
            <HiOutlineFunnel className="h-5 w-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm outline-none text-white"
            >
              <option value="All">All Status</option>
              {['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <TableComponent
          columns={applicationColumns}
          data={filteredApplications}
          pageSize={10}
          emptyMessage="No applications found"
        />
      </div>
    </motion.div>
  );
};

export default AdminApplications;
