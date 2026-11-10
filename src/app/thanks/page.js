import ThanksClient from "./client";
import { CheckoutError, validSessionId, verifyCheckout, createReceiptToken, maskCheckoutEmail } from "@/lib/checkout-access.js";
import { buildActivationLink } from "@/lib/universal-link.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your MoodMap access", referrer: "no-referrer", robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
const first = (value) => typeof value === "string" ? value : "";

export default async function ThanksPage({ searchParams }) {
  const params = await searchParams || {};
  const sessionId = first(params.s) || first(params.cs) || first(params.session_id);
  let props = { state: "invalid", sessionId: "", deepLink: "", receiptToken: "", maskedEmail: "" };
  if (validSessionId(sessionId)) {
    try {
      // Never trust URL-supplied email, identity, signatures, or a claimed success.
      const checkout = await verifyCheckout(sessionId);
      props = { state: "ready", sessionId, deepLink: buildActivationLink(checkout.userId, sessionId), receiptToken: createReceiptToken(sessionId), maskedEmail: maskCheckoutEmail(checkout.email) };
    } catch (error) {
      props.state = error instanceof CheckoutError && error.code === "payment_pending" ? "pending"
        : error instanceof CheckoutError ? "invalid" : "unavailable";
      if (!(error instanceof CheckoutError)) console.error("[thanks] checkout verification temporarily unavailable");
    }
  }
  return <ThanksClient {...props} />;
}
