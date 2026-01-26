/**
 * Shared utility functions for admin components
 */

/**
 * Escapes CSV values by wrapping in quotes if needed and escaping internal quotes
 */
export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  const needsQuotes = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

/**
 * Triggers a browser download of a text file
 */
export function downloadTextFile(filename: string, content: string, mime = "text/plain"): void {
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

/**
 * Loads hidden IDs from localStorage
 */
export function loadHiddenIds(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

/**
 * Saves hidden IDs to localStorage
 */
export function saveHiddenIds(key: string, set: Set<string>): void {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}
