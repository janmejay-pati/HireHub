import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText, HiOutlineSparkles } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import ResumeCard from '../../components/resume/ResumeCard';
import { resumeService } from '../../services/resume_service';

const MyResumes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const saved = resumeService.getResumesByUser(user.id);
    setResumes(saved);
    setLoading(false);
  };

  useEffect(() => {
    loadResumes();
  }, [user?.id]);

  const analytics = useMemo(() => {
    const publicCount = resumes.filter((resume) => resume.visibility === 'public').length;
    const avgCompletion = resumes.length
      ? Math.round(resumes.reduce((sum, resume) => sum + (resume.completion || 0), 0) / resumes.length)
      : 0;

    return { publicCount, avgCompletion };
  }, [resumes]);

  const handleDuplicate = async (resumeId) => {
    const created = resumeService.duplicateResume(resumeId, user.id);
    if (created) {
      toast.success('Resume duplicated successfully');
      loadResumes();
    }
  };

  const handleToggleVisibility = (resumeId) => {
    const current = resumeService.getResumeById(resumeId);
    if (!current) return;
    resumeService.updateVisibility(resumeId, current.visibility === 'public' ? 'private' : 'public');
    toast.success(`Resume visibility set to ${current.visibility === 'public' ? 'private' : 'public'}`);
    loadResumes();
  };

  const handleDelete = (resumeId) => {
    resumeService.deleteResume(resumeId);
    toast.success('Resume deleted');
    loadResumes();
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-(--border) bg-linear-to-br from-cyan-500/10 via-[var(--surface)] to-[var(--surface)] p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Saved resume library</p>
            <h1 className="mt-3 text-4xl font-black text-(--text)">My Resumes</h1>
            <p className="mt-3 max-w-2xl text-(--muted)">Keep multiple versions, compare templates, and reuse your best-performing resume for every opportunity.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.3rem] border border-(--border) bg-(--surface) px-4 py-3">
              <p className="text-sm text-(--muted)">Saved</p>
              <p className="mt-2 text-2xl font-black text-(--text)">{resumes.length}</p>
            </div>
            <div className="rounded-[1.3rem] border border-(--border) bg-(--surface) px-4 py-3">
              <p className="text-sm text-(--muted)">Public</p>
              <p className="mt-2 text-2xl font-black text-(--text)">{analytics.publicCount}</p>
            </div>
            <div className="rounded-[1.3rem] border border-(--border) bg-(--surface) px-4 py-3">
              <p className="text-sm text-(--muted)">Avg completion</p>
              <p className="mt-2 text-2xl font-black text-(--text)">{analytics.avgCompletion}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-[1.8rem] border border-(--border) bg-(--surface)" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-(--border) bg-(--surface) p-10 text-center">
          <HiOutlineDocumentText className="mx-auto h-14 w-14 text-cyan-300" />
          <h2 className="mt-4 text-2xl font-bold text-(--text)">No resumes saved yet</h2>
          <p className="mt-2 text-(--muted)">Create your first premium resume from the builder and return here to manage multiple versions.</p>
          <button type="button" onClick={() => navigate('/candidate/resume-builder')} className="mt-5 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white">
            Build a resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onPreview={() => navigate(`/candidate/resume-preview/${resume.id}`)}
              onEdit={() => navigate(`/candidate/resume-builder?resumeId=${resume.id}`)}
              onDuplicate={() => handleDuplicate(resume.id)}
              onToggleVisibility={() => handleToggleVisibility(resume.id)}
              onDelete={() => handleDelete(resume.id)}
            />
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-4xl border border-(--border) bg-(--surface) p-6">
        <div className="flex items-center gap-3">
          <HiOutlineSparkles className="h-5 w-5 text-cyan-300" />
          <div>
            <p className="text-lg font-bold text-(--text)">Resume optimization checklist</p>
            <p className="text-sm text-(--muted)">Use this as your weekly launch checklist for each role.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {['Tailor keywords to the role', 'Update the summary with metrics', 'Keep the ATS score above 85', 'Set recruiter visibility as public'].map((item) => (
            <div key={item} className="rounded-[1.3rem] bg-[var(--surface-strong)] px-4 py-3 text-sm text-(--text)">{item}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MyResumes;
