import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  initializeStorage,
} from "../services/storage_service";

import { userService } from "../services/user_service";
import { profileService } from "../services/profile_service";
import { jobService } from "../services/jobService";
import { companyService } from "../services/company_service";

const AuthContext = createContext();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, resumeFile, resumeData, documents, ...cleanUser } = user;
  return cleanUser;
};

/* only save small data in localStorage */
const getLightUser = (user) => {
  if (!user) return null;

  const profileImage = typeof user.profileImage === "string" && user.profileImage.startsWith("data:image/")
    ? ""
    : user.profileImage || "";

  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
    avatar: typeof user.avatar === "string" && user.avatar.startsWith("data:image/") ? "" : user.avatar || "",
    profileImage,
  };
};

const mergeUserWithProfile = (user, profile) => {
  const name = [
    profile?.personal?.firstName,
    profile?.personal?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    ...user,
    name: name || user.name,
    profileImage:
      profile?.personal?.profileImage ||
      user.profileImage ||
      user.avatar ||
      "",
  };
};

const syncUserFromStorage = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const storedUser = userService.getUserById(currentUser.id);
  const safeUser = sanitizeUser(storedUser || currentUser);

  if (!safeUser) {
    return null;
  }

  if (safeUser.role === "candidate") {
    const profile = profileService.getCandidateProfile(safeUser.id);
    return mergeUserWithProfile(safeUser, profile);
  }

  return safeUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    jobService.seedJobsIfEmpty();
    companyService.seedCompaniesIfEmpty();

    const syncedUser = syncUserFromStorage();

    if (syncedUser) {
      setUser(syncedUser);

      if (syncedUser.role === "candidate") {
        setCandidateProfile(
          profileService.getCandidateProfile(syncedUser.id)
        );
      }
    }

    setLoading(false);
  }, []);

  const refreshUser = ({ persist = true } = {}) => {
    const syncedUser = syncUserFromStorage();

    if (!syncedUser) {
      setUser(null);
      setCandidateProfile(null);
      return null;
    }

    if (syncedUser.role === "candidate") {
      const profile = profileService.getCandidateProfile(syncedUser.id);
      const mergedUser = mergeUserWithProfile(syncedUser, profile);

      if (persist) {
        setCurrentUser(getLightUser(mergedUser));
      }

      setCandidateProfile(profile);
      setUser(mergedUser);

      return mergedUser;
    }

    if (persist) {
      setCurrentUser(getLightUser(syncedUser));
    }

    setUser(syncedUser);
    setCandidateProfile(null);

    return syncedUser;
  };

  useEffect(() => {
    const handleStorageEvent = () => {
      refreshUser({ persist: false });
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const login = (userData) => {
    const storedUser = userService.getUserById(userData.id);
    const safeUser = sanitizeUser(storedUser || userData);

    if (!safeUser) return;

    if (safeUser.role === "candidate") {
      const profile = profileService.getCandidateProfile(safeUser.id);
      const mergedUser = mergeUserWithProfile(safeUser, profile);

      setCurrentUser(getLightUser(mergedUser));
      setCandidateProfile(profile);
      setUser(mergedUser);
    } else {
      setCurrentUser(getLightUser(safeUser));
      setUser(safeUser);
      setCandidateProfile(null);
    }
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
    setCandidateProfile(null);
  };

  const updateUser = (updates) => {
    if (!user) {
      return null;
    }

    const updatedUser = userService.updateUser(user.id, updates);
    const safeUser = sanitizeUser(updatedUser);

    if (!safeUser) {
      return null;
    }

    if (safeUser.role === "candidate") {
      const profile = profileService.getCandidateProfile(safeUser.id);
      const mergedUser = mergeUserWithProfile(safeUser, profile);

      setCurrentUser(getLightUser(mergedUser));
      setCandidateProfile(profile);
      setUser(mergedUser);

      return mergedUser;
    }

    setCurrentUser(getLightUser(safeUser));
    setUser(safeUser);
    setCandidateProfile(null);

    return safeUser;
  };

  const updateCandidateProfile = (updates) => {
    if (!user || user.role !== "candidate") return null;

    const nextProfile = profileService.saveCandidateProfile(user.id, {
      ...candidateProfile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    });

    const mergedUser = mergeUserWithProfile(user, nextProfile);

    setCurrentUser(getLightUser(mergedUser));
    setUser(mergedUser);
    setCandidateProfile(nextProfile);

    return nextProfile;
  };

  const refreshCandidateProfile = () => {
    if (!user || user.role !== "candidate") return null;

    const profile = profileService.getCandidateProfile(user.id);
    const mergedUser = mergeUserWithProfile(user, profile);

    setCandidateProfile(profile);
    setCurrentUser(getLightUser(mergedUser));
    setUser(mergedUser);

    return profile;
  };

  const value = useMemo(
    () => ({
      user,
      candidateProfile,
      updateCandidateProfile,
      refreshCandidateProfile,
      updateUser,
      refreshUser,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
    }),
    [user, candidateProfile, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};