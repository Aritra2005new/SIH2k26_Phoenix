import { useEffect, useRef, useState } from 'react';
import { Bell, Check, ExternalLink, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead, getApiError } from '../services/api';

function normalizeNotifications(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.notifications)) return data.notifications;
  return [];
}

function isRead(notification) {
  return Boolean(notification?.is_read ?? notification?.read ?? false);
}

function notificationTime(notification) {
  const value = notification?.created_at || notification?.created || notification?.timestamp;
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
}

export default function NotificationBell({ className = '' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getNotifications();
      setItems(normalizeNotifications(data));
      setError('');
    } catch (e) {
      setError(getApiError(e));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), 30000);
    return () => window.clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    const close = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const unreadCount = items.filter((item) => !isRead(item)).length;

  async function markRead(id, event) {
    event?.stopPropagation();
    if (busyId === id) return;
    setBusyId(id);
    try {
      await markNotificationRead(id);
      setItems((current) => current.map((item) => item.id === id ? { ...item, is_read: true, read: true } : item));
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusyId(null);
    }
  }

  function openNotification(notification) {
    setOpen(false);
    if (!isRead(notification)) markRead(notification.id);
    navigate(pathname.includes('/startup') ? '/startup/notifications' : '/government/notifications');
  }

  const preview = items.slice(0, 5);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-plum-600"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-plum-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <div>
              <h3 className="font-semibold text-ink-700">Notifications</h3>
              <p className="text-xs text-ink-400">{unreadCount} unread</p>
            </div>
            <button type="button" onClick={() => { setOpen(false); navigate(pathname.includes('/startup') ? '/startup/notifications' : '/government/notifications'); }} className="text-xs font-semibold text-plum-600 hover:text-plum-700">
              View all
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-ink-400"><Loader2 className="h-4 w-4 animate-spin" />Loading...</div>
          ) : error ? (
            <div className="px-4 py-6 text-sm text-red-600">{error}</div>
          ) : preview.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ink-400">No notifications yet.</div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {preview.map((notification) => {
                const read = isRead(notification);
                return (
                  <button key={notification.id} type="button" onClick={() => openNotification(notification)} className={`block w-full border-b border-ink-100 px-4 py-3 text-left last:border-b-0 hover:bg-ink-50 ${read ? '' : 'bg-plum-50/40'}`}>
                    <div className="flex gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${read ? 'bg-ink-200' : 'bg-plum-600'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-700">{notification.title || 'Notification'}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-500">{notification.message || notification.body || 'You have a new notification.'}</p>
                        <p className="mt-1 text-[11px] text-ink-400">{notificationTime(notification)}</p>
                      </div>
                      {!read && (
                        <span className="self-center" title="Mark as read" onClick={(event) => markRead(notification.id, event)}>
                          {busyId === notification.id ? <Loader2 className="h-4 w-4 animate-spin text-plum-600" /> : <Check className="h-4 w-4 text-plum-600" />}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button type="button" onClick={() => { setOpen(false); navigate(pathname.includes('/startup') ? '/startup/notifications' : '/government/notifications'); }} className="flex w-full items-center justify-center gap-2 border-t border-ink-100 px-4 py-3 text-sm font-semibold text-plum-600 hover:bg-ink-50">
            Open notification page <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
