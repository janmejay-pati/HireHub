// Mock applications data
export const mockApplications = [
  {
    id: 'app-1',
    candidate: 'candidate-1',
    job: 'job-1',
    resume: '',
    coverLetter: 'I am excited to apply for the Senior Frontend Developer position at TechCorp Inc. With 4 years of experience in React development, I believe I would be a great fit for your team.',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'app-2',
    candidate: 'candidate-2',
    job: 'job-2',
    resume: '',
    coverLetter: 'As a UX Designer with a passion for user-centered design, I am thrilled about the opportunity to join DesignStudio and contribute to creating exceptional user experiences.',
    status: 'Reviewed',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: 'app-3',
    candidate: 'candidate-1',
    job: 'job-3',
    resume: '',
    coverLetter: 'My background in DevOps and cloud infrastructure makes me excited about the DevOps Engineer role at CloudTech Solutions.',
    status: 'Interview',
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
  }
];

export const getApplicationsByCandidate = (candidateId) => {
  return mockApplications.filter(app => app.candidate === candidateId);
};

export const getApplicationsByJob = (jobId) => {
  return mockApplications.filter(app => app.job === jobId);
};

export const getApplicationById = (id) => {
  return mockApplications.find(app => app.id === id);
};

export const addApplication = (application) => {
  const newApplication = {
    ...application,
    id: `app-${Date.now()}`,
    appliedAt: new Date().toISOString(),
    status: 'Applied'
  };
  mockApplications.push(newApplication);
  return newApplication;
};