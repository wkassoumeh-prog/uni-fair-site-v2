/**
 * Custom hook for managing sponsors admin page state and logic
 * Handles data fetching, CRUD operations, selection, and seeding
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

// ============================================================================
// TYPES
// ============================================================================

export type SponsorRow = {
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
// HOOK
// ============================================================================

export function useSponsorsAdmin() {
  // ========================================================================
  // STATE
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

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

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
  // RETURN
  // ========================================================================

  return {
    // Data
    rows,
    loading,
    msg,
    errorMsg,

    // Selection
    selected,
    selectedIds,
    allSelected,
    toggleOne,
    toggleAll,

    // Form state
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

    // Actions
    addSponsor,
    updateSponsor,
    removeSponsor,
    seedFromExamples,
    deleteSelected,
  };
}
