import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { HiOutlineArrowDownTray, HiOutlineCheckCircle, HiOutlineDocumentText, HiOutlineXMark } from "react-icons/hi2";

const ResumeViewer = ({ candidate, isOpen = false, onClose, onMarkReviewed, reviewed = false }) => {
  if (!isOpen) {
    return null;
  }

  const handleDownload = () => {
    const pdf = new jsPDF();
    const lines = [
      candidate.name,
      candidate.title,
      candidate.location,
      "",
      `Summary: ${candidate.summary}`,
      "",
      "Experience",
      ...(candidate.experience || []).map((item) => `${item.title} • ${item.company} • ${item.duration}`),
      "",
      "Education",
      ...(candidate.education || []).map((item) => `${item.degree} • ${item.school}`),
      "",
      "Skills",
      (candidate.skills || []).join(", "),
    ];

    let y = 18;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(candidate.name, 18, y);
    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(candidate.title, 18, y);
    y += 8;
    pdf.text(candidate.location, 18, y);
    y += 16;

    lines.slice(4).forEach((line) => {
      if (line === "") {
        y += 6;
        return;
      }
      pdf.text(line, 18, y);
      y += 7;
    });

    pdf.save(`${candidate.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        className="w-full max-w-5xl rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: "var(--border)",
          background: "linear-gradient(135deg, var(--surface-strong), var(--surface))",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
              Resume preview
            </p>
            <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>
              {candidate.name} · {candidate.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onMarkReviewed}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{ background: reviewed ? "rgba(16,185,129,0.16)" : "var(--surface)", color: "var(--text)" }}
            >
              <HiOutlineCheckCircle className="h-4 w-4" />
              {reviewed ? "Reviewed" : "Mark as reviewed"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,.2), rgba(99,102,241,.2))", color: "var(--text)" }}
            >
              <HiOutlineArrowDownTray className="h-4 w-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--surface)", color: "var(--text)" }}
            >
              <HiOutlineXMark className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[26px] border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/15 p-3">
                <HiOutlineDocumentText className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--text)" }}>
                  Resume packet
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Premium PDF-style preview with key highlights and recruiter notes.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border p-5" style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(15,23,42,.25), transparent)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
                    {candidate.name}
                  </p>
                  <p style={{ color: "var(--muted)" }}>{candidate.title}</p>
                </div>
                <p className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-semibold text-cyan-300">
                  {candidate.location}
                </p>
              </div>
              <p className="mt-4 text-sm leading-6" style={{ color: "var(--text)" }}>
                {candidate.summary}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                    Experience
                  </p>
                  <div className="mt-2 space-y-2 text-sm" style={{ color: "var(--text)" }}>
                    {(candidate.experience || []).map((item) => (
                      <div key={`${item.title}-${item.company}`}>
                        <p className="font-semibold">{item.title}</p>
                        <p style={{ color: "var(--muted)" }}>{item.company} • {item.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                    Education
                  </p>
                  <div className="mt-2 space-y-2 text-sm" style={{ color: "var(--text)" }}>
                    {(candidate.education || []).map((item) => (
                      <div key={`${item.degree}-${item.school}`}>
                        <p className="font-semibold">{item.degree}</p>
                        <p style={{ color: "var(--muted)" }}>{item.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                  Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(candidate.skills || []).map((skill) => (
                    <span key={skill} className="rounded-full px-3 py-1 text-sm" style={{ background: "var(--surface)", color: "var(--text)" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Resume insights
              </p>
              <div className="mt-3 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                <div className="flex items-center justify-between">
                  <span>Interview-ready</span>
                  <span className="text-emerald-300">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Role fit</span>
                  <span className="text-cyan-300">{candidate.matchScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Availability</span>
                  <span>{candidate.availability}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Recruiter actions
              </p>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <p>• Review candidate background</p>
                <p>• Compare against role requirements</p>
                <p>• Add interview notes</p>
                <p>• Share endorsement details</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeViewer;
