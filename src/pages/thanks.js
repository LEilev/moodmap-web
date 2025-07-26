// pages/thanks.js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import Image from 'next/image';

export default function Thanks() {
  const { query } = useRouter();
  const { u = '', s = '', exp = '', sig = '' } = query;

  const deepLink = useMemo(() => {
    if (!u || !s || !exp || !sig) return '';
    return `moodmap-app://activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
      s,
    )}&exp=${exp}&sig=${sig}`;
  }, [u, s, exp, sig]);

  const valid = Boolean(deepLink);

  return (
    <>
      <Head>
        <title>MoodMap • Payment Successful</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-primary-blue text-white font-geist-sans px-6 py-16 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-center border border-white/20">
          <Image
            src="/icon.png"
            alt="MoodMap logo"
            width={60}
            height={60}
            className="mx-auto mb-6"
            priority
          />
          {valid ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                🎉 Payment successful
              </h1>
              <p className="text-base sm:text-lg mb-10 text-white/90">
                Your Pro access is active. Tap below to open the app and finish setup.
              </p>
              <a
                href={deepLink}
                className="inline-block bg-white text-primary-blue font-semibold text-base sm:text-lg rounded-full px-6 py-3 transition hover:bg-white/90"
              >
                🚀 Open MoodMap & Activate Pro
              </a>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                ⚠️ Invalid Link
              </h1>
              <p className="text-base sm:text-lg text-white/80">
                Something’s missing. Contact&nbsp;
                <a
                  href="mailto:support@moodmap-app.com"
                  className="underline hover:text-white"
                >
                  support@moodmap-app.com
                </a>.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
