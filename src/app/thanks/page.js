// src/app/thanks/page.js
// -----------------------------------------------------------------------------
// Thanks (server) – bygger ferdig deep link til /activate og sørger for at
//   1) u = sha256(lowercase(email))     ← unik, stabil app_user_id
//   2) HMAC-signert UL (u, s, exp, sig)
//   3) ?ce=email appendes én gang via redirect, slik at klienten kan sende mail
// -----------------------------------------------------------------------------
// Avh.: STRIPE_SECRET_KEY, UNIVERSAL_LINK_SECRET
// -----------------------------------------------------------------------------

import Stripe from "stripe";
import crypto from "crypto";
import { redirect } from "next/navigation";
import ThanksClient from "./client";
import { generateHmacSignature } from "@/lib/universal-link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Helper: sha256(email)
function hashEmail(e) {
  return crypto.createHash("sha256").update(e.trim().toLowerCase()).digest("hex");
}

// Helper: bygg full UL til /activate
function buildDeepLink(u, s, exp, sig) {
  const base = "https://moodmap-app.com/activate";
  const q = new URLSearchParams({ u, s, exp: String(exp), sig });
  return `${base}?${q.toString()}`;
}

// Server component
export default async function ThanksPage({ searchParams }) {
  // Klient kan allerede ha komplette parametere (f.eks. fra e-postlenke)
  let u = searchParams?.u || "";
  let s = searchParams?.s || searchParams?.cs || ""; // støtter ?cs= også
  let exp = searchParams?.exp || "";
  let sig = searchParams?.sig || "";
  let ce = searchParams?.ce || ""; // e-post, om allerede injectet
  let deepLink = "";
  let email = "";

  // Hvis vi ikke har komplett UL-sett, men har en Checkout Session-id (s/cs),
  // henter vi session for å bygge u/s/exp/sig + ce.
  const missingUL = !(u && s && exp && sig);
  if (missingUL && s) {
    try {
      const session = await stripe.checkout.sessions.retrieve(s, {
        expand: ["customer_details"],
      });

      // e-post er obligatorisk i Payment Link-oppsettet ditt; fallback er likevel med
      const email0 = session.customer_details?.email || "";
      const uHash = email0 ? hashEmail(email0) : (session.metadata?.app_user_id || "");

      // Sett nøkler
      u = uHash || "";
      exp = Math.floor(Date.now() / 1000) + 600; // 10 minutter gyldighet
      sig = generateHmacSignature(u, s, exp);
      email = email0;

      // Første gang: legg på ?ce=<email> slik at klienten kan sende mail ved klikk
      if (email && !searchParams?.ce) {
        const url = new URL(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://moodmap-app.com"}/thanks`);
        url.searchParams.set("u", u);
        url.searchParams.set("s", s);
        url.searchParams.set("exp", String(exp));
        url.searchParams.set("sig", sig);
        url.searchParams.set("ce", email);
        // Bevar ev. opprinnelig ?cs= for historikk/lenker (valgfritt)
        if (searchParams?.cs) url.searchParams.set("cs", searchParams.cs);

        redirect(url.toString());
      }
    } catch (err) {
      console.error("[thanks] Failed to retrieve Checkout Session", err?.message || err);
      // Fortsetter til render av feilmelding under hvis vi ikke kan bygge link
    }
  } else if (!missingUL) {
    // Parametre er allerede komplette – hvis ce ikke finnes men email ligger i URL,
    // lar vi klienten håndtere fallback-form (manuelt input).
    email = ce || "";
  }

  // Bygg deepLink hvis vi har alt
  if (u && s && exp && sig) {
    deepLink = buildDeepLink(u, s, exp, sig);
  }

  // Server-render: send ferdig deepLink som prop.
  // Klienten vil:
  //  - vise "Open MoodMap"-knapp
  //  - QR + copy
  //  - sende e-post ved klikk hvis ?ce= er i URL (dedupe pr sessionId) – se client.js
  return <ThanksClient deepLink={deepLink} />;
}
