import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleDefaultRoute } from '../utils/routeUtils';

const RoleRoute = ({ roles, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl bg-slate-900 p-6 shadow-2xl ring-1 ring-cyan-500/20">
          Verifying access...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={roleDefaultRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
