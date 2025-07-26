// pages/thanks.js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function Thanks() {
  const { query } = useRouter();
  const { u = '', s = '', exp = '', sig = '' } = query;

  // Build the deep‑link only when all params are present
  const deepLink = useMemo(() => {
    if (!u || !s || !exp || !sig) return '';
    return `moodmap-app://activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
      s,
    )}&exp=${exp}&sig=${sig}`;
  }, [u, s, exp, sig]);

  const isValid = Boolean(deepLink);

  return (
    <>
      <Head>
        <title>MoodMap • Payment successful</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white font-geist-sans px-6">
        <div className="w-full max-w-lg bg-white/10 rounded-2xl shadow-xl py-16 px-6 text-center">
          {isValid ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                🎉 Payment successful!
              </h1>
              <p className="text-lg mb-10">
                Your Pro access is active. Open the app to complete the sync.
              </p>
              <a
                href={deepLink}
                className="inline-block bg-white/90 hover:bg-white text-primary-blue font-semibold text-lg rounded-xl px-8 py-4 transition-colors"
              >
                🚀 Open MoodMap & activate Pro
              </a>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                ⚠️ Invalid link
              </h1>
              <p className="text-lg opacity-80">
                We couldnʼt find the required data in the URL. Please contact&nbsp;
                <a
                  href="mailto:moodmap.tech@gmail.com"
                  className="underline hover:text-white"
                >
                  support@moodmap‑app.com
                </a>
                .
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
