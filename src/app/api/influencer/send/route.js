export const runtime = 'edge';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function parseIntClamped(v, def, min, max) {
  const n = parseInt(String(v ?? ''), 10);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, n));
}

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  const followups = url.searchParams.get('followups') === '1';
  const dry = url.searchParams.get('dry') === '1';

  // Back-compat: /send?batch=10 -> /worker?max=10
  const batch = parseIntClamped(url.searchParams.get('batch') ?? url.searchParams.get('max'), 5, 1, 25);

  const target = new URL('/api/influencer/worker', url.origin);
  target.searchParams.set('token', token);
  target.searchParams.set('max', String(batch));
  if (followups) target.searchParams.set('followups', '1');
  if (dry) target.searchParams.set('dry', '1');

  // Pass-through optional knobs
  for (const k of ['domainCap', 'maxAttempts', 'minDelayMs', 'followupDays']) {
    const v = url.searchParams.get(k);
    if (v != null && v !== '') target.searchParams.set(k, v);
  }

  try {
    const res = await fetch(target.toString(), { method: 'GET' });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-MoodMap-Deprecated': 'send_is_wrapper_use_worker',
      },
    });
  } catch (e) {
    return json({ error: 'send_wrapper_failed', message: String(e?.message ?? e) }, 500);
  }
}
