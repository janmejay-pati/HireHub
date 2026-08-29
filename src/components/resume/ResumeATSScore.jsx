import { HiOutlineCheckBadge, HiOutlineSparkles } from 'react-icons/hi2';

const ResumeATSScore = ({ atsScore = 82, completion = 70 }) => {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-(--muted)">ATS readiness</p>
          <p className="mt-2 text-3xl font-black text-(--text)">{atsScore}%</p>
        </div>
        <HiOutlineSparkles className="h-6 w-6 text-cyan-300" />
      </div>
      <div className="mt-3 h-2 rounded-full bg-[var(--border)]">
        <div className="h-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500" style={{ width: `${atsScore}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[`Completion ${completion}%`, 'Keyword optimized', 'Strong summary'].map((label) => (
          <span key={label} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">
            <div className="flex items-center gap-1"><HiOutlineCheckBadge className="h-3 w-3" />{label}</div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumeATSScore;
