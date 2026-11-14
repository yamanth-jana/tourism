import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, CircleAlert as AlertCircle, Loader as Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, 'admin');
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
                Admin Login
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Secure access for administrators only
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@exploreindia.com"
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

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In to Admin <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-primary-50/60 dark:bg-primary-500/10 p-4 text-xs text-stone-600 dark:text-stone-400">
              <p className="font-semibold text-primary-700 dark:text-primary-300 mb-1 flex items-center gap-1">
                <ShieldCheck size={13} /> Demo Admin Credentials
              </p>
              <p>Email: admin@exploreindia.com</p>
              <p>Password: admin123</p>
            </div>

            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 mt-6 transition-colors">
              <ArrowLeft size={15} /> Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
