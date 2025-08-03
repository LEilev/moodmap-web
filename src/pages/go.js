// pages/tracking-test.js
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * • Laster PromoteKit‑scriptet ASAP (async).
 * • Leser ?via | ?ref  (+ ?type & evt. pk_*) fra URL‑en.
 * • Venter 1.0 – 1.5 s slik at PromoteKit rekker å plante cookies.
 * • Sender brukeren videre til /buy … med ALLE relevante query‑params intakt.
 * • Viser “Redirecting …” + manuell lenke dersom JS er blokkert / noe går galt.
 */
export default function GoRedirect() {
  const router = useRouter();

  /* -------------------------------------------------------------------- */
  /* 1. Bygg redirect‑URL (memoiseres så den bare lages én gang)          */
  /* -------------------------------------------------------------------- */
  const redirectUrl = useMemo(() => {
    if (!router.isReady) return null;

    const { query } = router;
    /** via = partner‑kode.  Faller tilbake til ref eller 'default'.   */
    const rawVia = query.via || query.ref || 'default';
    /** PromoKit anbefaler ≤32 tegn, [a‑zA‑Z0‑9_-]  – samme regex som buy.js */
    const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : 'default';

    const type = query.type === 'yearly' ? 'yearly' : 'monthly';

    const url = new URL('/buy', window.location.origin);
    url.searchParams.set('via', via);    // bevar 'via' – buy.js håndterer både via & ref
    url.searchParams.set('type', type);

    /* Bevar alle pk_*‑parametre for PromoteKit sin egen click‑tracking  */
    Object.entries(query).forEach(([k, v]) => {
      if (k.startsWith('pk_')) url.searchParams.set(k, v);
    });

    return url.pathname + url.search;
  }, [router]);

  /* -------------------------------------------------------------------- */
  /* 2. Klient‑side redirect etter 1‑1.5 s                               */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    if (!redirectUrl) return;

    const delay = 1_000 + Math.floor(Math.random() * 500); // 1 000–1 500 ms
    const id = setTimeout(() => {
      /* Bruk replace() slik at /tracking-test ikke havner i historikken */
      window.location.replace(redirectUrl);
    }, delay);

    return () => clearTimeout(id);
  }, [redirectUrl]);

  /* -------------------------------------------------------------------- */
  /* 3. UI – fallback hvis JS feiler                                     */
  /* -------------------------------------------------------------------- */
  const manualHref = redirectUrl || '/buy';

  return (
    <>
      <Head>
        <title>Just a sec… | MoodMap Pro</title>
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="88e4dc38-2a9b-412b-905d-5b91bb454187"
        />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8">
        <h1 className="text-2xl font-bold mb-4">Redirecting…</h1>
        <p className="text-lg text-center max-w-md mb-8">
           We’re getting your offer ready.<br />
          You’ll be at checkout in just a second.
        </p>

        {/* Synlig fallback – fungerer uten JavaScript */}
        <noscript>
          <p className="mb-4">
            JavaScript is disabled. Please&nbsp;
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
