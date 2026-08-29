import { motion } from 'framer-motion';
import {
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineBookmark,
  HiOutlineShare,
} from 'react-icons/hi2';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import toast from 'react-hot-toast';

const JobDetailsModal = ({ job, isOpen, onClose, onApply }) => {
  const { isSaved, toggleSaveJob } = useSavedJobs();

  if (!isOpen || !job) return null;

  const handleSave = (e) => {
    e.stopPropagation();
    const wasSaved = isSaved(job._id);
    toggleSaveJob(job);
    toast.success(wasSaved ? 'Removed from saved' : 'Saved successfully');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 z-50 w-full max-h-[90vh] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-4xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>

        {/* Banner */}
        <div className="relative -m-8 mb-6 h-48 w-full overflow-hidden rounded-t-[2rem] bg-slate-800">
          <img
            src={
              job?.banner ||
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200'
            }
            alt={job?.company}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex gap-4">
            {/* Logo */}
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={
                  job?.logo ||
                  `https://ui-avatars.com/api/?name=${job?.company}&background=0f172a&color=fff`
                }
                alt={job?.company}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Company */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{job?.title}</h1>
              <p className="mt-1 flex items-center gap-2 text-cyan-300">
                <HiOutlineBuildingOffice2 className="h-4 w-4" />
                {job?.company}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {job?.jobType}
                </span>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                  {job?.experienceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                isSaved(job._id)
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <HiOutlineBookmark className={`h-5 w-5 ${isSaved(job._id) ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
            >
              <HiOutlineShare className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-400">LOCATION</p>
            <p className="mt-2 flex items-center gap-2 text-white">
              <HiOutlineMapPin className="h-4 w-4 text-cyan-400" />
              {job?.location}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-400">SALARY</p>
            <p className="mt-2 flex items-center gap-2 text-white">
              <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-400" />
              {job?.salary}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-400">DEADLINE</p>
            <p className="mt-2 flex items-center gap-2 text-white">
              <HiOutlineClock className="h-4 w-4 text-violet-400" />
              {job?.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-slate-400">POSTED</p>
            <p className="mt-2 text-white">{job?.posted || 'Recently'}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">About This Job</h2>
          <p className="mt-3 leading-relaxed text-slate-300">
            {job?.description || 'No description provided'}
          </p>
        </div>

        {/* Skills */}
        {job?.skills && job.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white">Required Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">Why Join Us</h2>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li className="flex items-center gap-3">
              <HiOutlineCheckBadge className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              Competitive salary and benefits package
            </li>
            <li className="flex items-center gap-3">
              <HiOutlineCheckBadge className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              Flexible work arrangements
            </li>
            <li className="flex items-center gap-3">
              <HiOutlineCheckBadge className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              Career growth opportunities
            </li>
            <li className="flex items-center gap-3">
              <HiOutlineCheckBadge className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              Supportive team environment
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onApply(job);
              onClose();
            }}
            className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition"
          >
            Apply Now
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default JobDetailsModal;
