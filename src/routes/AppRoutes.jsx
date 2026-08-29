import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleDefaultRoute } from "../utils/routeUtils";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Services from "../pages/public/Services";
import InterviewQuestionsPage from "../pages/public/InterviewQuestions";
import E2ETest from "../pages/dev/E2ETest";
import NotFound from "../pages/public/NotFound";
import Unauthorized from "../pages/Unauthorized";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import CandidateDashboard from "../pages/candidate/Dashboard";
import MyProfile from "../pages/candidate/MyProfile";
import AppliedJobs from "../pages/candidate/AppliedJobs";
import SavedJobs from "../pages/candidate/SavedJobs";
import BrowseJobs from "../pages/candidate/BrowseJobs";
import ResumeBuilder from "../pages/candidate/ResumeBuilder";
import MyResumes from "../pages/candidate/MyResumes";
import ResumePreviewPage from "../pages/candidate/ResumePreviewPage";
import Notifications from "../pages/candidate/Notifications";
import Settings from "../pages/candidate/Settings";
import Practice from "../pages/candidate/Practice";
import ApplyJob from "../pages/candidate/ApplyJob";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import ManageJobs from "../pages/recruiter/ManageJobs";
import Applicants from "../pages/recruiter/Applicants";
import Candidates from "../pages/recruiter/Candidates";
import Interviews from "../pages/recruiter/Interviews";
import CompanyProfile from "../pages/recruiter/CompanyProfile";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";
import RecruiterSettings from "../pages/recruiter/RecruiterSettings";
import CandidateProfilePage from "../pages/recruiter/CandidateProfilePage";
import Analytics from "../pages/recruiter/Analytics";
import RecruiterNotifications from "../pages/recruiter/RecruiterNotifications";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import RecruiterManagement from "../pages/admin/RecruiterManagement";
import JobsManagement from "../pages/admin/JobsManagement";
import Reports from "../pages/admin/Reports";
import PlatformSettings from "../pages/admin/PlatformSettings";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminNotifications from "../pages/admin/AdminNotifications";

const AppRoutes = () => {
  const { user } = useAuth();
  const fallbackRoute = user ? roleDefaultRoute(user.role) : "/login";

  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="companies" element={<Companies />} />
        <Route path="services" element={<Services />} />
        <Route path="interview-questions" element={<InterviewQuestionsPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="dev/e2e-test" element={<E2ETest />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="candidate" element={<RoleRoute roles={["candidate"]} />}>
          <Route element={<DashboardLayout role="candidate" />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="dashboard" element={<Navigate to="/candidate" replace />} />
            <Route path="jobs" element={<BrowseJobs />} />
            <Route path="applications" element={<AppliedJobs />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="my-resumes" element={<MyResumes />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="resume-preview/:id" element={<ResumePreviewPage />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="practice" element={<Practice />} />
            <Route path="apply/:jobId" element={<ApplyJob />} />
            <Route path="apply-job/:id" element={<ApplyJob />} />
          </Route>
        </Route>

        <Route path="recruiter" element={<RoleRoute roles={["recruiter"]} />}>
          <Route element={<DashboardLayout role="recruiter" />}>
            <Route index element={<RecruiterDashboard />} />
            <Route path="dashboard" element={<Navigate to="/recruiter" replace />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:candidateId" element={<CandidateProfilePage />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="company-profile" element={<CompanyProfile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<RecruiterNotifications />} />
            <Route path="settings" element={<RecruiterSettings />} />
            <Route path="profile" element={<RecruiterProfile />} />
          </Route>
        </Route>

        <Route path="admin" element={<RoleRoute roles={["admin"]} />}>
          <Route element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="recruiters" element={<RecruiterManagement />} />
            <Route path="jobs" element={<JobsManagement />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<PlatformSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        <Route path="dashboard/*" element={<Navigate to={fallbackRoute} replace />} />
        <Route path="employer/*" element={<Navigate to={fallbackRoute} replace />} />
      </Route>

      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
