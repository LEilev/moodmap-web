// /app/api/partner-status/route.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/partner-status
 * Aggregator som returnerer samlet partner-state.
 * Sprint A tillegg:
 *   - Inkludér missionsVersion og scoresVersion (fra state:<pairId>)
 *   - Inkludér featureFlags fra getFeatureFlags()
 *   - Bevar ETag/304 + no-store
 *
 * Respons (eksempel):
 * {
 *   ok: true,
 *   version: 42,
 *   missionsVersion: 3,
 *   scoresVersion: 1,
 *   featureFlags: {...},
 *   vibe: 'calm' | null,
 *   readiness: 0..100 | null,
 *   tips: [...],
 * }
 */

import { getFeatureFlags } from '@/utils/getFeatureFlags';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function noStoreHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extra,
  };
}

async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

async function hgetallAsObject(key) {
  const res = await redis('hgetall', key);
  if (!res) return {};
  if (Array.isArray(res)) {
    const obj = {};
    for (let i = 0; i < res.length; i += 2) obj[res[i]] = res[i + 1];
    return obj;
  }
  return res;
}

function getPairIdFromRequest(req) {
  const url = new URL(req.url);
  const qp = url.searchParams.get('pairId');
  if (qp) return qp;
  const x1 = req.headers.get('x-mm-pair') || req.headers.get('x-partner-id');
  if (x1) return x1;
  try {
    const cookie = req.headers.get('cookie') || '';
    const found = /(?:^|;\s*)mm_pair\s*=\s*([^;]+)/.exec(cookie);
    if (found) return decodeURIComponent(found[1]);
  } catch {}
  return 'anon';
}

function safeJSONParse(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

function stableEtagFrom(obj) {
  // ETag basert på sentrale felt
  const basis = JSON.stringify({
    version: obj.version || 0,
    missionsVersion: obj.missionsVersion || 0,
    scoresVersion: obj.scoresVersion || 0,
    vibe: obj.vibe ?? null,
    readiness: obj.readiness ?? null,
    tipsLen: Array.isArray(obj.tips) ? obj.tips.length : 0,
    ff: obj.featureFlags,
  });
  // Weak ETag er tilstrekkelig
  const base64 = typeof btoa === 'function'
    ? btoa(basis).slice(0, 32)
    : Buffer.from(basis).toString('base64').slice(0, 32);
  return `W/"${base64}"`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function snapshot(pairId) {
  const stateKey = `state:${pairId}`;
  const gardenKey = `garden:${pairId}`;     // tips (JSON) – best effort
  const feedbackKey = `feedback:${pairId}`; // vibe/readiness (JSON) – best effort

  const stateHash = await hgetallAsObject(stateKey);
  const version = Number(stateHash.version) || 0;
  const missionsVersion = Number(stateHash.missionsVersion) || 0;
  const scoresVersion = Number(stateHash.scoresVersion) || 0;

  const gardenRaw = await redis('get', gardenKey).catch(() => null);
  const feedbackRaw = await redis('get', feedbackKey).catch(() => null);

  const garden = gardenRaw ? safeJSONParse(gardenRaw, {}) : {};
  const feedback = feedbackRaw ? safeJSONParse(feedbackRaw, {}) : {};

  const featureFlags = getFeatureFlags();

  const payload = {
    ok: true,
    version,
    missionsVersion,
    scoresVersion,
    featureFlags,
    tips: Array.isArray(garden?.tips) ? garden.tips : [],     // kompatibel med eksisterende front
    vibe: feedback?.vibe ?? null,
    readiness: typeof feedback?.readiness === 'number' ? feedback.readiness : null,
  };

  return { payload, etag: stableEtagFrom(payload) };
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }

    const url = new URL(req.url);
    const wait = Math.max(0, Math.min(25, Number(url.searchParams.get('wait') || 0))); // long-poll opptil 25s
    const pairId = getPairIdFromRequest(req);
    const ifNoneMatch = req.headers.get('if-none-match');

    // Første snapshot
    let { payload, etag } = await snapshot(pairId);

    if (ifNoneMatch && ifNoneMatch === etag) {
      if (wait > 0) {
        // Long-poll: vent på endring
        const deadline = Date.now() + wait * 1000;
        while (Date.now() < deadline) {
          await sleep(1000);
          const snap = await snapshot(pairId);
          if (snap.etag !== etag) {
            payload = snap.payload;
            etag = snap.etag;
            return new Response(JSON.stringify(payload), { status: 200, headers: noStoreHeaders({ ETag: etag }) });
          }
        }
      }
      // Ingen endring
      return new Response(null, { status: 304, headers: noStoreHeaders({ ETag: etag }) });
    }

    // Returnér umiddelbart (ikke-modifiserende GET)
    return new Response(JSON.stringify(payload), { status: 200, headers: noStoreHeaders({ ETag: etag }) });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), {
      status: 500,
      headers: noStoreHeaders(),
    });
  }
}
