import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {visible.map((page, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-accent text-white'
                  : 'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-accent hover:text-accent'
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
