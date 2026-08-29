import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import ResumePreview from "../../components/resume/ResumePreview";
import ResumeATSScore from "../../components/resume/ResumeATSScore";
import ResumeDownloadButton from "../../components/resume/ResumeDownloadButton";
import ResumeProfileCard from "../../components/resume/ResumeProfileCard";
import { resumeService } from "../../services/resume_service";

const ResumePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeTechStack = (techStack) => {
    if (Array.isArray(techStack)) {
      return techStack.join(", ");
    }

    if (typeof techStack === "string") {
      return techStack;
    }

    return "";
  };

  const normalizeResume = (data) => {
    if (!data) return null;

    return {
      ...data,

      projects: Array.isArray(data.projects)
        ? data.projects.map((item) => ({
            ...item,
            techStack: normalizeTechStack(item.techStack),
          }))
        : [],

      experience: Array.isArray(data.experience)
        ? data.experience
        : [],

      education: Array.isArray(data.education)
        ? data.education
        : [],

      skills: Array.isArray(data.skills)
        ? data.skills
        : String(data.skills || "")
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],

      languages: Array.isArray(data.languages)
        ? data.languages
        : [],
    };
  };

  useEffect(() => {
    const current = resumeService.getResumeById(id);

    if (!current) {
      toast.error("Resume not found");
      navigate("/candidate/my-resumes");
      return;
    }

    const safeResume = normalizeResume(current);

    setResume(safeResume);
    setLoading(false);
  }, [id, navigate]);

  const recommendedJobs = useMemo(() => {
    if (!resume?.userId) return [];

    return resumeService.getRecommendedJobs(resume.userId) || [];
  }, [resume?.userId]);

  if (loading || !resume) {
    return (
      <div className="rounded-4xl border border-(--border) bg-(--surface) p-8">
        <div className="h-64 animate-pulse rounded-[1.8rem] bg-[var(--surface-strong)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-4xl border border-(--border) bg-(--surface) p-6"
      >
        <button
          type="button"
          onClick={() => navigate("/candidate/my-resumes")}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to library
        </button>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Preview Mode
            </p>

            <h1 className="mt-3 text-3xl font-black text-(--text) sm:text-4xl">
              {resume.personal?.fullName || "Resume Preview"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-(--muted) sm:text-base">
              Share, inspect, edit, and export your selected resume directly
              from the preview page.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ResumeDownloadButton
              elementRef={previewRef}
              fileName={`${(resume.personal?.fullName || "resume")
                .replace(/\s+/g, "-")
                .toLowerCase()}.pdf`}
            />

            <button
              type="button"
              onClick={() =>
                navigate(`/candidate/resume-builder?resumeId=${resume.id}`)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-cyan-400/40"
            >
              <HiOutlinePencilSquare className="h-5 w-5" />
              Edit resume
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <ResumeProfileCard resume={resume} />

          <ResumeATSScore
            atsScore={resume.atsScore || 80}
            completion={resume.completion || 70}
          />

          <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <HiOutlineSparkles className="h-4 w-4" />
              Recommended jobs
            </div>

            <div className="mt-3 space-y-2">
              {recommendedJobs.length === 0 ? (
                <p className="text-sm text-(--muted)">
                  Add more skills to unlock role recommendations.
                </p>
              ) : (
                recommendedJobs.map((job, index) => (
                  <div
                    key={job._id || job.id || index}
                    className="rounded-2xl bg-[var(--surface-strong)] px-3 py-2"
                  >
                    <p className="font-semibold text-(--text)">
                      {job.title}
                    </p>

                    <p className="text-sm text-(--muted)">
                      {job.company} • {job.matchScore || 70}% match
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <motion.div
          ref={previewRef}
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-4xl border border-(--border) bg-white p-4 shadow-2xl"
        >
          <ResumePreview resume={resume} />
        </motion.div>
      </div>
    </div>
  );
};

export default ResumePreviewPage;