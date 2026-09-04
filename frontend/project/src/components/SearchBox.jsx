import { Search } from 'lucide-react';

export default function SearchBox({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}) {
  return (
    <div className="flex gap-2">

      <div className="relative flex-1">

        <Search
          className="
            absolute left-3 top-1/2
            h-4 w-4
            -translate-y-1/2
            text-[#9b877b]
          "
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            rounded-xl
            border border-[#4a3931]/15
            bg-[#fdfcfb]
            px-3 py-2.5 pl-10
            text-sm text-[#4a3931]
            outline-none
            placeholder:text-[#9b877b]
            transition
            focus:border-[#4a3931]/40
            focus:ring-2
            focus:ring-[#e2d1c3]
          "
        />

      </div>

      {onSearch && (
        <button
          type="button"
          onClick={onSearch}
          className="
            inline-flex
            items-center justify-center
            rounded-xl
            bg-[#4a3931]
            px-5 py-2.5
            text-sm font-semibold
            text-[#fdfcfb]
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:bg-[#5b463c]
          "
        >
          Search
        </button>
      )}

    </div>
  );
}