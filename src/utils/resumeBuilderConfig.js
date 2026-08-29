export const RESUME_STORAGE_KEY = 'hirehub_resume_builder_data';

export const INITIAL_RESUME = {
  personal: {
    fullName: 'Ava Thompson',
    jobTitle: 'Senior Product Designer',
    email: 'ava@hirehub.ai',
    phone: '+1 (555) 017-8842',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/avathompson',
    portfolio: 'avathompson.design',
    github: 'github.com/avathompson',
    website: 'hirehub.ai',
    summary:
      'Strategic product designer with a strong background in user-centered systems, SaaS UX design, and AI-first interface innovation. Known for turning complex problems into elegant digital products, shipping high-impact experiences, and collaborating closely with product and engineering teams.',
    profileImage: '',
    coverImage: '',
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'HireHub AI',
      role: 'Senior Product Designer',
      location: 'Remote',
      jobType: 'Full-time',
      startDate: '2022',
      endDate: 'Present',
      currentlyWorking: true,
      logo: '',
      achievements: [
        'Led redesign of the end-to-end candidate workflow, improving activation by 31%.',
        'Created premium design systems for recruiting dashboards and AI assistant experiences.',
        'Partnered with engineering to launch a new interview intelligence experience in 6 weeks.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Human-Computer Interaction',
      institution: 'California State University',
      location: 'San Francisco, CA',
      startYear: '2017',
      endYear: '2021',
      cgpa: '3.95',
      description: 'Focused on interaction design, product strategy, and design systems.',
      achievements: 'Dean’s List, Design Excellence Award',
    },
  ],
  skills: [
    { name: 'React', category: 'Frontend', level: 95 },
    { name: 'Figma', category: 'Tools', level: 98 },
    { name: 'TypeScript', category: 'Frontend', level: 92 },
    { name: 'Node.js', category: 'Backend', level: 88 },
    { name: 'PostgreSQL', category: 'Database', level: 84 },
    { name: 'Design Systems', category: 'Soft Skills', level: 96 },
  ],
  projects: [
    {
      id: 'project-1',
      title: 'TalentOS AI',
      description: 'AI-powered recruiting workspace with intelligent candidate matching and automated interview summaries.',
      techStack: ['React', 'Node.js', 'OpenAI', 'PostgreSQL'],
      repoUrl: 'https://github.com/avathompson/talentos',
      liveUrl: 'https://talentos.ai',
      featured: true,
      image: '',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Google UX Design Professional Certificate',
      issuer: 'Google',
      credentialId: 'UX-2023-1128',
      verifyUrl: 'https://www.coursera.org/verify/UX-2023-1128',
      issueDate: '2024-02-12',
      expires: false,
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Fluent' },
  ],
  achievements: [
    'Top 10% Product Design Awards 2024',
    'Hackathon Winner – AI Hiring Challenge',
    'Mentored 12 design interns and interns',
  ],
  socials: {
    dribbble: 'dribbble.com/ava-thompson',
    behance: 'behance.net/ava-thompson',
    medium: 'medium.com/@ava-thompson',
    twitter: 'x.com/ava_thompson',
    leetcode: 'leetcode.com/ava_thompson',
    codechef: 'codechef.com/users/ava_thompson',
    hackerrank: 'hackerrank.com/ava_thompson',
    stackoverflow: 'stackoverflow.com/users/ava-thompson',
  },
  hiddenSections: {},
  meta: {
    template: 'Modern Professional',
    theme: 'Neo Blue',
    lastSaved: new Date().toISOString(),
    aiScore: 92,
    atsScore: 89,
    keywordScore: 94,
  },
};

export const THEME_PRESETS = [
  { name: 'Neo Blue', accent: 'from-cyan-500 via-sky-500 to-blue-600', bg: 'from-slate-950 via-slate-900 to-cyan-950', glow: 'shadow-cyan-500/30' },
  { name: 'Emerald', accent: 'from-emerald-500 via-teal-500 to-cyan-600', bg: 'from-slate-950 via-emerald-950 to-teal-950', glow: 'shadow-emerald-500/30' },
  { name: 'Royal Purple', accent: 'from-violet-500 via-fuchsia-500 to-purple-700', bg: 'from-slate-950 via-violet-950 to-fuchsia-950', glow: 'shadow-violet-500/30' },
  { name: 'Sunset Orange', accent: 'from-orange-500 via-rose-500 to-pink-600', bg: 'from-slate-950 via-rose-950 to-orange-950', glow: 'shadow-orange-500/30' },
  { name: 'Midnight Dark', accent: 'from-slate-200 via-white to-slate-400', bg: 'from-slate-950 via-slate-900 to-black', glow: 'shadow-white/10' },
  { name: 'Rose Pink', accent: 'from-pink-500 via-rose-500 to-fuchsia-600', bg: 'from-slate-950 via-pink-950 to-fuchsia-950', glow: 'shadow-pink-500/30' },
  { name: 'Cyberpunk Neon', accent: 'from-fuchsia-500 via-purple-500 to-cyan-400', bg: 'from-slate-950 via-fuchsia-950 to-cyan-950', glow: 'shadow-fuchsia-500/30' },
];

export const TEMPLATE_OPTIONS = [
  'Modern Professional',
  'Minimal Elegant',
  'Creative Gradient',
  'Glassmorphism Resume',
  'Dark Cyberpunk',
  'Corporate ATS',
  'Designer Portfolio',
  'Neo Brutalism',
  'Premium Executive',
  'Futuristic Neon',
];

export const SKILL_SUGGESTIONS = [
  'Design Systems',
  'Accessibility',
  'Product Strategy',
  'AI UX',
  'Motion Design',
  'Leadership',
  'Mentoring',
  'Prototyping',
  'Analytics',
  'Research',
  'Cross-functional Collaboration',
  'Rapid Iteration',
];

export const EXPERIENCE_SUGGESTIONS = [
  'Improved user activation by 28% through streamlined onboarding flows.',
  'Built scalable design systems used by 8 product squads.',
  'Collaborated with product and engineering to ship AI-assisted workflows.',
  'Optimized conversion by refining information architecture and conversion copy.',
  'Led user research sessions to validate strategic product decisions.',
];

export const DEFAULT_SECTION_ORDER = [
  'personal',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
  'socials',
];
