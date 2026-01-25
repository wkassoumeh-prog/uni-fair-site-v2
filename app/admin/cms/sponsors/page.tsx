"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type SponsorRow = {
  id: string;
  created_at: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  published: boolean;
  source: "seed" | "website";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SponsorsCmsPage() {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  // Data state
  const [rows, setRows] = useState<SponsorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add form state
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(100);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Bulk selection state
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  // Get array of selected sponsor IDs
  const selectedIds = useMemo(
    () => rows.filter((r) => selected[r.id]).map((r) => r.id),
    [rows, selected]
  );

  // Check if all visible rows are selected
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Load sponsors on mount
  useEffect(() => {
    load();
  }, []);

  // ========================================================================
  // DATA LOADING
  // ========================================================================

  /**
   * Loads all sponsors from the database, ordered by sort_order then created_at
   */
  async function load() {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("sponsors")
      .select("id, created_at, name, logo_url, website_url, sort_order, published, source")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMsg(error.message);
      setRows([]);
      setSelected({});
    } else {
      setRows((data as SponsorRow[]) ?? []);
      setSelected({});
    }

    setLoading(false);
  }

  // ========================================================================
  // SELECTION FUNCTIONS
  // ========================================================================

  /**
   * Toggle selection of a single sponsor
   */
  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  /**
   * Toggle selection of all sponsors
   */
  function toggleAll() {
    setSelected(() => {
      if (allSelected) return {};
      const next: Record<string, boolean> = {};
      rows.forEach((r) => (next[r.id] = true));
      return next;
    });
  }

  // ========================================================================
  // CRUD OPERATIONS
  // ========================================================================

  /**
   * Adds a new sponsor to the database
   */
  async function addSponsor() {
    setSaving(true);
    setMsg(null);
    setErrorMsg(null);

    const payload = {
      name: name.trim(),
      logo_url: logoUrl.trim(),
      website_url: websiteUrl.trim() || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 100,
      published,
      source: "seed" as const,
    };

    if (!payload.name || !payload.logo_url) {
      setErrorMsg("Name and Logo URL are required.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("sponsors").insert(payload);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMsg("Added.");
      setName("");
      setLogoUrl("");
      setWebsiteUrl("");
      setSortOrder(100);
      setPublished(true);
      await load();
    }

    setSaving(false);
  }

  /**
   * Updates a sponsor's fields in the database
   */
  async function updateSponsor(id: string, patch: Partial<SponsorRow>) {
    setMsg(null);
    setErrorMsg(null);

    const { error } = await supabase.from("sponsors").update(patch).eq("id", id);

    if (error) setErrorMsg(error.message);
    else {
      setMsg("Saved.");
      setRows((prev) => prev.map((r) => (r.id === id ? ({ ...r, ...patch } as SponsorRow) : r)));
    }
  }

  /**
   * Deletes a single sponsor from the database
   */
  async function removeSponsor(id: string) {
    const ok = window.confirm("Delete this sponsor?");
    if (!ok) return;

    setMsg(null);
    setErrorMsg(null);

    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) setErrorMsg(error.message);
    else {
      setMsg("Deleted.");
      setRows((prev) => prev.filter((r) => r.id !== id));
      setSelected((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }

  /**
   * Seeds sponsors from the sponsors_examples table
   * @param replace - If true, replaces all existing sponsors; if false, merges (upserts)
   */
  async function seedFromExamples({ replace }: { replace: boolean }) {
    setSeeding(true);
    setMsg(null);
    setErrorMsg(null);

    // 1) Fetch examples from sponsors_examples table
    const { data: examples, error: exErr } = await supabase
      .from("sponsors_examples")
      .select("name, logo_url, website_url, sort_order, published");

    if (exErr) {
      setErrorMsg(exErr.message);
      setSeeding(false);
      return;
    }

    const rowsToInsert =
      (examples ?? []).map((x: any) => ({
        name: x.name,
        logo_url: x.logo_url,
        website_url: x.website_url,
        sort_order: x.sort_order,
        published: x.published,
        source: "seed" as const,
      })) ?? [];

    if (rowsToInsert.length === 0) {
      setMsg("No example sponsors found in sponsors_examples.");
      setSeeding(false);
      return;
    }

    // 2) Optional: replace the sponsors table completely
    if (replace) {
      const ok = window.confirm("Replace ALL sponsors with the example list?");
      if (!ok) {
        setSeeding(false);
        return;
      }
      const { error: delErr } = await supabase.from("sponsors").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (delErr) {
        setErrorMsg(delErr.message);
        setSeeding(false);
        return;
      }
    }

    // 3) Upsert by unique(name) - merges if name exists, inserts if new
    const { error: upErr } = await supabase
      .from("sponsors")
      .upsert(rowsToInsert, { onConflict: "name" });

    if (upErr) setErrorMsg(upErr.message);
    else setMsg(replace ? "Replaced sponsors with examples." : "Seeded examples into sponsors.");

    await load();
    setSeeding(false);
  }

  /**
   * Deletes multiple selected sponsors (bulk operation)
   */
  async function deleteSelected() {
    if (selectedIds.length === 0) return;

    const ok = window.confirm(`Delete ${selectedIds.length} sponsor(s)?`);
    if (!ok) return;

    setMsg(null);
    setErrorMsg(null);

    const { error } = await supabase.from("sponsors").delete().in("id", selectedIds);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMsg(`Deleted ${selectedIds.length}.`);
      setSelected({});
      await load();
    }
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-semibold">CMS — Sponsors</h1>
        <p className="text-sm opacity-70">Add/edit sponsors and media partners.</p>
      </div>

      {/* Add Sponsor Form */}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
            onClick={addSponsor}
            disabled={saving}
          >
            {saving ? "Saving…" : "Add"}
          </button>

          <button
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
            onClick={() => seedFromExamples({ replace: false })}
            disabled={seeding}
          >
            {seeding ? "Seeding…" : "Seed examples (merge)"}
          </button>

          <button
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
            onClick={() => seedFromExamples({ replace: true })}
            disabled={seeding}
          >
            {seeding ? "Seeding…" : "Seed examples (replace)"}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {msg ? <div className="text-sm text-green-700">{msg}</div> : null}
      {errorMsg ? <div className="text-sm text-red-600">Error: {errorMsg}</div> : null}

      {/* Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-70">Selected: {selectedIds.length}</div>

        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            onClick={toggleAll}
            disabled={rows.length === 0}
          >
            {allSelected ? "Unselect all" : "Select all"}
          </button>

          <button
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete selected
          </button>
        </div>
      </div>

      {/* Sponsors Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left font-medium px-3 py-2 w-[52px]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={rows.length === 0}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left font-medium px-3 py-2 w-[220px]">Name</th>
              <th className="text-left font-medium px-3 py-2 w-[320px]">Logo URL</th>
              <th className="text-left font-medium px-3 py-2 w-[260px]">Website</th>
              <th className="text-left font-medium px-3 py-2 w-[120px]">Sort</th>
              <th className="text-left font-medium px-3 py-2 w-[120px]">Published</th>
              <th className="text-left font-medium px-3 py-2 w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={7}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={7}>
                  No sponsors yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 align-top">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={!!selected[r.id]}
                      onChange={() => toggleOne(r.id)}
                      aria-label={`Select ${r.name}`}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full rounded-md border px-2 py-1"
                      value={r.name}
                      onChange={(e) => updateSponsor(r.id, { name: e.target.value })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full rounded-md border px-2 py-1"
                      value={r.logo_url}
                      onChange={(e) => updateSponsor(r.id, { logo_url: e.target.value })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full rounded-md border px-2 py-1"
                      value={r.website_url ?? ""}
                      onChange={(e) => updateSponsor(r.id, { website_url: e.target.value || null })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-24 rounded-md border px-2 py-1"
                      value={r.sort_order}
                      onChange={(e) =>
                        updateSponsor(r.id, { sort_order: parseInt(e.target.value || "100", 10) })
                      }
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={r.published}
                      onChange={(e) => updateSponsor(r.id, { published: e.target.checked })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <button className="rounded-md border px-2 py-1 text-xs" onClick={() => removeSponsor(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Text */}
      <p className="text-xs opacity-60">
        Tip: set <span className="font-mono">sort_order</span> to control ordering (lower appears first).
      </p>
    </div>
  );
}
