import { useState, useEffect } from 'react';
import { getSavedJobs, setSavedJobs } from '../services/storage_service';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobsState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = getSavedJobs();
      if (stored && Array.isArray(stored)) {
        setSavedJobsState(stored);
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (next) => {
    setSavedJobsState(next);
    try {
      setSavedJobs(next);
      // notify other components/tabs
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to persist saved jobs', e);
    }
  };

  const isSaved = (jobId) => savedJobs.some((j) => String(j._id || j.id) === String(jobId));

  const toggleSaveJob = (job) => {
    const id = String(job?._id || job?.id || job);

    if (isSaved(id)) {
      const next = savedJobs.filter((j) => String(j._id || j.id) !== id);
      persist(next);
      return false;
    }

    // if job is an id only, add a minimal object
    const jobObj = typeof job === 'string' || typeof job === 'number'
      ? { id: String(job), _id: String(job), savedDate: new Date().toISOString() }
      : { ...job, _id: String(job._id || job.id), savedDate: new Date().toISOString() };

    const next = [jobObj, ...savedJobs];
    persist(next);
    return true;
  };

  const saveJob = (job) => toggleSaveJob(job);

  const unsaveJob = (jobId) => {
    const id = String(jobId);
    const next = savedJobs.filter((j) => String(j._id || j.id) !== id);
    persist(next);
  };

  const getSavedCount = () => savedJobs.length;

  return {
    savedJobs,
    toggleSaveJob,
    isSaved,
    saveJob,
    unsaveJob,
    getSavedCount,
    loading,
  };
};
