import { redis } from '@/lib/redis';
import { normalizeInfluencerEmail, readLimitedText } from '@/lib/influencer-crypto';
import {
  createLegacyConfirmationToken,
  resolveLegacyConfirmationToken,
  resolveUnsubscribeToken,
  suppressInfluencer,
} from '@/lib/influencer-unsubscribe';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function page(title, content, status = 200) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — MoodMap</title></head><body style="font-family:system-ui,sans-serif;line-height:1.6;margin:0;padding:32px 20px;color:#172a42;background:#f5f7fa"><main style="max-width:560px;margin:48px auto;padding:28px;background:white;border-radius:16px"><h1>${title}</h1>${content}</main></body></html>`, { status, headers: HEADERS });
}

function invalidLink() {
  return page('Link unavailable', '<p>This unsubscribe link is invalid or has expired. Open the unsubscribe link in your email again.</p>', 400);
}

function unavailable() {
  return page('Please try again', '<p>We could not update your email preference right now. Please try again shortly.</p>', 503);
}

function confirmation(token) {
  // No address, name or untrusted markup is rendered in this document.
  return page('Unsubscribe from MoodMap outreach', `<p>Confirm below to stop partnership and outreach emails from MoodMap.</p><form method="post" action="/api/influencer/unsubscribe"><input type="hidden" name="token" value="${escapeHtml(token)}"><input type="hidden" name="confirm" value="1"><button type="submit" style="font:inherit;padding:12px 20px;background:#173f70;color:white;border:0;border-radius:8px;cursor:pointer">Unsubscribe</button></form>`);
}

/** GET is a read-only confirmation page, including links sent before tokens. */
export async function GET(req) {
  const params = new URL(req.url).searchParams;
  try {
    if (params.has('token')) {
      const token = params.get('token');
      if (!await resolveUnsubscribeToken(token, redis)) return invalidLink();
      return confirmation(token);
    }
    const email = normalizeInfluencerEmail(params.get('email'));
    if (!email) return invalidLink();
    // Minting this short-lived form proof changes no Redis/suppression state.
    return confirmation(await createLegacyConfirmationToken(email));
  } catch {
    return unavailable();
  }
}

/** RFC 8058 one-click POST; no login, cookies, redirects or follow-up step. */
export async function POST(req) {
  const url = new URL(req.url);
  let fields;
  try {
    const type = req.headers.get('content-type') || '';
    const raw = await readLimitedText(req, 8192);
    if (type.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
      fields = new URLSearchParams(raw);
    } else if (type.toLowerCase().startsWith('multipart/form-data;')) {
      fields = await new Response(raw, { headers: { 'Content-Type': type } }).formData();
    } else {
      return page('Invalid request', '<p>Please use the unsubscribe link in your email.</p>', 415);
    }
  } catch (error) {
    return page('Invalid request', '<p>Please use the unsubscribe link in your email.</p>', error?.status === 413 ? 413 : 400);
  }

  const queryToken = url.searchParams.get('token');
  const formToken = fields.get('token');
  if (queryToken && formToken && queryToken !== formToken) return invalidLink();
  const token = queryToken || formToken;
  const oneClick = fields.get('List-Unsubscribe') === 'One-Click';
  const confirmed = fields.get('confirm') === '1';
  if (!oneClick && !confirmed) return invalidLink();
  if (typeof token !== 'string') return invalidLink();

  const legacy = token.startsWith('legacy.');
  // Previously sent unsigned URLs remain usable in a browser, but never become
  // an unsigned one-click API for arbitrary addresses.
  if (legacy && (!confirmed || oneClick)) return invalidLink();
  if (!oneClick) {
    const origin = req.headers.get('origin');
    if (origin && origin !== url.origin) return page('Invalid request', '<p>Please open the unsubscribe link again.</p>', 403);
  }

  try {
    const email = legacy
      ? await resolveLegacyConfirmationToken(token)
      : await resolveUnsubscribeToken(token, redis);
    if (!email) return invalidLink();
    await suppressInfluencer({ redis, email, legacy });
    return page('Unsubscribed', '<p>Your request has been processed. If this address is on our outreach list, it has been unsubscribed from MoodMap partnership and outreach emails.</p>');
  } catch {
    return unavailable();
  }
}
