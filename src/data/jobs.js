// Mock jobs data
export const mockJobs = [
  {
    _id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $160k',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building modern web applications using React, TypeScript, and cutting-edge technologies.',
    requirements: [
      '5+ years of experience with React and modern JavaScript',
      'Strong proficiency in TypeScript',
      'Experience with state management (Redux, Zustand)',
      'Knowledge of testing frameworks (Jest, React Testing Library)',
      'Familiarity with CI/CD pipelines'
    ],
    responsibilities: [
      'Develop and maintain high-quality web applications',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and mentoring junior developers',
      'Stay up-to-date with latest frontend technologies'
    ],
    postedBy: 'recruiter-1',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-2',
    title: 'Product Designer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$90k - $130k',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Join our creative team as a Product Designer. You will work on designing intuitive user experiences for our SaaS platform, collaborating closely with product managers and developers.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong portfolio demonstrating UX/UI design skills',
      'Experience with design systems and component libraries',
      'Understanding of user research and usability testing'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with cross-functional teams',
      'Maintain and evolve our design system',
      'Present design concepts to stakeholders'
    ],
    postedBy: 'recruiter-2',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-3',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary: '$110k - $150k',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'We are seeking a skilled DevOps Engineer to help us build and maintain our cloud infrastructure. You will work with modern tools and technologies to ensure reliable deployments.',
    requirements: [
      '4+ years of DevOps or SRE experience',
      'Strong experience with AWS, Azure, or GCP',
      'Proficiency in Docker and Kubernetes',
      'Experience with Infrastructure as Code (Terraform, CloudFormation)',
      'Knowledge of monitoring and logging tools'
    ],
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure and deployments',
      'Implement monitoring and alerting systems',
      'Collaborate with development teams on best practices',
      'Ensure security and compliance standards'
    ],
    postedBy: 'recruiter-3',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-4',
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'New York, NY',
    salary: '$80k - $110k',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Lead our marketing efforts and drive growth initiatives. You will develop and execute marketing strategies to increase brand awareness and customer acquisition.',
    requirements: [
      '3+ years of marketing experience',
      'Experience with digital marketing channels',
      'Strong analytical and data-driven mindset',
      'Excellent communication and presentation skills',
      'Experience with marketing automation tools'
    ],
    responsibilities: [
      'Develop and execute marketing campaigns',
      'Analyze campaign performance and ROI',
      'Manage social media presence and content',
      'Collaborate with sales and product teams',
      'Conduct market research and competitive analysis'
    ],
    postedBy: 'recruiter-4',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-5',
    title: 'Data Scientist',
    company: 'DataDriven Inc.',
    location: 'Seattle, WA',
    salary: '$130k - $180k',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Join our data science team to build machine learning models and extract insights from complex datasets. You will work on cutting-edge AI projects.',
    requirements: [
      'PhD or Masters in Data Science, Statistics, or related field',
      '5+ years of experience in data science',
      'Strong proficiency in Python, R, and SQL',
      'Experience with machine learning frameworks (TensorFlow, PyTorch)',
      'Knowledge of statistical analysis and modeling'
    ],
    responsibilities: [
      'Develop and deploy machine learning models',
      'Analyze large datasets to extract insights',
      'Collaborate with engineering teams on model integration',
      'Present findings to stakeholders and leadership',
      'Stay current with latest ML/AI developments'
    ],
    postedBy: 'recruiter-5',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-6',
    title: 'UX Researcher',
    company: 'UserFirst Design',
    location: 'Remote',
    salary: '$85k - $115k',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Conduct user research to inform product design decisions. You will work closely with designers and product managers to understand user needs and behaviors.',
    requirements: [
      '3+ years of UX research experience',
      'Experience with various research methods (interviews, surveys, usability testing)',
      'Strong analytical and synthesis skills',
      'Proficiency in research tools and software',
      'Excellent communication and storytelling abilities'
    ],
    responsibilities: [
      'Plan and conduct user research studies',
      'Analyze research data and synthesize insights',
      'Create personas, journey maps, and research reports',
      'Collaborate with design and product teams',
      'Advocate for user needs throughout the product development process'
    ],
    postedBy: 'recruiter-2',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

export const getJobs = (filters = {}) => {
  let filteredJobs = [...mockJobs];

  if (filters.location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.jobType) {
    filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
  }

  if (filters.experienceLevel) {
    filteredJobs = filteredJobs.filter(job => job.experienceLevel === filters.experienceLevel);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm)
    );
  }

  return filteredJobs;
};

export const getJobById = (id) => {
  return mockJobs.find(job => job._id === id);
};