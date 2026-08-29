import { motion } from 'framer-motion';
import { HiOutlineArrowUpRight, HiOutlineDocumentDuplicate, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2';

const ResumeCard = ({ resume, onPreview, onEdit, onDuplicate, onDelete, onToggleVisibility }) => {
  const lastUpdated = new Date(resume.updatedAt || resume.lastSaved || Date.now()).toLocaleString();

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-[1.8rem] border border-(--border) bg-(--surface) p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{resume.template}</p>
          <h3 className="mt-2 text-xl font-bold text-(--text)">{resume.personal?.fullName || 'Untitled Resume'}</h3>
          <p className="mt-2 text-sm text-(--muted)">{resume.personal?.jobTitle || 'Professional profile'}</p>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{resume.visibility || 'public'}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--muted)">
        <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1">{resume.completion || 0}% complete</span>
        <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1">ATS {resume.atsScore || 0}%</span>
        <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1">{resume.personal?.location || 'Remote'}</span>
      </div>

      <p className="mt-4 text-sm text-(--muted)">Last updated: {lastUpdated}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={onPreview} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white">
          <div className="flex items-center justify-center gap-2"><HiOutlineEye className="h-4 w-4" />Preview</div>
        </button>
        <button type="button" onClick={onEdit} className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlineArrowUpRight className="h-4 w-4" />Edit</div>
        </button>
        <button type="button" onClick={onDuplicate} className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlineDocumentDuplicate className="h-4 w-4" />Duplicate</div>
        </button>
        {onToggleVisibility && (
          <button type="button" onClick={onToggleVisibility} className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-(--text)">
            <div className="flex items-center justify-center gap-2"><HiOutlineEye className="h-4 w-4" />{resume.visibility === 'public' ? 'Make Private' : 'Make Public'}</div>
          </button>
        )}
        <button type="button" onClick={onDelete} className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
          <div className="flex items-center justify-center gap-2"><HiOutlineTrash className="h-4 w-4" />Delete</div>
        </button>
      </div>
    </motion.div>
  );
};

export default ResumeCard;
