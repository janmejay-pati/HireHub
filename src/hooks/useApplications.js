import { useState, useEffect } from 'react';

export const useApplications = (userId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load applications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`applications_${userId}`);
      if (stored) {
        setApplications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (!loading && userId) {
      localStorage.setItem(`applications_${userId}`, JSON.stringify(applications));
    }
  }, [applications, loading, userId]);

  const addApplication = (application) => {
    const appWithMetadata = {
      ...application,
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };

    setApplications((prev) => {
      // Check if already applied
      const alreadyApplied = prev.find((app) => app.jobId === application.jobId);
      if (alreadyApplied) {
        return prev;
      }
      return [...prev, appWithMetadata];
    });

    return appWithMetadata;
  };

  const hasApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const getApplication = (jobId) => {
    return applications.find((app) => app.jobId === jobId) || null;
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  const updateApplicationStatus = (jobId, status) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.jobId === jobId ? { ...app, status } : app
      )
    );
  };

  const getApplicationCount = () => applications.length;

  return {
    applications,
    addApplication,
    hasApplied,
    getApplication,
    getApplicationsByStatus,
    updateApplicationStatus,
    getApplicationCount,
    loading,
  };
};
