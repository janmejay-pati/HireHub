import { motion } from 'framer-motion';

const Select = ({ label, options = [], value, onChange, placeholder = 'Select option', className = '', error, helperText, ...props }) => (
  <motion.label className="block text-sm text-[var(--text)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
    {label && <span className="mb-2 block font-medium text-[var(--text)]">{label}</span>}
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`hover-glow w-full rounded-2xl border border-(--border) bg-(--surface) text-(--text) px-4 py-3 pr-10 text-sm outline-none transition hover:border-cyan-400/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 ${className}`}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option} className="bg-slate-900 text-white">
            {option.label || option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        ▼
      </div>
    </div>
    {helperText && <p className="mt-2 text-sm text-slate-400">{helperText}</p>}
    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
  </motion.label>
);

export default Select;
