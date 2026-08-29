from pathlib import Path

files = {
    'src/components/layout/Navbar.jsx': '''import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBell,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineSparkles,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notification.service';

const roleLinks = {
  candidate: [
    { label: 'Home', path: '/', icon: HiOutlineHome },
    { label: 'Jobs', path: '/jobs', icon: HiOutlineBriefcase },
    { label: 'Companies', path: '/companies', icon: HiOutlineBuildingOffice2 },
    { label: 'Applications', path: '/candidate/applications', icon: HiOutlineDocumentText },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: HiOutlineHeart },
  ],
  recruiter: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: HiOutlineHome },
    { label: 'Post Job', path: '/recruiter/post-job', icon: HiOutlineBriefcase },
    { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: HiOutlineClipboardDocumentList },
    { label: 'Candidates', path: '/recruiter/applicants', icon: HiOutlineUsers },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineHome },
    { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
    { label: 'Reports', path: '/admin/reports', icon: HiOutlineDocumentText },
    { label: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
  ],
};

const publicLinks = [
  { label: 'Jobs', path: '/jobs', icon: HiOutlineBriefcase },
  { label: 'Companies', path: '/companies', icon: HiOutlineBuildingOffice2 },
  { label: 'About', path: '/about', icon: HiOutlineDocumentText },
  { label: 'Contact', path: '/contact', icon: HiOutlineUsers },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [search, setSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(notificationService.getAllNotifications());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const refreshNotifications = () => {
    setNotifications(notificationService.getAllNotifications());
  };

  const handleToggleNotifications = () => {
    if (!isNotificationsOpen) {
      notificationService.markAllRead();
      refreshNotifications();
    }
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    await logout();
    navigate('/');
  };

  const navItems = isAuthenticated ? roleLinks[user?.role] || publicLinks : publicLinks;

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-slate-900/20 bg-slate-950/95 backdrop-blur-2xl shadow-lg shadow-slate-950/10"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 lg:hidden"
            aria-label="Open mobile menu"
          >
            {isMobileOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiOutlineBars3 className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
            >
              <HiOutlineBriefcase className="h-5 w-5" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">HireHub</p>
              <h1 className="text-lg font-semibold text-white">Talent OS</h1>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, companies, or insights"
              className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3 pl-12 pr-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-200 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-2 py-1 shadow-sm shadow-slate-950/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <HiOutlineBell className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <HiOutlineChatBubbleOvalLeftEllipsis className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <HiOutlineSparkles className="h-5 w-5" />
            </motion.button>
          </div>

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-cyan-500 text-white shadow-inner shadow-slate-950/20">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'H'}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block font-medium text-slate-100">{user?.name?.split(' ')[0] || 'User'}</span>
                <motion.span animate={{ rotate: isProfileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <HiOutlineChevronDown className="h-4 w-4 text-slate-400" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 top-full z-30 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="p-4 border-b border-slate-800/70">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-cyan-500 text-white">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || 'H'
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{user?.name || 'HireHub User'}</p>
                          <p className="text-sm text-slate-400">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      <span className="mt-4 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-700">
                        {user?.role || 'Member'}
                      </span>
                    </div>

                    <div className="space-y-1 p-3">
                      <Link
                        to={user?.role ? `/${user.role}/dashboard` : '/'}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-slate-900 transition"
                      >
                        <HiOutlineHome className="h-4 w-4 text-cyan-400" />
                        Dashboard
                      </Link>
                      <Link
                        to={user?.role ? `/${user.role}/settings` : '/settings'}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-slate-900 transition"
                      >
                        <HiOutlineCog className="h-4 w-4 text-slate-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-600 hover:bg-rose-500/10 transition"
                      >
                        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth/login"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-slate-950/95 shadow-2xl border-l border-slate-800"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">HireHub</p>
                  <h2 className="text-lg font-semibold text-white">Quick Menu</h2>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-2xl bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-3 shadow-sm shadow-slate-950/10">
                  <div className="relative">
                    <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search jobs, companies..."
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 py-3 pl-12 pr-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
                    >
                      <item.icon className="h-5 w-5 text-cyan-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800">
                    Notifications
                  </button>
                  <button className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800">
                    Messages
                  </button>
                </div>
                {isAuthenticated ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm shadow-slate-950/10">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-lg font-semibold">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user?.name?.charAt(0).toUpperCase() || 'H'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name || 'HireHub User'}</p>
                        <p className="text-sm text-slate-400">{user?.role || 'Member'}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2">
                      <Link
                        to={user?.role ? `/${user.role}/dashboard` : '/'}
                        onClick={() => setIsMobileOpen(false)}
                        className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-white text-center transition hover:bg-cyan-400"
                      >
                        Go to dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="rounded-2xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="block rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-400"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="block rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
''',
    'src/components/layout/Sidebar.jsx': '''import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiBars3BottomLeft,
  HiXMark,
} from 'react-icons/hi2';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    setIsLargeScreen(typeof window !== 'undefined' && window.innerWidth >= 1024);

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarLinks = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineHome },
      { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
      { name: 'Recruiters', path: '/admin/recruiters', icon: HiOutlineShieldCheck },
      { name: 'Jobs', path: '/admin/jobs', icon: HiOutlineBriefcase },
      { name: 'Applications', path: '/admin/applications', icon: HiOutlineClipboardDocumentList },
      { name: 'Reports', path: '/admin/reports', icon: HiOutlineDocumentText },
      { name: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
      { name: 'Notifications', path: '/admin/notifications', icon: HiOutlineBell },
      { name: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
    ],
    recruiter: [
      { name: 'Dashboard', path: '/recruiter/dashboard', icon: HiOutlineHome },
      { name: 'Post Job', path: '/recruiter/post-job', icon: HiOutlineBriefcase },
      { name: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: HiOutlineClipboardDocumentList },
      { name: 'Applicants', path: '/recruiter/applicants', icon: HiOutlineUsers },
      { name: 'Interviews', path: '/recruiter/interviews', icon: HiOutlineChartBar },
      { name: 'Company Profile', path: '/recruiter/company-profile', icon: HiOutlineBuildingOffice2 },
      { name: 'Analytics', path: '/recruiter/analytics', icon: HiOutlineChartBar },
      { name: 'Notifications', path: '/recruiter/notifications', icon: HiOutlineBell },
      { name: 'Settings', path: '/recruiter/settings', icon: HiOutlineCog },
    ],
    candidate: [
      { name: 'Dashboard', path: '/candidate/dashboard', icon: HiOutlineHome },
      { name: 'Browse Jobs', path: '/candidate/browse-jobs', icon: HiOutlineBriefcase },
      { name: 'My Profile', path: '/candidate/profile', icon: HiOutlineUser },
      { name: 'Applications', path: '/candidate/applications', icon: HiOutlineDocumentText },
      { name: 'Saved Jobs', path: '/candidate/saved-jobs', icon: HiOutlineHeart },
      { name: 'Resume', path: '/candidate/resume', icon: HiOutlineDocumentText },
      { name: 'Notifications', path: '/candidate/notifications', icon: HiOutlineBell },
      { name: 'Settings', path: '/candidate/settings', icon: HiOutlineCog },
    ],
  };

  const links = sidebarLinks[user?.role] || [];

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="fixed left-5 top-5 z-[100] rounded-2xl bg-slate-900 p-3 text-white shadow-xl lg:hidden"
      >
        {isOpen ? (
          <HiXMark className="h-6 w-6" />
        ) : (
          <HiBars3BottomLeft className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {(isOpen || isLargeScreen) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl ${
              isOpen ? 'w-[290px]' : 'w-[95px]'
            } transition-all duration-300`}
          >
            <div className="border-b border-slate-800 p-5">
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                    >
                      <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-black text-transparent">
                        HireHub
                      </h1>
                      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                        {user?.role} Portal
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidebar}
                  className="hidden rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 lg:block"
                >
                  {isOpen ? (
                    <HiXMark className="h-5 w-5" />
                  ) : (
                    <HiBars3BottomLeft className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>

            <div className="px-4 py-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                    <span className="flex h-full w-full items-center justify-center text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'H'}
                    </span>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <h3 className="text-sm font-semibold text-white">{user?.name || 'HireHub User'}</h3>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{user?.role}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
              {links.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-4 overflow-hidden rounded-3xl px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-100 shadow-lg shadow-cyan-500/10'
                          : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/5" />}
                        <div
                          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                            isActive ? 'bg-cyan-500/15 text-cyan-100' : 'bg-slate-900 group-hover:bg-slate-800'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-sm font-medium">
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-slate-800 p-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white shadow-xl"
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">System Status</p>
                      <h4 className="mt-2 text-lg font-bold">All Systems Active 🚀</h4>
                      <p className="mt-1 text-xs text-cyan-100">Platform performance running smoothly.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
''',
    'src/pages/auth/Login.jsx': '''import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineUserGroup, HiOutlineSparkles } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const data = await login({ email: form.email.trim(), password: form.password });
    setLoading(false);

    if (data) {
      navigate(`/${data.user.role}/dashboard`);
    } else {
      setError('Please check your email and password and try again.');
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute left-[-80px] top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-[520px] h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-3xl">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-300">Modern hiring experience</span>
            <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Welcome back to <span className="text-cyan-300">HireHub</span>
            </h1>
            <p className="mt-6 max-w-xl text-slate-300">
              Sign in to access candidate, recruiter, and admin workspaces with a premium SaaS dashboard designed for faster hiring.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                <HiOutlineUserGroup className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Role-aware access</h3>
              <p className="mt-2 text-sm text-slate-400">Get the right tools for candidate search, recruiting, or admin control.</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <HiOutlineSparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Fast onboarding</h3>
              <p className="mt-2 text-sm text-slate-400">Smooth login flow with premium visuals and polished transitions.</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-3xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Sign in</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Access your dashboard</h2>
              <p className="mt-2 text-slate-400">Use your HireHub credentials for fast access to hiring analytics, jobs, and team workflows.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="hello@hirehub.com"
                required
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-[54px] text-slate-400 transition hover:text-white">
                  {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-300">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400" />
                  Remember me
                </label>
                <Link to="/auth/forgot-password" className="font-medium text-cyan-300 hover:text-cyan-100">Forgot password?</Link>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="text-center text-sm text-slate-500">Or continue with</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" className="rounded-3xl border border-slate-800 bg-slate-950/90 py-3 text-sm text-slate-200 transition hover:border-cyan-500 hover:text-white">Continue with Google</button>
                <button type="button" className="rounded-3xl border border-slate-800 bg-slate-950/90 py-3 text-sm text-slate-200 transition hover:border-blue-500 hover:text-white">Continue with Microsoft</button>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="absolute -right-8 top-16 hidden h-72 w-72 rounded-[2rem] bg-cyan-500/10 p-5 text-slate-100 shadow-2xl shadow-cyan-500/10 md:block">
            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="rounded-3xl bg-slate-950/90 p-4 shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Instant insights</p>
                  <h3 className="mt-4 text-xl font-semibold text-white">Fast access</h3>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-4 shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Talent pulse</p>
                  <p className="mt-2 text-sm text-slate-300">Jump into candidate pipelines faster than ever.</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                <span className="font-semibold text-white">Premium SaaS onboarding</span>
                <p className="mt-2 text-slate-400">A polished login experience for every user role.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
''',
    'src/pages/auth/Register.jsx': '''import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineUser, HiOutlineBriefcase, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const roleOptions = [
  { value: 'candidate', title: 'Candidate', description: 'Apply to roles, save jobs, and build your profile.', icon: HiOutlineUser },
  { value: 'recruiter', title: 'Recruiter', description: 'Post jobs, manage applicants, and scale hiring.', icon: HiOutlineBriefcase },
  { value: 'admin', title: 'Admin', description: 'Monitor users, review reports, and maintain the platform.', icon: HiOutlineShieldCheck },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const data = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: selectedRole,
    });
    setLoading(false);

    if (data) {
      navigate(`/${data.user.role}/dashboard`);
    } else {
      setError('Unable to create your account. Please try again.');
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 bottom-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-3xl">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-300">Role selection</span>
            <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl">Build your hiring experience</h1>
            <p className="mt-6 max-w-xl text-slate-300">Choose your role and join HireHub with a premium onboarding flow.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <motion.button
                  type="button"
                  key={option.value}
                  onClick={() => setSelectedRole(option.value)}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl border p-6 text-left transition ${
                    selectedRole === option.value
                      ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{option.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{option.description}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-3xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Create account</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Welcome to HireHub</h2>
              <p className="mt-2 text-slate-400">Register with the role that matches your career path and access the right workspace instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                required
              />
              <Input
                label="Email address"
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="hello@hirehub.com"
                required
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-[54px] text-slate-400 transition hover:text-white">
                  {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                required
              />

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <Button type="submit" className="w-full" loading={loading}>
                Create account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold text-cyan-300 hover:text-cyan-100">
                Sign in
              </Link>
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="absolute -right-8 top-20 hidden h-60 w-72 rounded-[2rem] border border-white/10 bg-cyan-500/10 p-5 text-slate-100 shadow-2xl shadow-cyan-500/20 backdrop-blur-3xl md:block">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/90 p-4 shadow-lg shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Smart onboarding</p>
                <p className="mt-3 text-base text-slate-300">Pick the right role and get a tailored experience from day one.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Role-aware setup</p>
                <p className="mt-2 text-slate-400">Candidate, recruiter, and admin registration in one place.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Register;
'''
}

for path, text in files.items():
    Path(path).write_text(text, encoding='utf-8')
    print(f'Wrote {path}')
