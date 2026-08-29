const ResumePreview = ({ resume }) => {
  const personal = resume?.personal || {};
  const isDark = resume?.mode === 'dark';
  const accent = resume?.accentColor || '#06b6d4';
  const fontFamily = resume?.fontFamily || 'Inter, sans-serif';
  const sidebarStyle = resume?.sidebarStyle || 'right';

  const headerBg = isDark
    ? `linear-gradient(135deg, rgba(15,23,42,0.98), rgba(8,47,73,0.95))`
    : `linear-gradient(135deg, rgba(248,250,252,0.98), rgba(224,242,254,0.95))`;

  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#cbd5e1' : '#475569';
  const cardColor = isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)';

  const renderTag = (label) => (
    <span key={label} style={{ background: `${accent}20`, color: textColor }} className="rounded-full px-3 py-1 text-sm">
      {label}
    </span>
  );

  const content = (
    <div style={{ fontFamily, color: textColor, background: isDark ? '#020617' : '#f8fafc' }} className="min-h-[1122px] w-full rounded-4xl p-6">
      <div style={{ background: headerBg }} className="rounded-[1.5rem] px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>{personal.jobTitle || 'Professional Profile'}</p>
            <h1 className="mt-3 text-4xl font-black">{personal.fullName || 'Candidate Name'}</h1>
            <p className="mt-2 text-sm" style={{ color: mutedColor }}>{personal.location || 'Remote'} • {personal.email || 'email@example.com'}</p>
          </div>
          {personal.profileImage ? (
            <img src={personal.profileImage} alt="profile" className="h-28 w-28 rounded-[1.5rem] object-cover" />
          ) : (
            <div style={{ background: accent }} className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] text-2xl font-black text-white">
              {personal.fullName?.slice(0, 2).toUpperCase() || 'RB'}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {personal.summary && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Summary</p>
              <p className="mt-3 leading-7 text-sm" style={{ color: mutedColor }}>{personal.summary}</p>
            </section>
          )}

          {(resume?.experience || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Experience</p>
              <div className="mt-4 space-y-4">
                {(resume.experience || []).map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-lg">{item.role || 'Role'}</p>
                        <p className="text-sm" style={{ color: mutedColor }}>{item.company || 'Company'} • {item.location || 'Location'}</p>
                      </div>
                      <span className="text-sm" style={{ color: mutedColor }}>{item.startDate || ''} - {item.currentlyWorking ? 'Present' : item.endDate || ''}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7" style={{ color: mutedColor }}>{item.achievements || 'Achievements go here.'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(resume?.education || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Education</p>
              <div className="mt-4 space-y-3">
                {(resume.education || []).map((item, index) => (
                  <div key={index}>
                    <p className="font-bold">{item.degree || 'Degree'}</p>
                    <p className="text-sm" style={{ color: mutedColor }}>{item.institution || 'Institution'} • {item.location || 'Location'}</p>
                    <p className="mt-2 text-sm" style={{ color: mutedColor }}>{item.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(resume?.projects || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Projects</p>
              <div className="mt-4 space-y-3">
                {(resume.projects || []).map((item, index) => (
                  <div key={index}>
                    <p className="font-bold">{item.title || 'Project'}</p>
                    <p className="mt-2 text-sm leading-7" style={{ color: mutedColor }}>{item.description || 'Project summary'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">{(item.techStack || '').split(',').filter(Boolean).map((tech) => renderTag(tech.trim()))}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Skills</p>
            <div className="mt-4 flex flex-wrap gap-2">{(resume?.skills || []).map((skill) => renderTag(typeof skill === 'string' ? skill : skill.name))}</div>
          </section>

          {(resume?.certifications || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Certifications</p>
              <div className="mt-4 space-y-3">
                {(resume.certifications || []).map((item, index) => (
                  <div key={index}>
                    <p className="font-bold">{item.title || 'Certification'}</p>
                    <p className="text-sm" style={{ color: mutedColor }}>{item.issuer || 'Issuer'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(resume?.languages || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Languages</p>
              <div className="mt-4 space-y-2">
                {(resume.languages || []).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name || 'Language'}</span>
                    <span style={{ color: mutedColor }}>{item.proficiency || 'Proficient'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(resume?.achievements || []).length > 0 && (
            <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Achievements</p>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: mutedColor }}>
                {(resume.achievements || []).map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </section>
          )}

          <section style={{ background: cardColor }} className="rounded-[1.5rem] border border-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: accent }}>Links</p>
            <div className="mt-4 space-y-2 text-sm" style={{ color: mutedColor }}>
              <p>{personal.email || 'email@example.com'}</p>
              <p>{personal.linkedin || 'LinkedIn'}</p>
              <p>{personal.github || 'GitHub'}</p>
              <p>{personal.portfolio || 'Portfolio'}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  if (sidebarStyle === 'left') {
    return (
      <div className="w-full">
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">{content}</div>
      </div>
    );
  }

  return content;
};

export default ResumePreview;
