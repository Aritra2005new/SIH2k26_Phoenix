import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  onSortChange,
  sortOption,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const domains = [
    'Agriculture',
    'Healthcare',
    'Disaster Management',
    'Smart City',
    'Education',
    'Environment',
    'Cybersecurity',
    'Transportation',
  ];

  const technologies = [
    'AI',
    'ML',
    'IoT',
    'Blockchain',
    'Computer Vision',
    'NLP',
  ];

  function toggleDomain(domain) {
    const current = filters.domains || [];

    const updated = current.includes(domain)
      ? current.filter((d) => d !== domain)
      : [...current, domain];

    onFilterChange({
      ...filters,
      domains: updated,
    });
  }

  function toggleTech(tech) {
    const current = filters.technologies || [];

    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];

    onFilterChange({
      ...filters,
      technologies: updated,
    });
  }

  return (
    <div className="rounded-2xl border border-[#4a3931]/10 bg-[#fdfcfb] p-4 shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex w-full items-center justify-between
          text-sm font-semibold
          text-[#4a3931]
          transition-colors
          hover:text-[#806e63]
        "
      >
        Filter Results

        <ChevronDown
          className={`
            h-4 w-4
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {isOpen && (
        <div className="mt-5 space-y-6">

          {/* Domains */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9b877b]">
              Domain
            </p>

            <div className="grid grid-cols-2 gap-2">
              {domains.map((domain) => (
                <label
                  key={domain}
                  className="
                    flex cursor-pointer items-center gap-2
                    text-sm text-[#806e63]
                    transition-colors
                    hover:text-[#4a3931]
                  "
                >
                  <input
                    type="checkbox"
                    checked={filters.domains?.includes(domain) || false}
                    onChange={() => toggleDomain(domain)}
                    className="
                      h-4 w-4 rounded
                      border-[#4a3931]/20
                      accent-[#4a3931]
                      focus:ring-[#4a3931]
                    "
                  />

                  {domain}
                </label>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9b877b]">
              Technology
            </p>

            <div className="grid grid-cols-2 gap-2">
              {technologies.map((tech) => (
                <label
                  key={tech}
                  className="
                    flex cursor-pointer items-center gap-2
                    text-sm text-[#806e63]
                    transition-colors
                    hover:text-[#4a3931]
                  "
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.technologies?.includes(tech) || false
                    }
                    onChange={() => toggleTech(tech)}
                    className="
                      h-4 w-4 rounded
                      border-[#4a3931]/20
                      accent-[#4a3931]
                      focus:ring-[#4a3931]
                    "
                  />

                  {tech}
                </label>
              ))}
            </div>
          </div>

          {/* Match Score */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9b877b]">
              Match Score:{' '}
              <span className="text-[#4a3931]">
                {filters.minScore || 0}%
              </span>{' '}
              — 100%
            </p>

            <input
              type="range"
              min="0"
              max="100"
              value={filters.minScore || 0}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minScore: Number(e.target.value),
                })
              }
              className="w-full accent-[#4a3931]"
            />
          </div>

          {/* Sort */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9b877b]">
              Sort
            </p>

            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="
                w-full rounded-xl
                border border-[#4a3931]/15
                bg-[#fdfcfb]
                px-3 py-2.5
                text-sm text-[#4a3931]
                outline-none
                transition
                focus:border-[#4a3931]/40
                focus:ring-2
                focus:ring-[#e2d1c3]
              "
            >
              <option value="highest">
                Highest Match
              </option>

              <option value="lowest">
                Lowest Match
              </option>

              <option value="name">
                Company Name (A-Z)
              </option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
}