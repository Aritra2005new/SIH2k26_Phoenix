import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-[#4a3931]/30
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-full max-w-lg
          overflow-hidden
          rounded-2xl
          border border-[#4a3931]/10
          bg-[#fdfcfb]
          shadow-xl
        "
      >

        {/* Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-[#4a3931]/10
            px-6 py-4
          "
        >
          <h3 className="text-lg font-semibold text-[#4a3931]">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg p-1.5
              text-[#9b877b]
              transition
              hover:bg-[#e2d1c3]/40
              hover:text-[#4a3931]
            "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

      </div>
    </div>
  );
}