// src/app/thanks/client.js
// -------------------------------------------------------------
// v2.4.0  –  fallback uses https-link, not moodmap-app://
// -------------------------------------------------------------
"use client";

import { useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Copy } from "lucide-react";

export default function ThanksClient({ deepLink: serverLink = "" }) {
  /* ---------- build deep‑link ---------- */
  const params = useSearchParams();
  const deepLink = useMemo(() => {
    if (serverLink) return serverLink;
    if (!params) return "";
    const u = params.get("u") || "";
    const s = params.get("s") || "";
    const exp = params.get("exp") || "";
    const sig = params.get("sig") || "";
    if (!u || !s || !exp || !sig) return "";
    // ✅ Fallback to HTTPS deep-link
    return `https://moodmap-app.com/activate?u=${encodeURIComponent(
      u,
    )}&s=${encodeURIComponent(s)}&exp=${exp}&sig=${sig}`;
  }, [serverLink, params]);

  if (!deepLink && typeof window !== "undefined") {
    console.warn("invalid_link_access");
    window?.posthog?.capture?.("invalid_link_access");
  }

  /* ---------- e‑mail send state ---------- */
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const lastClick = useRef(0);

  async function handleSend(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClick.current < 5000) return; // debounce 5 s
    lastClick.current = now;

    if (!email || status === "sending" || status === "sent") return;

    setStatus("sending");
    try {
      const r = await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, link: deepLink }),
      });
      if (!r.ok) {
        const { error = "Unknown error" } = await r.json();
        throw new Error(error);
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      console.error("receipt_send_failed", err);
    }
  }

  /* ---------- simple QR img (remote service) ---------- */
  const qrSrc = deepLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        deepLink,
      )}`
    : "";

  /* ---------- UI ---------- */
  const disabled = status === "sending" || status === "sent";
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white p-8">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-3xl">
        <Image src="/icon.png" alt="MoodMap" width={60} height={60} className="mx-auto mb-5" />

        {deepLink ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-3">🎉 Payment successful</h1>
            <p className="text-center mb-6">
              Tap below to open the app and finish setup.
            </p>

            <a
              href={deepLink}
              className="block bg-white text-black text-center font-semibold py-3 rounded-full mb-4 hover:brightness-105"
            >
              🚀 Open MoodMap
            </a>

            <div className="flex justify-center mb-6">
              {qrSrc && (
                <img
                  src={qrSrc}
                  alt="QR code"
                  width={160}
                  height={160}
                  className="rounded-lg border border-white/20"
                />
              )}
            </div>

            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(deepLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
              className="flex items-center gap-2 mx-auto text-sm mb-6 hover:underline"
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy unlock link"}
            </button>

            {/* e‑mail fallback */}
            <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow rounded-full bg-white/20 px-4 py-3 placeholder-white focus:outline-none disabled:opacity-60"
                placeholder="Your e‑mail"
                required
                disabled={disabled}
              />
              <button
                type="submit"
                disabled={disabled}
                className="rounded-full bg-white text-black px-5 py-3 font-semibold disabled:opacity-60"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                  ? "Sent ✅"
                  : "Email me this link"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-300 text-sm mt-2">Failed – try again later.</p>
            )}
          </>
        ) : (
          <p className="text-center text-lg">⚠️ Link invalid – contact support.</p>
        )}
      </div>
    </main>
  );
}
