// FILE: pages/go.js
// -------------------------------------------------------------
// v1.5.0 — robust redirector for PromoteKit + Stripe flows
// - Accepts BOTH query params and path segments (/go/yearly, /go/monthly)
// - Fixes malformed links like '?type=yearly?via=Eilev' by normalizing the query
// - Preserves via/type + pk_* / utm_* / coupon-like params
// - Default → /pro (so PromoteKit script can register clicks)
// - Optional direct hop to /buy via ?to=buy or ?direct=1
// - Small client-side delay + clickable fallback link
// -------------------------------------------------------------

import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const isBrowser = typeof window !== 'undefined';

function first(val) {
  return Array.isArray(val) ? (val[0] ?? '') : (val ?? '');
}

function validSlug(s) {
  return typeof s === 'string' && /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(s);
}

/** Parse the current window.location.search, but also normalize any extra '?' into '&'. */
function parseHrefParams() {
  if (!isBrowser) return {};
  const href = window.location.href || '';
  const qIndex = href.indexOf('?');
  if (qIndex < 0) return {};
  // normalize: replace any subsequent '?' with '&' so '?type=yearly?via=Eilev' works
  const raw = href.slice(qIndex + 1).replace(/\?/g, '&');
  const out = {};
  for (const kv of raw.split('&')) {
    if (!kv) continue;
    const [k, v = ''] = kv.split('=');
    const key = decodeURIComponent(k || '').trim();
    const val = decodeURIComponent(v || '').trim();
    if (!key) continue;
    if (key in out) {
      // keep first value (behavior similar to first())
      continue;
    }
    out[key] = val;
  }
  return out;
}

/** Extract 'monthly' | 'yearly' from pathname like /go/yearly (case-insensitive). */
function typeFromPathname() {
  if (!isBrowser) return '';
  const m = /\/go\/(yearly|monthly)\b/i.exec(window.location.pathname || '');
  return (m && m[1]) ? m[1].toLowerCase() : '';
}

/** Build a URL with given path + params (drops empty params) */
function buildUrl(path, params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v);
    if (!s) return;
    sp.set(k, s);
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Pick whitelisted passthrough params (pk_*, promotekit_*, utm_*, coupon-like) */
function collectPassthrough(all) {
  const keep = {};
  Object.entries(all || {}).forEach(([k, v]) => {
    const key = String(k);
    if (/^(pk_|promotekit_|utm_)/i.test(key)) {
      keep[key] = v;
      return;
    }
    // common coupon/promocode hints you might want to keep to /pro or /buy
    if (['coupon', 'promo', 'promocode', 'discount', 'code', 'ref_code', 'refcode'].includes(key)) {
      keep[key] = v;
    }
  });
  return keep;
}

export default function GoRedirect() {
  const router = useRouter();

  const { redirectUrl } = useMemo(() => {
    if (!router.isReady) return { redirectUrl: null };

    // Merge params from Next router + normalized href
    const q = router.query || {};
    const hrefQ = parseHrefParams();

    // via/ref (sanitize to a slug; default 'default' only if present but invalid)
    const rawVia = first(q.via) || first(q.ref) || hrefQ.via || hrefQ.ref || '';
    const via = validSlug(rawVia) ? rawVia : (rawVia ? 'default' : '');

    // plan type: query > href > pathname; default monthly
    const rawType =
      (first(q.type) || '').toLowerCase() ||
      (hrefQ.type || '').toLowerCase() ||
      typeFromPathname();
    const type = rawType === 'yearly' ? 'yearly' : rawType === 'monthly' ? 'monthly' : 'monthly';

    // passthrough analytics / coupon-ish params
    const passthrough = {
      ...collectPassthrough(hrefQ),
      ...collectPassthrough(q),
    };

    // optional direct hop
    const to = (first(q.to) || hrefQ.to || '').toLowerCase();
    const direct = (first(q.direct) || hrefQ.direct || '') === '1';
    const dest = (to === 'buy' || direct) ? '/buy' : '/pro';

    const finalParams = { via, type, ...passthrough };
    const url = buildUrl(dest, finalParams);

    return { redirectUrl: url };
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!redirectUrl) return;
    // Small randomized delay (900–1300ms) so scripts can record the visit if needed
    const delay = 900 + Math.floor(Math.random() * 400);
    const t = setTimeout(() => {
      // Use replace to avoid polluting history
      if (isBrowser) {
        window.location.replace(redirectUrl);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [redirectUrl]);

  return (
    <>
      <Head>
        <title>Redirecting… | MoodMap</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main style={{minHeight:'100vh'}} className="flex flex-col items-center justify-center">
        <p>Sender deg videre…</p>
        <a href={redirectUrl || '/pro'} className="underline mt-4">
          Klikk her hvis det ikke skjer noe.
        </a>
      </main>
    </>
  );
}
