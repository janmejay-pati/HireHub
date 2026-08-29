import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = true,
  padding = 'p-4',
  ...props
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border border-white/8 bg-white/4 backdrop-blur-lg shadow-sm ${padding} ${className}`}
      whileHover={hover ? {
        scale: 1.01,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;