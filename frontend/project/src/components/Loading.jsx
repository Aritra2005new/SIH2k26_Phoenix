export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="
          h-12 w-12
          animate-spin
          rounded-full
          border-4
          border-[#e2d1c3]
          border-t-[#4a3931]
        "
      />

      <p className="text-sm font-medium text-[#806e63]">
        {message}
      </p>
    </div>
  );
}