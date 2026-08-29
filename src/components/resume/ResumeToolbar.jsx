import { motion } from 'framer-motion';
import { HiOutlineArrowDownTray, HiOutlineDocumentDuplicate, HiOutlineEye, HiOutlineFolderOpen, HiOutlinePrinter, HiOutlineSparkles } from 'react-icons/hi2';

const ResumeToolbar = ({ onSave, onDuplicate, onDownload, onPreview, onPrint, onOpenLibrary, saving, isPreviewOpen }) => {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onSave}
          className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white"
        >
          {saving ? 'Saving…' : 'Save Resume'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onDuplicate}
          className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3 font-semibold text-(--text)"
        >
          <div className="flex items-center justify-center gap-2"><HiOutlineDocumentDuplicate className="h-4 w-4" />Duplicate</div>
        </motion.button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onDownload} className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3 font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlineArrowDownTray className="h-4 w-4" />Download PDF</div>
        </button>
        <button type="button" onClick={onPrint} className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3 font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlinePrinter className="h-4 w-4" />Print mode</div>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onPreview} className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3 font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlineEye className="h-4 w-4" />{isPreviewOpen ? 'Preview open' : 'Open preview'}</div>
        </button>
        <button type="button" onClick={onOpenLibrary} className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3 font-semibold text-(--text)">
          <div className="flex items-center justify-center gap-2"><HiOutlineFolderOpen className="h-4 w-4" />My Resumes</div>
        </button>
      </div>

      <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
        <div className="flex items-center gap-2 font-semibold"><HiOutlineSparkles className="h-4 w-4" />AI builder tip</div>
        <p className="mt-2">Save often, refine the summary, and keep the skills section aligned with the roles you are targeting.</p>
      </div>
    </div>
  );
};

export default ResumeToolbar;
