import { motion } from 'framer-motion';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'cyan',
  className = ''
}) => {
  const colors = {
    cyan: {
      bg: 'bg-cyan-500',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200'
    },
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200'
    }
  };

  const colorScheme = colors[color];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl border ${colorScheme.border} ${colorScheme.light} p-6 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Background gradient */}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${colorScheme.bg} opacity-10`} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <motion.p
              className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.p>

            <motion.div
              className="mt-2 flex items-baseline gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              {trend && trendValue && (
                <motion.span
                  className={`text-sm font-medium ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {trend === 'up' ? '+' : '-'}{trendValue}
                </motion.span>
              )}
            </motion.div>

            {subtitle && (
              <motion.p
                className="mt-1 text-sm text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {Icon && (
            <motion.div
              className={`rounded-2xl ${colorScheme.light} p-3`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon className={`h-6 w-6 ${colorScheme.text}`} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;