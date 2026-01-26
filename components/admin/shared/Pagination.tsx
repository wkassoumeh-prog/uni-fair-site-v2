/**
 * Reusable pagination component for admin tables
 */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, loading, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs opacity-70">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
        >
          Prev
        </button>
        <button
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
