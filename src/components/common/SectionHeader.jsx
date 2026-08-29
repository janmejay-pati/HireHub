import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, actions, icon: Icon, className = '' }) => (
  <motion.div
    className={`mb-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg shadow-slate-950/10 backdrop-blur-xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10">
            <Icon className="h-7 w-7" />
          </div>
        )}

        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text)]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-[var(--muted)] max-w-2xl">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  </motion.div>
);

export default SectionHeader;
