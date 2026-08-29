// Mock companies data
export const mockCompanies = [
  {
    id: 'company-1',
    name: 'TechCorp Inc.',
    description: 'Leading technology company specializing in AI-powered solutions and cloud infrastructure.',
    industry: 'Technology',
    size: '1000-5000',
    website: 'https://techcorp.com',
    location: 'San Francisco, CA',
    logo: '',
    founded: '2015',
    recruiterId: 'recruiter-1',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'company-2',
    name: 'DesignStudio',
    description: 'Creative design agency focused on user experience and brand identity.',
    industry: 'Design',
    size: '50-200',
    website: 'https://designstudio.com',
    location: 'New York, NY',
    logo: '',
    founded: '2018',
    recruiterId: 'recruiter-2',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'company-3',
    name: 'CloudTech Solutions',
    description: 'Cloud infrastructure and DevOps solutions provider.',
    industry: 'Technology',
    size: '500-1000',
    website: 'https://cloudtech.com',
    location: 'Austin, TX',
    logo: '',
    founded: '2012',
    recruiterId: 'recruiter-3',
    verified: false,
    createdAt: new Date().toISOString()
  }
];

export const getCompanies = () => {
  return mockCompanies;
};

export const getCompanyById = (id) => {
  return mockCompanies.find(company => company.id === id);
};

export const getCompaniesByRecruiter = (recruiterId) => {
  return mockCompanies.filter(company => company.recruiterId === recruiterId);
};

export const addCompany = (company) => {
  const newCompany = {
    ...company,
    id: `company-${Date.now()}`,
    verified: false,
    createdAt: new Date().toISOString()
  };
  mockCompanies.push(newCompany);
  return newCompany;
};

export const updateCompany = (id, updates) => {
  const index = mockCompanies.findIndex(company => company.id === id);
  if (index !== -1) {
    mockCompanies[index] = { ...mockCompanies[index], ...updates };
    return mockCompanies[index];
  }
  return null;
};

export const deleteCompany = (id) => {
  const index = mockCompanies.findIndex(company => company.id === id);
  if (index !== -1) {
    return mockCompanies.splice(index, 1)[0];
  }
  return null;
};