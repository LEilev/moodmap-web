// app/api/partner-status/route.js
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const headersNoStore = {
  'Cache-Control': 'no-store',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const toBool = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true' || v === '1';
  if (typeof v === 'number') return v !== 0;
  return false;
};

function weakETag(version) {
  return `W/"${version}"`;
}

function parseIfNoneMatch(req) {
  const inm = req.headers.get('if-none-match');
  if (!inm) return null;
  // accept W/"123", "123" or 123
  const m = inm.match(/W\/"(\d+)"|\"(\d+)\"|(\d+)/);
  const v = (m && (m[1] || m[2] || m[3])) ? Number(m[1] || m[2] || m[3]) : null;
  return Number.isNaN(v) ? null : v;
}

async function getState(pairId) {
  const key = `state:${pairId}`;
  const s = await redis.hgetall(key);
  const version = Number(s?.version ?? 0);
  const missionsVersion = s?.missionsVersion != null ? Number(s.missionsVersion) : undefined;
  const scoresVersion = s?.scoresVersion != null ? Number(s.scoresVersion) : undefined;
  return {
    key,
    exists: !!s, // <— presence of hash means active state
    currentDate: s?.currentDate || '',
    version,
    missionsVersion,
    scoresVersion,
  };
}

async function getFeedback(pairId, ownerDate) {
  const key = `feedback:${pairId}:${ownerDate}`;
  const fv = await redis.hgetall(key);
  const out = {
    tips: [],
    vibe: '',
    readiness: null,
    reactionAck: false,
  };
  if (fv) {
    out.vibe = typeof fv.vibe === 'string' ? fv.vibe : '';
    out.readiness = fv.readiness != null ? Number(fv.readiness) : null;
    out.reactionAck = toBool(fv.reactionAck);
    if (fv.tips) {
      try { out.tips = JSON.parse(fv.tips); } catch {}
    }
  }
  return out;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pairId = String(searchParams.get('pairId') || '').trim();
    let ownerDate = String(searchParams.get('ownerDate') || '').trim();
    const wait = Math.min(30, Math.max(0, Number(searchParams.get('wait') || '0')));

    if (!pairId) {
      return new Response(JSON.stringify({ error: 'pairId required' }), {
        status: 400,
        headers: { ...headersNoStore },
      });
    }

    // 🔒 Blocklist → 403 (symmetric unlink)
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      return new Response(null, { status: 403, headers: { ...headersNoStore } });
    }

    // Fetch state and ensure it exists — if missing, treat as disconnected (permanent)
    let state = await getState(pairId);
    if (!state.exists) {
      // Optional JSON: { ok:false, isValidConnection:false } — client can also rely on 403 alone
      return new Response(JSON.stringify({ ok: false, isValidConnection: false }), {
        status: 403,
        headers: { ...headersNoStore },
      });
    }

    if (!ownerDate) ownerDate = state.currentDate || new Date().toISOString().slice(0, 10);

    // ETag handling — MUST NOT mask invalid sessions
    const clientVersion = parseIfNoneMatch(req);

    if (wait > 0 && clientVersion != null) {
      let elapsed = 0;
      const step = 1000;
      while (elapsed < wait * 1000) {
        // Early abort: blocklist or missing state → 403
        const bl = await redis.get(`blocklist:${pairId}`);
        if (bl) return new Response(null, { status: 403, headers: { ...headersNoStore } });

        state = await getState(pairId);
        if (!state.exists) {
          return new Response(JSON.stringify({ ok: false, isValidConnection: false }), {
            status: 403,
            headers: { ...headersNoStore },
          });
        }
        if (state.version !== clientVersion) break;

        await sleep(step);
        elapsed += step;
      }
      if (state.version === clientVersion) {
        return new Response(null, {
          status: 304,
          headers: { ...headersNoStore, ETag: weakETag(state.version) },
        });
      }
    } else if (clientVersion != null && state.version === clientVersion) {
      // Short path: ensure still valid before 304
      const stillExists = (await getState(pairId)).exists;
      if (!stillExists) {
        return new Response(JSON.stringify({ ok: false, isValidConnection: false }), {
          status: 403,
          headers: { ...headersNoStore },
        });
      }
      return new Response(null, {
        status: 304,
        headers: { ...headersNoStore, ETag: weakETag(state.version) },
      });
    }

    // Build payload
    const f = await getFeedback(pairId, ownerDate);
    const payload = {
      ok: true,
      isValidConnection: true, // <— explicit validity bit
      ownerDate,
      version: state.version,
      tips: f.tips,
      vibe: f.vibe,
      readiness: f.readiness,
      reactionAck: f.reactionAck,
      missionsVersion: state.missionsVersion,
      scoresVersion: state.scoresVersion,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...headersNoStore, ETag: weakETag(state.version) },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'server_error', detail: String(err) }), {
      status: 500,
      headers: { ...headersNoStore },
    });
  }
}
