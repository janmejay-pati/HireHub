import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import Navbar from "../components/layout/Navbar";
import RecruiterNavbar from "../components/layout/RecruiterNavbar";
import RecruiterSidebar from "../components/layout/RecruiterSidebar";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ role: propRole }) => {
  const location = useLocation();
  const { user } = useAuth();
  const sidebar = useSidebar();

  const isOpen = sidebar?.isOpen ?? true;
  const role = propRole || user?.role || "candidate";

  return (
    <div className="relative min-h-screen overflow-hidden text-(--text)">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-[320px] rounded-full bg-cyan-500/12 blur-[120px]" />
        <div className="absolute right-0 top-0 h-80 w-[320px] rounded-full bg-violet-500/12 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-emerald-500/12 blur-[120px]" />
      </div>

      {role === "recruiter" ? <RecruiterSidebar /> : <Sidebar role={role} />}

      <motion.div
        className={`min-h-screen transition-all duration-300 ${
          isOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"
        }`}
      >
        <div className="sticky top-0 z-30">
          {role === "recruiter" ? <RecruiterNavbar user={user} /> : <Navbar role={role} user={user} />}
        </div>

        <main className="relative p-3 sm:p-4 md:p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-2xl border p-3 sm:p-4 md:p-5 shadow-[var(--shadow)] backdrop-blur-2xl"
                style={{
                  borderColor: "var(--border)",
                  background: "linear-gradient(135deg, var(--surface), transparent)",
                }}
              >
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;