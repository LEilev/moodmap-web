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
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white font-geist-sans px-6">
        <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-xl py-14 px-6 text-center">
          <Image
            src="/icon.png"
            alt="MoodMap logo"
            width={48}
            height={48}
            className="mx-auto mb-6"
            priority
          />
          {valid ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                🎉 Payment successful!
              </h1>
              <p className="text-base md:text-lg mb-10">
                Your Pro access is now active. Tap below to open the app and complete the sync.
              </p>
              <a
                href={deepLink}
                className="inline-block bg-white text-primary-blue font-semibold text-lg rounded-xl px-6 py-3 transition-colors hover:bg-white/90"
              >
                🚀 Open MoodMap & activate Pro
              </a>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                ⚠️ Invalid link
              </h1>
              <p className="text-base md:text-lg opacity-80">
                Something’s missing in the link. Please contact&nbsp;
                <a
                  href="mailto:moodmap.tech@gmail.com"
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
