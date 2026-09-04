export default function MatchScore({
  score,
  size = 'md',
}) {
  const radius = size === 'lg' ? 52 : 36;
  const stroke = size === 'lg' ? 8 : 6;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (score / 100) * circumference;

  const color =
    score >= 85
      ? '#4a3931'
      : score >= 70
        ? '#806e63'
        : '#9b877b';

  const dims =
    size === 'lg'
      ? 'h-32 w-32'
      : 'h-24 w-24';

  return (
    <div
      className={`
        relative flex ${dims}
        items-center justify-center
      `}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox={`
          0 0
          ${radius * 2 + stroke * 2}
          ${radius * 2 + stroke * 2}
        `}
      >
        {/* Background Circle */}
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="#e2d1c3"
          strokeWidth={stroke}
        />

        {/* Score Circle */}
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="text-center">
        <span
          className={`
            font-bold
            ${size === 'lg' ? 'text-2xl' : 'text-lg'}
            text-[#4a3931]
          `}
        >
          {score}%
        </span>

        <span
          className={`
            block
            ${size === 'lg' ? 'text-xs' : 'text-[10px]'}
            font-medium
            text-[#9b877b]
          `}
        >
          MATCH
        </span>
      </div>
    </div>
  );
}