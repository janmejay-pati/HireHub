const Loader = ({ className = '' }) => (
  <div className={`flex min-h-[160px] items-center justify-center ${className}`}>
    <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 text-[var(--muted)] shadow-lg shadow-slate-950/10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
      <span className="text-sm font-medium">Loading, please wait...</span>
    </div>
  </div>
);

export default Loader;
