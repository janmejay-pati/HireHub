import { motion } from 'framer-motion';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi2';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
  required = false,
  icon: Icon,
  helperText,
  className = '',
  ...props
}) => {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success && !hasError);

  return (
    <motion.label
      className="block text-sm text-[var(--text)]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </span>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none transition duration-150 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 dark:border-slate-600 dark:bg-slate-800/60 dark:text-white ${Icon ? 'pl-10' : ''} ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : hasSuccess
              ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30'
              : 'hover:border-slate-600'
          } ${className}`}
          {...props}
        />

        {hasError && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <HiOutlineExclamationCircle className="h-4 w-4 text-red-500" />
          </motion.div>
        )}

        {hasSuccess && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <HiOutlineCheckCircle className="h-4 w-4 text-emerald-400" />
          </motion.div>
        )}
      </div>

      {helperText && !hasError && (
        <motion.p
          className="mt-1 text-xs text-slate-400"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {helperText}
        </motion.p>
      )}

      {hasError && (
        <motion.p
          className="mt-1 text-xs text-red-500"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}

      {hasSuccess && (
        <motion.p
          className="mt-1 text-xs text-emerald-400"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {success}
        </motion.p>
      )}
    </motion.label>
  );
};

export default Input;
