import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { usePortal } from "../../context/PortalContext";
import { useSidebar } from "../../context/SidebarContext";
import { getCurrentUser } from "../../services/storage_service";
import {
  publicNavbarLinks,
  roleProfilePath,
  roleDefaultRoute,
} from "../../utils/routeUtils";

import {
  HiBars3BottomLeft,
  HiXMark,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, candidateProfile } = useAuth();

  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearAllNotifications,
    formatRelativeTime,
  } = usePortal();

  const { isOpen, setIsOpen } = useSidebar();

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [companiesMegaOpen, setCompaniesMegaOpen] = useState(false);

  const profileMeta = candidateProfile?.personal || {};

  const [liveAvatar, setLiveAvatar] = useState("");
  const [liveName, setLiveName] = useState("");
  const [liveEmail, setLiveEmail] = useState("");

  const blueGlowHover =
    "hover-glow hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-white hover:text-cyan-600 hover:ring-2 hover:ring-cyan-100 hover:shadow-[0_0_26px_rgba(34,211,238,0.28)] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300 dark:hover:ring-cyan-500/20";

  const cardHoverClass =
    "card-hover-glow hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white hover:ring-2 hover:ring-cyan-100/80 hover:shadow-[0_0_28px_rgba(34,211,238,0.22)] dark:hover:bg-slate-800 dark:hover:ring-cyan-500/20";

  const iconHoverClass =
    "transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500";

  const navItemClass = (active) =>
    `group flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
      active
        ? "border-cyan-400 bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-cyan-500/30"
        : `border-transparent text-slate-600 dark:text-slate-300 ${blueGlowHover}`
    }`;

  const dropdownItemClass =
    "dropdown-item group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:ring-2 hover:ring-cyan-100 hover:shadow-[0_0_20px_rgba(34,211,238,0.20)] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:bg-slate-800 dark:hover:text-cyan-300 dark:hover:ring-cyan-500/20 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]";

  const megaDropdownClass =
    "absolute left-0 top-full z-50 mt-3 w-205 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(37,99,235,0.18)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_80px_rgba(34,211,238,0.12)]";

  const profileDropdownClass =
    "absolute right-0 mt-4 w-[calc(100vw-2rem)] max-w-[23rem] overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_80px_rgba(34,211,238,0.12)] sm:w-88";

  const notificationDropdownClass =
    "absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-[24rem] overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_80px_rgba(34,211,238,0.12)] sm:w-96";

  const menuAnimation = {
    initial: { opacity: 0, y: 12, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.96 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  useEffect(() => {
    const syncProfile = () => {
      const currentUser = getCurrentUser();

      const isPremium =
        currentUser?.role === "admin" || currentUser?.role === "recruiter";

      if (isPremium) {
        setLiveAvatar(currentUser?.avatar || currentUser?.profileImage || "");
        setLiveName(currentUser?.name || "");
        setLiveEmail(currentUser?.email || "");
      } else {
        setLiveAvatar("");
        setLiveName("");
        setLiveEmail("");
      }
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);

    return () => window.removeEventListener("storage", syncProfile);
  }, [user, candidateProfile]);

  const role = user?.role || null;

  const displayName =
    role === "admin" || role === "recruiter"
      ? liveName ||
        [profileMeta.firstName, profileMeta.lastName].filter(Boolean).join(" ") ||
        user?.name ||
        "User"
      : [profileMeta.firstName, profileMeta.lastName].filter(Boolean).join(" ") ||
        user?.name ||
        "User";

  const email =
    role === "admin" || role === "recruiter"
      ? liveEmail || user?.email || ""
      : user?.email || "";

  const avatar =
    role === "admin" || role === "recruiter"
      ? liveAvatar ||
        user?.avatar ||
        user?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
      : profileMeta.profileImage ||
        user?.avatar ||
        user?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const candidateLinks = [
    { label: "Home", path: "/", icon: HiOutlineHome },
    { label: "Jobs", path: "/candidate/jobs", icon: HiOutlineBriefcase },
    { label: "Companies", path: "/companies", icon: HiOutlineBuildingOffice2 },
    { label: "Services", path: "/services", icon: HiOutlineShieldCheck },
  ];

  const recruiterLinks = [
    {
      label: "Dashboard",
      path: "/recruiter/dashboard",
      icon: HiOutlineChartBar,
    },
    {
      label: "Manage Jobs",
      path: "/recruiter/manage-jobs",
      icon: HiOutlineBriefcase,
    },
    {
      label: "Applicants",
      path: "/recruiter/applicants",
      icon: HiOutlineClipboardDocumentList,
    },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: HiOutlineChartBar },
    { label: "Users", path: "/admin/users", icon: HiOutlineUserCircle },
    { label: "Reports", path: "/admin/reports", icon: HiOutlineShieldCheck },
  ];

  const navLinks = user
    ? role === "admin"
      ? adminLinks
      : role === "recruiter"
      ? recruiterLinks
      : candidateLinks
    : publicNavbarLinks;

  const jobDomains = [
    "Frontend",
    "Backend",
    "MERN",
    "Java",
    "Python",
    "DevOps",
    "Cloud",
    "AI/ML",
    "Data Science",
    "UI/UX",
    "Product",
    "QA",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Internship",
    "Remote",
    "Full Stack",
  ];

  const companyIndustries = [
    "IT",
    "Software",
    "Cloud",
    "E-Commerce",
    "Finance",
    "Music Tech",
    "Healthcare",
    "EdTech",
    "Fintech",
    "AI/ML",
    "Blockchain",
    "Gaming",
  ];

  const companyTypes = [
    "All",
    "MNC",
    "Startup",
    "Product Based",
    "Service Based",
    "Funded",
    "Unicorn",
  ];

  const profilePath = user ? roleProfilePath(role) : "/login";
  const dashboardPath = user ? roleDefaultRoute(role) : "/";
  const jobsNavigatePath = user ? "/candidate/jobs" : "/jobs";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/85"
      >
        <div className="mx-auto flex h-16 max-w-400 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:flex ${blueGlowHover}`}
              >
                <HiBars3BottomLeft className={`h-5 w-5 ${iconHoverClass}`} />
              </button>
            )}

            <button
              onClick={() => setMobileMenu(true)}
              aria-label="Open navigation menu"
              className={`group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden ${blueGlowHover}`}
            >
              <HiBars3BottomLeft className={`h-5 w-5 ${iconHoverClass}`} />
            </button>

            <Link to="/" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(37,99,235,0.45)]">
                <HiOutlineBriefcase className="h-5 w-5 text-white" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-slate-900 transition group-hover:text-blue-600 dark:text-white">
                  HireHub
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI Portal
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((item) => {
              const Icon = item.icon;

              const active =
                location.pathname === item.path ||
                (item.label === "Jobs" &&
                  ["/jobs", "/candidate/jobs"].includes(location.pathname));

              if (item.label === "Jobs") {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    className="relative"
                  >
                    <button
                      onClick={() => navigate(jobsNavigatePath)}
                      className={navItemClass(active)}
                    >
                      <Icon className={`h-5 w-5 ${iconHoverClass}`} />
                      {item.label}
                    </button>

                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className={megaDropdownClass}
                        >
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              ["Popular Domains", jobDomains.slice(0, 6)],
                              ["Trending Roles", jobDomains.slice(6, 12)],
                              ["Filters", ["Remote", "Internship", "Full Stack"]],
                            ].map(([title, list]) => (
                              <div key={title}>
                                <h4 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-300">
                                  {title}
                                </h4>

                                <div className="flex flex-col gap-2">
                                  {list.map((d) => (
                                    <button
                                      key={d}
                                      onClick={() =>
                                        navigate(
                                          `${jobsNavigatePath}?category=${encodeURIComponent(
                                            d
                                          )}`
                                        )
                                      }
                                      className={dropdownItemClass}
                                    >
                                      {d}
                                    </button>
                                  ))}

                                  {title === "Filters" && (
                                    <button
                                      onClick={() => navigate(jobsNavigatePath)}
                                      className={dropdownItemClass}
                                    >
                                      View All Jobs
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (item.path === "/companies") {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setCompaniesMegaOpen(true)}
                    onMouseLeave={() => setCompaniesMegaOpen(false)}
                    className="relative"
                  >
                    <button
                      onClick={() => navigate("/companies")}
                      className={navItemClass(active)}
                    >
                      <Icon className={`h-5 w-5 ${iconHoverClass}`} />
                      {item.label}
                    </button>

                    <AnimatePresence>
                      {companiesMegaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className={megaDropdownClass}
                        >
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <h4 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-300">
                                Company Types
                              </h4>

                              <div className="flex flex-col gap-2">
                                {companyTypes.map((t) => (
                                  <button
                                    key={t}
                                    onClick={() =>
                                      navigate(
                                        `/companies${
                                          t !== "All"
                                            ? `?type=${encodeURIComponent(t)}`
                                            : ""
                                        }`
                                      )
                                    }
                                    className={dropdownItemClass}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-300">
                                Industries
                              </h4>

                              <div className="flex flex-col gap-2">
                                {companyIndustries.slice(0, 7).map((i) => (
                                  <button
                                    key={i}
                                    onClick={() =>
                                      navigate(
                                        `/companies?industry=${encodeURIComponent(
                                          i
                                        )}`
                                      )
                                    }
                                    className={dropdownItemClass}
                                  >
                                    {i}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-300">
                                Quick Filters
                              </h4>

                              <div className="flex flex-col gap-2">
                                {[
                                  ["Remote Friendly", "/companies?location=Remote"],
                                  ["Fresher Hiring", "/companies?experience=Fresher"],
                                  [
                                    "Product Based",
                                    "/companies?business=Product%20Based",
                                  ],
                                  ["View All Companies", "/companies"],
                                ].map(([label, path]) => (
                                  <button
                                    key={label}
                                    onClick={() => navigate(path)}
                                    className={dropdownItemClass}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={() => navItemClass(active)}
                >
                  <Icon className={`h-5 w-5 ${iconHoverClass}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <button
                    className={`rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${blueGlowHover}`}
                  >
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button className="rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div ref={notificationRef} className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className={`group relative hidden h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:flex ${blueGlowHover}`}
                  >
                    <HiOutlineBell className={`h-6 w-6 ${iconHoverClass}`} />

                    {unreadCount > 0 && (
                      <span className="absolute right-3 top-3 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        {...menuAnimation}
                        className={notificationDropdownClass}
                      >
                        <div className="bg-linear-to-br from-cyan-50 via-white to-blue-50 px-5 py-5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-base font-black text-slate-900 dark:text-white">
                                Notifications
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {unreadCount} unread • {notifications.length} total
                              </p>
                            </div>

                            <button
                              onClick={() => clearAllNotifications()}
                              className={`rounded-full border border-transparent bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-all duration-300 dark:bg-slate-800 dark:text-slate-200 ${blueGlowHover}`}
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="max-h-[22rem] overflow-y-auto p-3">
                          {notifications.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-blue-100 bg-blue-50/40 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-800/70">
                              <HiOutlineBell className="mx-auto h-9 w-9 text-blue-500" />
                              <p className="mt-3 text-sm font-bold text-slate-800 dark:text-white">
                                You are all caught up
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                New opportunities and updates will appear here.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {notifications.slice(0, 6).map((notification) => (
                                <button
                                  key={notification.id}
                                  onClick={() =>
                                    markNotificationAsRead(notification.id)
                                  }
                                  className={`group w-full rounded-3xl border px-4 py-3 text-left transition-all duration-300 ${
                                    notification.read
                                      ? "border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900"
                                      : "border-cyan-100 bg-cyan-50/80 dark:border-cyan-500/20 dark:bg-cyan-500/10"
                                  } ${cardHoverClass}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transition group-hover:scale-105">
                                      <HiOutlineSparkles className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="line-clamp-1 text-sm font-black text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300">
                                          {notification.title}
                                        </p>

                                        {!notification.read && (
                                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                                        )}
                                      </div>

                                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 transition group-hover:text-blue-500 dark:text-slate-300 dark:group-hover:text-cyan-300">
                                        {notification.message}
                                      </p>

                                      <p className="mt-2 text-[11px] font-semibold text-slate-400 transition group-hover:text-blue-500 dark:text-slate-500 dark:group-hover:text-cyan-300">
                                        {formatRelativeTime(
                                          notification.timestamp
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                          <button
                            onClick={() => {
                              navigate("/candidate/notifications");
                              setNotificationOpen(false);
                            }}
                            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(37,99,235,0.42)]"
                          >
                            <HiOutlineSparkles className="h-4 w-4 transition group-hover:scale-110" />
                            Open notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={dropdownRef} className="relative">
                  <motion.button
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`group flex items-center gap-3 rounded-3xl border border-cyan-200 bg-white/90 px-3 py-2 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${blueGlowHover}`}
                  >
                    <img
                      src={avatar}
                      alt="profile"
                      className="h-11 w-11 rounded-3xl border-2 border-cyan-400/70 object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500 group-hover:shadow-[0_0_18px_rgba(37,99,235,0.45)]"
                    />

                    <div className="hidden text-left lg:block">
                      <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300">
                        {displayName}
                      </h3>
                      <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                        {role}
                      </p>
                    </div>

                    <HiOutlineChevronDown className="hidden h-5 w-5 text-slate-500 transition group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-cyan-300 lg:block" />
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        {...menuAnimation}
                        className={profileDropdownClass}
                      >
                        <div className="relative overflow-hidden bg-linear-to-br from-cyan-50 via-white to-blue-50 p-5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />
                          <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

                          <div className="relative flex items-center gap-4">
                            <img
                              src={avatar}
                              alt="profile"
                              className="h-14 w-14 rounded-3xl border-2 border-cyan-400/75 object-cover shadow-[0_0_22px_rgba(37,99,235,0.28)]"
                            />

                            <div className="min-w-0">
                              <h2 className="truncate text-lg font-black text-slate-900 dark:text-white">
                                {displayName}
                              </h2>
                              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                                {email}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold capitalize text-blue-600 shadow-sm ring-1 ring-blue-100 dark:bg-slate-800 dark:text-cyan-300 dark:ring-slate-700">
                                  {role}
                                </span>

                                <span className="max-w-44 truncate rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm ring-1 ring-blue-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                                  {profileMeta.location ||
                                    "Open to opportunities"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 p-4">
                          <div
                            className={`rounded-3xl border border-transparent bg-slate-50 px-3 py-3 text-center dark:bg-slate-800 ${cardHoverClass}`}
                          >
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {candidateProfile?.skills?.length || 0}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              Skills
                            </p>
                          </div>

                          <div
                            className={`rounded-3xl border border-transparent bg-slate-50 px-3 py-3 text-center dark:bg-slate-800 ${cardHoverClass}`}
                          >
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {unreadCount}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              Alerts
                            </p>
                          </div>

                          <div
                            className={`rounded-3xl border border-transparent bg-slate-50 px-3 py-3 text-center dark:bg-slate-800 ${cardHoverClass}`}
                          >
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              {profileMeta.profileImage ? "1" : "0"}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              Photo
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 p-4 pt-0">
                          <button
                            onClick={() => {
                              navigate(profilePath);
                              setProfileOpen(false);
                            }}
                            className={dropdownItemClass}
                          >
                            <HiOutlineUserCircle className="h-5 w-5 text-cyan-500 transition group-hover:text-blue-600 dark:group-hover:text-cyan-300" />
                            View profile
                          </button>

                          <button
                            onClick={() => {
                              navigate("/candidate/resume-builder");
                              setProfileOpen(false);
                            }}
                            className={dropdownItemClass}
                          >
                            <HiOutlineSparkles className="h-5 w-5 text-violet-500 transition group-hover:text-blue-600 dark:group-hover:text-cyan-300" />
                            Resume Builder
                          </button>

                          <button
                            onClick={() => {
                              navigate(dashboardPath);
                              setProfileOpen(false);
                            }}
                            className={dropdownItemClass}
                          >
                            <HiOutlineChartBar className="h-5 w-5 text-cyan-500 transition group-hover:text-blue-600 dark:group-hover:text-cyan-300" />
                            Dashboard
                          </button>

                          <button
                            onClick={() => {
                              const target =
                                role === "admin"
                                  ? "/admin/settings"
                                  : role === "recruiter"
                                  ? "/recruiter/settings"
                                  : "/candidate/settings";

                              navigate(target);
                              setProfileOpen(false);
                            }}
                            className={dropdownItemClass}
                          >
                            <HiOutlineCog6Tooth className="h-5 w-5 text-violet-500 transition group-hover:text-blue-600 dark:group-hover:text-cyan-300" />
                            Settings
                          </button>

                          <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 text-sm font-bold text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:ring-2 hover:ring-rose-100 hover:shadow-[0_0_22px_rgba(244,63,94,0.22)] dark:bg-slate-900 dark:text-rose-400 dark:hover:border-rose-400/40 dark:hover:bg-slate-800 dark:hover:ring-rose-500/20"
                          >
                            <HiOutlineArrowRightOnRectangle className="h-5 w-5 transition group-hover:scale-110" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xl lg:hidden"
            />

            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[min(92vw,380px)] flex-col overflow-hidden rounded-r-4xl border-r border-blue-900/50 bg-slate-950 text-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                    Navigation
                  </p>
                  <h2 className="text-xl font-black text-white">HireHub</h2>
                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  aria-label="Close navigation menu"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-[0_0_24px_rgba(37,99,235,0.35)]"
                >
                  <HiXMark className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div
                  className={`mb-6 rounded-3xl border border-white/10 bg-slate-900/80 p-4 ring-1 ring-white/10 ${cardHoverClass}`}
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Current role
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {role
                      ? role.charAt(0).toUpperCase() + role.slice(1)
                      : "Guest"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Smart navigation for mobile dashboards.
                  </p>
                </div>

                <div className="space-y-2">
                  {navLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileMenu(false)}
                        className={({ isActive }) =>
                          `group flex items-center gap-4 rounded-3xl border px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                            isActive
                              ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/20"
                              : "border-transparent text-slate-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-100 hover:shadow-[0_0_24px_rgba(37,99,235,0.35)]"
                          }`
                        }
                      >
                        <Icon className="h-6 w-6 transition group-hover:scale-110 group-hover:text-blue-600" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-800 px-5 py-5">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenu(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-rose-600 hover:shadow-[0_0_24px_rgba(244,63,94,0.35)]"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenu(false);
                      }}
                      className="rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-[0_0_22px_rgba(37,99,235,0.32)]"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        navigate("/register");
                        setMobileMenu(false);
                      }}
                      className="rounded-3xl bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;