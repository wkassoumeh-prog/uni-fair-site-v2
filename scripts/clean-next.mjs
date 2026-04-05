/**
 * Removes .next to fix stale/corrupt Next.js cache (UNKNOWN open build-manifest on Windows).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NEXT = path.join(ROOT, ".next");

const ENDPOINT =
  "http://127.0.0.1:7468/ingest/3dc7556d-6828-4a40-aad8-80fc4239cfd8";
const SESSION = "a3c27b";
const LOG_FILE = path.join(ROOT, "debug-a3c27b.log");

function emit(payload) {
  const line = JSON.stringify({
    sessionId: SESSION,
    timestamp: Date.now(),
    runId: process.env.DEBUG_RUN_ID || "clean-next",
    ...payload,
  });
  // #region agent log
  fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION,
    },
    body: line,
  }).catch(() => {});
  // #endregion
  try {
    fs.appendFileSync(LOG_FILE, line + "\n", "utf8");
  } catch {
    /* ignore */
  }
}

try {
  if (fs.existsSync(NEXT)) {
    fs.rmSync(NEXT, { recursive: true, force: true });
    emit({
      location: "clean-next.mjs",
      message: "removed .next",
      hypothesisId: "H4",
      data: { ok: true },
    });
    console.log("[clean:next] Removed .next — run npm run dev again.");
  } else {
    emit({
      location: "clean-next.mjs",
      message: "no .next to remove",
      hypothesisId: "H4",
      data: { ok: true, skipped: true },
    });
    console.log("[clean:next] No .next folder (already clean).");
  }
} catch (e) {
  emit({
    location: "clean-next.mjs",
    message: "clean failed",
    hypothesisId: "H2",
    data: { ok: false, message: String(e?.message || e), code: e?.code },
  });
  console.error("[clean:next] Failed:", e);
  process.exit(1);
}
