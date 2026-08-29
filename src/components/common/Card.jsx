import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => (
  <motion.div
    {...props}
    className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-slate-950/5 backdrop-blur-lg p-4 transition-all duration-200 ${className}`}
    whileHover={{ y: -2 }}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {children}
  </motion.div>
);

export default Card;
