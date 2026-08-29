import { getDB } from "../data/db";

export const getAnalytics = () => {
  const db = getDB();

  const totalUsers = db.users.length;
  const blockedUsers = db.users.filter(u => u.blocked).length;

  const totalJobs = db.jobs.length;

  const verifiedRecruiters = db.recruiters.filter(r => r.verified).length;

  return {
    totalUsers,
    blockedUsers,
    totalJobs,
    verifiedRecruiters
  };
};