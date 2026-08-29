import { motion } from 'framer-motion';

const TextArea = ({ label, value, onChange, placeholder, rows = 4, error, helperText, className = '', ...props }) => (
  <motion.label className="block text-sm text-[var(--text)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
    {label && <span className="mb-2 block font-medium text-[var(--text)]">{label}</span>}
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 ${className}`}
      {...props}
    />
    {helperText && <p className="mt-2 text-sm text-slate-400">{helperText}</p>}
    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
  </motion.label>
);

export default TextArea;
