/**
 * Filters component for registrations admin page
 */
type FiltersProps = {
  q: string;
  setQ: (q: string) => void;
  institutionType: string;
  setInstitutionType: (type: string) => void;
  sourceFilter: "all" | "website" | "seed";
  setSourceFilter: (filter: "all" | "website" | "seed") => void;
  sort: "newest" | "oldest";
  setSort: (sort: "newest" | "oldest") => void;
  typeOptions: string[];
};

export default function Filters({
  q,
  setQ,
  institutionType,
  setInstitutionType,
  sourceFilter,
  setSourceFilter,
  sort,
  setSort,
  typeOptions,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center" data-section="filters">
      <input
        className="w-full sm:w-72 rounded-md border px-3 py-2"
        placeholder="Search name, email, institution…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="w-full sm:w-48 rounded-md border px-3 py-2"
        value={institutionType}
        onChange={(e) => setInstitutionType(e.target.value)}
      >
        {typeOptions.map((t) => (
          <option key={t} value={t}>
            {t === "all" ? "All types" : t}
          </option>
        ))}
      </select>

      <select
        className="w-full sm:w-44 rounded-md border px-3 py-2"
        value={sourceFilter}
        onChange={(e) => setSourceFilter(e.target.value as any)}
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
