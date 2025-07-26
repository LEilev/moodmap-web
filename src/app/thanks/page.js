// src/app/thanks/page.js  ← **SERVER COMPONENT**

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MoodMap • Payment successful",
  robots: { index: false, follow: false },
};

import ThanksClient from "./client";

export default function ThanksPage({ searchParams = {} }) {
  const u = searchParams.u ?? "";
  const s = searchParams.s ?? "";
  const exp = searchParams.exp ?? "";
  const sig = searchParams.sig ?? "";

  const deepLink =
    u && s && exp && sig
      ? `https://moodmap-app.com/activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
          s,
        )}&exp=${exp}&sig=${sig}`
      : "";

  return <ThanksClient deepLink={deepLink} />;
}

// `loading.js` provides the skeleton while the client bundle loads.
