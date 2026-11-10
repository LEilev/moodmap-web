"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Copy, Mail, Check, ArrowUpRight } from "lucide-react";

export default function ThanksClient({ state = "invalid", deepLink = "", sessionId = "", receiptToken = "", maskedEmail = "" }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const sending = useRef(false);
  const tracked = useRef(false);

  useEffect(() => {
    // Remove legacy email/signature parameters without a network redirect.
    const url = new URL(window.location.href);
    ["ce", "email", "u", "exp", "sig"].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
    if (!tracked.current && typeof window.mmGaEvent === "function") {
      window.mmGaEvent("thanks_opened", { source: "stripe_redirect", deep_link_rendered: !!deepLink });
      tracked.current = true;
    }
  }, [deepLink]);

  useEffect(() => {
    if (!deepLink) return;
    let cancelled = false;
    import("qrcode").then((module) => (module.default || module).toDataURL(deepLink, { width: 240, margin: 4, errorCorrectionLevel: "M" }))
      .then((data) => { if (!cancelled) setQr(data); }).catch(() => { /* The direct link remains available. */ });
    return () => { cancelled = true; };
  }, [deepLink]);

  async function sendReceipt() {
    if (sending.current || !receiptToken) return;
    sending.current = true;
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/send-receipt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, receiptToken }), signal: AbortSignal.timeout(20000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok !== true) throw new Error(data.error || "The email could not be sent. Please try again.");
      setStatus("sent"); setMessage("Sent to the email address you used at checkout. Check your inbox and spam folder.");
    } catch (error) {
      setStatus("error");
      setMessage(error?.name === "TimeoutError" ? "The request timed out. Please try again." : error?.message || "Connection failed. Please try again.");
    } finally { sending.current = false; }
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(deepLink); setCopyStatus("Link copied."); }
    catch { setCopyStatus("Could not copy. Use Open MoodMap or email the link instead."); }
  }

  const pending = state === "pending";
  const ready = state === "ready" && !!deepLink;
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white px-5 py-16">
      <div className="w-full max-w-xl bg-white/5 border border-white/15 p-6 sm:p-9 rounded-3xl">
        <Image src="/icon.png" alt="MoodMap" width={60} height={60} className="mx-auto mb-5 rounded-2xl" priority />
        {ready ? <>
          <h1 className="text-3xl font-bold text-center mb-3">Your Premium+ access is ready</h1>
          <p className="text-center mb-7 text-white/85">Open MoodMap on your phone to finish setup. Your subscription may take a moment to appear.</p>
          <a href={deepLink} rel="noreferrer" className="flex items-center justify-center gap-2 bg-white text-slate-950 font-semibold py-3 px-5 rounded-full mb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Open MoodMap <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          {qr && <figure className="flex flex-col items-center gap-3 my-6">
            {/* A data URL generated on this device; no activation data goes to a QR service. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={240} height={240} alt="Scan this QR code with your phone to open your MoodMap activation link" className="rounded-xl max-w-full h-auto" />
            <figcaption className="text-sm text-white/80 text-center">On a computer? Scan with your phone’s camera.</figcaption>
          </figure>}
          <button type="button" onClick={copyLink} className="flex gap-2 items-center justify-center w-full underline underline-offset-4 py-3 mb-5 rounded-lg focus-visible:outline-2 focus-visible:outline-white">
            <Copy size={17} aria-hidden="true" /> Copy activation link
          </button>
          <p role="status" className="text-sm text-center text-white/85">{copyStatus}</p>
          <div className="border-t border-white/15 pt-6 mt-3">
            <h2 className="font-semibold mb-2">Keep a link in your inbox</h2>
            <p className="text-sm text-white/85 mb-4">We’ll send it to your checkout address{maskedEmail ? ` (${maskedEmail})` : ""}.</p>
            <button type="button" onClick={sendReceipt} disabled={status === "sending" || status === "sent"} className="flex gap-2 items-center justify-center w-full rounded-full bg-white/15 border border-white/25 px-5 py-3 font-semibold disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {status === "sent" ? <Check size={18} aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
              {status === "sending" ? "Sending…" : status === "sent" ? "Email sent" : status === "error" ? "Try sending again" : "Email my activation link"}
            </button>
            <p role={status === "error" ? "alert" : "status"} className="mt-3 text-sm text-white/90">{message}</p>
          </div>
        </> : <>
          <h1 className="text-3xl font-bold text-center mb-4">{pending ? "Your payment is processing" : state === "unavailable" ? "We’re checking your access" : "Let’s find your MoodMap access"}</h1>
          <p className="text-center text-white/85 mb-6">{pending ? "Some payment methods take a little longer. Refresh this page once the payment is confirmed." : state === "unavailable" ? "We couldn’t reach the payment service just now. Please refresh in a moment." : "Open the confirmation link from your checkout, or use Restore purchases in the app. Contact us if you need help."}</p>
          {(pending || state === "unavailable") && <button type="button" onClick={() => window.location.reload()} className="block mx-auto bg-white text-slate-950 px-6 py-3 rounded-full font-semibold">Check again</button>}
        </>}
        <p className="text-center text-sm text-white/80 mt-8">Need help? <a href="mailto:support@moodmap-app.com" className="underline underline-offset-4">Contact MoodMap support</a>.</p>
      </div>
    </main>
  );
}
