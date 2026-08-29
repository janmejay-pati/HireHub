import { HiOutlineArrowUpTray, HiOutlineArrowDownTray, HiOutlineTrash } from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';

const formatFileSize = (size) => {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1048576).toFixed(1)} MB`;
};

const ResumeUpload = ({ resume, onUpload, onRemove, onDownload }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resume</p>
          <h3 className="mt-2 text-2xl font-black text-white">Professional Resume</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Upload your latest resume and keep your application profile ready for fast apply.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400">
          <HiOutlineArrowUpTray className="h-5 w-5" />
          Upload Resume
          <input type="file" accept=".pdf,.doc,.docx" hidden onChange={onUpload} />
        </label>
      </div>

      {resume ? (
        <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">File</p>
              <p className="text-lg font-semibold text-white">{resume.fileName}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span>{new Date(resume.uploadDate).toLocaleDateString()}</span>
              <span>{formatFileSize(resume.fileSize)}</span>
              <span>{resume.fileType}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onDownload}>
              <HiOutlineArrowDownTray className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="danger" onClick={onRemove}>
              <HiOutlineTrash className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
          No resume uploaded yet. Upload your resume to boost your profile and enable one-click applications.
        </div>
      )}
    </GlassCard>
  );
};

export default ResumeUpload;
