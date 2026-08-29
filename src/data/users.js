// Mock users data
export const mockUsers = [
  {
    id: 'candidate-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    password: 'password123',
    role: 'candidate',
    profileImage: '',
    bio: 'Passionate frontend developer with 4 years of experience building modern web applications.',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'JavaScript'],
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Computer Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2018',
        endDate: '2022'
      }
    ],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        from: '2022',
        to: 'Present',
        description: 'Developed and maintained React applications, improved performance by 40%.'
      }
    ],
    resume: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'candidate-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    password: 'password123',
    role: 'candidate',
    profileImage: '',
    bio: 'UX Designer focused on creating intuitive and accessible user experiences.',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    education: [
      {
        school: 'Design Institute',
        degree: 'Master of Fine Arts',
        fieldOfStudy: 'Interaction Design',
        startDate: '2019',
        endDate: '2021'
      }
    ],
    experience: [
      {
        title: 'Product Designer',
        company: 'DesignStudio',
        location: 'Remote',
        from: '2021',
        to: 'Present',
        description: 'Led design for SaaS platform, increased user engagement by 35%.'
      }
    ],
    resume: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'recruiter-1',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@techcorp.com',
    password: 'password123',
    role: 'recruiter',
    profileImage: '',
    bio: 'Tech recruiter specializing in software engineering roles.',
    skills: ['Talent Acquisition', 'Technical Interviewing', 'ATS Systems'],
    education: [],
    experience: [],
    resume: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'recruiter-2',
    name: 'Emily Davis',
    email: 'emily.davis@designstudio.com',
    password: 'password123',
    role: 'recruiter',
    profileImage: '',
    bio: 'Creative recruiter for design and product roles.',
    skills: ['Design Recruitment', 'Portfolio Review', 'Creative Team Building'],
    education: [],
    experience: [],
    resume: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-1',
    name: 'David Wilson',
    email: 'david.wilson@hirehub.com',
    password: 'password123',
    role: 'admin',
    profileImage: '',
    bio: 'Platform administrator managing HireHub operations.',
    skills: ['System Administration', 'Data Analysis', 'Platform Management'],
    education: [],
    experience: [],
    resume: '',
    createdAt: new Date().toISOString()
  }
];

export const getUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role) => {
  return mockUsers.filter(user => user.role === role);
};