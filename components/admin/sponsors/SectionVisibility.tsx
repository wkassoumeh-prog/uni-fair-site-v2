"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  isSponsorsSectionHidden,
  SPONSORS_SECTION_HIDDEN_KEY,
} from "@/lib/cms/sponsorsSectionVisibility";

export default function SectionVisibility() {
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("content_blocks")
        .select("value")
        .eq("key", SPONSORS_SECTION_HIDDEN_KEY)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setErrorMsg(error.message);
        setHidden(false);
      } else {
        setHidden(isSponsorsSectionHidden(data?.value));
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(nextHidden: boolean) {
    setSaving(true);
    setMsg(null);
    setErrorMsg(null);

    const { error } = await supabase.from("content_blocks").upsert(
      { key: SPONSORS_SECTION_HIDDEN_KEY, value: nextHidden ? "true" : "false" },
      { onConflict: "key" }
    );

    if (error) {
      setErrorMsg(error.message);
    } else {
      setHidden(nextHidden);
      setMsg("Section visibility saved.");
    }

    setSaving(false);
  }

  return (
    <div className="rounded-md border p-4 space-y-3 bg-slate-50/80">
      <div className="font-medium">Sponsors section on the website</div>
      <p className="text-sm opacity-70">
        When hidden, the whole sponsors block is removed from the public site. Individual sponsor rows are unchanged.
      </p>

      {loading ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hidden}
              disabled={saving}
              onChange={(e) => save(e.target.checked)}
            />
            Hide entire sponsors section
          </label>
          {msg ? <span className="text-sm text-green-700">{msg}</span> : null}
          {errorMsg ? <span className="text-sm text-red-600">{errorMsg}</span> : null}
        </div>
      )}
    </div>
  );
}
