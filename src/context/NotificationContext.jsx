import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Bell, CircleCheck as CheckCircle, Circle as XCircle, Info, MessageSquare, Calendar, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { notificationsApi } from '../services/api';

const NotificationContext = createContext(null);

const ICONS = {
  // user-facing
  submitted: { icon: Info, color: 'text-accent-500', bg: 'bg-accent-100 dark:bg-accent-500/20' },
  approved: { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-100 dark:bg-success-500/20' },
  rejected: { icon: XCircle, color: 'text-error-500', bg: 'bg-error-100 dark:bg-error-500/20' },
  more_info: { icon: MessageSquare, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-500/20' },
  booking: { icon: Calendar, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-500/20' },
  trip: { icon: Sparkles, color: 'text-accent-500', bg: 'bg-accent-100 dark:bg-accent-500/20' },
  system: { icon: Info, color: 'text-stone-500', bg: 'bg-stone-100 dark:bg-stone-700' },
  // admin-facing
  new_registration: { icon: ShieldCheck, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-500/20' },
  pending_approval: { icon: Clock, color: 'text-accent-500', bg: 'bg-accent-100 dark:bg-accent-500/20' },
  admin_rejected: { icon: XCircle, color: 'text-error-500', bg: 'bg-error-100 dark:bg-error-500/20' },
  admin_more_info: { icon: MessageSquare, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-500/20' },
};

let counter = 0;

const USER_SEED = [
  {
    id: 'n-seed-user-1', type: 'booking', audience: 'user',
    title: 'Booking Confirmed',
    message: 'Your guided tour of the Taj Mahal has been confirmed for tomorrow at 9:00 AM.',
    read: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'n-seed-user-2', type: 'trip', audience: 'user',
    title: 'Trip Recommendation',
    message: 'Based on your favourites, we recommend exploring the backwaters of Kerala this season.',
    read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

const ADMIN_SEED = [
  {
    id: 'n-seed-admin-1', type: 'new_registration', audience: 'admin',
    title: 'New Guide Registration',
    message: 'Arjun Sharma submitted a new Government Certified Guide application.',
    read: false, createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'n-seed-admin-2', type: 'pending_approval', audience: 'admin',
    title: 'Pending Approval',
    message: '2 guide applications are awaiting your review.',
    read: false, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([...USER_SEED, ...ADMIN_SEED]);

  useEffect(() => {
    async function loadNotifications() {
      const res = await notificationsApi.getNotifications();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data);
      }
    }
    loadNotifications();
  }, []);

  const addNotification = useCallback((type, title, message, audience = 'user') => {
    setNotifications((prev) => [
      {
        id: `n-${++counter}`,
        type,
        title,
        message,
        audience,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback((audience) => {
    notificationsApi.markAllRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => (audience ? (n.audience === audience ? { ...n, read: true } : n) : { ...n, read: true })));
  }, []);

  const clearAll = useCallback((audience) => {
    setNotifications((prev) => (audience ? prev.filter((n) => n.audience !== audience) : []));
  }, []);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    markAllRead,
    clearAll,
    ICONS,
  }), [notifications, addNotification, markAllRead, clearAll]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
