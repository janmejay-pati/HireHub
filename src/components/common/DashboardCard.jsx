import { motion } from "framer-motion";

const DashboardCard = ({
  title,
  description,
  action,
  children,
  className = "",
  glow = true,
  accent = "from-cyan-500/15 via-blue-500/10 to-violet-500/15",
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border p-5 sm:p-6 ${className}`}
      style={{
        background: "linear-gradient(135deg, var(--surface), transparent)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {glow && (
        <div
          className={`pointer-events-none absolute inset-x-8 top-0 h-1 rounded-full bg-linear-to-r ${accent}`}
        />
      )}
      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
              {title}
            </p>
            {description && (
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </motion.section>
  );
};

export default DashboardCard;
