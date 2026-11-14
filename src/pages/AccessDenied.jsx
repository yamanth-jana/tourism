import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Hop as Home } from 'lucide-react';

export default function AccessDenied({ redirectDelay = 5 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/', { replace: true }), redirectDelay * 1000);
    return () => clearTimeout(timer);
  }, [navigate, redirectDelay]);

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="glass-card p-8 sm:p-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-error-100 dark:bg-error-500/20 mb-6">
              <ShieldAlert size={40} className="text-error-500" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">
              Access Denied
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
              You don't have permission to view this page. This area is restricted to administrators only.
            </p>
            <p className="text-xs text-stone-400 mb-8">
              Redirecting you to the Home page in a few seconds...
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/')} className="btn-primary text-sm">
                <Home size={16} /> Go Home
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary text-sm">
                <ArrowLeft size={16} /> Switch Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
