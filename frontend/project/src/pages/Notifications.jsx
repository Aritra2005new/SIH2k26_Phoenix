import { useCallback, useEffect, useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { getNotifications, markNotificationRead, getApiError } from '../services/api';
import Loading from '../components/Loading';

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.notifications)) return data.notifications;
  return [];
}

const readState = (n) => Boolean(n?.is_read ?? n?.read ?? false);

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(normalize(await getNotifications()));
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function read(id) {
    setBusyId(id);
    try {
      await markNotificationRead(id);
      setItems((current) => current.map((n) => n.id === id ? { ...n, is_read: true, read: true } : n));
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusyId(null);
    }
  }

  const unread = items.filter((n) => !readState(n)).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-700">Notifications</h1>
        <p className="mt-1 text-ink-400">Live notifications from the backend workflow.</p>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {loading ? <Loading message="Loading notifications..." /> : (
        <div className="space-y-3">
          {items.map((n) => {
            const isRead = readState(n);
            const dateValue = n.created_at || n.created || n.timestamp;
            const date = dateValue && !Number.isNaN(new Date(dateValue).getTime()) ? new Date(dateValue).toLocaleString() : '';
            return (
              <div key={n.id} className={`card p-4 ${isRead ? 'opacity-70' : 'border-plum-200'}`}>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-plum-50">
                    <Bell className="h-5 w-5 text-plum-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-ink-700">{n.title || 'Notification'}</h2>
                        <p className="mt-1 text-sm text-ink-500">{n.message || n.body || 'You have a new notification.'}</p>
                      </div>
                      {!isRead && (
                        <button disabled={busyId === n.id} onClick={() => read(n.id)} className="btn-ghost whitespace-nowrap">
                          {busyId === n.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Mark read
                        </button>
                      )}
                    </div>
                    {date && <p className="mt-2 text-xs text-ink-400">{date}</p>}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <div className="card py-12 text-center text-sm text-ink-400">No notifications yet.</div>}
          {items.length > 0 && <p className="text-center text-xs text-ink-400">{unread} unread notification{unread === 1 ? '' : 's'}</p>}
        </div>
      )}
    </div>
  );
}
