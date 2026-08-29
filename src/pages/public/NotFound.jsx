import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-20 text-center">
      <div className="max-w-xl rounded-4xl bg-white p-10 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-500">404 error</p>
        <h1 className="mt-6 text-5xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for may have moved or no longer exists.</p>
        <Link to="/" className="mt-8 inline-flex rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Return home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;