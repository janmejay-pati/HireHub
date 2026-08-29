const Badge = ({ label, variant = 'primary', className = '' }) => {
  const styles = {
    primary: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
    secondary: 'bg-slate-700/70 text-slate-100 border border-slate-600/70',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${styles[variant] || styles.primary} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
