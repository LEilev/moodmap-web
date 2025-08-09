// pages/buy.js
// -------------------------------------------------------------
// v3.0.0 • Client-side redirect til Stripe
// - Gir PromoteKit tid til å registrere klikk (~1.2s)
// - Setter client_reference_id = ref/via/PromoteKit-ref
// - Bevarer pk_* parametere (pk_click_id m.m.)
// -------------------------------------------------------------
import { useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const PLAN_LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04",
};

export default function BuyClient() {
  const router = useRouter();

  const href = useMemo(() => {
    if (!router.isReady) return "";
    const q = router.query || {};

    const type = q.type === "yearly" ? "yearly" : "monthly";
    const base = PLAN_LINKS[type];
    if (!base) return "";

    const url = new URL(base);

    // ref/via → client_reference_id (fallback: PromoteKit, deretter 'default')
    const rawVia = (q.ref || q.via || "").toString();
    const pkRef =
      typeof window !== "undefined" && window.promotekit_referral
        ? String(window.promotekit_referral)
        : "";
    const via =
      /^[\\w-]{1,32}$/.test(rawVia) ? rawVia : pkRef || "default";

    url.searchParams.set("client_reference_id", via);
    url.searchParams.set("type", type); // ikke nødvendig for Stripe, fint for deg i logs

    // Bevar alle pk_* fra URL (PromoteKit kan legge disse inn)
    Object.entries(q).forEach(([k, v]) => {
      if (k.startsWith("pk_")) url.searchParams.set(k, String(v));
    });

    return url.toString();
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!href) return;
    const a = document.getElementById("stripeLink");
    const t = setTimeout(() => a?.click(), 1200); // pustepause så PromoteKit rekker tracking
    return () => clearTimeout(t);
  }, [href]);

  return (
    <>
      <Head>
        <title>Buy Pro · MoodMap</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://buy.stripe.com" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <p>Recording your click… redirecting to Stripe</p>
        {href ? (
          <>
            <a id="stripeLink" href={href} style={{ display: "none" }}>
              Continue
            </a>
            <a className="underline mt-4" href={href}>
              Click here if nothing happens.
            </a>
          </>
        ) : (
          <a className="underline mt-4" href="https://moodmap-app.com/pro">
            Go back
          </a>
        )}
      </main>
    </>
  );
}
