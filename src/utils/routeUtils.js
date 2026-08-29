import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineUserCircle,
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineSparkles,
} from 'react-icons/hi2';

export const publicNavbarLinks = [
  { label: 'Home', path: '/', icon: HiOutlineHome },
  { label: 'Jobs', path: '/jobs', icon: HiOutlineBriefcase },
  { label: 'Companies', path: '/companies', icon: HiOutlineBuildingOffice2 },
  { label: 'Services', path: '/services', icon: HiOutlineSparkles },
];

export const sidebarLinks = {
  candidate: [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: HiOutlineHome },
    { label: 'Browse Jobs', path: '/candidate/jobs', icon: HiOutlineBriefcase },
    { label: 'Applied Jobs', path: '/candidate/applications', icon: HiOutlineClipboardDocumentList },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: HiOutlineHeart },
    { label: 'Resume Builder', path: '/candidate/resume-builder', icon: HiOutlineUser },
    { label: 'My Resumes', path: '/candidate/my-resumes', icon: HiOutlineSparkles },
    { label: 'Notifications', path: '/candidate/notifications', icon: HiOutlineChartBar },
    { label: 'Profile', path: '/candidate/profile', icon: HiOutlineUser },
    { label: 'Settings', path: '/candidate/settings', icon: HiOutlineCog },
  ],
  recruiter: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: HiOutlineHome },
    { label: 'Profile', path: '/recruiter/profile', icon: HiOutlineUser },
    { label: 'Post Job', path: '/recruiter/post-job', icon: HiOutlineBriefcase },
    { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: HiOutlineClipboardDocumentList },
    { label: 'Applications', path: '/recruiter/applicants', icon: HiOutlineUsers },
    { label: 'Candidates', path: '/recruiter/candidates', icon: HiOutlineUser },
    // { label: 'Interviews', path: '/recruiter/interviews', icon: HiOutlineCalendar },
    { label: 'Company Profile', path: '/recruiter/company-profile', icon: HiOutlineBuildingOffice2 },
    { label: 'Analytics', path: '/recruiter/analytics', icon: HiOutlineChartBar },
    { label: 'Settings', path: '/recruiter/settings', icon: HiOutlineCog },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: HiOutlineHome },
    { label: 'Profile', path: '/admin/profile', icon: HiOutlineUserCircle },
    { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
    { label: 'Recruiters', path: '/admin/recruiters', icon: HiOutlineBuildingOffice2 },
    { label: 'Jobs', path: '/admin/jobs', icon: HiOutlineBriefcase },
    { label: 'Applications', path: '/admin/applications', icon: HiOutlineClipboardDocumentList },
    { label: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
    { label: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
    { label: 'Notifications', path: '/admin/notifications', icon: HiOutlineShieldCheck },
    { label: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
  ],
};

export const roleDashboardLinks = {
  candidate: [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: HiOutlineChartBar },
    { label: 'Jobs', path: '/candidate/jobs', icon: HiOutlineBriefcase },
    { label: 'Companies', path: '/companies', icon: HiOutlineBuildingOffice2 },
    { label: 'Services', path: '/services', icon: HiOutlineSparkles },
  ],
  recruiter: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: HiOutlineChartBar },
    { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: HiOutlineBriefcase },
    { label: 'Applicants', path: '/recruiter/applicants', icon: HiOutlineClipboardDocumentList },
    { label: 'Interviews', path: '/recruiter/interviews', icon: HiOutlineCalendar },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: HiOutlineChartBar },
    { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
    { label: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
  ],
};

export const roleDefaultRoute = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'recruiter') return '/recruiter/dashboard';
  return '/candidate/dashboard';
};

export const roleProfilePath = (role) => {
  if (role === 'admin') return '/admin/profile';
  if (role === 'recruiter') return '/recruiter/profile';
  return '/candidate/profile';
};

export const roleSettingsPath = (role) => {
  if (role === 'admin') return '/admin/settings';
  if (role === 'recruiter') return '/recruiter/settings';
  return '/candidate/settings';
};

export const unauthorizedRoute = '/unauthorized';
