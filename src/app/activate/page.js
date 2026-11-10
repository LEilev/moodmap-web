// src/app/activate/page.js
import ActivateClient from "./ActivateClient";
import { validSessionId } from "@/lib/checkout-access.js";
import { verifyHmacSignature } from "@/lib/universal-link.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activate",
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function ActivatePage({ searchParams }) {
  const params = await searchParams || {};
  const first = (value) => typeof value === "string" ? value : "";
  const s = first(params.s);
  const u = first(params.u);
  const exp = first(params.exp);
  const sig = first(params.sig);
  const valid = validSessionId(s) && verifyHmacSignature(u, s, exp, sig);
  return <ActivateClient activation={valid ? { u, s, exp, sig } : null} refreshHref={validSessionId(s) ? `/thanks?s=${encodeURIComponent(s)}` : ""} />;
}
