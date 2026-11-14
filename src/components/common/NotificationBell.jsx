import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell({ variant = 'light' }) {
  const { notifications, markAllRead, clearAll, ICONS } = useNotifications();
  const { role } = useAuth();
  const audience = role === 'admin' ? 'admin' : 'user';

  const visible = notifications.filter((n) => n.audience === audience);
  const unreadCount = visible.filter((n) => !n.read).length;

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const baseColor = variant === 'light'
    ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
    : 'text-white hover:bg-white/20';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2.5 rounded-full transition-colors ${baseColor}`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card p-0 overflow-hidden z-50 animate-scale-in max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-stone-200/60 dark:border-stone-700/50">
            <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Bell size={16} className="text-primary-500" /> Notifications
              {unreadCount > 0 && (
                <span className="badge bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300">{unreadCount} new</span>
              )}
            </h3>
            <div className="flex gap-1">
              <button onClick={() => markAllRead(audience)} title="Mark all read" className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
                <Check size={15} />
              </button>
              <button onClick={() => clearAll(audience)} title="Clear all" className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {visible.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-stone-400 mb-2" />
                <p className="text-sm text-stone-500 dark:text-stone-400">No notifications yet</p>
              </div>
            ) : (
              visible.map((n) => {
                const cfg = ICONS[n.type] || ICONS.system;
                const Icon = cfg.icon;
                return (
                  <div key={n.id} className={`flex gap-3 p-4 border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${!n.read ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}>
                    <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-stone-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
