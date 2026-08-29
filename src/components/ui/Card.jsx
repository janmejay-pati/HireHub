import { motion } from 'framer-motion';

const Card = ({ className = '', children, style = {}, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 ${className}`}
      style={{ boxShadow: '0 20px 60px rgba(2,6,23,0.6)', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
