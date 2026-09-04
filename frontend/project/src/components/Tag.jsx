export default function Tag({
  children,
  variant = 'domain',
}) {
  const styles = {
    domain: `
      inline-flex
      items-center
      rounded-full
      border border-[#4a3931]/10
      bg-[#e2d1c3]/35
      px-2.5 py-1
      text-xs font-medium
      text-[#4a3931]
    `,

    tech: `
      inline-flex
      items-center
      rounded-full
      border border-[#4a3931]/10
      bg-[#fdfcfb]
      px-2.5 py-1
      text-xs font-medium
      text-[#806e63]
    `,

    success: `
      inline-flex
      items-center
      rounded-full
      bg-green-50
      px-2.5 py-1
      text-xs font-medium
      text-green-700
    `,

    warning: `
      inline-flex
      items-center
      rounded-full
      bg-amber-50
      px-2.5 py-1
      text-xs font-medium
      text-amber-700
    `,

    pending: `
      inline-flex
      items-center
      rounded-full
      bg-[#e2d1c3]/30
      px-2.5 py-1
      text-xs font-medium
      text-[#806e63]
    `,
  };

  return (
    <span
      className={
        styles[variant] || styles.domain
      }
    >
      {children}
    </span>
  );
}