import { Link } from 'react-router-dom';

export default function Button({
  to,
  onClick,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200';

  const variants = {
    primary: `
      bg-[#4a3931]
      text-[#fdfcfb]
      shadow-[0_8px_24px_rgba(74,57,49,0.16)]
      hover:-translate-y-0.5
      hover:bg-[#5b463c]
      hover:shadow-[0_12px_30px_rgba(74,57,49,0.22)]
    `,

    secondary: `
      border
      border-[#4a3931]/20
      bg-[#e2d1c3]/40
      text-[#4a3931]
      hover:-translate-y-0.5
      hover:border-[#4a3931]/35
      hover:bg-[#e2d1c3]/65
    `,

    ghost: `
      text-[#6b5a50]
      hover:bg-[#e2d1c3]/40
      hover:text-[#4a3931]
    `,
  };

  const cls = `
    ${base}
    ${variants[variant] || variants.primary}
    ${className}
  `;

  if (to) {
    return (
      <Link
        to={to}
        className={cls}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
    >
      {children}
    </button>
  );
}