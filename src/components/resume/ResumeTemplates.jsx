import { motion } from 'framer-motion';
import { HiOutlineCheckBadge } from 'react-icons/hi2';

const templateCards = [
  {
    name: 'Modern Professional',
    tone: 'From clean gradients to strong hierarchy, ideal for high-growth startups.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Corporate ATS',
    tone: 'Structured, scannable, and recruiter-friendly for enterprise hiring.',
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    name: 'Creative Designer',
    tone: 'Bold cards and expressive spacing for design-led opportunities.',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    name: 'Minimal Clean',
    tone: 'Elegant whitespace and subtle accents for polished, modern applications.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'ATS Friendly',
    tone: 'Optimized for keyword readability and clear section sequencing.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Dark Resume',
    tone: 'High-contrast resume mode meant for premium recruiter previews.',
    gradient: 'from-violet-500 to-indigo-600',
  },
  {
    name: 'Glassmorphism Resume',
    tone: 'Backdrop blur and luminous layering reserved for premium branding.',
    gradient: 'from-cyan-400 via-sky-500 to-violet-600',
  },
];

const ResumeTemplates = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {templateCards.map((template) => {
        const isSelected = selectedTemplate === template.name;

        return (
          <motion.button
            key={template.name}
            type="button"
            whileHover={{ y: -4 }}
            onClick={() => onSelect(template.name)}
            className={`rounded-xl border p-4 text-left transition ${
              isSelected
                ? 'border-cyan-400/70 bg-cyan-500/10'
                : 'border-(--border) bg-(--surface)'
            }`}
          >
            <div className={`h-2 rounded-full bg-linear-to-r ${template.gradient}`} />
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-(--text)">{template.name}</p>
                <p className="mt-2 text-sm text-(--muted)">{template.tone}</p>
              </div>
              {isSelected && <HiOutlineCheckBadge className="h-5 w-5 text-cyan-300" />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ResumeTemplates;
