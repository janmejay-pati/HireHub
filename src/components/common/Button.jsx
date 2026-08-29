import { motion } from 'framer-motion';
import { HiOutlineArrowPath } from 'react-icons/hi2';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'hover-glow inline-flex items-center justify-center rounded-3xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const styles = {
    primary: 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/35 active:scale-95',
    secondary: 'border border-white/10 bg-slate-900/70 text-slate-100 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white hover:text-cyan-600 shadow-sm',
    ghost: 'bg-transparent text-slate-100 hover:-translate-y-0.5 hover:bg-cyan-500/10 hover:text-cyan-300',
    danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/15 hover:bg-rose-600 active:scale-95'
  };

  return (
    <motion.button
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {loading && (
        <HiOutlineArrowPath className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
