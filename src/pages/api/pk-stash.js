// FILE: pages/api/pk-stash.js
// Soft mode: prøver å stash’e {uid->slug}, men returnerer 204 ved alle Upstash-feil.
// Tracking fungerer uansett (stash er kun for valgfri ref_slug).

export const config = { maxDuration: 5 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "moodmap-app.com";
    const url = new URL(req.url, `${proto}://${host}`);

    const uid = (url.searchParams.get("uid") || "").trim();
    const slug = (url.searchParams.get("slug") || "").trim();
    const ttlParam = Number(url.searchParams.get("ttl") || 900);
    const ttl = Math.max(600, Math.min(900, Number.isFinite(ttlParam) ? ttlParam : 900));

    if (!uid || !/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
      return res.status(400).json({ ok: false, error: "invalid uid" });
    }
    if (!slug || !/^[A-Za-z0-9_-]{1,32}$/.test(slug)) {
      return res.status(400).json({ ok: false, error: "invalid slug" });
    }

    const UURL = (process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
    const UTOK = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Ingen Upstash config? Ikke blokker.
    if (!UURL || !UTOK) return res.status(204).end();

    const key = `ref:${uid}`;
    const value = JSON.stringify({ slug, ts: Date.now() });

    // Prøv JSON body mode
    let r = await fetch(`${UURL}/setex`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UTOK}`, "content-type": "application/json" },
      body: JSON.stringify([key, value, ttl]),
      cache: "no-store",
    });

    // Fallback: path params mode
    if (!r.ok) {
      r = await fetch(
        `${UURL}/setex/${encodeURIComponent(key)}/${ttl}/${encodeURIComponent(value)}`,
        { method: "POST", headers: { Authorization: `Bearer ${UTOK}` }, cache: "no-store" }
      );
    }

    // Soft-fail: ikke blokker selv om Upstash sier nei (read-only / feil URL / osv.)
    if (!r.ok) return res.status(204).end();

    return res.status(200).json({ ok: true, key, slug, ttl });
  } catch {
    // Soft-fail på uventet feil
    return res.status(204).end();
  }
}
