import { HiOutlineArrowTrendingUp, HiOutlineEye, HiOutlineLockClosed, HiOutlineSparkles, HiOutlineUserGroup } from 'react-icons/hi2';

const ResumeAnalytics = ({ resume, jobs = [], completion }) => {
  const analytics = resume?.analytics || {};
  const recommendedJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-(--muted)">Resume completion</p>
            <p className="mt-2 text-3xl font-black text-(--text)">{completion}%</p>
          </div>
          <div className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-cyan-200">{resume?.visibility === 'public' ? 'Public' : 'Private'}</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--border)]">
          <div className="h-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
          <div className="flex items-center gap-2 text-cyan-300"><HiOutlineEye className="h-4 w-4" />Views</div>
          <p className="mt-3 text-2xl font-black text-(--text)">{analytics.profileViews || 0}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
          <div className="flex items-center gap-2 text-emerald-300"><HiOutlineUserGroup className="h-4 w-4" />Downloads</div>
          <p className="mt-3 text-2xl font-black text-(--text)">{analytics.recruiterDownloads || 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-(--text)">AI suggestions</p>
            <p className="mt-2 text-sm text-(--muted)">Resume tips are refreshed automatically as you edit.</p>
          </div>
          <HiOutlineSparkles className="h-5 w-5 text-cyan-300" />
        </div>
        <div className="mt-4 space-y-2">
          {(resume?.aiSuggestions || []).map((item) => (
            <div key={item} className="rounded-2xl bg-[var(--surface-strong)] px-3 py-2 text-sm text-(--text)">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
        <div className="flex items-center gap-2 text-cyan-300"><HiOutlineArrowTrendingUp className="h-4 w-4" />Recommended roles</div>
        <div className="mt-3 space-y-2">
          {recommendedJobs.length === 0 ? (
            <p className="text-sm text-(--muted)">Add more skills to unlock role match recommendations.</p>
          ) : (
            recommendedJobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-strong)] px-3 py-2">
                <div>
                  <p className="font-semibold text-(--text)">{job.title}</p>
                  <p className="text-sm text-(--muted)">{job.company}</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{job.matchScore}%</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
        <div className="flex items-center gap-2 text-amber-200"><HiOutlineLockClosed className="h-4 w-4" />Privacy controls</div>
        <p className="mt-3 text-sm text-(--muted)">Set resumes to public to make them visible to recruiters or keep them private while editing.</p>
      </div>
    </div>
  );
};

export default ResumeAnalytics;
