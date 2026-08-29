import { motion } from 'framer-motion';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.96 }}
      aria-pressed={isDark}
      className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-300 ${className}`}
      style={{
        background: 'var(--surface)',
        color: 'var(--text)',
        borderColor: 'var(--border)',
      }}
      aria-label="Toggle theme"
    >
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: isDark ? 0 : 0, scale: 0.9, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="flex items-center"
      >
        {isDark ? (
          <HiOutlineSun className="h-4 w-4 text-yellow-400" />
        ) : (
          <HiOutlineMoon className="h-4 w-4 text-slate-400" />
        )}
      </motion.span>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        {isDark ? 'Light' : 'Dark'}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
