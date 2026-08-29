import { motion } from "framer-motion";
import { HiOutlineArrowRight, HiOutlineBookmark, HiOutlineCalendarDays, HiOutlineDownload, HiOutlineEye, HiOutlineHeart, HiOutlineMail, HiOutlineXCircle, HiOutlineCheckCircle } from "react-icons/hi2";

const CandidateCard = ({
  candidate,
  onViewProfile,
  onDownloadResume,
  onShortlist,
  onReject,
  onScheduleInterview,
  onSaveCandidate,
  onSendMessage,
  compact = false,
}) => {
  const ringGradient = `conic-gradient(${candidate.matchScore * 3.6}deg, rgba(34,211,238,.95), rgba(99,102,241,.95), rgba(59,130,246,.95), rgba(16,185,129,.9))`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border p-4 sm:p-5"
      style={{
        borderColor: "var(--border)",
        background: "linear-gradient(135deg, var(--surface), transparent)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 rounded-xl p-[2px]" style={{ background: ringGradient }}>
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] bg-(--surface)">
                <img src={candidate.profileImage} alt={candidate.name} className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: "var(--text)" }}>
                {candidate.name}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {candidate.title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300">
              {candidate.matchScore}% match
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              {candidate.availability}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border px-3 py-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Experience
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
              {candidate.experience}
            </p>
          </div>
          <div className="rounded-xl border px-3 py-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Education
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
              {candidate.education}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(candidate.skills || []).slice(0, 5).map((skill) => (
            <span key={skill} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--surface)", color: "var(--text)" }}>
              {skill}
            </span>
          ))}
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2" style={{ color: "var(--muted)" }}>
          <p>Salary: {candidate.expectedSalary}</p>
          <p>Location: {candidate.location}</p>
          <p>Resume: {candidate.resumeAvailable ? "Available" : "Pending"}</p>
          <p>Status: {candidate.status}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewProfile}
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
            style={{ background: "var(--surface-strong)", color: "var(--text)" }}
          >
            <HiOutlineEye className="h-4 w-4" />
            View Profile
          </button>
          <button
            type="button"
            onClick={onDownloadResume}
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
            style={{ background: "var(--surface-strong)", color: "var(--text)" }}
          >
            <HiOutlineDownload className="h-4 w-4" />
            Download Resume
          </button>
          <button
            type="button"
            onClick={onShortlist}
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-emerald-300"
            style={{ background: "rgba(16,185,129,0.12)" }}
          >
            <HiOutlineCheckCircle className="h-4 w-4" />
            Shortlist
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-rose-300"
            style={{ background: "rgba(244,63,94,0.12)" }}
          >
            <HiOutlineXCircle className="h-4 w-4" />
            Reject
          </button>
        </div>

        {!compact && (
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onScheduleInterview}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,.22), rgba(99,102,241,.2))", color: "var(--text)" }}
            >
              <HiOutlineCalendarDays className="h-4 w-4" />
              Schedule Interview
            </button>
            <button
              type="button"
              onClick={onSaveCandidate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
              style={{ background: "var(--surface-strong)", color: "var(--text)" }}
            >
              <HiOutlineBookmark className="h-4 w-4" />
              Save Candidate
            </button>
            <button
              type="button"
              onClick={onSendMessage}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, rgba(244,114,182,.22), rgba(129,140,248,.2))", color: "var(--text)" }}
            >
              <HiOutlineMail className="h-4 w-4" />
              Send Message
            </button>
            <button
              type="button"
              onClick={onViewProfile}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold"
              style={{ background: "var(--surface-strong)", color: "var(--text)" }}
            >
              <HiOutlineArrowRight className="h-4 w-4" />
              Continue review
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default CandidateCard;
