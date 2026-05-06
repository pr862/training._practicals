import React from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

const RouteErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let description = 'Please try again.';
  let details: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || 'Error'}`;
    description = typeof error.data === 'string' ? error.data : 'The requested page failed to load.';
  } else if (error instanceof Error) {
    details = error.message;
  } else if (typeof error === 'string') {
    details = error;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-rose-500/10">
          <div className="flex items-center gap-3 text-rose-200">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-sm uppercase tracking-widest text-gray-300">
              Unexpected error
            </div>
          </div>

          <h1 className="mt-4 text-2xl md:text-4xl font-extrabold">{title}</h1>
          <p className="mt-3 text-gray-300">{description}</p>
          {details ? (
            <p className="mt-4 text-sm text-gray-400 font-mono break-words">{details}</p>
          ) : null}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reload
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/20 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorPage;

