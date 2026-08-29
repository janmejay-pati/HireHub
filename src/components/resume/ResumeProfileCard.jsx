import { HiOutlineGlobeAlt, HiOutlineMapPin, HiOutlineSparkles } from 'react-icons/hi2';

const ResumeProfileCard = ({ resume }) => {
  const personal = resume?.personal || {};

  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-lg font-black text-white">
          {personal.fullName?.slice(0, 2).toUpperCase() || 'RB'}
        </div>
        <div>
          <p className="text-sm text-(--muted)">Resume profile</p>
          <h3 className="text-lg font-bold text-(--text)">{personal.fullName || 'Your Name'}</h3>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-(--muted)">
        <p className="flex items-center gap-2"><HiOutlineSparkles className="h-4 w-4 text-cyan-300" />{personal.jobTitle || 'Professional title'}</p>
        <p className="flex items-center gap-2"><HiOutlineMapPin className="h-4 w-4 text-cyan-300" />{personal.location || 'Remote'}</p>
        <p className="flex items-center gap-2"><HiOutlineGlobeAlt className="h-4 w-4 text-cyan-300" />{personal.portfolio || 'Portfolio link'}</p>
      </div>
    </div>
  );
};

export default ResumeProfileCard;
