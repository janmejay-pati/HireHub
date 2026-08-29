import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

const createExperience = () => ({
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  achievements: '',
});

const createProject = () => ({
  title: '',
  description: '',
  techStack: '',
  repoUrl: '',
  liveUrl: '',
  featured: false,
});

const createCertification = () => ({
  title: '',
  issuer: '',
  credentialId: '',
  issueDate: '',
  verifyUrl: '',
  expires: false,
});

const createLanguage = () => ({ name: '', proficiency: '' });

const createReference = () => ({ name: '', designation: '', company: '', email: '', phone: '' });

const ResumeSectionEditor = ({ section, resume, onUpdate }) => {
  const skills = resume.skills || [];
  const addSkill = (value) => {
    const trimmed = value.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onUpdate({ skills: [...skills, trimmed] });
  };

  const removeSkill = (skill) => {
    onUpdate({ skills: skills.filter((item) => item !== skill) });
  };

  if (section === 'personal') {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-(--text)">Full name<input value={resume.personal?.fullName || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, fullName: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
          <label className="text-sm text-(--text)">Professional title<input value={resume.personal?.jobTitle || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, jobTitle: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-(--text)">Email<input value={resume.personal?.email || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, email: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
          <label className="text-sm text-(--text)">Phone<input value={resume.personal?.phone || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, phone: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-(--text)">Location<input value={resume.personal?.location || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, location: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
          <label className="text-sm text-(--text)">Portfolio<input value={resume.personal?.portfolio || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, portfolio: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-(--text)">LinkedIn<input value={resume.personal?.linkedin || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, linkedin: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
          <label className="text-sm text-(--text)">GitHub<input value={resume.personal?.github || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, github: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        </div>
        <label className="block text-sm text-(--text)">Profile image URL<input value={resume.personal?.profileImage || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, profileImage: event.target.value } })} placeholder="https://" className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        <label className="block text-sm text-(--text)">Professional summary<textarea rows={5} value={resume.personal?.summary || ''} onChange={(event) => onUpdate({ personal: { ...resume.personal, summary: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
      </div>
    );
  }

  if (section === 'skills') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.span key={skill} layout className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)}><HiOutlineTrash className="h-3 w-3" /></button>
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['React', 'Figma', 'TypeScript', 'AI', 'Leadership', 'Data analysis'].map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => addSkill(suggestion)} className="rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm text-(--text)">
              + {suggestion}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input id="skill-input" placeholder="Add a skill" className="flex-1 rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" />
          <button type="button" onClick={() => addSkill(document.getElementById('skill-input').value)} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><HiOutlinePlus className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    const items = resume.education || [];
    const setItems = (value) => onUpdate({ education: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={item.degree || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, degree: event.target.value } : entry))} placeholder="Degree" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.institution || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, institution: event.target.value } : entry))} placeholder="Institution" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.location || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, location: event.target.value } : entry))} placeholder="Location" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.cgpa || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, cgpa: event.target.value } : entry))} placeholder="CGPA / GPA" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.startYear || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, startYear: event.target.value } : entry))} placeholder="Start year" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.endYear || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, endYear: event.target.value } : entry))} placeholder="End year" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
            <textarea value={item.description || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, description: event.target.value } : entry))} placeholder="Highlights" rows={3} className="mt-3 w-full rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, { id: `edu-${Date.now()}`, degree: '', institution: '', location: '', startYear: '', endYear: '', cgpa: '', description: '' }])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add education</div></button>
      </div>
    );
  }

  if (section === 'experience') {
    const items = resume.experience || [];
    const setItems = (value) => onUpdate({ experience: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={item.company || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, company: event.target.value } : entry))} placeholder="Company" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.role || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, role: event.target.value } : entry))} placeholder="Role" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.location || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, location: event.target.value } : entry))} placeholder="Location" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <div className="flex gap-2">
                <input value={item.startDate || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, startDate: event.target.value } : entry))} placeholder="Start" className="flex-1 rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
                <input value={item.endDate || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, endDate: event.target.value } : entry))} placeholder="End" className="flex-1 rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              </div>
            </div>
            <textarea value={item.achievements || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, achievements: event.target.value } : entry))} placeholder="Achievements, metrics, bullet points" rows={4} className="mt-3 w-full rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, createExperience()])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add experience</div></button>
      </div>
    );
  }

  if (section === 'projects') {
    const items = resume.projects || [];
    const setItems = (value) => onUpdate({ projects: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <input value={item.title || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry))} placeholder="Project title" className="w-full rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            <textarea value={item.description || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, description: event.target.value } : entry))} placeholder="Project description" rows={3} className="mt-3 w-full rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.techStack || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, techStack: event.target.value } : entry))} placeholder="Tech stack" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.liveUrl || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, liveUrl: event.target.value } : entry))} placeholder="Live URL" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, createProject()])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add project</div></button>
      </div>
    );
  }

  if (section === 'certifications') {
    const items = resume.certifications || [];
    const setItems = (value) => onUpdate({ certifications: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <input value={item.title || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry))} placeholder="Certification title" className="w-full rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.issuer || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, issuer: event.target.value } : entry))} placeholder="Issuer" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.credentialId || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, credentialId: event.target.value } : entry))} placeholder="Credential ID" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, createCertification()])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add certification</div></button>
      </div>
    );
  }

  if (section === 'languages') {
    const items = resume.languages || [];
    const setItems = (value) => onUpdate({ languages: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-2">
            <input value={item.name || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, name: event.target.value } : entry))} placeholder="Language" className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" />
            <input value={item.proficiency || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, proficiency: event.target.value } : entry))} placeholder="Proficiency" className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" />
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, createLanguage()])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add language</div></button>
      </div>
    );
  }

  if (section === 'achievements') {
    const values = (resume.achievements || []).join('\n');
    return (
      <div>
        <textarea value={values} onChange={(event) => onUpdate({ achievements: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} rows={7} className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" placeholder="Add one achievement per line" />
      </div>
    );
  }

  if (section === 'socials') {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {['website', 'linkedin', 'github', 'portfolio', 'dribbble', 'behance'].map((field) => (
          <label key={field} className="text-sm text-(--text)">{field}<input value={resume.socials?.[field] || ''} onChange={(event) => onUpdate({ socials: { ...resume.socials, [field]: event.target.value } })} className="mt-2 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)" /></label>
        ))}
      </div>
    );
  }

  if (section === 'references') {
    const items = resume.references || [];
    const setItems = (value) => onUpdate({ references: value });
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={item.name || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, name: event.target.value } : entry))} placeholder="Reference name" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.designation || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, designation: event.target.value } : entry))} placeholder="Designation" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input value={item.company || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, company: event.target.value } : entry))} placeholder="Company" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
              <input value={item.email || ''} onChange={(event) => setItems(items.map((entry, idx) => idx === index ? { ...entry, email: event.target.value } : entry))} placeholder="Email" className="rounded-2xl border border-(--border) bg-[var(--surface-strong)] px-4 py-3 text-(--text)" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, createReference()])} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white"><div className="flex items-center justify-center gap-2"><HiOutlinePlus className="h-4 w-4" />Add reference</div></button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-4 text-sm text-(--muted)">
      This section is coming soon. Use the other editors to keep the resume production-ready.
    </div>
  );
};

export default ResumeSectionEditor;
