/**
 * Filters component for messages admin page
 */
type FiltersProps = {
  q: string;
  setQ: (q: string) => void;
  status: "all" | "new" | "read" | "archived";
  setStatus: (status: "all" | "new" | "read" | "archived") => void;
  source: "all" | "website" | "seed";
  setSource: (source: "all" | "website" | "seed") => void;
  sort: "newest" | "oldest";
  setSort: (sort: "newest" | "oldest") => void;
};

export default function Filters({ q, setQ, status, setStatus, source, setSource, sort, setSort }: FiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center" data-section="filters">
      <input
        className="w-full sm:w-72 rounded-md border px-3 py-2"
        placeholder="Search name, email, subject, message…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="w-full sm:w-40 rounded-md border px-3 py-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
      >
        <option value="all">All status</option>
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="archived">Archived</option>
      </select>

      <select
        className="w-full sm:w-40 rounded-md border px-3 py-2"
        value={source}
        onChange={(e) => setSource(e.target.value as any)}
      >
        <option value="all">All sources</option>
        <option value="website">Website</option>
        <option value="seed">Seed</option>
      </select>

      <select
        className="w-full sm:w-40 rounded-md border px-3 py-2"
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
