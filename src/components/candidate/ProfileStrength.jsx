import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';

const ProfileStrength = ({ score, suggestions }) => {
  const ringStyle = score >= 80 ? 'from-emerald-400 to-cyan-400' : score >= 60 ? 'from-yellow-400 to-cyan-400' : 'from-rose-400 to-pink-500';

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile Completion</p>
          <h2 className="mt-3 text-3xl font-black text-white">{score}% Complete</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-400">Complete your candidate profile to improve matches and recruiter visibility.</p>
        </div>

        <div className="relative flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-slate-950/70" />
          <div className="absolute inset-4 rounded-full bg-slate-900/90" />
          <motion.div
            className={`absolute inset-4 rounded-full border-8 border-transparent border-r-cyan-400 border-t-emerald-400 border-b-slate-900`}
            initial={{ rotate: 0 }}
            animate={{ rotate: score * 3.6 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-950 text-white">
            <span className="text-4xl font-black">{score}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <div key={suggestion.label} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">{suggestion.label}</p>
            <p className="mt-2 text-sm font-semibold text-white">{suggestion.detail}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default ProfileStrength;
