import { motion } from 'framer-motion';
import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';

const CandidateCard = ({ application, candidateName, jobTitle, status, onDragStart, onClick }) => {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-grab rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">{candidateName}</p>
          <p className="text-sm text-slate-500">{jobTitle}</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          {status}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4" />
        <p>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'No date'}</p>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
