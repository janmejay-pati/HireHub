import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineBookmark,
  HiOutlineArrowRight,
  HiOutlineStar
} from "react-icons/hi2";

const JobCard = ({
  job,
  showSaveButton = true,
  compact = false,
  className = ""
}) => {
  const {
    id,
    title,
    company,
    location,
    jobType,
    salary,
    description,
    logo,
    rating,
    reviews,
    postedDate,
    featured = false,
    urgent = false
  } = job;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`card-hover-glow bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 ${className}`}
    >
      {/* Featured/Ungent Badges */}
      {(featured || urgent) && (
        <div className="flex gap-2 p-4 pb-0">
          {featured && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/50">
              Featured
            </span>
          )}
          {urgent && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/50">
              Urgent
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <img
              src={logo}
              alt={company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
          </motion.div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <Link to={`/jobs/${id}`} className="group">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>

            <p className="text-cyan-400 font-medium mb-2">{company}</p>

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mb-3">
                <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{rating}</span>
                <span className="text-slate-400 text-sm">({reviews?.toLocaleString()} reviews)</span>
              </div>
            )}

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-4">
              <div className="flex items-center gap-1">
                <HiOutlineMapPin className="w-4 h-4" />
                {location}
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineClock className="w-4 h-4" />
                {jobType}
              </div>
              {salary && (
                <div className="flex items-center gap-1">
                  <HiOutlineCurrencyDollar className="w-4 h-4" />
                  {salary}
                </div>
              )}
            </div>

            {/* Description */}
            {!compact && description && (
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}

            {/* Posted Date */}
            <p className="text-xs text-slate-500 mb-4">
              Posted {new Date(postedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link to={`/jobs/${id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              View Details
              <HiOutlineArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>

          {showSaveButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Save job"
            >
              <HiOutlineBookmark className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;