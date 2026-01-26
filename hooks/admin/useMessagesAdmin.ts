/**
 * Custom hook for managing messages admin page state and logic
 * Handles data fetching, filtering, pagination, selection, and status updates
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { csvEscape, downloadTextFile } from "@/components/admin/shared/utils";

// ============================================================================
// TYPES
// ============================================================================

export type MsgRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "archived";
  source: "website" | "seed";
  resend_message_id: string | null;
};

const PAGE_SIZE = 20;
const EXPORT_BATCH_SIZE = 1000;

// ============================================================================
// HOOK
// ============================================================================

export function useMessagesAdmin() {
  // ========================================================================
  // STATE
  // ========================================================================

  // Data state
  const [rows, setRows] = useState<MsgRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter and pagination state
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | MsgRow["status"]>("all");
  const [source, setSource] = useState<"all" | MsgRow["source"]>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  // UI state
  const [selectedMsg, setSelectedMsg] = useState<MsgRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  // Bulk selection state
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  // Get array of selected message IDs
  const selectedIds = useMemo(
    () => rows.filter((r) => selected[r.id]).map((r) => r.id),
    [rows, selected]
  );

  // Check if all visible rows are selected
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [q, status, source, sort]);

  // Load messages when filters, pagination, or reload trigger changes
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
          `name.ilike.${pattern}`,
          `email.ilike.${pattern}`,
          `subject.ilike.${pattern}`,
          `message.ilike.${pattern}`,
        ].join(",");
      }

      // Apply filters
      let query = supabase
        .from("contact_messages")
        .select("id, created_at, name, email, subject, message, status, source, resend_message_id", {
          count: "exact",
        });

      if (status !== "all") query = query.eq("status", status);
      if (source !== "all") query = query.eq("source", source);
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
        setRows((data as MsgRow[]) ?? []);
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
  }, [page, q, status, source, sort, reloadTick]);

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

  async function setRowStatus(id: string, next: MsgRow["status"]) {
    setErrorMsg(null);
    const { error } = await supabase.from("contact_messages").update({ status: next }).eq("id", id);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
      // Update selectedMsg if it's the same message
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev));
      }
    }
  }

  async function setBulkStatus(next: MsgRow["status"]) {
    if (selectedIds.length === 0) return;

    setErrorMsg(null);
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: next })
      .in("id", selectedIds);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setRows((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: next } : r))
      );
      // Update selectedMsg if it's in the selection
      if (selectedMsg && selectedIds.includes(selectedMsg.id)) {
        setSelectedMsg((prev) => (prev ? { ...prev, status: next } : prev));
      }
      setSelected({});
      setReloadTick((t) => t + 1);
    }
  }

  async function addMessageSeed() {
    if (!newMessage.trim()) {
      setErrorMsg("Message is required.");
      return;
    }

    setSavingNew(true);
    setErrorMsg(null);

    const payload = {
      name: newName.trim() || null,
      email: newEmail.trim() || null,
      subject: newSubject.trim() || null,
      message: newMessage.trim(),
      status: "new",
      source: "seed" as const,
    };

    const { error } = await supabase.from("contact_messages").insert(payload);

    if (error) {
      setErrorMsg(error.message);
      setSavingNew(false);
      return;
    }

    setNewName("");
    setNewEmail("");
    setNewSubject("");
    setNewMessage("");
    setShowAdd(false);
    setSavingNew(false);

    setReloadTick((t) => t + 1);
  }

  async function deleteMessage(id: string) {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;

    setDeletingId(id);
    setErrorMsg(null);

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) setErrorMsg(error.message);

    setDeletingId(null);
    setReloadTick((t) => t + 1);
  }

  async function deleteSelected() {
    if (selectedIds.length === 0) return;

    const ok = window.confirm(`Delete ${selectedIds.length} selected message(s)?`);
    if (!ok) return;

    setErrorMsg(null);
    const { error } = await supabase.from("contact_messages").delete().in("id", selectedIds);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSelected({});
      setReloadTick((t) => t + 1);
    }
  }

  async function exportCsv() {
    setExporting(true);
    setExportError(null);

    try {
      const all: MsgRow[] = [];
      let offset = 0;

      function buildSearchOr(term: string) {
        const escaped = term.replace(/%/g, "\\%").replace(/_/g, "\\_");
        const pattern = `%${escaped}%`;
        return [
          `name.ilike.${pattern}`,
          `email.ilike.${pattern}`,
          `subject.ilike.${pattern}`,
          `message.ilike.${pattern}`,
        ].join(",");
      }

      while (true) {
        let query = supabase
          .from("contact_messages")
          .select("id, created_at, name, email, subject, message, status, source, resend_message_id")
          .order("created_at", { ascending: sort === "oldest" })
          .range(offset, offset + EXPORT_BATCH_SIZE - 1);

        if (status !== "all") query = query.eq("status", status);
        if (source !== "all") query = query.eq("source", source);
        const term = q.trim();
        if (term) query = query.or(buildSearchOr(term));

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const batch = (data as MsgRow[]) ?? [];
        all.push(...batch);

        if (batch.length < EXPORT_BATCH_SIZE) break;
        offset += EXPORT_BATCH_SIZE;
      }

      const headers = [
        "created_at",
        "name",
        "email",
        "subject",
        "message",
        "status",
        "source",
        "resend_message_id",
        "id",
      ] as const;

      const lines: string[] = [];
      lines.push(headers.join(","));

      for (const r of all) {
        lines.push(headers.map((h) => csvEscape((r as any)[h])).join(","));
      }

      const date = new Date().toISOString().slice(0, 10);
      downloadTextFile(`contact_messages_${date}.csv`, lines.join("\r\n"), "text/csv");
    } catch (e: any) {
      setExportError(e?.message ?? "Export failed");
    } finally {
      setExporting(false);
    }
  }

  // Determine bulk status toggle target
  const bulkStatusTarget = useMemo<"new" | "read" | null>(() => {
    if (selectedIds.length === 0) return null;
    const selectedRows = rows.filter((r) => selectedIds.includes(r.id));
    const allRead = selectedRows.length > 0 && selectedRows.every((r) => r.status === "read");
    return allRead ? ("new" as const) : ("read" as const);
  }, [rows, selectedIds]);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    // Data
    rows,
    total,
    loading,
    errorMsg,
    exportError,

    // Filters
    q,
    setQ,
    status,
    setStatus,
    source,
    setSource,
    sort,
    setSort,

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
    addMessageSeed,
    deleteMessage,
    deleteSelected,
    setRowStatus,
    setBulkStatus,
    bulkStatusTarget,
    exportCsv,
    exporting,
    deletingId,

    // Form state
    newName,
    setNewName,
    newEmail,
    setNewEmail,
    newSubject,
    setNewSubject,
    newMessage,
    setNewMessage,
    savingNew,

    // Modal
    selectedMsg,
    setSelectedMsg,
  };
}
