import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineCodeBracket,
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineLink,
  HiOutlineMapPin,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineXMark,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import ResumePreview from '../../components/resume/ResumePreview';
import ResumeTemplates from '../../components/resume/ResumeTemplates';
import ResumeThemeCustomizer from '../../components/resume/ResumeThemeCustomizer';
import ResumeToolbar from '../../components/resume/ResumeToolbar';
import { resumeService } from '../../services/resume_service';
import { INITIAL_RESUME, TEMPLATE_OPTIONS, DEFAULT_SECTION_ORDER } from '../../utils/resumeBuilderConfig';

const createExperience = () => ({ company: '', role: '', location: '', startDate: '', endDate: '', currentlyWorking: false, achievements: '' });
const createEducation = () => ({ degree: '', institution: '', location: '', startYear: '', endYear: '', description: '' });
const createProject = () => ({ title: '', description: '', techStack: '', repoUrl: '', liveUrl: '' });
const createCertification = () => ({ title: '', issuer: '', credentialId: '', issueDate: '' });
const createLanguage = () => ({ name: '', proficiency: '' });

const SECTION_LABELS = {
  personal: 'Personal',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  achievements: 'Achievements',
  socials: 'Social links',
};

const buildSeedResume = () => ({
  personal: { ...INITIAL_RESUME.personal, fullName: '', jobTitle: '', email: '', location: '', summary: '', linkedin: '', portfolio: '', github: '' },
  experience: [createExperience()],
  education: [createEducation()],
  skills: [],
  projects: [createProject()],
  certifications: [createCertification()],
  languages: [createLanguage()],
  achievements: [''],
  mode: 'dark',
  accentColor: '#06b6d4',
  fontFamily: 'Inter, sans-serif',
  sidebarStyle: 'right',
  template: 'Modern Professional',
  visibility: 'public',
});

const convertToEditableResume = (resume = {}) => {
  const base = buildSeedResume();
  const personal = resume.personal || {};
  return {
    ...base,
    ...resume,
    personal: {
      ...base.personal,
      ...personal,
      fullName: personal.fullName || '',
      jobTitle: personal.jobTitle || '',
      email: personal.email || '',
      location: personal.location || '',
      summary: personal.summary || '',
      linkedin: personal.linkedin || '',
      portfolio: personal.portfolio || '',
      github: personal.github || '',
      website: personal.website || '',
      profileImage: personal.profileImage || '',
    },
    experience: Array.isArray(resume.experience) && resume.experience.length ? resume.experience.map((item) => ({
      ...createExperience(), ...item, achievements: Array.isArray(item?.achievements) ? item.achievements.join('\n') : item?.achievements || '',
    })) : [createExperience()],
    education: Array.isArray(resume.education) && resume.education.length ? resume.education.map((item) => ({ ...createEducation(), ...item })) : [createEducation()],
    skills: Array.isArray(resume.skills) ? resume.skills.map((skill) => (typeof skill === 'string' ? skill : skill?.name || '')).filter(Boolean) : [],
    projects: Array.isArray(resume.projects) && resume.projects.length ? resume.projects.map((item) => ({
      ...createProject(), ...item, techStack: Array.isArray(item?.techStack) ? item.techStack.join(', ') : item?.techStack || '',
    })) : [createProject()],
    certifications: Array.isArray(resume.certifications) && resume.certifications.length ? resume.certifications.map((item) => ({ ...createCertification(), ...item })) : [createCertification()],
    languages: Array.isArray(resume.languages) && resume.languages.length ? resume.languages.map((item) => ({ ...createLanguage(), ...item })) : [createLanguage()],
    achievements: Array.isArray(resume.achievements) && resume.achievements.length ? resume.achievements : [''],
    mode: resume.mode || 'dark',
    accentColor: resume.accentColor || '#06b6d4',
    fontFamily: resume.fontFamily || 'Inter, sans-serif',
    sidebarStyle: resume.sidebarStyle || 'right',
    template: resume.template || 'Modern Professional',
    visibility: resume.visibility || 'public',
  };
};

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewRef = useRef(null);
  const [resume, setResume] = useState(buildSeedResume);
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('Draft autosaved');
  const [editingResumeId, setEditingResumeId] = useState(null);

  useEffect(() => {
    const existingId = searchParams.get('resumeId');
    const draft = resumeService.getDraft();
    if (existingId) {
      const found = resumeService.getResumeById(existingId);
      if (found) {
        setResume(convertToEditableResume(found));
        setEditingResumeId(found.id);
        return;
      }
    }
    if (draft && draft.personal) {
      setResume(convertToEditableResume(draft));
      setEditingResumeId(draft.id || null);
      return;
    }
    setResume(buildSeedResume());
    setEditingResumeId(null);
  }, [searchParams]);

  useEffect(() => {
    resumeService.saveDraft(resume);
    setSavedMessage('Draft autosaved');
  }, [resume]);

  useEffect(() => {
    setSectionOrder(resume.sectionOrder || DEFAULT_SECTION_ORDER);
  }, [resume.sectionOrder]);

  const atsScore = useMemo(() => resume.atsScore || 78, [resume.atsScore]);
  const completion = useMemo(() => resume.completion || 0, [resume.completion]);

  const updatePersonal = (field, value) => {
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const handleArrayUpdate = (field, index, value, subField) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) => itemIndex === index ? { ...item, [subField]: value } : item),
    }));
  };

  const addArrayItem = (field, factory) => {
    setResume((prev) => ({ ...prev, [field]: [...prev[field], factory()] }));
  };

  const removeArrayItem = (field, index) => {
    setResume((prev) => ({ ...prev, [field]: prev[field].filter((_, itemIndex) => itemIndex !== index) }));
  };

  const addSkill = () => {
    const nextSkill = skillInput.trim();
    if (!nextSkill) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, nextSkill] }));
    setSkillInput('');
  };

  const removeSkill = (index) => {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((_, skillIndex) => skillIndex !== index) }));
  };

  const moveSection = (section, direction) => {
    setSectionOrder((current) => {
      const index = current.indexOf(section);
      if (index === -1) return current;
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const updated = [...current];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      setResume((prev) => ({ ...prev, sectionOrder: updated }));
      return updated;
    });
  };

  const handleDownload = () => {
    if (!previewRef.current) return;
    const fileName = `${(resume.personal.fullName || 'resume').replace(/\s+/g, '-').toLowerCase()}.pdf`;
    const options = {
      margin: [0.35, 0.35, 0.35, 0.35],
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(options).from(previewRef.current).save();
  };

  const handleDuplicateCurrent = () => {
    if (!user?.id) {
      toast.error('Sign in to duplicate your resume.');
      return;
    }
    const sourceId = editingResumeId || resume.id;
    const created = sourceId ? resumeService.duplicateResume(sourceId, user.id) : null;
    if (created) {
      setResume(convertToEditableResume(created));
      setEditingResumeId(created.id);
      toast.success('Resume duplicated. You can continue editing your copy.');
    } else {
      toast.error('Save the resume before duplicating it.');
    }
  };

  const handleSave = async (publish = false) => {
    if (!user?.id) {
      toast.error('Sign in to save your resume.');
      return;
    }
    setSaving(true);
    try {
      const nextResume = {
        ...resume,
        visibility: publish ? 'public' : resume.visibility || 'private',
        template: resume.template || 'Modern Professional',
      };
      const saved = resumeService.saveResume(user.id, nextResume);
      setResume(convertToEditableResume(saved));
      setEditingResumeId(saved.id);
      setSavedMessage(publish ? 'Resume published and saved' : 'Resume saved successfully');
      toast.success(publish ? 'Resume published' : 'Resume saved');
    } catch (error) {
      toast.error('Unable to save resume right now.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updatePersonal('profileImage', reader.result);
    reader.readAsDataURL(file);
  };

  const fieldMeta = [
    { label: 'Full name', icon: HiOutlineUser, field: 'fullName', type: 'text' },
    { label: 'Professional title', icon: HiOutlineBriefcase, field: 'jobTitle', type: 'text' },
    { label: 'Email', icon: HiOutlineEnvelope, field: 'email', type: 'email' },
    { label: 'Phone', icon: HiOutlinePhone, field: 'phone', type: 'text' },
    { label: 'Location', icon: HiOutlineMapPin, field: 'location', type: 'text' },
    { label: 'Portfolio', icon: HiOutlineGlobeAlt, field: 'portfolio', type: 'text' },
    { label: 'LinkedIn', icon: HiOutlineLink, field: 'linkedin', type: 'text' },
    { label: 'GitHub', icon: HiOutlineCodeBracket, field: 'github', type: 'text' },
    { label: 'Website', icon: HiOutlineBuildingOffice2, field: 'website', type: 'text' },
  ];

  return (
    <div className="space-y-3 max-w-7xl mx-auto p-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-(--border) bg-(--surface) p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-(--text)">Resume Builder</h1>
          </div>
          <div className="flex gap-2 text-center">
            <div className="rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5 min-w-[70px]">
              <p className="text-[10px] uppercase text-(--muted)">ATS</p>
              <p className="text-sm font-bold text-(--text)">{atsScore}%</p>
            </div>
            <div className="rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5 min-w-[70px]">
              <p className="text-[10px] uppercase text-(--muted)">Done</p>
              <p className="text-sm font-bold text-(--text)">{completion}%</p>
            </div>
            <div className="rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5">
              <p className="text-[11px] font-medium text-cyan-300">{savedMessage}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr] items-start">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-3">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Personal details</h2>
              <HiOutlineSparkles className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fieldMeta.map(({ label, icon: Icon, field, type }) => (
                <label key={field} className="block">
                  <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-(--text)">
                    <Icon className="h-3.5 w-3.5 text-cyan-400" />{label}
                  </span>
                  <input
                    type={type}
                    value={resume.personal[field] || ''}
                    onChange={(event) => updatePersonal(field, event.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5 text-sm text-(--text) outline-none transition focus:border-cyan-500"
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-(--text)">
                  <HiOutlineDocumentText className="h-3.5 w-3.5 text-cyan-400" />Summary
                </span>
                <textarea
                  rows={3}
                  value={resume.personal.summary || ''}
                  onChange={(event) => updatePersonal('summary', event.target.value)}
                  className="w-full rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5 text-sm text-(--text) outline-none transition focus:border-cyan-500"
                />
              </label>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-(--border) bg-[var(--surface-strong)] p-2">
              <span className="text-xs font-semibold text-(--text)">Profile Image</span>
              <label className="cursor-pointer rounded-lg bg-cyan-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-cyan-500">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-3">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Visual settings & Order</h2>
              <HiOutlineSparkles className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              <ResumeTemplates selectedTemplate={resume.template} onSelect={(value) => setResume((prev) => ({ ...prev, template: value }))} />
              <ResumeThemeCustomizer resume={resume} onUpdate={(patch) => setResume((prev) => ({ ...prev, ...patch }))} />
              <div className="rounded-lg border border-(--border) bg-[var(--surface-strong)] p-3">
                <p className="text-xs uppercase font-bold text-(--muted) mb-2">Section ordering</p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {sectionOrder.map((section, index) => (
                    <div key={section} className="flex items-center justify-between rounded-lg border border-(--border) bg-(--surface) px-2.5 py-1 text-xs">
                      <span className="font-medium text-(--text)">{SECTION_LABELS[section] || section}</span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveSection(section, -1)} disabled={index === 0} className="rounded p-1 border border-(--border) bg-[var(--surface-strong)] disabled:opacity-30">↑</button>
                        <button type="button" onClick={() => moveSection(section, 1)} disabled={index === sectionOrder.length - 1} className="rounded p-1 border border-(--border) bg-[var(--surface-strong)] disabled:opacity-30">↓</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-2">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {resume.skills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-200">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} className="text-[10px] font-bold hover:text-rose-400"><HiOutlineXMark /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} placeholder="React, SQL, Figma..." className="flex-1 rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1.5 text-sm text-(--text)" />
              <button type="button" onClick={addSkill} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-2">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Experience</h2>
              <HiOutlineBriefcase className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {resume.experience.map((item, index) => (
                <div key={`${item.company}-${index}`} className="rounded-lg border border-(--border) bg-[var(--surface-strong)] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Role #{index + 1}</span>
                    <button type="button" onClick={() => removeArrayItem('experience', index)} className="text-rose-400 hover:underline">Remove</button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <input value={item.company} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'company')} placeholder="Company" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.role} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'role')} placeholder="Role" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.location} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'location')} placeholder="Location" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <div className="flex gap-1.5">
                      <input value={item.startDate} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'startDate')} placeholder="Start" className="w-full rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                      <input value={item.endDate} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'endDate')} placeholder="End" className="w-full rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-(--muted) sm:col-span-2">
                      <input type="checkbox" checked={item.currentlyWorking} onChange={(event) => handleArrayUpdate('experience', index, event.target.checked, 'currentlyWorking')} />
                      Currently working here
                    </label>
                    <textarea value={item.achievements} onChange={(event) => handleArrayUpdate('experience', index, event.target.value, 'achievements')} rows={2} placeholder="Achievements (separated by line breaks)" className="sm:col-span-2 rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('experience', createExperience)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Experience</button>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-2">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Education</h2>
              <HiOutlineAcademicCap className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {resume.education.map((item, index) => (
                <div key={`${item.institution}-${index}`} className="rounded-lg border border-(--border) bg-[var(--surface-strong)] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Education #{index + 1}</span>
                    <button type="button" onClick={() => removeArrayItem('education', index)} className="text-rose-400 hover:underline">Remove</button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <input value={item.degree} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'degree')} placeholder="Degree" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.institution} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'institution')} placeholder="Institution" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.location} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'location')} placeholder="Location" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <div className="flex gap-1.5">
                      <input value={item.startYear} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'startYear')} placeholder="Start year" className="w-full rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                      <input value={item.endYear} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'endYear')} placeholder="End year" className="w-full rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    </div>
                    <textarea value={item.description} onChange={(event) => handleArrayUpdate('education', index, event.target.value, 'description')} rows={1.5} placeholder="Description" className="sm:col-span-2 rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('education', createEducation)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Education</button>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-2">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Projects & Credentials</h2>
              <HiOutlineClipboardDocumentList className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {resume.projects.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-lg border border-(--border) bg-[var(--surface-strong)] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Project #{index + 1}</span>
                    <button type="button" onClick={() => removeArrayItem('projects', index)} className="text-rose-400 hover:underline">Remove</button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <input value={item.title} onChange={(event) => handleArrayUpdate('projects', index, event.target.value, 'title')} placeholder="Project title" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.repoUrl} onChange={(event) => handleArrayUpdate('projects', index, event.target.value, 'repoUrl')} placeholder="Repo URL" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.liveUrl} onChange={(event) => handleArrayUpdate('projects', index, event.target.value, 'liveUrl')} placeholder="Live URL" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <input value={item.techStack} onChange={(event) => handleArrayUpdate('projects', index, event.target.value, 'techStack')} placeholder="Tech Stack (React, Node...)" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    <textarea value={item.description} onChange={(event) => handleArrayUpdate('projects', index, event.target.value, 'description')} rows={2} placeholder="Project description" className="sm:col-span-2 rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('projects', createProject)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Project</button>

              <div className="border-t border-(--border) pt-2 space-y-2">
                {resume.certifications.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-lg border border-(--border) bg-[var(--surface-strong)] p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                      <span>Certification #{index + 1}</span>
                      <button type="button" onClick={() => removeArrayItem('certifications', index)} className="text-rose-400 hover:underline">Remove</button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 text-sm">
                      <input value={item.title} onChange={(event) => handleArrayUpdate('certifications', index, event.target.value, 'title')} placeholder="Title" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                      <input value={item.issuer} onChange={(event) => handleArrayUpdate('certifications', index, event.target.value, 'issuer')} placeholder="Issuer" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                      <input value={item.credentialId} onChange={(event) => handleArrayUpdate('certifications', index, event.target.value, 'credentialId')} placeholder="Credential ID" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                      <input value={item.issueDate} onChange={(event) => handleArrayUpdate('certifications', index, event.target.value, 'issueDate')} placeholder="Issued" className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-(--text)" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('certifications', createCertification)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Certification</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between border-b border-(--border) pb-2 mb-2">
              <h2 className="text-sm uppercase tracking-wider font-bold text-cyan-400">Languages & Achievements</h2>
              <HiOutlineCheck className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {resume.languages.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex gap-1.5">
                    <input value={item.name} onChange={(event) => handleArrayUpdate('languages', index, event.target.value, 'name')} placeholder="Language" className="w-1/2 rounded-lg border border-(--border) bg-[var(--surface-strong)] px-2 py-1 text-xs text-(--text)" />
                    <input value={item.proficiency} onChange={(event) => handleArrayUpdate('languages', index, event.target.value, 'proficiency')} placeholder="Proficiency" className="w-1/2 rounded-lg border border-(--border) bg-[var(--surface-strong)] px-2 py-1 text-xs text-(--text)" />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addArrayItem('languages', createLanguage)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Language</button>

              <div className="border-t border-(--border) pt-2 space-y-1.5">
                <p className="text-xs font-semibold text-(--text)">Achievements</p>
                {resume.achievements.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-1.5">
                    <input
                      value={item}
                      onChange={(event) => setResume((prev) => ({
                        ...prev,
                        achievements: prev.achievements.map((ach, achIdx) => achIdx === index ? event.target.value : ach),
                      }))}
                      placeholder="Achievement or award details..."
                      className="flex-1 rounded-lg border border-(--border) bg-[var(--surface-strong)] px-3 py-1 text-xs text-(--text)"
                    />
                    <button type="button" onClick={() => setResume((prev) => ({
                      ...prev,
                      achievements: prev.achievements.filter((_, achIdx) => achIdx !== index),
                    }))} className="rounded-lg border border-(--border) px-2 text-xs text-rose-300">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setResume((prev) => ({ ...prev, achievements: [...prev.achievements, ''] }))} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"><HiOutlinePlus /> Add Achievement</button>
              </div>
            </div>
          </div>

          <ResumeToolbar
            onSave={() => handleSave(false)}
            onDuplicate={handleDuplicateCurrent}
            onDownload={handleDownload}
            onPreview={() => toast('Your dynamic template updates instantly in the preview layout.')}
            onPrint={() => window.print()}
            onOpenLibrary={() => navigate('/candidate/my-resumes')}
            saving={saving}
            isPreviewOpen={false}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 sticky top-4">
          <div className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Dynamic visual output</p>
              <h2 className="text-sm font-bold text-(--text)">Recruiter Document Preview</h2>
            </div>
            <HiOutlineDocumentArrowDown className="h-4 w-4 text-cyan-300" />
          </div>
          <div ref={previewRef} className="rounded-2xl border border-(--border) bg-white p-3 shadow-xl overflow-hidden">
            <ResumePreview resume={resume} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeBuilder;