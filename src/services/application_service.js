import {
  getApplications,
  setApplications,
  getUsers,
  getJobs,
} from './storage_service';
import { notificationService } from './notification_service';

const normalizeApplications = (applications) => {
  return applications.map((app) => ({
    ...app,
    candidateId: app.candidateId || app.candidate,
    jobId: app.jobId || app.job,
    recruiterId: app.recruiterId || app.recruiterId || null,
    applicationId: app.applicationId || app.id || `app-${Date.now()}`,
    appliedDate: app.appliedDate || app.appliedAt || new Date().toISOString(),
    status: app.status || 'Applied',
  }));
};

export const applicationService = {
  getAllApplications: () => normalizeApplications(getApplications()),

  getApplicationById: (id) => {
    const applications = normalizeApplications(getApplications());
    return applications.find((app) => app.id === id || app.applicationId === id);
  },

  getApplicationsByCandidate: (candidateId) => {
    const applications = normalizeApplications(getApplications());
    return applications.filter(
      (app) => app.candidateId === candidateId || app.candidate === candidateId
    );
  },

  getApplicationsByJob: (jobId) => {
    const applications = normalizeApplications(getApplications());
    return applications.filter((app) => app.jobId === jobId || app.job === jobId);
  },

  getApplicationsByRecruiter: (recruiterId) => {
    const applications = normalizeApplications(getApplications());
    const jobs = getJobs();
    const recruiterJobIds = jobs
      .filter((job) => job.postedBy === recruiterId)
      .map((job) => job._id);

    return applications.filter((app) => recruiterJobIds.includes(app.jobId || app.job));
  },

  createApplication: (applicationData) => {
    const applications = normalizeApplications(getApplications());

    const existingApplication = applications.find(
      (app) =>
        (app.candidateId === applicationData.candidateId || app.candidate === applicationData.candidateId) &&
        (app.jobId === applicationData.jobId || app.job === applicationData.jobId)
    );

    if (existingApplication) {
      throw new Error('You have already applied to this job');
    }

    const timestamp = new Date().toISOString();
    const newApplication = {
      ...applicationData,
      id: applicationData.applicationId || `app-${Date.now()}`,
      applicationId: applicationData.applicationId || `app-${Date.now()}`,
      candidateId: applicationData.candidateId,
      jobId: applicationData.jobId,
      recruiterId: applicationData.recruiterId,
      candidateName: applicationData.candidateName,
      email: applicationData.email,
      resume: applicationData.resume,
      coverLetter: applicationData.coverLetter,
      expectedSalary: applicationData.expectedSalary,
      experience: applicationData.experience,
      skills: applicationData.skills || [],
      portfolioLink: applicationData.portfolioLink,
      linkedInLink: applicationData.linkedInLink || applicationData.linkedIn,
      availability: applicationData.availability,
      termsAccepted: applicationData.termsAccepted,
      status: applicationData.status || 'Applied',
      appliedDate: applicationData.appliedDate || timestamp,
      statusHistory: [
        {
          status: applicationData.status || 'Applied',
          timestamp,
          note: 'Application submitted',
        },
      ],
    };

    const existingRaw = getApplications();
    setApplications([...existingRaw, newApplication]);

    try {
      // Notify recruiter
      if (newApplication.recruiterId) {
        notificationService.createNotification({
          type: 'application',
          title: 'New application received',
          message: `${newApplication.candidateName} applied for ${newApplication.jobTitle}`,
          relatedId: newApplication.id,
          recipientId: newApplication.recruiterId,
        });
      }
    } catch (e) {
      // ignore notification errors
      console.warn('Failed to create recruiter notification', e);
    }

    return newApplication;
  },

  updateApplicationStatus: (id, newStatus, note = '') => {
    const applications = normalizeApplications(getApplications());
    const appIndex = applications.findIndex((app) => app.id === id || app.applicationId === id);

    if (appIndex === -1) {
      throw new Error('Application not found');
    }

    const application = applications[appIndex];
    application.status = newStatus;
    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`,
    });

    setApplications(applications);
    return application;
  },

  updateApplication: (id, updates) => {
    const applications = normalizeApplications(getApplications());
    const appIndex = applications.findIndex((app) => app.id === id || app.applicationId === id);

    if (appIndex === -1) {
      throw new Error('Application not found');
    }

    applications[appIndex] = {
      ...applications[appIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setApplications(applications);
    return applications[appIndex];
  },

  deleteApplication: (id) => {
    const applications = normalizeApplications(getApplications());
    const appIndex = applications.findIndex((app) => app.id === id || app.applicationId === id);

    if (appIndex === -1) {
      throw new Error('Application not found');
    }

    const deletedApplication = applications.splice(appIndex, 1)[0];
    setApplications(applications);
    return deletedApplication;
  },

  getApplicationStats: () => {
    const applications = normalizeApplications(getApplications());
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: applications.length,
      applied: statusCounts.Applied || 0,
      reviewed: statusCounts.Reviewed || 0,
      shortlisted: statusCounts.Shortlisted || 0,
      interview: statusCounts.Interview || 0,
      hired: statusCounts.Hired || 0,
      rejected: statusCounts.Rejected || 0,
    };
  },

  getApplicationsByStatus: (status) => {
    const applications = normalizeApplications(getApplications());
    return applications.filter((app) => app.status === status);
  },

  searchApplications: (query) => {
    const applications = normalizeApplications(getApplications());
    const users = getUsers();
    const jobs = getJobs();

    if (!query) return applications;

    const lowerQuery = query.toLowerCase();
    return applications.filter((app) => {
      const candidate = users.find((u) => u.id === app.candidateId || u.id === app.candidate);
      const job = jobs.find((j) => j._id === app.jobId || j._id === app.job);

      return (
        (candidate && candidate.name.toLowerCase().includes(lowerQuery)) ||
        (candidate && candidate.email.toLowerCase().includes(lowerQuery)) ||
        (job && job.title.toLowerCase().includes(lowerQuery)) ||
        (job && job.company.toLowerCase().includes(lowerQuery)) ||
        app.status.toLowerCase().includes(lowerQuery)
      );
    });
  },

  getRecentApplications: (limit = 10) => {
    const applications = normalizeApplications(getApplications());
    return applications
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .slice(0, limit);
  },
};
