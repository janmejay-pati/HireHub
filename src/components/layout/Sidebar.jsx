import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/storage_service";
import { sidebarLinks, roleProfilePath } from "../../utils/routeUtils";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineSparkles,
} from "react-icons/hi2";

const Sidebar = ({ role = "candidate" }) => {
  const { isOpen } = useSidebar();
  const { user, logout, candidateProfile } = useAuth();
  const menuItems = sidebarLinks[role] || sidebarLinks.candidate;
  const profileMeta = candidateProfile?.personal || {};
  const [liveAvatar, setLiveAvatar] = useState("");
  const [liveName, setLiveName] = useState("");
  const [liveEmail, setLiveEmail] = useState("");

  useEffect(() => {
    const syncProfile = () => {
      const currentUser = getCurrentUser();
      const isPremium =
        currentUser?.role === "admin" ||
        currentUser?.role === "recruiter";

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

  const displayName =
    role === "admin" || role === "recruiter"
      ? liveName ||
        [profileMeta.firstName, profileMeta.lastName]
          .filter(Boolean)
          .join(" ") ||
        user?.name ||
        "User"
      : [profileMeta.firstName, profileMeta.lastName]
          .filter(Boolean)
          .join(" ") ||
        user?.name ||
        "User";
  const isPremiumProfile = role === "admin" || role === "recruiter";
  const avatar = isPremiumProfile
    ? liveAvatar ||
      user?.avatar ||
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}`
    : profileMeta.profileImage ||
      user?.avatar ||
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}`;
  const email =
    role === "admin" || role === "recruiter"
      ? liveEmail || user?.email || ""
      : user?.email || "";

  const profilePath = roleProfilePath(role);
  const mainLinks = menuItems.slice(0, 5);
  const utilityLinks = menuItems.slice(5);

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-slate-800/50 bg-slate-950 text-slate-100 transition-all duration-300 ${isOpen ? "w-70" : "w-20"}`}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-800/50 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <HiOutlineSparkles className="h-5 w-5" />
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-semibold text-white">HireHub</p>
              <p className="text-[11px] text-slate-500">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 pb-20">
        {isPremiumProfile ? (
          <Link to={profilePath} className="mb-4 block">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="hover-glow flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-900/60 p-3 shadow-sm transition duration-300 hover:border-cyan-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(34,211,238,0.18)] dark:hover:bg-slate-800"
            >
              <img
                src={avatar}
                alt="User avatar"
                className="h-12 w-12 rounded-lg border border-cyan-400/60 object-cover shadow-sm transition duration-300"
              />
              {isOpen && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{role}</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{email}</p>
                </div>
              )}
            </motion.div>
          </Link>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-sm"
          >
            <img
              src={avatar}
              alt="User avatar"
              className="h-12 w-12 rounded-lg border border-slate-700 object-cover"
            />
            {isOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{role}</p>
              </div>
            )}
          </motion.div>
        )}

        <div className="mt-4 space-y-2">
          <p className="px-3 text-xs uppercase tracking-[0.3em] text-slate-500">Navigation</p>
          {mainLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `hover-glow flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition duration-200 ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30"
                      : "text-slate-300 hover:-translate-y-0.5 hover:bg-cyan-500/10 hover:text-cyan-200"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {utilityLinks.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="px-3 text-xs uppercase tracking-[0.3em] text-slate-500">Tools</p>
            {utilityLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `hover-glow flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition duration-200 ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-500/20"
                        : "text-slate-400 hover:-translate-y-0.5 hover:bg-cyan-500/10 hover:text-cyan-200"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full border-t border-slate-800/50 bg-slate-950/80 px-3 py-3 backdrop-blur-sm">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500/80 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          {isOpen && "Logout"}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
