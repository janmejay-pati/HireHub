import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";

import ApplyJobModal from "./components/common/ApplyJobModal";
import AppRoutes from "./routes/AppRoutes";
import { usePortal } from "./context/PortalContext";

const App = () => {
  const { selectedJob, isApplyModalOpen, closeApplyModal } = usePortal();
  const { theme } = useTheme();

  return (
    <>
    
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: theme === 'dark' ? "#0f172a" : "#f8fafc",
            color: theme === 'dark' ? "#fff" : "#0f172a",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: theme === 'dark' ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)"
          },
        }}
      />

      <AppRoutes />

      <ApplyJobModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
      />
    </>
  );
};

export default App;
