"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type RegistrationRow = {
  id: string;
  created_at: string;
  institution_name: string | null;
  contact_name: string | null;
  email: string | null;
  institution_type: string | null;
  message: string | null;
  source: "website" | "seed";
};

type UiRow = RegistrationRow & { _local?: boolean };

const PAGE_SIZE = 100;
const EXPORT_BATCH_SIZE = 1000;

const HIDDEN_KEY = "admin_hidden_registration_ids_v1";

function csvEscape(value: unknown) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  const needsQuotes = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function loadHiddenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function saveHiddenIds(set: Set<string>) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(set)));
}

export default function AdminRegistrationsPage() {
  // DB rows
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [total, setTotal] = useState(0);

  // UI-only local test rows (never saved to Supabase)
  const [localRows, setLocalRows] = useState<UiRow[]>([]);

  // Hidden DB ids (UI only)
  const [hiddenDbIds, setHiddenDbIds] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Filters and UI State ---
  const [q, setQ] = useState("");
  const [institutionType, setInstitutionType] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "website" | "seed">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  // --- Exporting Data State ---
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // --- Local Testing Registration Form State ---
  const [showAdd, setShowAdd] = useState(false);
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newInstitutionType, setNewInstitutionType] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState<UiRow | null>(null);

  const [reloadTick, setReloadTick] = useState(0);

  // selection (works for both local + db rows currently visible)
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  // load hidden ids once
  useEffect(() => {
    setHiddenDbIds(loadHiddenIds());
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, institutionType, sourceFilter, sort]);

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

  function applyFilters(query: any) {
    if (institutionType !== "all") query = query.eq("institution_type", institutionType);
    if (sourceFilter !== "all") query = query.eq("source", sourceFilter);
    const term = q.trim();
    if (term) query = query.or(buildSearchOr(term));
    return query;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("registrations")
        .select(
          "id, created_at, institution_name, contact_name, email, institution_type, message, source",
          { count: "exact" }
        );

      query = applyFilters(query);
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

      // clear selection on reload
      setSelected({});
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, q, institutionType, sourceFilter, sort, reloadTick]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.institution_type && set.add(r.institution_type));
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  // visible DB rows (hide locally)
  const visibleDbRows: UiRow[] = useMemo(() => {
    return rows.filter((r) => !hiddenDbIds.has(r.id));
  }, [rows, hiddenDbIds]);

  // show local rows only on page 1 (so pagination stays sane)
  const visibleLocalRows: UiRow[] = useMemo(() => {
    return page === 1 ? localRows : [];
  }, [localRows, page]);

  // Combine visible DB rows with local test rows for display
  const displayRows: UiRow[] = useMemo(() => {
    return [...visibleLocalRows, ...visibleDbRows];
  }, [visibleLocalRows, visibleDbRows]);

  // Track which rows are currently selected via checkboxes
  const selectedIds = useMemo(
    () => displayRows.filter((r) => selected[r.id]).map((r) => r.id),
    [displayRows, selected]
  );

  const allSelected = displayRows.length > 0 && selectedIds.length === displayRows.length;

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

    // reset form
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
      saveHiddenIds(next);
      return next;
    });
  }

  function deleteLocalRow(id: string) {
    setLocalRows((prev) => prev.filter((r) => r.id !== id));
  }

  function deleteOrHideOne(r: UiRow) {
    if (r._local) {
      deleteLocalRow(r.id);
    } else {
      hideDbRow(r.id);
    }
    setSelected((prev) => {
      const next = { ...prev };
      delete next[r.id];
      return next;
    });
  }

  function deleteSelectedUiOnly() {
    if (selectedIds.length === 0) return;

    const ok = window.confirm(`Remove ${selectedIds.length} selected rows from the admin view? (No DB delete)`);
    if (!ok) return;

    const selectedSet = new Set(selectedIds);

    // local rows: really remove from local list
    setLocalRows((prev) => prev.filter((r) => !selectedSet.has(r.id)));

    // db rows: hide
    setHiddenDbIds((prev) => {
      const next = new Set(prev);
      for (const r of displayRows) {
        if (!r._local && selectedSet.has(r.id)) next.add(r.id);
      }
      saveHiddenIds(next);
      return next;
    });

    setSelected({});
  }

  function resetHiddenDb() {
    const ok = window.confirm("Unhide all hidden DB registrations in the admin view?");
    if (!ok) return;
    const empty = new Set<string>();
    saveHiddenIds(empty);
    setHiddenDbIds(empty);
  }

  async function exportCsv() {
    // Export ONLY DB rows (visible only depends on filters, not hidden list)
    setExporting(true);
    setExportError(null);

    try {
      const all: RegistrationRow[] = [];
      let offset = 0;

      while (true) {
        let query = supabase
          .from("registrations")
          .select("id, created_at, institution_name, contact_name, email, institution_type, message, source")
          .order("created_at", { ascending: sort === "oldest" })
          .range(offset, offset + EXPORT_BATCH_SIZE - 1);

        query = applyFilters(query);

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const batch = (data as RegistrationRow[]) ?? [];
        all.push(...batch);

        if (batch.length < EXPORT_BATCH_SIZE) break;
        offset += EXPORT_BATCH_SIZE;
      }

      // apply local "hidden" on export too (optional; makes export match admin view)
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

  return (
    <div className="space-y-6">
      {/* Line 1: Header and Summary Statistics */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Registrations</h1>
          <p className="text-sm opacity-70">
            {loading ? "Loading…" : `${total} in database · ${localRows.length} local test rows`}
          </p>
          <p className="text-xs opacity-60">
            “Delete” here means remove from admin view only. Database is not modified.
          </p>
        </div>
      </div>

      {/* Line 2: Search and Filter Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search Input */}
        <input
          className="w-full sm:w-72 rounded-md border px-3 py-2"
          placeholder="Search name, email, institution…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {/* Institution Type Filter */}
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

        {/* Source Filter (Website vs Seed) */}
        <select
          className="w-full sm:w-44 rounded-md border px-3 py-2"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as any)}
        >
          <option value="all">All sources</option>
          <option value="website">Website</option>
          <option value="seed">Seed</option>
        </select>

        {/* Sort Order */}
        <select
          className="w-full sm:w-40 rounded-md border px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Line 3: Action Buttons (Local Testing and Export) */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Toggle Add Local Registration Form */}
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? "Close" : "Add (local)"}
        </button>

        {/* Bulk Add Demo Rows for UI Testing */}
        <button className="rounded-md border px-3 py-2 text-sm" onClick={addLocalDemoRows}>
          Add demo rows (local)
        </button>

        {/* Batch Delete (Hide) Selected Rows */}
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={deleteSelectedUiOnly}
          disabled={selectedIds.length === 0 || loading}
          title={selectedIds.length === 0 ? "Select rows first" : ""}
        >
          Delete selected ({selectedIds.length})
        </button>

        {/* Export Visible Data to CSV */}
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={exportCsv}
          disabled={exporting || loading}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>

        {/* Restore All Hidden Database Rows */}
        {/* <button className="rounded-md border px-3 py-2 text-sm" onClick={resetHiddenDb}>
          Unhide all
        </button> */}
      </div>

      {showAdd ? (
        <div className="rounded-md border p-4 space-y-3">
          <div className="text-sm font-medium">Add local test registration (not saved to Supabase)</div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Institution name *"
              value={newInstitutionName}
              onChange={(e) => setNewInstitutionName(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Institution type *"
              value={newInstitutionType}
              onChange={(e) => setNewInstitutionType(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Contact name *"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Email *"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <textarea
            className="w-full min-h-[90px] rounded-md border p-3 text-sm"
            placeholder="Message (optional)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button className="rounded-md bg-black text-white px-4 py-2 text-sm" onClick={addLocalRegistration}>
            Add to admin view
          </button>
        </div>
      ) : null}

      {exportError ? <div className="text-sm text-red-600">Export error: {exportError}</div> : null}
      {errorMsg ? <div className="text-sm text-red-600">Error: {errorMsg}</div> : null}

      <div className="rounded-md border overflow-x-auto">
        <table className=" w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left font-medium px-3 py-2 w-[52px]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={displayRows.length === 0 || loading}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left font-medium px-3 py-2 w-[220px]">Institution</th>
              <th className="text-left font-medium px-3 py-2 w-[180px]">Contact</th>
              <th className="text-left font-medium px-3 py-2 w-[240px]">Email</th>
              <th className="text-left font-medium px-3 py-2 w-[140px]">Type</th>
              <th className="text-left font-medium px-3 py-2 w-[110px]">Source</th>
              <th className="text-left font-medium px-3 py-2">Message</th>
              <th className="text-left font-medium px-3 py-2 w-[160px]">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={8}>
                  Loading…
                </td>
              </tr>
            ) : displayRows.length === 0 ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={8}>
                  No results.
                </td>
              </tr>
            ) : (
              displayRows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={!!selected[r.id]}
                      onChange={() => toggleOne(r.id)}
                      aria-label="Select row"
                    />
                  </td>

                  <td className="px-3 py-2">
                    {r.institution_name ?? <span className="opacity-50">—</span>}
                    {r._local ? (
                      <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
                        local
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">{r.contact_name ?? <span className="opacity-50">—</span>}</td>
                  <td className="px-3 py-2">
                    {r.email ? (
                      <a className="underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    ) : (
                      <span className="opacity-50">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.institution_type ?? <span className="opacity-50">—</span>}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                      {r.source}
                    </span>
                  </td>
                  <td 
                    className="px-3 py-2 max-w-[380px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedRow(r)}
                    title="Click to view full details"
                  >
                    <div className="line-clamp-2">{r.message ?? <span className="opacity-50">—</span>}</div>
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs opacity-70">Page {page} of {totalPages}</p>

        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Prev
          </button>
          <button
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>

      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-800">Registration Details</h3>
              <button 
                onClick={() => setSelectedRow(null)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Email-like Header Section */}
              <div className="space-y-3 border-b pb-6">
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Institution:</span>
                  <span className="text-gray-900 font-semibold">{selectedRow.institution_name || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Contact:</span>
                  <span className="text-gray-900">{selectedRow.contact_name || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Email:</span>
                  {selectedRow.email ? (
                    <a href={`mailto:${selectedRow.email}`} className="text-blue-600 hover:underline">
                      {selectedRow.email}
                    </a>
                  ) : (
                    <span className="text-gray-900">—</span>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Type:</span>
                  <span className="text-gray-900 capitalize">{selectedRow.institution_type || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Source:</span>
                  <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700">
                    {selectedRow.source}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Submitted:</span>
                  <span className="text-gray-600 text-sm">
                    {new Date(selectedRow.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-2">
                <h4 className="text-gray-500 font-medium">Message:</h4>
                <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {selectedRow.message || <span className="text-gray-400 italic">No message provided</span>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setSelectedRow(null)}
                className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
