// src/app/api/partner-status/route.js
// Partner Mode v4.3 — status endpoint (Edge).
// Changes:
// - Adds optional `wait` query param (1–30s) for Edge long‑poll.               // FIX
//   If If-None-Match matches current per‑day version, the request waits until
//   the per‑day version changes or timeout, enabling ~instant updates.
// - TIP regex expanded to allow `_ : - .` characters.                          // FIX
// - ETag now reflects the per‑day feedback version when available.             // FIX

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const TIP_RE = /^[A-Za-z0-9][A-Za-z0-9:._-]{0,63}$/;  // FIX
const DATE_RE = /^[0-9]{8}$/;

export async function GET(req) {
  const url = new URL(req.url);
  const pairId = String(url.searchParams.get('pairId') ?? '').trim();
  const ownerDateQ = String(url.searchParams.get('ownerDate') ?? '').trim();
  const waitQ = url.searchParams.get('wait');
  const waitSec = clampInt(waitQ ? Number(waitQ) : 0, 0, 30);                 // FIX

  if (!pairId) {
    return NextResponse.json({ error: 'pairId required' }, { status: 400 });
  }

  const blocked = (await redis.exists(`blocklist:${pairId}`)) === 1;
  if (blocked) {
    return NextResponse.json({ error: 'Pair disconnected' }, { status: 403 });
  }

  const stateKey = `state:${pairId}`;
  const state = await redis.hgetall(stateKey);
  const stateDate = String(state?.currentDate ?? '').trim();
  let ownerDate = DATE_RE.test(ownerDateQ)
    ? ownerDateQ
    : (DATE_RE.test(stateDate) ? stateDate : yyyymmddUTC());

  const feedbackKey = `feedback:${pairId}:${ownerDate}`;

  // derive per‑day version from feedback hash (preferred)                    // FIX
  let perDayVersion = toNum(await redis.hget(feedbackKey, 'version'), 0);
  let tipsRaw = await redis.hget(feedbackKey, 'tips');
  if (tipsRaw == null) tipsRaw = await redis.hget(feedbackKey, 'tipsJson');
  if (tipsRaw == null) tipsRaw = await redis.hget(feedbackKey, 'highlightedTips');

  // Long‑poll: wait until version changes if client sent ETag                // FIX
  const inm = req.headers.get('if-none-match');
  const clientVer = parseETagVersion(inm);
  if (waitSec > 0 && clientVer != null) {
    const deadline = Date.now() + waitSec * 1000;
    while (Date.now() < deadline) {
      const blockedNow = (await redis.exists(`blocklist:${pairId}`)) === 1;
      if (blockedNow) {
        return new Response(JSON.stringify({ error: 'Pair disconnected' }), {
          status: 403,
          headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
        });
      }
      // re-check per‑day version (fast path)
      const vNow = toNum(await redis.hget(feedbackKey, 'version'), 0);
      if (vNow !== clientVer) {
        perDayVersion = vNow;
        // break to assemble fresh response
        tipsRaw = await redis.hget(feedbackKey, 'tips') ?? tipsRaw;
        break;
      }
      // small sleep (~350ms)
      await sleep(350);
    }
  }

  const tips = safeParseJsonArray(tipsRaw).filter((k) => typeof k === 'string' && TIP_RE.test(k));

  // FIX: v4.3.3 flicker — ETag/version now strictly per-day; no fallback to state.version
  let version = perDayVersion;// ETag reflects per‑day version when available
  const etag = buildETag(version);

  // Conditional GET: no change
  const inm2 = req.headers.get('if-none-match');
  // FIX: v4.3.3 flicker — return 304 when ETag unchanged (per-day)
  if (inm2 && sameETag(inm2, etag)) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (tips.length === 0) {
    console.log(`[partner-status] No feedback for pairId ${pairId} (${feedbackKey})`);
  } else {
    console.log(`[partner-status] Loaded feedback for ${feedbackKey} → version ${version} tipCount ${tips.length}`);
  }

  return NextResponse.json(
    { ok: true, pairId, ownerDate, version, tips, tipCount: tips.length },
    { status: 200, headers: { ETag: etag, 'Cache-Control': 'no-store' } }
  );
}

// ----------------- helpers -----------------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function yyyymmddUTC(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = `${now.getUTCMonth() + 1}`.padStart(2, '0');
  const d = `${now.getUTCDate()}`.padStart(2, '0');
  return `${y}${m}${d}`;
}

function safeParseJsonArray(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch { return []; }
  }
  return [];
}

function toNum(v, fallback = 0) {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : fallback;
}

function buildETag(version) {
  return `W/"${String(version)}"`;
}

function sameETag(a, b) {
  const norm = (x) => String(x).replace(/^W\//, '').replace(/"/g, '');
  return norm(a) === norm(b);
}

function parseETagVersion(etag) {
  if (!etag) return null;
  const s = String(etag).replace(/^W\//, '').replace(/"/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function clampInt(n, min, max) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

/* ---------------------------------------------------------------------------
v4.3 Verification Summary (partner-status/route.js)
- Added `wait` parameter with Edge long‑poll to deliver near‑instant updates. // FIX
- ETag now aligns with per‑day feedback version for better conditional GETs.   // FIX
- Expanded TIP regex to allow underscores, hyphens, colons, and dots.         // FIX
- Maintains 403 on blocklist and 200/304 semantics for clients.
--------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------
v4.3.3 Verification Summary (partner-status/route.js)
- Long-poll compares per-day version; no fallback to state.version.          // FIX: v4.3.3 flicker
- Conditional GET now returns 304 reliably when ETag unchanged for the day.  // FIX: v4.3.3 flicker
--------------------------------------------------------------------------- */
