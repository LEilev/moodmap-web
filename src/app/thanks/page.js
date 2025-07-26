// src/app/thanks/page.js  ← **SERVER COMPONENT**

// Always run server‑side; query params must be evaluated per request
export const dynamic = "force-dynamic";

export const metadata = {
  title: "MoodMap • Payment successful",
  robots: { index: false, follow: false },
};

// Directly import the client component; Next.js will lazy‑hydrate it and show
// `loading.js` automatically. No `next/dynamic` needed (and `ssr:false` was the
// source of the build error).
import ThanksClient from "./client";

export default function ThanksPage({ searchParams = {} }) {
  const u = searchParams.u ?? "";
  const s = searchParams.s ?? "";
  const exp = searchParams.exp ?? "";
  const sig = searchParams.sig ?? "";

  const deepLink =
    u && s && exp && sig
      ? `moodmap-app://activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
          s,
        )}&exp=${exp}&sig=${sig}`
      : "";

  return <ThanksClient deepLink={deepLink} />;
}

// `loading.js` continues to provide the skeleton while the client bundle downloads.
