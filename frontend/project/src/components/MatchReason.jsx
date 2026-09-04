import { Check, X, ArrowRight } from 'lucide-react';

export default function MatchReason({
  matchDetails,
  strongMatches,
}) {
  return (
    <div className="space-y-5">

      <h4 className="text-sm font-semibold text-[#4a3931]">
        Why this startup matches
      </h4>

      {/* Match Table */}
      <div className="overflow-hidden rounded-xl border border-[#4a3931]/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-[#e2d1c3]/35 text-left">
                <th className="px-4 py-3 font-medium text-[#806e63]">
                  Government Requirement
                </th>

                <th className="px-2 py-3">
                </th>

                <th className="px-4 py-3 font-medium text-[#806e63]">
                  Startup Capability
                </th>

                <th className="px-4 py-3 text-right font-medium text-[#806e63]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {matchDetails.map((detail, i) => (
                <tr
                  key={i}
                  className="border-t border-[#4a3931]/10"
                >
                  <td className="px-4 py-3 text-[#806e63]">
                    {detail.requirement}
                  </td>

                  <td className="px-2 py-3 text-[#9b877b]">
                    <ArrowRight className="h-4 w-4" />
                  </td>

                  <td className="px-4 py-3 text-[#806e63]">
                    {detail.capability}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {detail.matched ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-50 p-1 text-green-600">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-[#e2d1c3]/30 p-1 text-[#9b877b]">
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Strong Matches */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9b877b]">
          Strong matches
        </p>

        <div className="flex flex-wrap gap-2">
          {strongMatches.map((match, i) => (
            <span
              key={i}
              className="
                inline-flex items-center gap-1
                rounded-full
                border border-[#4a3931]/10
                bg-[#e2d1c3]/35
                px-3 py-1
                text-xs font-medium
                text-[#4a3931]
              "
            >
              <Check className="h-3 w-3" />
              {match}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}