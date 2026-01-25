"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type MsgRow = {
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

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<MsgRow[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | MsgRow["status"]>("all");
  const [source, setSource] = useState<"all" | MsgRow["source"]>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const [selectedMsg, setSelectedMsg] = useState<MsgRow | null>(null);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // add/delete
  const [showAdd, setShowAdd] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  useEffect(() => {
    setPage(1);
  }, [q, status, source, sort]);

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

  function applyFilters(query: any) {
    if (status !== "all") query = query.eq("status", status);
    if (source !== "all") query = query.eq("source", source);
    const term = q.trim();
    if (term) query = query.or(buildSearchOr(term));
    return query;
  }

  async function load() {
    setLoading(true);
    setErrorMsg(null);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("contact_messages")
      .select("id, created_at, name, email, subject, message, status, source, resend_message_id", {
        count: "exact",
      });

    query = applyFilters(query);
    query = query.order("created_at", { ascending: sort === "oldest" }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      setErrorMsg(error.message);
      setRows([]);
      setTotal(0);
    } else {
      setRows((data as MsgRow[]) ?? []);
      setTotal(count ?? 0);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, status, source, sort, reloadTick]);

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

  async function exportCsv() {
    setExporting(true);
    setExportError(null);

    try {
      const all: MsgRow[] = [];
      let offset = 0;

      while (true) {
        let query = supabase
          .from("contact_messages")
          .select("id, created_at, name, email, subject, message, status, source, resend_message_id")
          .order("created_at", { ascending: sort === "oldest" })
          .range(offset, offset + EXPORT_BATCH_SIZE - 1);

        query = applyFilters(query);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contact messages</h1>
          <p className="text-sm opacity-70">{loading ? "Loading…" : `${total} total`}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? "Close" : "Add"}
          </button>

          <button
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            onClick={exportCsv}
            disabled={exporting || loading}
          >
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        </div>
      </div>

      {showAdd ? (
        <div className="rounded-md border p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Email (optional)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
              placeholder="Subject (optional)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </div>

          <textarea
            className="w-full min-h-[90px] rounded-md border p-3 text-sm"
            placeholder="Message (required)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button
            className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
            onClick={addMessageSeed}
            disabled={savingNew}
          >
            {savingNew ? "Saving…" : "Save message (seed)"}
          </button>
        </div>
      ) : null}

      {exportError ? <div className="text-sm text-red-600">Export error: {exportError}</div> : null}
      {errorMsg ? <div className="text-sm text-red-600">Error: {errorMsg}</div> : null}

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left font-medium px-3 py-2 w-[170px]">Created</th>
              <th className="text-left font-medium px-3 py-2 w-[120px]">Status</th>
              <th className="text-left font-medium px-3 py-2 w-[120px]">Source</th>
              <th className="text-left font-medium px-3 py-2 w-[180px]">Name</th>
              <th className="text-left font-medium px-3 py-2 w-[240px]">Email</th>
              <th className="text-left font-medium px-3 py-2 w-[220px]">Subject</th>
              <th className="text-left font-medium px-3 py-2">Message</th>
              <th className="text-left font-medium px-3 py-2 w-[220px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={8}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4 opacity-70" colSpan={8}>
                  No results.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 align-top">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div>{new Date(r.created_at).toLocaleDateString()}</div>
                      <div>{new Date(r.created_at).toLocaleTimeString()}</div>
                    </td>

                  <td className="px-3 py-2">
                    <span className="rounded-md border px-2 py-1 text-xs">{r.status}</span>
                  </td>

                  <td className="px-3 py-2">
                    <span className="rounded-md border px-2 py-1 text-xs">{r.source}</span>
                  </td>

                  <td className="px-3 py-2">{r.name ?? <span className="opacity-50">—</span>}</td>

                  <td className="px-3 py-2">
                    {r.email ? (
                      <a className="underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    ) : (
                      <span className="opacity-50">—</span>
                    )}
                  </td>

                  <td className="px-3 py-2">{r.subject ?? <span className="opacity-50">—</span>}</td>

                  <td 
                    className="px-3 py-2 max-w-[380px] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedMsg(r)}
                    title="Click to view full message"
                  >
                    <div className="line-clamp-2">{r.message}</div>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => setSelectedMsg(r)}
                      >
                        View
                      </button>

                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => setRowStatus(r.id, r.status === "read" ? "new" : "read")}
                      >
                        {r.status === "read" ? "Mark unread" : "Mark read"}
                      </button>

                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => setRowStatus(r.id, "archived")}
                        disabled={r.status === "archived"}
                      >
                        Archive
                      </button>

                      <button
                        className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                        onClick={() => deleteMessage(r.id)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs opacity-70">
          Page {page} of {totalPages}
        </p>
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

      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-800">Message Details</h3>
              <button 
                onClick={() => setSelectedMsg(null)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Email-like Header Section */}
              <div className="space-y-3 border-b pb-6">
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">From:</span>
                  <span className="text-gray-900 font-semibold">{selectedMsg.name || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Email:</span>
                  {selectedMsg.email ? (
                    <a href={`mailto:${selectedMsg.email}`} className="text-blue-600 hover:underline">
                      {selectedMsg.email}
                    </a>
                  ) : (
                    <span className="text-gray-900">—</span>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Subject:</span>
                  <span className="text-gray-900">{selectedMsg.subject || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Status:</span>
                  <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700 capitalize">
                    {selectedMsg.status}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Source:</span>
                  <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700 capitalize">
                    {selectedMsg.source}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 shrink-0 font-medium">Submitted:</span>
                  <span className="text-gray-600 text-sm">
                    {new Date(selectedMsg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-2">
                <h4 className="text-gray-500 font-medium">Message:</h4>
                <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {selectedMsg.message || <span className="text-gray-400 italic">No message provided</span>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between bg-gray-50 rounded-b-lg gap-3">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-white transition-colors"
                  onClick={() => {
                    const newStatus = selectedMsg.status === "read" ? "new" : "read";
                    setRowStatus(selectedMsg.id, newStatus);
                    setSelectedMsg(prev => prev ? { ...prev, status: newStatus } : null);
                  }}
                >
                  {selectedMsg.status === "read" ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
                  onClick={() => {
                    setRowStatus(selectedMsg.id, "archived");
                    setSelectedMsg(prev => prev ? { ...prev, status: "archived" } : null);
                  }}
                  disabled={selectedMsg.status === "archived"}
                >
                  Archive
                </button>
              </div>
              <button 
                onClick={() => setSelectedMsg(null)}
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
