import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowDownTray,
  HiOutlineBookmark,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineXCircle,
} from "react-icons/hi2";

import ProfileHeader from "../../components/common/ProfileHeader";
import ResumeViewer from "../../components/common/ResumeViewer";
import { useAuth } from "../../context/AuthContext";
import { recruiterService } from "../../services/recruiter_service";

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [notes, setNotes] = useState("");
  const [showResume, setShowResume] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (!user) return;

    const profile = recruiterService.getCandidateById(candidateId, user.id);
    if (!profile) {
      navigate("/recruiter/candidates");
      return;
    }

    setCandidate(profile);
    setNotes(profile.recruiterNotes || "");
  }, [candidateId, navigate, user]);

  const metrics = useMemo(
    () => [
      { label: "Match", value: `${candidate?.matchScore || 0}%` },
      { label: "Experience", value: candidate?.experience || "n/a" },
      { label: "Salary", value: candidate?.expectedSalary || "n/a" },
    ],
    [candidate]
  );

  const recordAction = (type, detail = {}) => {
    if (!user || !candidate) return;

    recruiterService.recordCandidateAction(user.id, candidate.id, type, detail);
    toast.success(`${type.replace(/_/g, " ")} updated.`);
  };

  const handleShortlist = () => {
    setCandidate((current) => ({ ...current, status: "Shortlisted" }));
    recordAction("shortlist", { status: "Shortlisted" });
  };

  const handleReject = () => {
    setCandidate((current) => ({ ...current, status: "Rejected" }));
    recordAction("reject", { status: "Rejected" });
  };

  const handleInterview = () => {
    setCandidate((current) => ({ ...current, status: "Interview" }));
    recordAction("schedule_interview", { status: "Interview" });
  };

  const handleSave = () => {
    setCandidate((current) => ({ ...current, saved: true }));
    recordAction("save_candidate", { saved: true });
  };

  const handleNotes = () => {
    setCandidate((current) => ({ ...current, recruiterNotes: notes }));
    recordAction("add_note", { note: notes });
  };

  const handleReview = () => {
    setReviewed(true);
    recordAction("mark_reviewed", { reviewed: true });
  };

  if (!candidate) {
    return (
      <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <p style={{ color: "var(--text)" }}>Loading candidate profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={candidate.name}
        subtitle={`${candidate.title} • ${candidate.location}`}
        avatar={candidate.profileImage}
        banner={candidate.profileImage}
        badge={candidate.status}
        metrics={metrics}
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowResume(true)} className="rounded-2xl px-4 py-2 text-sm font-semibold" style={{ background: "var(--surface)", color: "var(--text)" }}>
              <span className="inline-flex items-center gap-2"><HiOutlineEye className="h-4 w-4" />Resume</span>
            </button>
            <Link to="/recruiter/candidates" className="rounded-2xl px-4 py-2 text-sm font-semibold" style={{ background: "var(--surface)", color: "var(--text)" }}>
              Back to list
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, var(--surface), transparent)", boxShadow: "var(--shadow)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
                  Candidate overview
                </p>
                <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {candidate.summary}
                </h2>
              </div>
              <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-semibold text-cyan-300">
                {candidate.availability}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                { label: "Education", value: candidate.education, icon: HiOutlineSparkles },
                { label: "Location", value: candidate.location, icon: HiOutlineMapPin },
                { label: "Resume", value: candidate.resumeAvailable ? "Available" : "Pending", icon: HiOutlineArrowDownTray },
                { label: "Expected salary", value: candidate.expectedSalary, icon: HiOutlineBriefcase },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <item.icon className="h-5 w-5 text-cyan-300" />
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{item.label}</p>
                  <p className="mt-1 font-semibold" style={{ color: "var(--text)" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
                  Skills progress
                </p>
                <h3 className="mt-2 text-xl font-bold" style={{ color: "var(--text)" }}>
                  Strength areas
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                AI matched
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {(candidate.skills || []).map((skill) => (
                <div key={skill}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span style={{ color: "var(--text)" }}>{skill}</span>
                    <span style={{ color: "var(--muted)" }}>{80 + Math.round(Math.random() * 15)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(148,163,184,0.16)]">
                    <div className="h-2 rounded-full bg-linear-to-r from-cyan-400 to-violet-500" style={{ width: `${75 + Math.round(Math.random() * 20)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
                  Experience & education
                </p>
                <h3 className="mt-2 text-xl font-bold" style={{ color: "var(--text)" }}>
                  Hiring timeline
                </h3>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Experience</p>
                <div className="mt-3 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                  {(candidate.resumePreview?.experience || []).map((item) => (
                    <div key={`${item.title}-${item.company}`}>
                      <p style={{ color: "var(--text)" }}>{item.title}</p>
                      <p>{item.company}</p>
                      <p>{item.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Education</p>
                <div className="mt-3 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                  {(candidate.resumePreview?.education || []).map((item) => (
                    <div key={`${item.degree}-${item.school}`}>
                      <p style={{ color: "var(--text)" }}>{item.degree}</p>
                      <p>{item.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="space-y-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, var(--surface), transparent)", boxShadow: "var(--shadow)" }}
          >
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
              Recruiter actions
            </p>
            <div className="mt-4 grid gap-2">
              <button onClick={handleShortlist} className="rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "var(--text)" }}>
                <span className="inline-flex items-center gap-2"><HiOutlineCheckCircle className="h-4 w-4" />Shortlist candidate</span>
              </button>
              <button onClick={handleInterview} className="rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(34,211,238,0.12)", color: "var(--text)" }}>
                <span className="inline-flex items-center gap-2"><HiOutlineCalendarDays className="h-4 w-4" />Mark interview</span>
              </button>
              <button onClick={handleReject} className="rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(244,63,94,0.12)", color: "var(--text)" }}>
                <span className="inline-flex items-center gap-2"><HiOutlineXCircle className="h-4 w-4" />Reject candidate</span>
              </button>
              <button onClick={handleSave} className="rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--surface)", color: "var(--text)" }}>
                <span className="inline-flex items-center gap-2"><HiOutlineBookmark className="h-4 w-4" />Save candidate</span>
              </button>
            </div>

            <div className="mt-4 rounded-3xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex items-center justify-between">
                <p className="font-semibold" style={{ color: "var(--text)" }}>Resume availability</p>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {candidate.resumeAvailable ? "Ready" : "Pending"}
                </span>
              </div>
              <button onClick={() => setShowResume(true)} className="mt-3 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold" style={{ background: "linear-gradient(135deg, rgba(34,211,238,.2), rgba(99,102,241,.2))", color: "var(--text)" }}>
                <HiOutlineEye className="h-4 w-4" />
                Preview resume
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
              Add notes & message
            </p>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} className="mt-3 w-full rounded-2xl border px-4 py-3" style={{ background: "var(--surface)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Capture interview insights, salary expectations, and follow-up notes." />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={handleNotes} className="rounded-2xl px-4 py-2 text-sm font-semibold" style={{ background: "var(--surface)", color: "var(--text)" }}>
                Save notes
              </button>
              <button className="rounded-2xl px-4 py-2 text-sm font-semibold" style={{ background: "rgba(244,114,182,.14)", color: "var(--text)" }}>
                <span className="inline-flex items-center gap-2"><HiOutlineEnvelope className="h-4 w-4" />Send message</span>
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
              Activity history
            </p>
            <div className="mt-4 space-y-3">
              {(candidate.activity || []).map((item) => (
                <div key={`${item.label}-${item.time}`} className="rounded-3xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold" style={{ color: "var(--text)" }}>{item.label}</p>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{item.time}</span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <ResumeViewer
        candidate={candidate}
        isOpen={showResume}
        onClose={() => setShowResume(false)}
        onMarkReviewed={handleReview}
        reviewed={reviewed}
      />
    </div>
  );
};

export default CandidateProfilePage;
