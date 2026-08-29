import { getCompanies, setCompanies } from './storage_service';

const publicStatuses = ['published', 'approved', 'active', 'open'];

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop';

const industryBanners = {
  Technology: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  IT: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
  Software: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  Cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  Design: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
  'E-Commerce': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
};

const buildLogoUrl = (name) =>
  `https://ui-avatars.com/api/?background=0891b2&color=fff&bold=true&size=128&name=${encodeURIComponent(name || 'Co')}`;

const resolveBanner = (company, name) =>
  company.image ||
  company.companyBanner ||
  industryBanners[company.industry] ||
  DEFAULT_BANNER;

const resolveLogo = (company, name) =>
  company.logo || company.companyLogo || buildLogoUrl(name);

const createId = () => `company-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const notifyCompaniesUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('companies-updated'));
  }
};

const createDemoCompanies = () => [
  {
    id: 'company-demo-1',
    name: 'Google',
    type: 'MNC',
    industry: 'IT',
    experience: 'Mid Level',
    department: 'Development',
    business: 'Product Based',
    location: 'Bangalore',
    jobs: '245 Open Jobs',
    employees: '1.8L+',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    description: 'Global technology leader building products used by billions.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
  {
    id: 'company-demo-2',
    name: 'Microsoft',
    type: 'MNC',
    industry: 'Cloud',
    experience: 'Senior Level',
    department: 'Cloud',
    business: 'Service Based',
    location: 'Hyderabad',
    jobs: '180 Open Jobs',
    employees: '2.2L+',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    description: 'Cloud and productivity software for enterprises worldwide.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
  {
    id: 'company-demo-3',
    name: 'Amazon',
    type: 'MNC',
    industry: 'E-Commerce',
    experience: 'Mid Level',
    department: 'Operations',
    business: 'Product Based',
    location: 'Pune',
    jobs: '320 Open Jobs',
    employees: '3L+',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    description: 'E-commerce and cloud computing innovator.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
  {
    id: 'company-demo-4',
    name: 'Infosys',
    type: 'IT',
    industry: 'Software',
    experience: 'Fresher',
    department: 'Development',
    business: 'Service Based',
    location: 'Bhubaneswar',
    jobs: '140 Open Jobs',
    employees: '90K+',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://cdn.worldvectorlogo.com/logos/infosys-1.svg',
    description: 'Global IT services and consulting company.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
  {
    id: 'company-demo-5',
    name: 'TCS',
    type: 'IT',
    industry: 'Software',
    experience: 'Fresher',
    department: 'Support',
    business: 'Service Based',
    location: 'Chennai',
    jobs: '190 Open Jobs',
    employees: '6L+',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    description: 'Leading IT services, consulting and business solutions organization.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
  {
    id: 'company-demo-6',
    name: 'Wipro',
    type: 'IT',
    industry: 'Technology',
    experience: 'Entry Level',
    department: 'Testing',
    business: 'Service Based',
    location: 'Noida',
    jobs: '95 Open Jobs',
    employees: '2.5L+',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    description: 'Technology services and consulting company.',
    status: 'Published',
    verified: true,
    postedBy: 'system',
    recruiterId: 'system',
    createdByRole: 'system',
  },
];

const normalizeCompany = (company = {}) => {
  const id = company._id || company.id || createId();
  const status = company.status || (company.verified ? 'Approved' : 'Published');
  const name = String(company.name || 'Unknown Company').trim();

  return {
    ...company,
    _id: id,
    id,
    name,
    type: String(company.type || 'IT').trim(),
    industry: String(company.industry || 'Technology').trim(),
    experience: String(company.experience || 'Mid Level').trim(),
    department: String(company.department || 'Development').trim(),
    business: String(company.business || 'Product Based').trim(),
    location: String(company.location || 'Remote').trim(),
    jobs: String(company.jobs || '0 Open Jobs').trim(),
    employees: String(company.employees || company.size || 'N/A').trim(),
    image: resolveBanner(company, name),
    logo: resolveLogo(company, name),
    description: String(company.description || '').trim(),
    status,
    verified: Boolean(company.verified),
    postedBy: company.postedBy || company.recruiterId || '',
    recruiterId: company.recruiterId || company.postedBy || '',
    createdByRole: company.createdByRole || '',
    createdAt: company.createdAt || new Date().toISOString(),
    updatedAt: company.updatedAt || new Date().toISOString(),
    size: company.size || company.employees || '',
    website: company.website || '',
    email: company.email || '',
  };
};

const seedCompaniesIfEmpty = () => {
  const companies = getCompanies();

  if (!Array.isArray(companies) || companies.length === 0) {
    const demoCompanies = createDemoCompanies().map(normalizeCompany);
    setCompanies(demoCompanies);
    return demoCompanies;
  }

  return companies.map(normalizeCompany);
};

const getSyncedCompanies = () => seedCompaniesIfEmpty();

const saveSyncedCompanies = (companies) => {
  const normalized = companies.map(normalizeCompany);
  setCompanies(normalized);
  notifyCompaniesUpdated();
  return normalized;
};

const applyFilters = (companies, filters = {}) => {
  let filtered = Array.isArray(companies) ? [...companies] : [];

  if (filters.type && filters.type !== 'All') {
    filtered = filtered.filter((c) => String(c.type) === String(filters.type));
  }

  if (filters.industry && filters.industry !== 'All') {
    filtered = filtered.filter((c) => String(c.industry) === String(filters.industry));
  }

  if (filters.experience && filters.experience !== 'All') {
    filtered = filtered.filter((c) => String(c.experience) === String(filters.experience));
  }

  if (filters.department && filters.department !== 'All') {
    filtered = filtered.filter((c) => String(c.department) === String(filters.department));
  }

  if (filters.business && filters.business !== 'All') {
    filtered = filtered.filter((c) => String(c.business) === String(filters.business));
  }

  if (filters.location && filters.location !== 'All') {
    filtered = filtered.filter((c) =>
      String(c.location || '').toLowerCase().includes(String(filters.location).toLowerCase())
    );
  }

  if (filters.search) {
    const term = String(filters.search).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        String(c.name || '').toLowerCase().includes(term) ||
        String(c.industry || '').toLowerCase().includes(term) ||
        String(c.location || '').toLowerCase().includes(term) ||
        String(c.description || '').toLowerCase().includes(term) ||
        String(c.type || '').toLowerCase().includes(term)
    );
  }

  return filtered;
};

const isPublicCompany = (company) =>
  publicStatuses.includes(String(company.status || '').toLowerCase()) ||
  company.verified === true;

export const companyService = {
  DEFAULT_BANNER,
  buildLogoUrl,
  seedCompaniesIfEmpty,

  getAllCompanies: (filters = {}) => {
    const companies = getSyncedCompanies();
    return applyFilters(companies, filters);
  },

  getPublicCompanies: (filters = {}) => {
    const companies = getSyncedCompanies();
    const publicCompanies = companies.filter(isPublicCompany);
    return applyFilters(publicCompanies, filters);
  },

  getCompanyById: (id) => {
    const companies = getSyncedCompanies();
    return companies.find(
      (company) => String(company._id) === String(id) || String(company.id) === String(id)
    );
  },

  getCompaniesByRecruiter: (recruiterId) => {
    const companies = getSyncedCompanies();
    return companies.filter(
      (company) =>
        String(company.recruiterId) === String(recruiterId) ||
        String(company.postedBy) === String(recruiterId)
    );
  },

  createCompany: (companyData = {}) => {
    const companies = getSyncedCompanies();
    const id = companyData._id || companyData.id || createId();

    const newCompany = normalizeCompany({
      ...companyData,
      _id: id,
      id,
      status: companyData.status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return saveSyncedCompanies([newCompany, ...companies]).find((c) => c.id === id);
  },

  updateCompany: (id, updates) => {
    const companies = getSyncedCompanies();
    const companyIndex = companies.findIndex(
      (company) => String(company._id) === String(id) || String(company.id) === String(id)
    );

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex] = normalizeCompany({
      ...companies[companyIndex],
      ...updates,
      _id: companies[companyIndex]._id,
      id: companies[companyIndex].id,
      updatedAt: new Date().toISOString(),
    });

    saveSyncedCompanies(companies);
    return companies[companyIndex];
  },

  deleteCompany: (id) => {
    const companies = getSyncedCompanies();
    const companyIndex = companies.findIndex(
      (company) => String(company._id) === String(id) || String(company.id) === String(id)
    );

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    const deletedCompany = companies.splice(companyIndex, 1)[0];
    saveSyncedCompanies(companies);
    return deletedCompany;
  },

  verifyCompany: (id) => companyService.updateCompany(id, { verified: true, status: 'Approved' }),

  getCompanyStats: () => {
    const companies = getSyncedCompanies();

    const industryCounts = companies.reduce((acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
      return acc;
    }, {});

    return {
      total: companies.length,
      verified: companies.filter((c) => c.verified).length,
      unverified: companies.filter((c) => !c.verified).length,
      public: companies.filter(isPublicCompany).length,
      byIndustry: industryCounts,
    };
  },

  searchCompanies: (query) => {
    const companies = getSyncedCompanies();
    if (!query) return companies;
    return applyFilters(companies, { search: query });
  },

  getVerifiedCompanies: () => {
    const companies = getSyncedCompanies();
    return companies.filter((company) => company.verified);
  },

  getUnverifiedCompanies: () => {
    const companies = getSyncedCompanies();
    return companies.filter((company) => !company.verified);
  },
};
