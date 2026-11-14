import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      setError('Please agree to the Terms of Service & Privacy Policy');
      return;
    }
    setError('');
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.ok) {
      navigate('/profile');
    } else {
      setError(res.error || 'Registration failed');
    }
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
                Join Explore India
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Create your account and start exploring
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 text-error-600 dark:text-error-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
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
                {formData.password && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full ${
                          formData.password.length >= s * 2
                            ? s <= 2 ? 'bg-error-500' : s === 3 ? 'bg-accent-500' : 'bg-success-500'
                            : 'bg-stone-200 dark:bg-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 rounded accent-primary-500 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="btn-primary w-full text-base py-3.5">
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-6">
              <hr className="border-stone-200 dark:border-stone-700" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-stone-900 px-4 text-xs text-stone-400">
                or sign up with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary text-sm justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="btn-secondary text-sm justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-stone-600 dark:text-stone-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
