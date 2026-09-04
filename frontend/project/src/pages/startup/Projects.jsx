import { useEffect, useState } from 'react';

import {
  updateApplicationProgress,
  getApiError,
} from '../../services/api';

import { useAuth } from '../../context/AuthContext';

import {
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  const storageKey = `accepted_applications_${user?.id}`;

  function load() {
    if (!user?.id) {
      setItems([]);
      return;
    }

    try {
      setItems(
        JSON.parse(
          localStorage.getItem(storageKey) || '[]'
        )
      );
    } catch {
      setItems([]);
      setError('Unable to load accepted projects.');
    }
  }

  useEffect(() => {
    load();
  }, [user?.id]);

  async function update(id, current) {
    const value = window.prompt(
      'Enter new progress percentage (0-100). It cannot decrease.',
      String(current || 0)
    );

    if (value === null) return;

    const n = Number(value);

    if (
      !Number.isInteger(n) ||
      n < Number(current || 0) ||
      n > 100
    ) {
      setError(
        'Progress must be a whole number and cannot decrease.'
      );
      return;
    }

    setBusy(id);
    setError('');

    try {
      const result = await updateApplicationProgress(id, n);

      setItems((prev) => {
        const next = prev.map((x) =>
          x.application_id === id
            ? { ...x, ...result }
            : x
        );

        localStorage.setItem(
          storageKey,
          JSON.stringify(next)
        );

        return next;
      });
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-700">
            Active Projects
          </h1>

          <p className="mt-1 text-ink-400">
            Projects accepted through the current application workflow.
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

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Info Banner */}
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Accepted projects are retained for your startup in this
        browser so their progress can be updated.
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {items.map((a) => (
          <div
            key={a.application_id}
            className="card p-5"
          >
            {/* Project Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-ink-700">
                  {a.challenge_title}
                </h2>

                <p className="text-sm text-ink-400">
                  Application #{a.application_id}
                </p>
              </div>

              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            {/* Progress Bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-ink-100">
                <div
                  className="h-2 rounded-full bg-plum-600 transition-all duration-500"
                  style={{
                    width: `${a.progress_percentage || 0}%`,
                  }}
                />
              </div>

              <span className="text-sm font-semibold">
                {a.progress_percentage || 0}%
              </span>
            </div>

            {/* Action */}
            {a.status !== 'COMPLETED' ? (
              <button
                className="btn-primary mt-4"
                disabled={busy !== null}
                onClick={() =>
                  update(
                    a.application_id,
                    a.progress_percentage || 0
                  )
                }
              >
                {busy === a.application_id
                  ? 'Updating...'
                  : 'Update Progress'}
              </button>
            ) : (
              <p className="mt-4 text-sm font-semibold text-green-600">
                Project completed.
              </p>
            )}
          </div>
        ))}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="card py-12 text-center text-sm text-ink-400">
            No accepted projects recorded for this startup yet.
            Accept a challenge request first.
          </div>
        )}
      </div>
    </div>
  );
}