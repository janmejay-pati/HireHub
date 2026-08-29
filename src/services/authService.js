import { userService } from './user_service';
import {
  getCurrentUser as getCurrentUserFromStorage,
  setCurrentUser,
  clearCurrentUser,
  setToken,
  clearToken,
  getVerifications,
  setVerifications,
  ensureDefaultAdmin,
} from './storage_service';

const ADMIN_SECRET_CODE = 'HIREHUB.ADMIN.2026';

export const seedDefaultAdmin = () => {
  return ensureDefaultAdmin();
};

export const seedDefaultUsers = seedDefaultAdmin;

export const getAllUsers = () => {
  return userService.getAllUsers();
};

export const updateUserRole = (userId, newRole) => {
  return userService.updateUser(userId, { role: newRole });
};

export const deleteUser = (userId) => {
  return userService.deleteUser(userId);
};

export const registerUser = async (payload, remember = true) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    if (!payload.email || !payload.password || !payload.name) {
      throw new Error('Name, email, and password are required');
    }

    const role = payload.role || 'candidate';

    if (role === 'recruiter') {
      if (!payload.company || !payload.designation || !payload.companySize) {
        throw new Error('Recruiter registration requires company, designation, and company size');
      }
    }

    if (role === 'admin') {
      if (payload.adminCode !== ADMIN_SECRET_CODE) {
        throw new Error('Invalid admin code');
      }
    }

    const userPayload = {
      ...payload,
      role,
      skills: role === 'candidate'
        ? (payload.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean)
        : payload.skills || [],
      company: role === 'recruiter' ? payload.company : undefined,
      designation: role === 'recruiter' ? payload.designation : undefined,
      companySize: role === 'recruiter' ? payload.companySize : undefined,
      location: role === 'recruiter' ? payload.location : undefined,
    };

    const newUser = userService.createUser(userPayload);

    const { password, ...userSession } = newUser;
    setCurrentUser(userSession, remember);
    setToken('mock-jwt-token-' + Date.now(), remember);

    return {
      success: true,
      data: {
        user: userSession,
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

export const loginUser = async (payload, remember = true) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    const user = userService.getUserByEmail(payload.email);

    if (!user || user.password !== payload.password || (payload.role && user.role !== payload.role)) {
      return {
        success: false,
        message: 'Invalid email, password or role'
      };
    }

    if (user.isBlocked) {
      return {
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      };
    }

    const { password, ...userSession } = user;
    setCurrentUser(userSession, remember);
    setToken('mock-jwt-token-' + Date.now(), remember);

    return {
      success: true,
      data: {
        user: userSession,
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Login failed'
    };
  }
};

export const logoutUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    clearCurrentUser();
    clearToken();
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Logout failed'
    };
  }
};

export const requestPasswordReset = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = userService.getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      message: 'No account found with that email.'
    };
  }

  const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const existing = getVerifications();
  const resetRecord = {
    id: `verify-${Date.now()}`,
    type: 'password_reset',
    userId: user.id,
    email: user.email,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  };

  setVerifications([resetRecord, ...existing]);

  return {
    success: true,
    data: {
      token
    }
  };
};

export const requestOTP = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const user = userService.getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      message: 'No account found with that email.'
    };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const existing = getVerifications();
  const otpRecord = {
    id: `verify-${Date.now()}`,
    type: 'otp',
    userId: user.id,
    email: user.email,
    code,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
  };

  setVerifications([otpRecord, ...existing]);

  return {
    success: true,
    data: {
      code
    }
  };
};

export const verifyOTP = async (email, code) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const verifications = getVerifications();
  const record = verifications.find((item) => item.type === 'otp' && item.email === email && item.code === code);

  if (!record || new Date(record.expiresAt) < new Date()) {
    return {
      success: false,
      message: 'OTP is invalid or expired.'
    };
  }

  // create a password_reset token so user can reset password
  const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const resetRecord = {
    id: `verify-${Date.now()}-reset`,
    type: 'password_reset',
    userId: record.userId,
    email: record.email,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  };

  // remove all otp records for this email and add the reset record
  const remaining = verifications.filter((item) => !(item.type === 'otp' && item.email === email));
  setVerifications([resetRecord, ...remaining]);

  return {
    success: true,
    data: {
      token
    }
  };
};

export const resetPassword = async (token, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const verifications = getVerifications();
  const record = verifications.find((item) => item.token === token && item.type === 'password_reset');

  if (!record || new Date(record.expiresAt) < new Date()) {
    return {
      success: false,
      message: 'Password reset link is invalid or expired.'
    };
  }

  try {
    const updatedUser = userService.updateUser(record.userId, { password });
    setVerifications(verifications.filter((item) => item.id !== record.id));

    return {
      success: true,
      data: updatedUser
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to reset password.'
    };
  }
};

export const getCurrentUserSession = () => {
  return getCurrentUserFromStorage();
};

export const getCurrentUser = getCurrentUserSession;
export const getUsers = () => userService.getAllUsers();

export const updateProfile = async (userId, updates) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const updatedUser = userService.updateUser(userId, updates);

    const currentUser = getCurrentUser();
    const { password, ...sessionUser } = updatedUser;
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(sessionUser);
    }

    return {
      success: true,
      data: updatedUser
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Profile update failed'
    };
  }
};