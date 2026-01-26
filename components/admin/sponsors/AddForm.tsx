/**
 * Form component for adding new sponsors
 */
type AddFormProps = {
  name: string;
  setName: (value: string) => void;
  logoUrl: string;
  setLogoUrl: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
  sortOrder: number;
  setSortOrder: (value: number) => void;
  published: boolean;
  setPublished: (value: boolean) => void;
  saving: boolean;
  seeding: boolean;
  onAdd: () => void;
  onSeedMerge: () => void;
  onSeedReplace: () => void;
};

export default function AddForm({
  name,
  setName,
  logoUrl,
  setLogoUrl,
  websiteUrl,
  setWebsiteUrl,
  sortOrder,
  setSortOrder,
  published,
  setPublished,
  saving,
  seeding,
  onAdd,
  onSeedMerge,
  onSeedReplace,
}: AddFormProps) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="font-medium">Add sponsor</div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Logo URL * (https://...)"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          placeholder="Website URL (optional)"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <label className="text-sm opacity-80">Sort order</label>
          <input
            type="number"
            className="w-28 rounded-md border px-3 py-2 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value || "100", 10))}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
          onClick={onAdd}
          disabled={saving}
        >
          {saving ? "Saving…" : "Add"}
        </button>

        <button
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
          onClick={onSeedMerge}
          disabled={seeding}
        >
          {seeding ? "Seeding…" : "Seed examples (merge)"}
        </button>

        <button
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
          onClick={onSeedReplace}
          disabled={seeding}
        >
          {seeding ? "Seeding…" : "Seed examples (replace)"}
        </button>
      </div>
    </div>
  );
}
