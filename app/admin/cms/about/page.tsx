"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const KEY = "about_paragraph";
const KEY_DEFAULT = "about_paragraph_default";

// Converts "<p>..</p><p>..</p>" or "<br>" into plain text with line breaks.
// Keeps formatting, removes tags.
function normalizeContent(raw: string) {
  const s = (raw ?? "").trim();
  if (!s) return "";

  const looksLikeHtml =
    /<\s*p[\s>]/i.test(s) || /<\s*br\s*\/?>/i.test(s) || /<[^>]+>/.test(s);

  if (!looksLikeHtml) return s;

  // DOMParser is available because this is a client component
  const doc = new DOMParser().parseFromString(s, "text/html");

  const ps = Array.from(doc.querySelectorAll("p"))
    .map((p) => (p.textContent ?? "").trim())
    .filter(Boolean);

  if (ps.length > 0) return ps.join("\n\n");

  // Fallback: strip all tags by using textContent
  const text = (doc.body.textContent ?? "").trim();
  return text;
}

export default function AdminContentPage() {
  const [value, setValue] = useState("");
  const [defaultValue, setDefaultValue] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);
      setMsg(null);

      const { data, error } = await supabase
        .from("content_blocks")
        .select("key, value")
        .in("key", [KEY, KEY_DEFAULT]);

      if (cancelled) return;

      if (error) {
        setErrorMsg(error.message);
        setValue("");
        setDefaultValue("");
      } else {
        const currentRaw = data?.find((x) => x.key === KEY)?.value ?? "";
        const defRaw = data?.find((x) => x.key === KEY_DEFAULT)?.value ?? "";

        setValue(normalizeContent(currentRaw));
        setDefaultValue(normalizeContent(defRaw));
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(newValue?: string) {
    setSaving(true);
    setErrorMsg(null);
    setMsg(null);

    // Always normalize before saving (prevents <p> tags being stored)
    const toSave = normalizeContent(newValue ?? value);

    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: KEY, value: toSave }, { onConflict: "key" });

    if (error) setErrorMsg(error.message);
    else {
      setValue(toSave); // keep UI consistent with what we stored
      setMsg("Saved.");
    }

    setSaving(false);
  }

  async function restoreDefault() {
    if (!defaultValue) {
      setErrorMsg(
        "No default text found. Seed about_paragraph_default in Supabase first."
      );
      return;
    }

    const restored = normalizeContent(defaultValue);

    // restore + save immediately
    setValue(restored);
    await save(restored);
    setMsg("Restored default.");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Content (CMS)</h1>
        <p className="text-sm opacity-70">Edit the About paragraph.</p>
      </div>

      {loading ? (
        <div className="rounded-md border p-4 text-sm opacity-70">Loading…</div>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium">About paragraph</label>

          <textarea
            className="w-full min-h-[180px] rounded-md border p-3 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write the About paragraph here…"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
              onClick={() => save()}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>

            <button
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
              onClick={restoreDefault}
              disabled={saving || !defaultValue}
              title={!defaultValue ? "Default not set yet" : "Restore saved default text"}
            >
              Restore default
            </button>

            {msg ? <span className="text-sm text-green-700">{msg}</span> : null}
            {errorMsg ? <span className="text-sm text-red-600">{errorMsg}</span> : null}
          </div>

          <p className="text-xs opacity-60">
            Tip: save plain text with blank lines between paragraphs (no HTML tags).
          </p>

          <p className="text-xs opacity-60">
            Keys: <span className="font-mono">{KEY}</span> /{" "}
            <span className="font-mono">{KEY_DEFAULT}</span>
          </p>
        </div>
      )}
    </div>
  );
}
