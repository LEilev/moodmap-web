export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const HEADERS = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
};

function cronAuthorized(req, searchParams) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (cronSecret) {
    const match = (req.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
    return (match?.[1] || '').trim() === cronSecret;
  }

  // Keep the legacy operator credential for callers whose CRON_SECRET is unset.
  const supplied = (searchParams.get('token') || '').trim();
  const expected = (process.env.CRON_TOKEN || '').trim();
  return Boolean(supplied && expected && supplied === expected);
}

export async function GET(req) {
  if (!cronAuthorized(req, new URL(req.url).searchParams)) {
    return new Response('Forbidden', { status: 403, headers: HEADERS });
  }

  // The Stripe affiliate offer is retired. There is deliberately no Redis,
  // template, provider, queue or feature-flag path that can resume sending.
  // Keep old unsubscribe/webhook routes operational for already-sent mail.
  return Response.json(
    { ok: true, paused: true, disabled: true, didWork: false, sent: 0, attempted: 0, reason: 'web_sales_retired' },
    { status: 200, headers: HEADERS },
  );
}
