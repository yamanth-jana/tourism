import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Compass, Heart, User, ChevronDown, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/hidden-gems', label: 'Hidden Gems' },
  { to: '/guides', label: 'Guides' },
  { to: '/trip-planner', label: 'Plan Trip' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, role, isAuthenticated, isAdmin, isUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Admin gets a minimal nav while on admin pages; users always see the full public nav
  const navLinks = isAdminPage && isAdmin ? adminLinks : publicLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel = isAdmin ? 'Administrator' : 'User';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'glass-nav shadow-soft py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
            {isAdmin ? <ShieldCheck size={22} className="text-white" /> : <Compass size={22} className="text-white" />}
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-lg font-bold ${scrolled || !isHome ? 'text-stone-900 dark:text-white' : 'text-white'}`}>
              {isAdmin ? 'Admin Panel' : 'Explore India'}
            </span>
            <span className={`text-[10px] ${scrolled || !isHome ? 'text-stone-500 dark:text-stone-400' : 'text-white/70'}`}>
              {isAdmin ? 'Explore India · Admin' : 'Tourism & Heritage'}
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/' || link.to === '/admin'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''} ${
                  scrolled || !isHome
                    ? ''
                    : 'text-white/90 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-colors ${
              scrolled || !isHome
                ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className={`hidden sm:block ${scrolled || !isHome ? '' : 'text-white'}`}>
            <NotificationBell variant={scrolled || !isHome ? 'light' : 'dark'} />
          </div>

          {isAuthenticated && isUser && (
            <Link
              to="/favorites"
              className={`hidden sm:flex p-2.5 rounded-full transition-colors ${
                scrolled || !isHome
                  ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Favorites"
            >
              <Heart size={20} />
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="hidden sm:block btn-ghost text-sm">
                Login
              </Link>
              <Link to="/register" className="hidden sm:block btn-primary text-sm py-2 px-5">
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-all ${
                  scrolled || !isHome
                    ? 'border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                    : 'border-white/50 hover:bg-white/10'
                } border-2`}
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className={`text-sm font-semibold ${scrolled || !isHome ? 'text-stone-700 dark:text-stone-200' : 'text-white'}`}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-60 glass-card p-2 z-50 animate-scale-in">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`badge ${isAdmin ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300'}`}>
                          {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />} {roleLabel}
                        </span>
                      </div>
                    </div>
                    <hr className="my-1 border-stone-200 dark:border-stone-700" />
                    {isUser && (
                      <>
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm">
                          <User size={16} /> My Profile
                        </Link>
                        <Link to="/favorites" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm">
                          <Heart size={16} /> Favorites
                        </Link>
                        <Link to="/guides" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm">
                          <Compass size={16} /> Guides
                        </Link>
                        <Link to="/guide-registration" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm">
                          <User size={16} /> Become a Guide
                        </Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-stone-200 dark:border-stone-700" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm text-error-600 dark:text-error-400">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2.5 rounded-full transition-colors ${
              scrolled || !isHome
                ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-nav border-t border-white/20 dark:border-white/10 shadow-soft-lg animate-fade-in">
          <div className="container-max px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/' || link.to === '/admin'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="my-2 border-stone-200 dark:border-stone-700" />

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 flex items-center gap-2">
                  <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                    <span className={`badge ${isAdmin ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300'}`}>
                      {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />} {roleLabel}
                    </span>
                  </div>
                </div>
                {isUser && (
                  <>
                    <Link to="/profile" className="px-4 py-3 rounded-2xl text-base font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                      Profile
                    </Link>
                    <Link to="/favorites" className="px-4 py-3 rounded-2xl text-base font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                      Favorites
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="px-4 py-3 rounded-2xl text-base font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 mt-2">
                <Link to="/login" className="btn-secondary flex-1 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
