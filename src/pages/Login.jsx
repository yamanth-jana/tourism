import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const { login, logout } = useAuth();
  const [mode, setMode] = useState('user'); // 'user' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, mode);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    // Defense in depth: never route an admin account through User Login,
    // even if an older or misconfigured backend returns a successful login.
    if (mode === 'user' && result.role === 'admin') {
    logout();
    setError('Invalid user credentials.');
    return;
    }
    if (mode === 'admin' && result.role !== 'admin') {
      logout();
      setError('Administrator access is required. Please use a valid admin account.');
      return;
    }

    if (result.role === 'admin') navigate('/admin');
    else navigate(redirectTarget || '/');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
                <Compass size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Sign in to continue your journey
              </p>
            </div>

            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/60 mb-6">
              <button
                type="button"
                onClick={() => { setMode('user'); setError(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'user'
                    ? 'bg-white dark:bg-stone-900 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <User size={16} /> User Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('admin'); setError(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'admin'
                    ? 'bg-white dark:bg-stone-900 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <ShieldCheck size={16} /> Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {mode === 'admin' ? 'Admin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={mode === 'admin' ? 'admin@exploreindia.com' : 'you@email.com'}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 rounded-2xl px-4 py-3">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-stone-600 dark:text-stone-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-primary-500" />
                  Remember me
                </label>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>

            {mode === 'admin' ? (
              <div className="mt-6 rounded-2xl bg-primary-50/60 dark:bg-primary-500/10 p-4 text-xs text-stone-600 dark:text-stone-400">
                <p className="font-semibold text-primary-700 dark:text-primary-300 mb-1 flex items-center gap-1">
                  <ShieldCheck size={13} /> Demo Admin Credentials
                </p>
                <p>Email: admin@exploreindia.com</p>
                <p>Password: admin123</p>
              </div>
            ) : (
              <p className="text-center text-sm text-stone-600 dark:text-stone-400 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
