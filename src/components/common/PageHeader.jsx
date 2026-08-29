import { motion } from 'framer-motion';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  className = ''
}) => {
  return (
    <motion.div
      className={`mb-8 rounded-3xl bg-linear-to-r from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-xl border border-white/10 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <motion.div
              className="rounded-2xl bg-cyan-500/20 p-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon className="h-8 w-8 text-cyan-400" />
            </motion.div>
          )}

          <div>
            <motion.h1
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {actions && (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;