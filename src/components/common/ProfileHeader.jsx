import { motion } from "framer-motion";

const ProfileHeader = ({
  name,
  subtitle,
  avatar,
  banner,
  badge,
  metrics = [],
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-4xl border"
      style={{
        borderColor: "var(--border)",
        background: "linear-gradient(135deg, var(--surface), transparent)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        className="h-36 sm:h-48"
        style={{
          backgroundImage: banner
            ? `linear-gradient(135deg, rgba(34,211,238,.32), rgba(139,92,246,.34)), url(${banner})`
            : "linear-gradient(135deg, rgba(34,211,238,.28), rgba(99,102,241,.32))",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="px-5 pb-5 sm:px-8 sm:pb-8">
        <div className="-mt-12 flex flex-wrap items-end gap-4 sm:-mt-16">
          <img
            src={avatar}
            alt={name}
            className="h-24 w-24 rounded-3xl border-4 border-[var(--surface)] object-cover sm:h-28 sm:w-28"
          />
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                {name}
              </h1>
              {badge && (
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {subtitle}
            </p>
          </div>
          {action}
        </div>
        {metrics.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border px-4 py-3"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                  {metric.label}
                </p>
                <p className="mt-2 text-lg font-bold" style={{ color: "var(--text)" }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
