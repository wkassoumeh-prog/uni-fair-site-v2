"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Copy } from "@/content/copy.en";
import Sponsors from "@/components/Sponsors";
import {
  isSponsorsSectionHidden,
  SPONSORS_SECTION_HIDDEN_KEY,
} from "@/lib/cms/sponsorsSectionVisibility";

type GateState = "loading" | "show" | "hide";

export default function SponsorsSectionGate({ copy }: { copy: Copy }) {
  const [gate, setGate] = useState<GateState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("value")
        .eq("key", SPONSORS_SECTION_HIDDEN_KEY)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setGate("show");
        return;
      }

      setGate(isSponsorsSectionHidden(data?.value) ? "hide" : "show");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (gate === "loading" || gate === "hide") return null;
  return <Sponsors copy={copy} />;
}
