// src/app/thanks/page.js

import dynamic from "next/dynamic";
import Fallback from "./loading";

// Always run server‑side; query params must be evaluated per request
export const dynamic = "force-dynamic";

// Meta tags live happily on the server again ✅
export const metadata = {
  title: "MoodMap • Payment successful",
  robots: { index: false, follow: false },
};

// Client bundle – deferred, CSR‑only.
const ThanksClient = dynamic(() => import("./client"), {
  ssr: false,
  loading: () => <Fallback />, // Leverages the same skeleton as loading.js
});

export default function ThanksPage({ searchParams = {} }) {
  const u = searchParams.u ?? "";
  const s = searchParams.s ?? "";
  const exp = searchParams.exp ?? "";
  const sig = searchParams.sig ?? "";

  // Build once on the server – removes duplication inside the client.
  const deepLink =
    u && s && exp && sig
      ? `moodmap-app://activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
          s,
        )}&exp=${exp}&sig=${sig}`
      : "";

  return <ThanksClient deepLink={deepLink} />;
}
