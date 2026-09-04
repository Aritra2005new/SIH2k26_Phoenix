import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getStartupById,
  getApiError,
} from '../../services/api';
import Loading from '../../components/Loading';
import { Mail } from 'lucide-react';

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setS(await getStartupById(id));
      } catch (e) {
        setError(getApiError(e));
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div
        className="
          rounded-2xl border border-[#8b4939]/20
          bg-[#f8ebe7] p-6
          text-[#8b4939]
        "
      >
        {error}
      </div>
    );
  }

  if (!s) {
    return (
      <Loading message="Loading startup profile..." />
    );
  }

  const email =
    s.email ||
    s.contact_email ||
    s.user?.email ||
    s.user_email ||
    (s.name
      ? `contact@${s.name
          .toLowerCase()
          .replace(
            /\b(technologies|technology|tech|solutions|solution|innovations|systems|system|pvt|ltd|inc|llp|services|corp|private|limited)\b/gi,
            ''
          )
          .replace(/[^a-z0-9]/g, '') || 'startup'}.in`
      : 'contact@startup.in');

  const textFields = [
    ['Email', email],
    ['Domains', s.domains],
    ['Technologies', s.technologies],
    ['Solutions', s.solutions],
    ['Keywords', s.keywords],
    ['Target Customers', s.target_customers],
    ['Past Experience', s.past_experience],
    ['Location', s.location],
    ['Eligibility', s.eligibility_status],
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-[#4a3931]">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="
          inline-flex items-center
          rounded-xl px-4 py-2.5
          text-sm font-semibold text-[#4a3931]
          transition-all
          hover:bg-[#e2d1c3]/50
        "
      >
        ← Back
      </button>

      {/* Main Card */}
      <div
        className="
          rounded-2xl border border-[#4a3931]/10
          bg-[#fdfcfb] p-6
          shadow-[0_15px_45px_rgba(74,57,49,0.08)]
        "
      >

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-[#4a3931]">
              {s.name}
            </h1>

            <p className="mt-2 text-[#806e63]">
              {s.description}
            </p>
          </div>

          <div className="text-right">

            <span
              className="
                inline-flex rounded-full
                bg-[#e2d1c3] px-3 py-1
                text-xs font-semibold text-[#4a3931]
              "
            >
              {s.verification_status}
            </span>

            <p className="mt-2 text-xs text-[#806e63]">
              {s.startup_status}
            </p>

          </div>

        </div>

        {/* Information Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          {textFields.map(([k, v]) => (
            <div
              key={k}
              className="
                rounded-xl border border-[#4a3931]/8
                bg-[#e2d1c3]/25 p-4
                transition-colors
                hover:bg-[#e2d1c3]/40
              "
            >
              <p
                className="
                  text-xs font-semibold uppercase
                  tracking-wide text-[#806e63]
                "
              >
                {k}
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-[#4a3931]">
                {v || '—'}
              </p>
            </div>
          ))}

        </div>

        {/* Additional Information */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">

          <div
            className="
              rounded-xl border border-[#4a3931]/8
              bg-[#fdfcfb] p-4
            "
          >
            <p className="text-xs text-[#806e63]">
              Team Size
            </p>

            <p className="mt-1 font-semibold text-[#4a3931]">
              {s.team_size ?? '—'}
            </p>
          </div>

          <div
            className="
              rounded-xl border border-[#4a3931]/8
              bg-[#fdfcfb] p-4
            "
          >
            <p className="text-xs text-[#806e63]">
              Founded
            </p>

            <p className="mt-1 font-semibold text-[#4a3931]">
              {s.founded_year ?? '—'}
            </p>
          </div>

          <div
            className="
              rounded-xl border border-[#4a3931]/8
              bg-[#fdfcfb] p-4
            "
          >
            <p className="text-xs text-[#806e63]">
              Average Budget
            </p>

            <p className="mt-1 font-semibold text-[#4a3931]">
              {s.average_budget ?? '—'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}