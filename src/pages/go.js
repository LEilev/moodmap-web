// FILE: pages/go.js
// -------------------------------------------------------------
// v1.3.0 • default → /pro (boost Clicks) • 1.0–1.5 s delay • origin guard
// - Preserves via/type + pk_*
// - Fallback: support direct /buy hops via ?to=buy or ?direct=1
// -------------------------------------------------------------

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function first(val) {
  return Array.isArray(val) ? (val[0] ?? '') : (val ?? '');
}
function validSlug(s) {
  return typeof s === 'string' && /^[\w-]{1,32}$/.test(s);
}

export default function GoRedirect() {
  const router = useRouter();

  /* ---------- build redirect URL ---------- */
  const { redirectUrl, via, type } = useMemo(() => {
    if (!router.isReady) return { redirectUrl: null, via: '', type: '' };
    const { query } = router;

    const rawVia = first(query.via) || first(query.ref) || 'default';
    const via = validSlug(rawVia) ? rawVia : 'default';
    const type = first(query.type) === 'yearly' ? 'yearly' : 'monthly';

    /* prod-origin guard */
    let origin = 'https://moodmap-app.com';
    if (typeof window !== 'undefined') {
      origin = window.location.origin.startsWith('http://localhost')
        ? 'https://moodmap-app.com'
        : window.location.origin;
    }

    // Default: /pro (so the user clicks a real Stripe <a>)
    const goDirect = first(query.to) === 'buy' || first(query.direct) === '1';
    const pathname = goDirect ? '/buy' : '/pro';

    const url = new URL(pathname, origin);
    url.searchParams.set('via', via);
    url.searchParams.set('type', type);
    Object.entries(query).forEach(([k, v]) => {
      if (k.startsWith('pk_')) url.searchParams.set(k, String(first(v)));
    });

    return { redirectUrl: url.pathname + url.search, via, type };
  }, [router.isReady, router.query]);

  /* ---------- client redirect ---------- */
  useEffect(() => {
    if (!redirectUrl) return;
    console.info('[go] redirect init', { via, type });

    const delay = 1000 + Math.random() * 500;
    const id = setTimeout(() => window.location.replace(redirectUrl), delay);

    /* 5 s warn + 10 s abort */
    const warn = setTimeout(() => console.warn('[go] redirect >5 s', { via }), 5000);
    const abort = setTimeout(() => {
      console.error('[go] redirect abort 10 s', { via });
      window.location.href = redirectUrl;
    }, 10_000);

    return () => {
      clearTimeout(id);
      clearTimeout(warn);
      clearTimeout(abort);
    };
  }, [redirectUrl, via, type]);

  /* ---------- minimal UI ---------- */
  return (
    <>
      <Head>
        <title>Redirecting… | MoodMap</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://buy.stripe.com" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <p>Sending you to the next step…</p>
        <a href={redirectUrl || '/pro'} className="underline mt-4">
          Click here if nothing happens.
        </a>
      </main>
    </>
  );
}
