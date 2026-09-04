import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getChallenges,
  getGovernmentApplications,
  getApiError,
} from '../../services/api';
import Loading from '../../components/Loading';
import {
  Search,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [c, a] = await Promise.all([
          getChallenges(),
          getGovernmentApplications(),
        ]);

        setChallenges(c);
        setApps(a);
      } catch (e) {
        setError(getApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-full space-y-6 text-[#4a3931]">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#4a3931]">
          Welcome, {user?.username || 'Government User'}
        </h1>

        <p className="mt-1 text-[#806e63]">
          Create a challenge and use AI to discover suitable startups.
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Create Challenge */}
        <Link
          to="/government/search"
          className="
            group rounded-2xl border border-[#4a3931]/10
            bg-[#fdfcfb] p-6
            shadow-[0_10px_35px_rgba(74,57,49,0.07)]
            transition-all duration-300
            hover:-translate-y-1
            hover:border-[#4a3931]/20
            hover:shadow-[0_18px_45px_rgba(74,57,49,0.12)]
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl bg-[#e2d1c3]
                text-[#4a3931]
              "
            >
              <Search className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[#4a3931]">
                Create Challenge
              </h2>

              <p className="text-sm text-[#806e63]">
                Create a backend challenge and run AI matching.
              </p>
            </div>

          </div>

          <span
            className="
              mt-4 inline-flex items-center gap-1
              text-sm font-semibold text-[#4a3931]
              transition-transform duration-300
              group-hover:translate-x-1
            "
          >
            Start
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        {/* Applications */}
        <Link
          to="/government/applications"
          className="
            group rounded-2xl border border-[#4a3931]/10
            bg-[#fdfcfb] p-6
            shadow-[0_10px_35px_rgba(74,57,49,0.07)]
            transition-all duration-300
            hover:-translate-y-1
            hover:border-[#4a3931]/20
            hover:shadow-[0_18px_45px_rgba(74,57,49,0.12)]
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl bg-[#e2d1c3]
                text-[#4a3931]
              "
            >
              <ClipboardList className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[#4a3931]">
                Applications & Projects
              </h2>

              <p className="text-sm text-[#806e63]">
                Track selected startups and project progress.
              </p>
            </div>

          </div>
        </Link>
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

      {/* Loading / Content */}
      {loading ? (
        <Loading message="Loading government data..." />
      ) : (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-3">

            <div
              className="
                rounded-2xl border border-[#4a3931]/10
                bg-[#fdfcfb] p-5
                shadow-[0_8px_25px_rgba(74,57,49,0.06)]
              "
            >
              <p className="text-3xl font-black tracking-tight text-[#4a3931]">
                {challenges.length}
              </p>

              <p className="mt-1 text-xs text-[#806e63]">
                Challenges visible to this account
              </p>
            </div>

            <div
              className="
                rounded-2xl border border-[#4a3931]/10
                bg-[#fdfcfb] p-5
                shadow-[0_8px_25px_rgba(74,57,49,0.06)]
              "
            >
              <p className="text-3xl font-black tracking-tight text-[#4a3931]">
                {apps.length}
              </p>

              <p className="mt-1 text-xs text-[#806e63]">
                Applications
              </p>
            </div>

            <div
              className="
                rounded-2xl border border-[#4a3931]/10
                bg-[#fdfcfb] p-5
                shadow-[0_8px_25px_rgba(74,57,49,0.06)]
              "
            >
              <p className="text-3xl font-black tracking-tight text-[#4a3931]">
                {
                  apps.filter(
                    (a) => a.status === 'COMPLETED'
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-[#806e63]">
                Completed
              </p>
            </div>

          </div>

          {/* Recent Challenges */}
          <div
            className="
              rounded-2xl border border-[#4a3931]/10
              bg-[#fdfcfb] p-6
              shadow-[0_10px_35px_rgba(74,57,49,0.06)]
            "
          >
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-semibold text-[#4a3931]">
                Recent Challenges
              </h2>

              <Link
                to="/government/search"
                className="
                  text-sm font-semibold text-[#4a3931]
                  transition-opacity hover:opacity-60
                "
              >
                Create new
              </Link>

            </div>

            <div className="mt-4 space-y-2">

              {challenges.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="
                    rounded-xl border border-[#4a3931]/10
                    bg-[#e2d1c3]/25 p-3
                    transition-colors
                    hover:bg-[#e2d1c3]/45
                  "
                >
                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="font-medium text-[#4a3931]">
                        {c.title}
                      </p>

                      <p className="text-xs text-[#806e63]">
                        #{c.id} · {c.status}
                      </p>
                    </div>

                    <Link
                      className="
                        text-sm font-semibold text-[#4a3931]
                        hover:opacity-60
                      "
                      to={`/government/recommendations/${c.id}`}
                    >
                      Recommendations
                    </Link>

                  </div>
                </div>
              ))}

              {challenges.length === 0 && (
                <p className="py-6 text-center text-sm text-[#806e63]">
                  No challenges yet.
                </p>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}