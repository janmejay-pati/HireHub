import { useState, useEffect } from 'react';

export const useRecentlyViewed = (maxItems = 10) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewedJobs');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('recentlyViewedJobs', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, loading]);

  const addToRecentlyViewed = (job) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists, then add to front
      const filtered = prev.filter((j) => j._id !== job._id);
      const updated = [job, ...filtered];
      // Keep only maxItems
      return updated.slice(0, maxItems);
    });
  };

  const getRecentlyViewed = () => recentlyViewed;

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewed,
    clearRecentlyViewed,
    loading,
  };
};
