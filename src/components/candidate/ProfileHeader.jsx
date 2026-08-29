import { motion } from 'framer-motion';
import { HiOutlineCamera, HiOutlinePencilSquare } from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';

const ProfileHeader = ({ profile, progress, stats, onUploadImage, onOpenResume }) => {
  const personal = profile?.personal || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Candidate Name';

  return (
    <GlassCard className="overflow-hidden p-6 lg:p-8">
      <div className="relative overflow-hidden rounded-4xl bg-slate-950/80 p-6 md:p-8 ring-1 ring-white/10">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <motion.div
              className="relative h-28 w-28 overflow-hidden rounded-4xl border border-cyan-500/20 bg-slate-900"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={personal.profileImage || 'https://i.pravatar.cc/300?img=12'}
                alt="profile"
                className="h-full w-full object-cover"
              />
              <label className="absolute bottom-3 left-3 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950/90 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-500/95">
                <HiOutlineCamera className="h-4 w-4" />
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={onUploadImage} />
              </label>
            </motion.div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-white">{fullName}</h1>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-semibold text-cyan-200">Premium Candidate</span>
              </div>
              <p className="max-w-2xl text-sm text-slate-400">{personal.bio || 'Build a standout profile to connect with recruiters and unlock better opportunities.'}</p>
              <div className="flex flex-wrap gap-3 pt-3">
                <span className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-300">{personal.email || 'No email yet'}</span>
                <span className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-300">{personal.location || 'No location set'}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 w-full lg:max-w-[360px]">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={onOpenResume}>Resume</Button>
            <Button variant="secondary" onClick={onUploadImage}>Update Photo</Button>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <HiOutlinePencilSquare className="h-5 w-5 text-cyan-400" />
            <span>Last updated {profile?.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString() : 'today'}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileHeader;
