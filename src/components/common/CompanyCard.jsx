import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlinePlus,
  HiOutlineStar
} from "react-icons/hi2";

const CompanyCard = ({
  company,
  className = ""
}) => {
  const {
    id,
    name,
    industry,
    employees,
    logo,
    banner,
    rating,
    reviews,
    openJobs,
    location,
    description,
    featured = false
  } = company;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group ${className}`}
    >
      {/* Banner Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={banner}
          alt={`${name} banner`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/50 backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}

        {/* Company Logo */}
        <div className="absolute -bottom-6 left-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 bg-slate-900 rounded-xl border-4 border-slate-900 overflow-hidden"
          >
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-8">
        <div className="mb-4">
          <Link to={`/companies/${id}`} className="group">
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
              {name}
            </h3>
          </Link>

          <p className="text-slate-400 text-sm mb-2">{industry}</p>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-3">
              <HiOutlineStar className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">{rating}</span>
              <span className="text-slate-400 text-sm">({reviews?.toLocaleString()} reviews)</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <HiOutlineUsers className="w-4 h-4" />
              <span className="font-semibold">{employees?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400">Employees</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <HiOutlineBriefcase className="w-4 h-4" />
              <span className="font-semibold">{openJobs}</span>
            </div>
            <p className="text-xs text-slate-400">Open Jobs</p>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Location */}
        <p className="text-slate-400 text-sm mb-4 flex items-center gap-1">
          <HiOutlineOfficeBuilding className="w-4 h-4" />
          {location}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/companies/${id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-all duration-200 font-medium"
            >
              View Company
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Follow company"
          >
            <HiOutlinePlus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;