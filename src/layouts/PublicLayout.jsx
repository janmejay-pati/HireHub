import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="relative overflow-hidden pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;