// src/app/api/partner-status/route.js
// Partner Mode v4.2 — status endpoint (Edge).
// FIX: ETag-based change detection, blocklist 403, version self-heal when feedback exists, and robust JSON parsing.

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const TIP_RE = /^[a-z0-9]+(\.[a-z0-9]+)*$/i; // must allow dots + numbers only
const DATE_RE = /^[0-9]{8}$/;

export async function GET(req) {
  const url = new URL(req.url);
  const pairId = String(url.searchParams.get('pairId') ?? '').trim();
  const ownerDateQ = String(url.searchParams.get('ownerDate') ?? '').trim();

  if (!pairId) {
    return NextResponse.json({ error: 'pairId required' }, { status: 400 });
  }

  // Blocklist → immediate 403
  const blockKey = `blocklist:${pairId}`;
  const isBlocked = (await redis.exists(blockKey)) === 1;
  if (isBlocked) {
    return NextResponse.json({ error: 'Pair disconnected' }, { status: 403 });
  }

  const stateKey = `state:${pairId}`;
  const state = await redis.hgetall(stateKey);
  let version = num(state?.version, 0);
  const stateDate = String(state?.currentDate ?? '').trim();
  let ownerDate = DATE_RE.test(ownerDateQ)
    ? ownerDateQ
    : (DATE_RE.test(stateDate) ? stateDate : yyyymmddUTC());

  // Read-path: tips (canonical → legacy fallbacks)
  const feedbackKey = `feedback:${pairId}:${ownerDate}`;
  let tipsRaw = await redis.hget(feedbackKey, 'tips');

  if (tipsRaw == null) {
    tipsRaw = await redis.hget(feedbackKey, 'tipsJson'); // legacy stringified array
  }
  if (tipsRaw == null) {
    tipsRaw = await redis.hget(feedbackKey, 'highlightedTips'); // legacy stringified array
  }

  const tips = safeParseJsonArray(tipsRaw).filter((k) => typeof k === 'string' && TIP_RE.test(k));

  // If feedback exists but state missing, re-sync state // FIX: self-heal
  if ((!state || version === 0) && tips.length > 0) {
    version = await redis.hincrby(stateKey, 'version', 1);
    await redis.hset(stateKey, { currentDate: ownerDate });
    // keep state TTL fresh (~30h)
    const stateTtlSec = ttlFromOwnerDate(ownerDate, 30);
    if (stateTtlSec > 0) await redis.expire(stateKey, stateTtlSec);
  }

  const etag = buildETag(version);
  const inm = req.headers.get('if-none-match');
  if (inm && sameETag(inm, etag)) {
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
    console.log(
      `[partner-status] Loaded feedback for ${feedbackKey} → version ${version} tipCount ${tips.length}`
    );
  }

  return NextResponse.json(
    {
      ok: true,
      pairId,
      ownerDate,
      version,
      tips,
      tipCount: tips.length,
    },
    {
      status: 200,
      headers: {
        ETag: etag,
        'Cache-Control': 'no-store',
      },
    }
  );
}

// ----------------- helpers -----------------

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
    } catch {
      // Not JSON; reject
      return [];
    }
  }
  return [];
}

function ttlFromOwnerDate(ownerDate, hours) {
  if (!/^[0-9]{8}$/.test(ownerDate)) return hours * 3600;
  const y = Number(ownerDate.slice(0, 4));
  const m = Number(ownerDate.slice(4, 6));
  const d = Number(ownerDate.slice(6, 8));
  const anchorMs = Date.UTC(y, m - 1, d, 0, 0, 0);
  const target = anchorMs + hours * 3600 * 1000;
  const delta = Math.floor((target - Date.now()) / 1000);
  return Math.max(1, delta);
}

function num(v, fallback = 0) {
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
