// -------------------------------------------------------------
// MoodMap – /thanks          (server component)
// -------------------------------------------------------------
// Handles two entry modes:
//   ① direct HMAC params (link in e‑mail)
//   ② ?cs={CHECKOUT_SESSION_ID}   (Stripe success redirect)
// Adds signature‑length & expiry validation and clearer
// error logging differentiated by Stripe error types.
// -------------------------------------------------------------

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MoodMap • Payment successful",
  robots: { index: false, follow: false },
};

import Stripe from "stripe";
import { generateHmacSignature } from "@/lib/universal-link";
import ThanksClient from "./client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export default async function ThanksPage({ searchParams = {} }) {
  let { u = "", s = "", exp = "", sig = "", cs = "" } = searchParams;

  /* ‑‑‑‑‑ 1 · If only a CheckoutSession ID is present, resolve & sign ‑‑‑‑‑ */
  if (cs && !(u && s && exp && sig)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(cs, {
        expand: ["customer_details"],
      });
      u   = session.client_reference_id || session.metadata?.app_user_id || "";
      s   = cs;
      exp = Math.floor(Date.now() / 1000) + 600;
      sig = generateHmacSignature(u, s, exp);
    } catch (err) {
      const code = err?.type === "StripeRateLimitError" ? "RateLimit"
                 : err?.statusCode === 404                    ? "NotFound"
                 : "StripeErr";
      console.error(`[thanks] ${code}:`, err.message);
      /* graceful fall‑through to “invalid link” UI */
    }
  }

  /* ‑‑‑‑‑ 2 · Lightweight server‑side validation of incoming params ‑‑‑‑‑ */
  const now = Math.floor(Date.now() / 1000);
  const looksValid =
    u && s &&
    sig && sig.length === 64 && /^[a-f0-9]{64}$/i.test(sig) &&
    Number(exp) > now;

  /* Extra guard: don’t trust client‑side for expiry check */
  const deepLink = looksValid
    ? `https://moodmap-app.com/activate?u=${encodeURIComponent(
        u,
      )}&s=${encodeURIComponent(s)}&exp=${exp}&sig=${sig}`
    : "";

  return <ThanksClient deepLink={deepLink} />;
}

/*
 * TODO (perf): consider `export const revalidate = 30`
 * once we put Next .js on the Edge runtime to cache
 * session‑lookups for 30 s.  Skipped for now because
 * checkout → redirect happens only once per user.
 */
