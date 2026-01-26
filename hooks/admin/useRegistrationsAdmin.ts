/**
 * Custom hook for managing registrations admin page state and logic
 * Handles data fetching, filtering, pagination, selection, and local test data
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadHiddenIds, saveHiddenIds, csvEscape, downloadTextFile } from "@/components/admin/shared/utils";

// ============================================================================
// TYPES
// ============================================================================

export type RegistrationRow = {
  id: string;
  created_at: string;
  institution_name: string | null;
  contact_name: string | null;
  email: string | null;
  institution_type: string | null;
  message: string | null;
  source: "website" | "seed";
};

export type UiRow = RegistrationRow & { _local?: boolean };

const PAGE_SIZE = 100;
const EXPORT_BATCH_SIZE = 1000;
const HIDDEN_KEY = "admin_hidden_registration_ids_v1";

// ============================================================================
// HOOK
// ============================================================================

export function useRegistrationsAdmin() {
  // ========================================================================
  // STATE
  // ========================================================================

  // Data state
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [localRows, setLocalRows] = useState<UiRow[]>([]);
  const [hiddenDbIds, setHiddenDbIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter and pagination state
  const [q, setQ] = useState("");
  const [institutionType, setInstitutionType] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "website" | "seed">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Local testing form state
  const [showAdd, setShowAdd] = useState(false);
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newInstitutionType, setNewInstitutionType] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState<UiRow | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  // Bulk selection state
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  // Extract unique institution types from current rows for filter dropdown
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.institution_type && set.add(r.institution_type));
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  // Filter out hidden DB rows (these are stored in localStorage)
  const visibleDbRows: UiRow[] = useMemo(() => {
    return rows.filter((r) => !hiddenDbIds.has(r.id));
  }, [rows, hiddenDbIds]);

  // Show local test rows only on page 1 (so pagination stays sane)
  const visibleLocalRows: UiRow[] = useMemo(() => {
    return page === 1 ? localRows : [];
  }, [localRows, page]);

  // Combine visible DB rows with local test rows for display
  const displayRows: UiRow[] = useMemo(() => {
    return [...visibleLocalRows, ...visibleDbRows];
  }, [visibleLocalRows, visibleDbRows]);

  // Get array of selected row IDs
  const selectedIds = useMemo(
    () => displayRows.filter((r) => selected[r.id]).map((r) => r.id),
    [displayRows, selected]
  );

  // Check if all visible rows are selected
  const allSelected = displayRows.length > 0 && selectedIds.length === displayRows.length;

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Load hidden IDs from localStorage on mount
  useEffect(() => {
    setHiddenDbIds(loadHiddenIds(HIDDEN_KEY));
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [q, institutionType, sourceFilter, sort]);

  // Load registrations when filters, pagination, or reload trigger changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Build search OR query
      function buildSearchOr(term: string) {
        const escaped = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
        const pattern = `%${escaped}%`;
        return [
          `institution_name.ilike.${pattern}`,
          `contact_name.ilike.${pattern}`,
          `email.ilike.${pattern}`,
          `institution_type.ilike.${pattern}`,
        ].join(",");
      }

      // Apply filters
      let query = supabase
        .from("registrations")
        .select("id, created_at, institution_name, contact_name, email, institution_type, message, source", {
          count: "exact",
        });

      if (institutionType !== "all") query = query.eq("institution_type", institutionType);
      if (sourceFilter !== "all") query = query.eq("source", sourceFilter);
      const term = q.trim();
      if (term) query = query.or(buildSearchOr(term));

      query = query.order("created_at", { ascending: sort === "oldest" }).range(from, to);

      const { data, error, count } = await query;

      if (cancelled) return;

      if (error) {
        setErrorMsg(error.message);
        setRows([]);
        setTotal(0);
      } else {
        setRows((data as RegistrationRow[]) ?? []);
        setTotal(count ?? 0);
      }

      // Clear selection on reload
      setSelected({});
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, q, institutionType, sourceFilter, sort, reloadTick]);

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
      displayRows.forEach((r) => (next[r.id] = true));
      return next;
    });
  }

  // ========================================================================
  // CRUD OPERATIONS
  // ========================================================================

  function addLocalRegistration() {
    setErrorMsg(null);

    const institution_name = newInstitutionName.trim();
    const contact_name = newContactName.trim();
    const email = newEmail.trim();
    const institution_type = newInstitutionType.trim();

    if (!institution_name || !contact_name || !email || !institution_type) {
      setErrorMsg("Institution name, contact name, email, and institution type are required.");
      return;
    }

    const nowIso = new Date().toISOString();

    const newRow: UiRow = {
      id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      created_at: nowIso,
      institution_name,
      contact_name,
      email,
      institution_type,
      message: newMessage.trim() || null,
      source: "seed",
      _local: true,
    };

    setLocalRows((prev) => [newRow, ...prev]);

    // Reset form
    setNewInstitutionName("");
    setNewContactName("");
    setNewEmail("");
    setNewInstitutionType("");
    setNewMessage("");
    setShowAdd(false);
  }

  function addLocalDemoRows() {
    const now = Date.now();
    const demo: UiRow[] = [
      {
        id: `local-${now}-1`,
        created_at: new Date(now - 2 * 86400000).toISOString(),
        institution_name: "Damascus International University",
        contact_name: "Rana Al-Hassan",
        email: "rana.alhassan@example.com",
        institution_type: "Local",
        message: "Interested in a booth + scholarship corner. Please send pricing.",
        source: "seed",
        _local: true,
      },
      {
        id: `local-${now}-2`,
        created_at: new Date(now - 86400000).toISOString(),
        institution_name: "Syrian Virtual Academy",
        contact_name: "Omar Darwish",
        email: "omar.darwish@example.com",
        institution_type: "Online",
        message: "We want to present our online programs and live demo sessions.",
        source: "seed",
        _local: true,
      },
      {
        id: `local-${now}-3`,
        created_at: new Date(now - 5 * 86400000).toISOString(),
        institution_name: "Berlin Tech Institute",
        contact_name: "Mina Schreiber",
        email: "mina.schreiber@example.com",
        institution_type: "International",
        message: "We would like a joint session about studying in Germany.",
        source: "seed",
        _local: true,
      },
      {
        id: `local-${now}-4`,
        created_at: new Date(now - 7 * 86400000).toISOString(),
        institution_name: "Istanbul Language Center",
        contact_name: "Khaled Yasin",
        email: "khaled.yasin@example.com",
        institution_type: "Institute",
        message: "Need two standing banners + placement near entrance.",
        source: "seed",
        _local: true,
      },
      {
        id: `local-${now}-5`,
        created_at: new Date(now - 10 * 86400000).toISOString(),
        institution_name: "EdTech Partners MENA",
        contact_name: "Nour Al-Khatib",
        email: "nour.khatib@example.com",
        institution_type: "Online",
        message: "Can we integrate our e-learning platform into the event app?",
        source: "seed",
        _local: true,
      },
      {
        id: `local-${now}-6`,
        created_at: new Date(now - 3 * 86400000).toISOString(),
        institution_name: "Damascus Community College",
        contact_name: "Lama Fares",
        email: "lama.fares@example.com",
        institution_type: "Local",
        message: null,
        source: "seed",
        _local: true,
      },
    ];

    setLocalRows((prev) => [...demo, ...prev]);
  }

  function hideDbRow(id: string) {
    setHiddenDbIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveHiddenIds(HIDDEN_KEY, next);
      return next;
    });
  }

  function deleteLocalRow(id: string) {
    setLocalRows((prev) => prev.filter((r) => r.id !== id));
  }

  function deleteSelectedUiOnly() {
    if (selectedIds.length === 0) return;

    const ok = window.confirm(`Remove ${selectedIds.length} selected rows from the admin view? (No DB delete)`);
    if (!ok) return;

    const selectedSet = new Set(selectedIds);

    // Local rows: really remove from local list
    setLocalRows((prev) => prev.filter((r) => !selectedSet.has(r.id)));

    // DB rows: hide
    setHiddenDbIds((prev) => {
      const next = new Set(prev);
      for (const r of displayRows) {
        if (!r._local && selectedSet.has(r.id)) next.add(r.id);
      }
      saveHiddenIds(HIDDEN_KEY, next);
      return next;
    });

    setSelected({});
  }

  async function exportCsv() {
    setExporting(true);
    setExportError(null);

    try {
      const all: RegistrationRow[] = [];
      let offset = 0;

      function buildSearchOr(term: string) {
        const escaped = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
        const pattern = `%${escaped}%`;
        return [
          `institution_name.ilike.${pattern}`,
          `contact_name.ilike.${pattern}`,
          `email.ilike.${pattern}`,
          `institution_type.ilike.${pattern}`,
        ].join(",");
      }

      while (true) {
        let query = supabase
          .from("registrations")
          .select("id, created_at, institution_name, contact_name, email, institution_type, message, source")
          .order("created_at", { ascending: sort === "oldest" })
          .range(offset, offset + EXPORT_BATCH_SIZE - 1);

        if (institutionType !== "all") query = query.eq("institution_type", institutionType);
        if (sourceFilter !== "all") query = query.eq("source", sourceFilter);
        const term = q.trim();
        if (term) query = query.or(buildSearchOr(term));

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const batch = (data as RegistrationRow[]) ?? [];
        all.push(...batch);

        if (batch.length < EXPORT_BATCH_SIZE) break;
        offset += EXPORT_BATCH_SIZE;
      }

      // Apply local "hidden" on export too (optional; makes export match admin view)
      const exported = all.filter((r) => !hiddenDbIds.has(r.id));

      const headers = [
        "created_at",
        "institution_name",
        "contact_name",
        "email",
        "institution_type",
        "message",
        "source",
        "id",
      ] as const;

      const lines: string[] = [];
      lines.push(headers.join(","));

      for (const r of exported) {
        lines.push(headers.map((h) => csvEscape((r as any)[h])).join(","));
      }

      const date = new Date().toISOString().slice(0, 10);
      downloadTextFile(`registrations_${date}.csv`, lines.join("\r\n"), "text/csv");
    } catch (e: any) {
      setExportError(e?.message ?? "Export failed");
    } finally {
      setExporting(false);
    }
  }

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    // Data
    rows: displayRows,
    total,
    localRowsCount: localRows.length,
    loading,
    errorMsg,
    exportError,

    // Filters
    q,
    setQ,
    institutionType,
    setInstitutionType,
    sourceFilter,
    setSourceFilter,
    sort,
    setSort,
    typeOptions,

    // Pagination
    page,
    setPage,
    totalPages,

    // Selection
    selected,
    selectedIds,
    allSelected,
    toggleOne,
    toggleAll,

    // Actions
    showAdd,
    setShowAdd,
    addLocalRegistration,
    addLocalDemoRows,
    deleteSelectedUiOnly,
    exportCsv,
    exporting,

    // Form state
    newInstitutionName,
    setNewInstitutionName,
    newContactName,
    setNewContactName,
    newEmail,
    setNewEmail,
    newInstitutionType,
    setNewInstitutionType,
    newMessage,
    setNewMessage,

    // Modal
    selectedRow,
    setSelectedRow,
  };
}
