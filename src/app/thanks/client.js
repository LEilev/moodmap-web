// src/app/thanks/client.js  ← **CLIENT COMPONENT** (interactive)

"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ThanksClient({ deepLink: serverLink = "" }) {
  const params = useSearchParams();

  const deepLink = useMemo(() => {
    if (serverLink) return serverLink;
    if (!params) return "";
    const u = params.get("u") || "";
    const s = params.get("s") || "";
    const exp = params.get("exp") || "";
    const sig = params.get("sig") || "";
    if (!u || !s || !exp || !sig) return "";
    return `moodmap-app://activate?u=${encodeURIComponent(u)}&s=${encodeURIComponent(
      s,
    )}&exp=${exp}&sig=${sig}`;
  }, [serverLink, params]);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    if (!email || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, link: deepLink }),
      });

      if (!res.ok) {
        const { error = "Unknown error" } = await res.json();
        throw new Error(error);
      }

      setStatus("sent");
      console.info("receipt_send_success", { email });
    } catch (err) {
      console.error("receipt_send_failed", err);
      setErrMsg(err.message);
      setStatus("error");
    }
  }

  const inputDisabled = status === "sending" || status === "sent";
  const btnLabel =
    status === "sending"
      ? "Sending…"
      : status === "sent"
        ? "Link sent! ✅"
        : "Email me this link";

  return (
    <main className="min-h-screen bg-primary-blue text-white font-geist-sans px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-center border border-white/20">
        <Image
          src="/icon.png"
          alt="MoodMap logo"
          width={60}
          height={60}
          className="mx-auto mb-6"
          priority
        />

        {deepLink ? (
          <>
            <h1 className="text-4xl font-bold mb-4">🎉 Payment successful</h1>
            <p className="text-lg mb-10 text-white/90">
              Your Pro access is active. Tap below to open the app and finish setup.
            </p>

            {/* Deep‑link CTA */}
            <a
              href={deepLink}
              className="inline-block bg-white text-primary-blue font-bold tracking-wide text-lg rounded-full px-6 py-3 shadow-sm transition hover:bg-white/90 hover:shadow-md hover:brightness-105 mb-10"
            >
              🚀 Open MoodMap &amp; Activate Pro
            </a>

            {/* E‑mail input */}
            <form
              onSubmit={handleSend}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your e‑mail address"
                className="flex-grow rounded-full bg-white/20 placeholder-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                required
                disabled={inputDisabled}
              />

              <button
                type="submit"
                className="bg-white text-primary-blue font-bold tracking-wide rounded-full px-6 py-3 shadow-sm transition hover:bg-white/90 hover:shadow-md hover:brightness-105 disabled:opacity-80 disabled:ring-1 disabled:ring-white/20 disabled:cursor-not-allowed"
                disabled={inputDisabled}
              >
                {btnLabel}
              </button>
            </form>

            {/* Feedback messages */}
            {status === "error" && (
              <p className="mt-3 text-red-300 text-sm">❌ {errMsg}</p>
            )}
            {status === "sent" && (
              <p className="mt-3 text-green-300 text-sm">
                We'll see you in the app! 📥
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">⚠️ Invalid Link</h1>
            <p className="text-lg text-white/80">
              Something’s missing. Contact{" "}
              <a
                href="mailto:moodmap.tech@gmail.com"
                className="underline hover:text-white"
              >
                support@moodmap-app.com
              </a>
              .
            </p>
          </>
        )}
      </div>
    </main>
  );
}
