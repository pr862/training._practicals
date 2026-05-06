import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-teal-500/10">
          <div className="text-sm uppercase tracking-widest text-gray-400">404</div>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            Page not found
          </h1>
          <p className="mt-4 text-gray-300">
            We couldn&apos;t find{' '}
            <span className="font-mono text-gray-200">{location.pathname}</span>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/20 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => navigate('/app/search')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

