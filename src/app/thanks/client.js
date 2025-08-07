// src/app/thanks/client.js   v2.5.0   • sends mail on button‑click only
"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Copy } from "lucide-react";

export default function ThanksClient({ deepLink: serverLink = "" }) {
  const params = useSearchParams();

  /* ---------- Build deep‑link ---------- */
  const deepLink = useMemo(() => {
    if (serverLink) return serverLink;
    if (!params) return "";
    const u = params.get("u") || "";
    const s = params.get("s") || "";
    const exp = params.get("exp") || "";
    const sig = params.get("sig") || "";
    if (!u || !s || !exp || !sig) return "";
    return `https://moodmap-app.com/activate?u=${encodeURIComponent(
      u,
    )}&s=${encodeURIComponent(s)}&exp=${exp}&sig=${sig}`;
  }, [serverLink, params]);

  /* ---------- Session‑ID + email (if supplied by server via ?ce=) ---------- */
  const sessionId = params?.get("s") || params?.get("cs") || "";
  const autoEmail = params?.get("ce") || "";              // added in Thanks Page

  /* ---------- Send‑once helper ---------- */
  const sendReceiptOnce = useCallback(async () => {
    if (!autoEmail || !deepLink || !sessionId) return;
    const key = `mailSent_${sessionId}`;
    if (localStorage.getItem(key)) return;                // dedupe

    try {
      await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: autoEmail, link: deepLink }),
      });
      localStorage.setItem(key, "1");
      console.info("receipt_mail_sent");
    } catch (err) {
      console.warn("receipt_mail_fail", err);
    }
  }, [autoEmail, deepLink, sessionId]);

  /* ---------- e‑mail Fallback form (unchanged) ---------- */
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const lastClick = useRef(0);

  async function handleManualSend(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClick.current < 5000) return;
    lastClick.current = now;

    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, link: deepLink }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  /* ---------- UI ---------- */
  const qrSrc = deepLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        deepLink,
      )}`
    : "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white p-8">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-3xl">
        <Image src="/icon.png" alt="MoodMap" width={60} height={60} className="mx-auto mb-5" priority />

        {deepLink ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-3">🎉 Payment successful</h1>
            <p className="text-center mb-6">Tap below to open the app and finish setup.</p>

            {/* ——— MAIN BUTTON ——— */}
            <a
              href={deepLink}
              onClick={sendReceiptOnce}
              className="block bg-white text-black text-center font-semibold py-3 rounded-full mb-4 hover:brightness-105"
            >
              🚀 Open MoodMap
            </a>

            {/* QR + copy untouched */}
            {qrSrc && (
              <div className="flex justify-center mb-6">
                <img src={qrSrc} alt="QR" width={160} height={160} className="rounded-lg border border-white/20" />
              </div>
            )}
            {/* … manual copy & e‑mail fallback (handleManualSend) – uendret … */}
            <form onSubmit={handleManualSend} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your e‑mail"
                required
                className="flex-grow rounded-full bg-white/20 px-4 py-3 placeholder-white focus:outline-none disabled:opacity-60"
                disabled={status !== "idle"}
              />
              <button
                type="submit"
                disabled={status !== "idle"}
                className="rounded-full bg-white text-black px-5 py-3 font-semibold disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✅" : "Email me this link"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-lg">⚠️ Link invalid – contact support.</p>
        )}
      </div>
    </main>
  );
}
