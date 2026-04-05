/** Stored in `content_blocks`; when true, the sponsors block is not rendered on public pages. */
export const SPONSORS_SECTION_HIDDEN_KEY = "sponsors_section_hidden";

export function isSponsorsSectionHidden(value: string | null | undefined): boolean {
  const v = (value ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}
