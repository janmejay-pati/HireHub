import { motion } from 'framer-motion';

const KanbanColumn = ({ title, count, children, onDrop, onDragOver }) => {
  return (
    <motion.div
      className="flex min-h-[520px] flex-col rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg"
      whileHover={{ y: -2 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{count}</p>
        </div>
      </div>
      <div
        className="flex-1 space-y-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default KanbanColumn;
