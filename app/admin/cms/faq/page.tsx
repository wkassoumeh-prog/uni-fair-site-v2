"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErrorMsg(null);
    setMsg(null);

    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, sort_order, published")
      .order("sort_order", { ascending: true });

    if (error) setErrorMsg(error.message);
    else setItems((data as FaqRow[]) ?? []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveRow(row: FaqRow) {
    setBusyId(row.id);
    setErrorMsg(null);
    setMsg(null);

    const { error } = await supabase
      .from("faqs")
      .update({
        question: row.question,
        answer: row.answer,
        sort_order: row.sort_order,
        published: row.published,
      })
      .eq("id", row.id);

    if (error) setErrorMsg(error.message);
    else setMsg("Saved.");

    setBusyId(null);
  }

  async function addNew() {
    setErrorMsg(null);
    setMsg(null);

    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("faqs")
      .insert({
        question: "New question",
        answer: "New answer",
        sort_order: nextOrder,
        published: true,
      })
      .select("id, question, answer, sort_order, published")
      .single();

    if (error) setErrorMsg(error.message);
    else {
      setItems((prev) => [...prev, data as FaqRow]);
      setMsg("Added.");
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setErrorMsg(null);
    setMsg(null);

    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) setErrorMsg(error.message);
    else {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setMsg("Deleted.");
    }

    setBusyId(null);
  }

  async function move(id: string, dir: "up" | "down") {
    const idx = items.findIndex((x) => x.id === id);
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swapWith < 0 || swapWith >= items.length) return;

    const a = items[idx];
    const b = items[swapWith];

    // swap sort_order values
    const updated = items.slice();
    updated[idx] = { ...a, sort_order: b.sort_order };
    updated[swapWith] = { ...b, sort_order: a.sort_order };

    setItems(updated);

    // persist both updates
    setBusyId(id);
    setErrorMsg(null);
    setMsg(null);

    const { error: e1 } = await supabase.from("faqs").update({ sort_order: updated[idx].sort_order }).eq("id", a.id);
    const { error: e2 } = await supabase.from("faqs").update({ sort_order: updated[swapWith].sort_order }).eq("id", b.id);

    if (e1 || e2) setErrorMsg((e1 ?? e2)!.message);
    else setMsg("Reordered.");

    setBusyId(null);
    // reload to ensure consistent ordering
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">FAQs</h1>
          <p className="text-sm opacity-70">Edit questions, answers, publish, and reorder.</p>
        </div>

        <button className="rounded-md bg-black text-white px-4 py-2 text-sm" onClick={addNew}>
          + Add FAQ
        </button>
      </div>

      {msg ? <div className="text-sm text-green-700">{msg}</div> : null}
      {errorMsg ? <div className="text-sm text-red-600">{errorMsg}</div> : null}

      {loading ? (
        <div className="rounded-md border p-4 text-sm opacity-70">Loading…</div>
      ) : (
        <div className="space-y-3">
          {items.map((row, i) => (
            <div key={row.id} className="rounded-xl border bg-white p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                    onClick={() => move(row.id, "up")}
                    disabled={i === 0 || !!busyId}
                  >
                    ↑
                  </button>
                  <button
                    className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                    onClick={() => move(row.id, "down")}
                    disabled={i === items.length - 1 || !!busyId}
                  >
                    ↓
                  </button>

                  <label className="text-sm flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      checked={row.published}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x) => (x.id === row.id ? { ...x, published: e.target.checked } : x))
                        )
                      }
                    />
                    Published
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-md bg-black text-white px-3 py-1.5 text-sm disabled:opacity-60"
                    onClick={() => saveRow(row)}
                    disabled={busyId === row.id}
                  >
                    {busyId === row.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                    onClick={() => remove(row.id)}
                    disabled={busyId === row.id}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={row.question}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === row.id ? { ...x, question: e.target.value } : x))
                    )
                  }
                />
                <textarea
                  className="w-full min-h-[90px] rounded-md border p-3 text-sm"
                  value={row.answer}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === row.id ? { ...x, answer: e.target.value } : x))
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
