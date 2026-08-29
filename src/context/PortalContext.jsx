import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "./AuthContext";
import { applicationService } from "../services/application_service";
import { userService } from "../services/user_service";
import { resumeService } from "../services/resume_service";
import { notificationService } from "../services/notification_service";

const PortalContext = createContext(null);

const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();

  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;
  return `${Math.floor(diff / 86_400_000)} day${diff >= 172_800_000 ? "s" : ""} ago`;
};

const createSampleNotifications = () => [
  {
    id: "sample-1",
    title: "New jobs added",
    message: "Fresh opportunities in frontend and cloud roles are now live.",
    category: "jobs",
    read: false,
    timestamp: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: "sample-2",
    title: "New events available",
    message: "Career workshops and recruiter Q&A sessions are scheduled this week.",
    category: "events",
    read: false,
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: "sample-3",
    title: "Admin announcement",
    message: "Profile completion tips are now available for stronger recruiter visibility.",
    category: "admin",
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: "sample-4",
    title: "Recruiter message",
    message: "A recruiter has requested a follow-up on your recent application.",
    category: "recruiter",
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
  },
  {
    id: "sample-5",
    title: "Application approved",
    message: "Your application for a frontend role is now under recruiter review.",
    category: "status",
    read: true,
    timestamp: new Date(Date.now() - 8 * 60 * 60_000).toISOString(),
  },
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

const createNotificationRecord = (payload = {}) => ({
  id: payload.id || `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: payload.title || "New update",
  message: payload.message || "A new action is ready for you.",
  category: payload.category || "status",
  read: Boolean(payload.read),
  timestamp: payload.timestamp || new Date().toISOString(),
});

const normalizeJob = (job = {}) => ({
  _id: job._id || job.id,
  id: job.id || job._id,
  title: job.title || "Untitled role",
  company: job.company || job.employer || "HireHub",
  location: job.location || "Remote",
  salary: job.salary || job.compensation || "Competitive",
  description: job.description || "",
  skills: Array.isArray(job.skills) ? job.skills : [],
  jobType: job.jobType || job.type || "Full Time",
  experienceLevel: job.experienceLevel || job.experience || "Mid Level",
  logo: job.logo || job.image || "",
  banner: job.banner || job.image || "",
  postedBy: job.postedBy || job.recruiterId || null,
  deadline: job.deadline || null,
});

export const PortalProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState(() => notificationService.getAllNotifications(user?.id || null));

  const syncApplications = useCallback(() => {
    if (!user?.id) {
      setApplications([]);
      return;
    }

    setApplications(applicationService.getApplicationsByCandidate(user.id));
  }, [user?.id]);

  useEffect(() => {
    syncApplications();
  }, [syncApplications]);

  useEffect(() => {
    // keep local notifications in sync with service
    setNotifications(notificationService.getAllNotifications(user?.id || null));
    const handle = () => setNotifications(notificationService.getAllNotifications(user?.id || null));
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

  const closeApplyModal = useCallback(() => {
    setIsApplyModalOpen(false);
    setSelectedJob(null);
  }, []);

  const hasApplied = useCallback(
    (jobId) => applications.some((application) => application.jobId === jobId),
    [applications]
  );

  const openApplyModal = useCallback(
    (job) => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (user.role !== "candidate") {
        navigate("/unauthorized");
        return;
      }

      const normalized = normalizeJob(job);

      if (!normalized._id) {
        toast.error("Job details are unavailable right now.");
        return;
      }

      if (hasApplied(normalized._id)) {
        toast.success("You already applied to this role.");
        navigate("/candidate/applications");
        return;
      }

      setSelectedJob(null);
      setIsApplyModalOpen(false);
      navigate(`/candidate/apply/${normalized._id}`);
    },
    [hasApplied, navigate, user]
  );

  const submitApplication = useCallback(
    async (job, formData = {}) => {
      if (!user) {
        throw new Error("Please sign in to apply.");
      }

      if (user.role !== "candidate") {
        throw new Error("Only candidates can apply.");
      }

      const normalized = normalizeJob(job || selectedJob);

      if (!normalized._id) {
        throw new Error("Job details are unavailable.");
      }

      if (hasApplied(normalized._id)) {
        throw new Error("You have already applied to this role.");
      }

      const resume = formData.resumeFile
        ? await readFileAsDataUrl(formData.resumeFile)
        : formData.resume || "Resume uploaded";

      const skills = Array.isArray(formData.skills)
        ? formData.skills
        : String(formData.skills || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

      // Save candidate resume into resume library for recruiter visibility
      let savedResume = null;
      try {
        if (typeof resume === 'string' && resume.startsWith('data:')) {
          const resumePayload = {
            personal: {
              fullName: formData.fullName || user.name || '',
              email: formData.email || user.email || '',
              profileImage: user.profileImage || user.avatar || '',
            },
            skills,
            experience: formData.experience
              ? [{ title: formData.experience, company: normalized.company, duration: '' }]
              : [],
            summary: formData.coverLetter || '',
            resumeFile: resume,
            visibility: 'private',
          };

          savedResume = resumeService.saveResume(user.id, resumePayload);
        }
      } catch (e) {
        console.warn('Failed to save resume to library', e);
      }

      const recruiterProfile = userService.getUserById(normalized.postedBy) || null;
      const applicationData = {
        applicationId: `app-${Date.now()}`,
        candidateId: user.id,
        recruiterId: normalized.postedBy || formData.recruiterId || null,
        recruiterName: recruiterProfile?.name || "Hiring Team",
        recruiterEmail: recruiterProfile?.email || "",
        jobId: normalized._id,
        jobTitle: normalized.title,
        company: normalized.company,
        jobCategory: normalized.jobCategory || normalized.jobType || "General",
        jobDomain: normalized.jobCategory || normalized.department || normalized.jobType || "General",
        candidateName: formData.fullName || user.name || user.email,
        email: formData.email || user.email,
        phone: formData.phone || "",
        resume,
        resumeId: savedResume?.id || null,
        coverLetter: formData.coverLetter || "",
        expectedSalary: formData.expectedSalary || "",
        experience: formData.experience || "",
        skills,
        portfolioLink: formData.portfolio || formData.portfolioLink || "",
        linkedInLink: formData.linkedin || formData.linkedIn || "",
        githubLink: formData.github || "",
        availability: formData.availability || "Immediately",
        termsAccepted: formData.terms || true,
        status: "Applied",
        appliedDate: new Date().toISOString(),
      };

      const createdApplication = applicationService.createApplication(applicationData);
      setApplications((current) => [...current, createdApplication]);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      try {
        notificationService.createNotification({
          title: "Application submitted",
          message: `Your application for ${normalized.title} is now saved in your dashboard.`,
          category: "status",
        });
      } catch (e) {}
        setNotifications(notificationService.getAllNotifications(user?.id || null));
      toast.success("Application submitted successfully!");
      // notify other parts of the app (and other tabs) about storage changes
      try {
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        // ignore
      }
      return createdApplication;
    },
    [hasApplied, selectedJob, user]
  );

  const addNotification = useCallback((payload = {}) => {
    const created = notificationService.createNotification(payload);
    setNotifications(notificationService.getAllNotifications(user?.id || null));
    return created;
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    notificationService.markAsRead(notificationId); // keep simple: mark read
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    notificationService.markAsRead(notificationId);
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  }, []);

  const clearAllNotifications = useCallback(() => {
    notificationService.clearNotifications();
    setNotifications(notificationService.getAllNotifications(user?.id || null));
  }, []);

  const value = useMemo(
    () => ({
      applications,
      notifications,
      selectedJob,
      isApplyModalOpen,
      openApplyModal,
      closeApplyModal,
      submitApplication,
      addNotification,
      deleteNotification,
      hasApplied,
      markNotificationAsRead,
      clearAllNotifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
      formatRelativeTime,
    }),
    [addNotification, applications, clearAllNotifications, closeApplyModal, deleteNotification, hasApplied, isApplyModalOpen, markNotificationAsRead, notifications, openApplyModal, selectedJob, submitApplication]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

export const usePortal = () => {
  const context = useContext(PortalContext);

  if (!context) {
    throw new Error("usePortal must be used within PortalProvider");
  }

  return context;
};
