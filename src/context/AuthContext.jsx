import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { authApi, getToken } from '../services/api';

const AuthContext = createContext(null);

const USER_CACHE_KEY = 'explore-india-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session against database on mount
  useEffect(() => {
    let isMounted = true;
    async function verifyAuth() {
      const token = getToken();
      if (!token) {
        if (isMounted) {
          setUser(null);
          try { localStorage.removeItem(USER_CACHE_KEY); } catch {}
          setLoading(false);
        }
        return;
      }

      try {
        const res = await authApi.getMe();
        if (isMounted) {
          if (res.ok && res.data) {
            const profile = {
              id: res.data.id,
              email: res.data.email,
              name: res.data.fullName || res.data.name,
              role: (res.data.role || 'user').toLowerCase(),
              photo: res.data.avatarUrl || res.data.photo,
            };
            setUser(profile);
            try { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(profile)); } catch {}
          } else {
            // Token invalid or expired - clear session
            setUser(null);
            authApi.logout();
            try { localStorage.removeItem(USER_CACHE_KEY); } catch {}
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    verifyAuth();
    return () => { isMounted = false; };
  }, []);

  // Sync cache with state
  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_CACHE_KEY);
    } catch {}
  }, [user]);

  const login = useCallback(async (email, password, role) => {
    if (!email || !password) {
      return { ok: false, error: 'Please enter both email and password' };
    }

    try {
      const res = await authApi.login(email.trim(), password, role);
      if (res.ok && res.data) {
        const profile = {
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          role: (res.data.role || role || 'user').toLowerCase(),
          photo: res.data.photo || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
        };
        setUser(profile);
        return { ok: true, role: profile.role };
      }

      return {
        ok: false,
        error: res.error || 'Invalid email or password',
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Unable to connect to backend server. Please ensure the backend is running.',
      };
    }
  }, []);

  const register = useCallback(async (userData) => {
    if (!userData.email || !userData.password || !userData.name) {
      return { ok: false, error: 'Full name, email, and password are required' };
    }

    try {
      const res = await authApi.register(userData);
      if (res.ok && res.data) {
        const profile = {
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          role: (res.data.role || 'user').toLowerCase(),
          photo: res.data.photo,
        };
        setUser(profile);
        return { ok: true, role: profile.role };
      }

      return {
        ok: false,
        error: res.error || 'Registration failed. Please check your details.',
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Unable to connect to backend server. Please ensure the backend is running.',
      };
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    try { localStorage.removeItem(USER_CACHE_KEY); } catch {}
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    loading,
    login,
    register,
    logout,
  }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
