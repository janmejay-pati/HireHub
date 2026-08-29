import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionTo,
  actionOnClick,
  className = ''
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-8 py-16 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="rounded-full bg-slate-100 p-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        <Icon className="h-8 w-8 text-slate-400" />
      </motion.div>

      <motion.h3
        className="mt-4 text-lg font-semibold text-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="mt-2 text-sm text-slate-600 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>

      {(actionLabel && (actionTo || actionOnClick)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {actionTo ? (
            <Link
              to={actionTo}
              className="mt-6 inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-600 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className="mt-6 inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-600 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;