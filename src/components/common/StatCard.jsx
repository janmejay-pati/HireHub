import { motion } from "framer-motion";

const StatCard = ({ label, value, change, icon: Icon, tone = "cyan" }) => {
  const tones = {
    cyan: { from: "from-cyan-500/15", to: "to-sky-500/10", text: "text-cyan-400" },
    amber: { from: "from-amber-500/15", to: "to-orange-500/10", text: "text-amber-400" },
    violet: { from: "from-violet-500/15", to: "to-fuchsia-500/10", text: "text-violet-300" },
    emerald: { from: "from-emerald-500/15", to: "to-teal-500/10", text: "text-emerald-300" },
    rose: { from: "from-rose-500/15", to: "to-pink-500/10", text: "text-rose-300" },
  };

  const currentTone = tones[tone] || tones.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[26px] border p-4"
      style={{
        borderColor: "var(--border)",
        background: "linear-gradient(135deg, var(--surface), transparent)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className={`inline-flex rounded-2xl bg-linear-to-br ${currentTone.from} ${currentTone.to} p-3`}>
        <Icon className={`h-6 w-6 ${currentTone.text}`} />
      </div>
      <div className="mt-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {label}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {value}
          </p>
          {change && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              {change}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
