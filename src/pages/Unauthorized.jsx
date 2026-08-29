import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-20">
      <div className="mx-auto max-w-3xl rounded-4xl border border-white/10 bg-slate-900/90 p-12 shadow-2xl">
        <h1 className="text-5xl font-black text-cyan-400">Access Denied</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          You do not have permission to view this page. Please return to the correct dashboard or sign in with the right account.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="rounded-2xl bg-slate-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-600"
          >
            Back to Home
          </Link>
          <Link
            to="/login"
            className="rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
