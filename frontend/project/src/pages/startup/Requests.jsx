import { useEffect, useState } from 'react';

import {
  getStartupApplications,
  respondToApplication,
  getApiError,
} from '../../services/api';

import { useAuth } from '../../context/AuthContext';

import Loading from '../../components/Loading';

import {
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

export default function Requests() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      setItems(await getStartupApplications());
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(id, action) {
    setBusy(id);
    setError('');

    try {
      const result = await respondToApplication(id, action);

      if (action === 'ACCEPT') {
        const storageKey = `accepted_applications_${user?.id}`;

        const current = JSON.parse(
          localStorage.getItem(storageKey) || '[]'
        );

        if (
          !current.some(
            (x) => x.application_id === result.application_id
          )
        ) {
          localStorage.setItem(
            storageKey,
            JSON.stringify([...current, result])
          );
        }
      }

      await load();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-700">
            Challenge Requests
          </h1>

          <p className="mt-1 text-ink-400">
            Government departments can select your verified startup for a challenge.
          </p>
        </div>

        <button
          onClick={load}
          className="btn-secondary"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <Loading message="Loading requests..." />
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div
              className="card p-5"
              key={a.application_id}
            >
              <h2 className="text-lg font-semibold text-ink-700">
                {a.challenge_title}
              </h2>

              <p className="mt-1 text-sm text-ink-400">
                Selected by government user:{' '}
                {a.government || 'Government'}
              </p>

              <p className="mt-2 text-xs text-ink-400">
                Request #{a.application_id} ·{' '}
                {new Date(a.created_at).toLocaleString()}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  disabled={busy !== null}
                  onClick={() =>
                    respond(a.application_id, 'ACCEPT')
                  }
                  className="btn-primary"
                >
                  <Check className="h-4 w-4" />

                  {busy === a.application_id
                    ? 'Processing...'
                    : 'Accept'}
                </button>

                <button
                  disabled={busy !== null}
                  onClick={() =>
                    respond(a.application_id, 'REJECT')
                  }
                  className="btn-secondary"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="card py-12 text-center text-sm text-ink-400">
              No pending challenge requests.
            </div>
          )}
        </div>
      )}
    </div>
  );
}