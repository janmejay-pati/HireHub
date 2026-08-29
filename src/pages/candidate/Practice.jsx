import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const Practice = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Practice Interview Questions"
        subtitle="Sharpen your interview skills with role-based mock questions and expert preparation tips."
      />

      <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-white">Career-ready interview practice</h2>
            <p className="mt-4 text-slate-400">
              Select industry-standard questions, practice answers, and track your confidence before you apply.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-950/80 p-6">
              <h3 className="text-xl font-semibold text-white">Role-focused question banks</h3>
              <p className="mt-2 text-slate-400">Evaluate your responses for product, engineering, design, and business roles.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-6">
              <h3 className="text-xl font-semibold text-white">Strengthen your communication</h3>
              <p className="mt-2 text-slate-400">Build ready-to-share answers for behavioral interview rounds.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-6">
              <h3 className="text-xl font-semibold text-white">Review your progress</h3>
              <p className="mt-2 text-slate-400">Practice consistently and unlock follow-up preparation content.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => navigate('/candidate/jobs')}>Browse Jobs</Button>
          <Button variant="secondary" onClick={() => navigate('/candidate/profile')}>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
