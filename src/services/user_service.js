import {
  getUsers,
  setUsers,
  getCompanies,
  setCompanies,
  getApplications,
  setApplications,
  getJobs,
  setJobs
} from './storage_service';

// User Service - Handles all user-related operations
export const userService = {
  // Get all users
  getAllUsers: () => {
    return getUsers();
  },

  // Get user by ID
  getUserById: (id) => {
    const users = getUsers();
    return users.find(user => user.id === id);
  },

  // Get user by email
  getUserByEmail: (email) => {
    const users = getUsers();
    return users.find(user => user.email === email);
  },

  // Get users by role
  getUsersByRole: (role) => {
    const users = getUsers();
    return users.filter(user => user.role === role);
  },

  // Create new user
  createUser: (userData) => {
    const users = getUsers();

    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      ...userData,
      role: userData.role || 'candidate', // Default to candidate
      id: `${userData.role || 'candidate'}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isBlocked: false,
      profileCompletion: 0
    };

    users.push(newUser);
    setUsers(users);

    return newUser;
  },

  // Update user
  updateUser: (id, updates) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    setUsers(users);

    return users[userIndex];
  },

  // Delete user
  deleteUser: (id) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Remove associated data
    const deletedUser = users.splice(userIndex, 1)[0];
    setUsers(users);

    // Remove user's applications
    const applications = getApplications();
    const filteredApplications = applications.filter(app => app.candidate !== id);
    setApplications(filteredApplications);

    // Remove user's jobs if recruiter
    if (deletedUser.role === 'recruiter') {
      const jobs = getJobs();
      const filteredJobs = jobs.filter(job => job.postedBy !== id);
      setJobs(filteredJobs);

      // Remove user's company
      const companies = getCompanies();
      const filteredCompanies = companies.filter(company => company.recruiterId !== id);
      setCompanies(filteredCompanies);
    }

    return deletedUser;
  },

  // Block/Unblock user
  toggleUserBlock: (id) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].isBlocked = !users[userIndex].isBlocked;
    setUsers(users);

    return users[userIndex];
  },

  // Suspend user
  suspendUser: (id) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].status = users[userIndex].status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers(users);

    return users[userIndex];
  },

  // Promote user role
  promoteUser: (id, newRole) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].role = newRole;
    users[userIndex].updatedAt = new Date().toISOString();
    setUsers(users);

    return users[userIndex];
  },

  // Approve recruiter account
  approveRecruiter: (id) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id && user.role === 'recruiter');

    if (userIndex === -1) {
      throw new Error('Recruiter not found');
    }

    users[userIndex].isVerified = true;
    users[userIndex].verifiedAt = new Date().toISOString();
    users[userIndex].status = 'Verified';
    setUsers(users);

    return users[userIndex];
  },

  // Update candidate approval status
  updateCandidateApproval: (id, status) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id && user.role === 'candidate');

    if (userIndex === -1) {
      throw new Error('Candidate not found');
    }

    users[userIndex].approvalStatus = status;
    users[userIndex].status = status === 'Approved' ? 'Active' : 'Rejected';
    users[userIndex].updatedAt = new Date().toISOString();
    setUsers(users);

    return users[userIndex];
  },

  // Get user statistics
  getUserStats: () => {
    const users = getUsers();
    const applications = getApplications();
    const jobs = getJobs();

    return {
      totalUsers: users.length,
      candidates: users.filter(u => u.role === 'candidate').length,
      recruiters: users.filter(u => u.role === 'recruiter').length,
      verifiedRecruiters: users.filter(u => u.role === 'recruiter' && u.isVerified).length,
      admins: users.filter(u => u.role === 'admin').length,
      blockedUsers: users.filter(u => u.isBlocked).length,
      totalApplications: applications.length,
      totalJobs: jobs.length
    };
  },

  // Search users
  searchUsers: (query, role = null) => {
    const users = getUsers();
    let filteredUsers = users;

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(lowerQuery)))
      );
    }

    return filteredUsers;
  },

  // Calculate profile completion percentage
  calculateProfileCompletion: (user) => {
    const fields = ['name', 'email', 'bio', 'skills', 'education', 'experience'];
    const completedFields = fields.filter(field => {
      if (field === 'skills') return user.skills && user.skills.length > 0;
      if (field === 'education') return user.education && user.education.length > 0;
      if (field === 'experience') return user.experience && user.experience.length > 0;
      return user[field] && user[field].trim() !== '';
    });

    return Math.round((completedFields.length / fields.length) * 100);
  }
};