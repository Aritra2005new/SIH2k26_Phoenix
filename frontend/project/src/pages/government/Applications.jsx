import { useEffect, useState } from 'react';
import {
  getGovernmentApplications,
  getApiError,
} from '../../services/api';
import Loading from '../../components/Loading';
import {
  RefreshCw,
} from 'lucide-react';

const statusClass = {
  PENDING_ACCEPTANCE:
    'bg-[#e2d1c3] text-[#4a3931]',

  ACCEPTED:
    'bg-[#eee5df] text-[#4a3931]',

  REJECTED:
    'bg-[#f8ebe7] text-[#8b4939]',

  COMPLETED:
    'bg-[#e8eee7] text-[#486044]',
};

export default function Applications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      setItems(await getGovernmentApplications());
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 text-[#4a3931]">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#4a3931]">
            Applications & Projects
          </h1>

          <p className="mt-1 text-[#806e63]">
            Track startup selection, acceptance and project progress.
          </p>
        </div>

        <button
          onClick={load}
          className="
            inline-flex items-center gap-2
            rounded-xl border border-[#4a3931]/15
            bg-[#fdfcfb] px-4 py-2.5
            text-sm font-semibold text-[#4a3931]
            shadow-sm
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-[#e2d1c3]/40
            hover:shadow-md
          "
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-xl border border-[#8b4939]/20
            bg-[#f8ebe7] px-4 py-3
            text-sm text-[#8b4939]
          "
        >
          {error}
        </div>
      )}

      {loading ? (
        <Loading message="Loading applications..." />
      ) : (
        <div className="space-y-4">

          {items.map((a) => (
            <div
              key={a.application_id}
              className="
                rounded-2xl border border-[#4a3931]/10
                bg-[#fdfcfb] p-5
                shadow-[0_10px_35px_rgba(74,57,49,0.06)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_16px_40px_rgba(74,57,49,0.10)]
              "
            >

              {/* Top */}
              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>
                  <h2 className="font-semibold text-[#4a3931]">
                    {a.challenge_title}
                  </h2>

                  <p className="mt-1 text-sm text-[#806e63]">
                    Startup: {a.startup_name}
                  </p>
                </div>

                <span
                  className={`
                    rounded-full px-3 py-1
                    text-xs font-semibold
                    ${
                      statusClass[a.status] ||
                      'bg-[#eee5df] text-[#4a3931]'
                    }
                  `}
                >
                  {a.status}
                </span>

              </div>

              {/* Progress */}
              <div className="mt-5">

                <div className="flex justify-between text-xs text-[#806e63]">
                  <span>Progress</span>
                  <span>{a.progress_percentage}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2d1c3]/50">
                  <div
                    className="h-2 rounded-full bg-[#4a3931] transition-all duration-500"
                    style={{
                      width: `${a.progress_percentage}%`,
                    }}
                  />
                </div>

              </div>

              {/* Metadata */}
              <div
                className="
                  mt-4 grid gap-2
                  text-xs text-[#806e63]
                  sm:grid-cols-3
                "
              >

                <span>
                  Application #{a.application_id}
                </span>

                <span>
                  Created:{' '}
                  {new Date(a.created_at).toLocaleString()}
                </span>

                {a.completed_at ? (
                  <span className="text-[#486044]">
                    Completed:{' '}
                    {new Date(a.completed_at).toLocaleString()}
                  </span>
                ) : a.accepted_at ? (
                  <span className="text-[#4a3931]">
                    Accepted:{' '}
                    {new Date(a.accepted_at).toLocaleString()}
                  </span>
                ) : a.rejected_at ? (
                  <span className="text-[#8b4939]">
                    Rejected:{' '}
                    {new Date(a.rejected_at).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-[#806e63]">
                    Waiting for startup
                  </span>
                )}

              </div>

            </div>
          ))}

          {items.length === 0 && (
            <div
              className="
                rounded-2xl border border-[#4a3931]/10
                bg-[#fdfcfb] py-12 text-center
                text-sm text-[#806e63]
              "
            >
              No applications yet. Select a startup from AI recommendations.
            </div>
          )}

        </div>
      )}
    </div>
  );
}