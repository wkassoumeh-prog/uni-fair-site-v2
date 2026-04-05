/**
 * Pre-flight check for Next.js .next/build-manifest.json readability.
 * Maps to debug hypotheses H1–H6 (missing file, lock, cloud, corrupt cache, contention, port busy).
 */
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST = path.join(ROOT, ".next", "build-manifest.json");

const ENDPOINT =
  "http://127.0.0.1:7468/ingest/3dc7556d-6828-4a40-aad8-80fc4239cfd8";
const LOG_FILE = path.join(ROOT, "debug-a3c27b.log");
const SESSION = "a3c27b";

function emit(payload) {
  const line = JSON.stringify({
    sessionId: SESSION,
    timestamp: Date.now(),
    runId: process.env.DEBUG_RUN_ID || "diagnose",
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

const exists = fs.existsSync(MANIFEST);
let stat = null;
let openError = null;
let sample = null;

if (exists) {
  try {
    stat = fs.statSync(MANIFEST);
  } catch (e) {
    openError = { phase: "stat", message: String(e?.message || e), code: e?.code };
  }
  if (!openError) {
    try {
      const fd = fs.openSync(MANIFEST, "r");
      const buf = Buffer.alloc(200);
      const n = fs.readSync(fd, buf, 0, 200, 0);
      fs.closeSync(fd);
      sample = buf.slice(0, n).toString("utf8");
    } catch (e) {
      openError = { phase: "openRead", message: String(e?.message || e), code: e?.code, errno: e?.errno };
    }
  }
} else {
  openError = { phase: "missing", message: "build-manifest.json does not exist" };
}

emit({
  location: "diagnose-next-manifest.mjs:exists",
  message: "build-manifest presence",
  hypothesisId: "H1",
  data: { exists, path: MANIFEST },
});

emit({
  location: "diagnose-next-manifest.mjs:stat",
  message: "build-manifest stat or read",
  hypothesisId: "H3",
  data: stat
    ? { size: stat.size, mtimeMs: stat.mtimeMs, mode: stat.mode }
    : { stat: null },
});

emit({
  location: "diagnose-next-manifest.mjs:open",
  message: "open+read first 200 bytes",
  hypothesisId: "H4",
  data: openError
    ? { ok: false, error: openError }
    : { ok: true, samplePrefix: sample?.slice(0, 80) },
});

/** H6: default Next dev port already bound (often a second next dev → .next contention). */
function portBusy(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", (e) =>
      resolve({ busy: e.code === "EADDRINUSE", code: e.code })
    );
    s.once("listening", () => s.close(() => resolve({ busy: false })));
    s.listen(port);
  });
}

const port3000 = await portBusy(3000);
emit({
  location: "diagnose-next-manifest.mjs:port3000",
  message: "port 3000 availability",
  hypothesisId: "H6",
  data: port3000,
});

console.log(
  exists && !openError?.phase
    ? "[diagnose] build-manifest.json OK"
    : `[diagnose] issue: ${JSON.stringify(openError || "unknown")}`
);
if (port3000.busy) {
  console.warn(
    "[diagnose] Port 3000 is in use — stop other Next dev servers (or node) to avoid UNKNOWN errno on .next files."
  );
}
