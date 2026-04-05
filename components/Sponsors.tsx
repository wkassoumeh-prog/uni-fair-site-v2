"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Copy } from "@/content/copy.en";

type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

interface SponsorsProps {
  copy: Copy;
}

function sponsorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hasLogoUrl(url: string | null | undefined): boolean {
  return Boolean(url?.trim());
}

const logoSlotClassName =
  "h-16 sm:h-20 md:h-24 lg:h-32 w-full min-h-[4rem] max-w-full sm:max-w-[120px] md:max-w-[140px] lg:max-w-[160px]";

export default function Sponsors({ copy }: SponsorsProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await supabase
          .from("sponsors")
          .select("id, name, logo_url, website_url")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!cancelled) setSponsors((data as Sponsor[]) ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="sponsors" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-bold tracking-wider uppercase text-base md:text-lg mb-4 block">
            {copy.sponsors.badge}
          </span>
          <h2 className="text-4xl font-bold text-blue-900 mb-6">{copy.sponsors.title}</h2>
          <p className="text-lg text-slate-600">
            {copy.sponsors.description}
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-dashed border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex justify-center">
                  <div className={`${logoSlotClassName} bg-slate-200 rounded-lg`} aria-hidden />
                </div>
              ))
            ) : sponsors.length === 0 ? (
              <div className="col-span-2 md:col-span-4 text-center text-slate-500 py-8">
                {copy.sponsors.emptyList}
              </div>
            ) : (
              sponsors.map((s) => {
                const logoUrl = s.logo_url;
                const logo = hasLogoUrl(logoUrl) ? (
                  <img
                    src={logoUrl!}
                    alt={s.name}
                    title={s.name}
                    className={`${logoSlotClassName} w-auto object-contain`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`${logoSlotClassName} flex items-center justify-center rounded-lg bg-slate-200/90 text-blue-900 font-semibold text-sm sm:text-base md:text-lg tabular-nums`}
                    aria-hidden
                  >
                    {sponsorInitials(s.name)}
                  </div>
                );

                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 min-h-[5rem]">
                    {s.website_url ? (
                      <a
                        href={s.website_url}
                        target="_blank"
                        rel="noreferrer"
                        title={s.name}
                        className="flex justify-center"
                      >
                        {logo}
                      </a>
                    ) : (
                      <div className="flex justify-center">{logo}</div>
                    )}

                    <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl text-blue-900 text-center">
                      {s.name}
                    </h2>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
