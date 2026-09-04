import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import MatchScore from './MatchScore';
import Tag from './Tag';

export default function StartupCard({
  startup,
  rank,
}) {
  const fullStartup =
    startup.solutions || startup.technologies
      ? startup
      : {};

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border border-[#4a3931]/10
        bg-[#fdfcfb]
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#4a3931]/20
        hover:shadow-lg
      "
    >
      <div className="p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            {rank && (
              <span
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-[#4a3931]
                  text-sm font-bold
                  text-[#fdfcfb]
                "
              >
                {rank}
              </span>
            )}

            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-base font-semibold
                  text-[#4a3931]
                "
              >
                {startup.company}
              </h3>

              {startup.match_reasons && (
                <p className="mt-0.5 text-xs text-[#9b877b]">
                  {startup.match_reasons.join(' • ')}
                </p>
              )}
            </div>

          </div>

          <MatchScore score={startup.match_score} />

        </div>

        {/* Technologies */}
        {startup.technologies && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {startup.technologies.map((tech, i) => (
              <Tag key={i} variant="tech">
                {tech}
              </Tag>
            ))}
          </div>
        )}

        {/* Domains */}
        {startup.domains && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {startup.domains.map((domain, i) => (
              <Tag key={i} variant="domain">
                {domain}
              </Tag>
            ))}
          </div>
        )}

        {/* Match Reasons */}
        {startup.match_reasons && (
          <div
            className="
              mt-4
              rounded-xl
              border border-[#4a3931]/10
              bg-[#e2d1c3]/25
              p-3
            "
          >
            <p
              className="
                mb-2
                text-xs font-semibold
                text-[#806e63]
              "
            >
              Why this match?
            </p>

            <ul className="space-y-1">
              {startup.match_reasons.map((reason, i) => (
                <li
                  key={i}
                  className="
                    flex items-center gap-2
                    text-sm text-[#806e63]
                  "
                >
                  <Check
                    className="
                      h-4 w-4
                      shrink-0
                      text-[#4a3931]
                    "
                  />

                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Startup */}
        <div className="mt-4">
          <Link
            to={`/government/startup/${
              startup.startup_id || startup.id
            }`}
            className="
              flex w-full
              items-center justify-center
              rounded-xl
              bg-[#4a3931]
              px-4 py-2.5
              text-sm font-semibold
              text-[#fdfcfb]
              transition-all
              hover:-translate-y-0.5
              hover:bg-[#5b463c]
            "
          >
            View Startup
          </Link>
        </div>

      </div>
    </div>
  );
}