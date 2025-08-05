// pages/go.js  – affiliate landing
// -------------------------------------------------------------
// v1.2.0   • hard abort 10 s  • prod‑origin guard
// -------------------------------------------------------------
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GoRedirect() {
  const router = useRouter();

  /* ---------- build redirect URL ---------- */
  const { redirectUrl, via, type } = useMemo(() => {
    if (!router.isReady) return { redirectUrl: null, via: '', type: '' };

    const { query } = router;

    const rawVia = query.via || query.ref || 'default';
    const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : 'default';
    const type = query.type === 'yearly' ? 'yearly' : 'monthly';

    /* prod‑origin guard */
    const origin =
      window.location.origin.startsWith('http://localhost')
        ? 'https://moodmap-app.com'
        : window.location.origin;

    const url = new URL('/buy', origin);
    url.searchParams.set('via', via);
    url.searchParams.set('type', type);
    Object.entries(query).forEach(([k, v]) => {
      if (k.startsWith('pk_')) url.searchParams.set(k, v);
    });

    return { redirectUrl: url.pathname + url.search, via, type };
  }, [router]);

  /* ---------- client redirect ---------- */
  useEffect(() => {
    if (!redirectUrl) return;
    console.info('[go] redirect init', { via, type });

    const delay = 1000 + Math.random() * 500;
    const id = setTimeout(() => window.location.replace(redirectUrl), delay);

    /* 5 s warn + 10 s abort */
    const warn = setTimeout(
      () => console.warn('[go] redirect >5 s', { via }),
      5000,
    );
    const abort = setTimeout(() => {
      console.error('[go] redirect abort 10 s', { via });
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
        <title>Redirecting… | MoodMap</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://buy.stripe.com" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <p>Sending you to checkout…</p>
        <a href={redirectUrl || '/buy'} className="underline mt-4">
          Click here if nothing happens.
        </a>
      </main>
    </>
  );
}
