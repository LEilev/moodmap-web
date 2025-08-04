// -------------------------------------------------------------
// MoodMap  – /go      (affiliate landing page)
// -------------------------------------------------------------
// • Laster PromoteKit‑scriptet ASAP (async, non‑blocking).
// • Skriver partner‑cookie → venter 1–1,5 s → redirect til /buy
//   med ?via, ?type og ALLE pk_* query‑parametre intakt.
// • Logger strukturert info til console (og PostHog hvis den er
//   initialisert globalt).
// • Preconnect'er til buy.stripe.com for raskere checkout‑TTFB.
// • Gir tydelig «Click here if nothing happens»‑fallback + noscript.
// -------------------------------------------------------------

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GoRedirect() {
  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /* 1 · Bygg redirect‑URL (memoiseres)                                 */
  /* ------------------------------------------------------------------ */
  const { redirectUrl, via, type } = useMemo(() => {
    if (!router.isReady) return { redirectUrl: null, via: '', type: '' };

    const { query } = router;

    /* Partner‑kode (≤32 tegn, a‑zA‑Z0‑9_-)  */
    const rawVia = query.via || query.ref || 'default';
    const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : 'default';

    /* Plan‑type  */
    const type = query.type === 'yearly' ? 'yearly' : 'monthly';

    const url = new URL('/buy', window.location.origin);
    url.searchParams.set('via', via);
    url.searchParams.set('type', type);

    /* Bevar alle pk_*‑parametre  */
    Object.entries(query).forEach(([k, v]) => {
      if (k.startsWith('pk_')) url.searchParams.set(k, v);
    });

    return { redirectUrl: url.pathname + url.search, via, type };
  }, [router]);

  /* ------------------------------------------------------------------ */
  /* 2 · Klient‑side redirect med logg + guard‑timeout                  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!redirectUrl) return;

    console.info('[go] redirect‑init', { via, type });
    window?.posthog?.capture?.('go_redirect_init', { via, type });

    /* 1 000–1 500 ms → gir PromoteKit tid til å plante cookie */
    const delay = 1_000 + Math.floor(Math.random() * 500);
    const id = setTimeout(() => {
      window.location.replace(redirectUrl);
    }, delay);

    /* Safety‑net: hvis vi fortsatt er her etter 5 s → logg advarsel */
    const guard = setTimeout(() => {
      console.warn('[go] redirect_timeout', { via, type });
      window?.posthog?.capture?.('go_redirect_timeout', { via, type });
    }, 5_000);

    return () => {
      clearTimeout(id);
      clearTimeout(guard);
    };
  }, [redirectUrl, via, type]);

  /* ------------------------------------------------------------------ */
  /* 3 · Render fallback / no‑JS variant                                */
  /* ------------------------------------------------------------------ */
  const manualHref = redirectUrl || '/buy';

  return (
    <>
      <Head>
        <title>Just a sec… | MoodMap Pro</title>
        <meta name="robots" content="noindex" />
        {/* Forhåndskoble til Stripe for raskere TLS / DNS‑oppslag */}
        <link rel="preconnect" href="https://buy.stripe.com" />
        <link rel="dns-prefetch" href="https://buy.stripe.com" />
        {/* PromoteKit – async så den aldri blokkerer */}
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="88e4dc38-2a9b-412b-905d-5b91bb454187"
        />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8">
        <h1 className="text-2xl font-bold mb-4">Redirecting…</h1>
        <p className="text-lg text-center max-w-md mb-8">
          We’re getting your offer ready.
          <br />
          You’ll be at checkout in just a second.
        </p>

        {/* Fallback – fungerer uten JavaScript */}
        <noscript>
          <p className="mb-4">
            JavaScript is disabled.&nbsp;Please{' '}
            <a href={manualHref} className="underline text-blue-600">
              click here to continue
            </a>
            .
          </p>
        </noscript>

        <a
          href={manualHref}
          className="underline text-blue-600"
          style={{ marginTop: '1rem' }}
        >
          Click here if nothing happens.
        </a>
      </main>
    </>
  );
}
