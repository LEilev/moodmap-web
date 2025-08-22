// FILE: pages/api/pk-stash.js
// Optional helper: short-lived stash { uniqueId -> slug } for 10–15 minutes
// - Non-blocking; used by /buy.js just before redirect
// - Webhook can read it via key "ref:<uniqueId>" to write invoice/sub metadata

export const config = { maxDuration: 5 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const proto = (req.headers["x-forwarded-proto"] || "https");
    const host = req.headers.host || "moodmap-app.com";
    const url = new URL(req.url, `${proto}://${host}`);

    const uid = (url.searchParams.get("uid") || "").trim();
    const slug = (url.searchParams.get("slug") || "").trim();
    const ttlParam = Number(url.searchParams.get("ttl") || 900);
    const ttl = Math.max(600, Math.min(900, isFinite(ttlParam) ? ttlParam : 900)); // 10–15 min

    if (!uid || !/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
      return res.status(400).json({ ok: false, error: "invalid uid" });
    }
    if (!slug || !/^[A-Za-z0-9_-]{1,32}$/.test(slug)) {
      return res.status(400).json({ ok: false, error: "invalid slug" });
    }

    const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      // No cache available — acknowledge without storing (non-blocking semantics)
      return res.status(204).end();
    }

    const key = `ref:${uid}`;
    const value = JSON.stringify({ slug, ts: Date.now() });

    const ok = await fetch(`${UPSTASH_URL}/setex`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([key, value, ttl]),
      cache: "no-store",
    })
      .then((r) => r.ok)
      .catch(() => false);

    if (!ok) return res.status(500).json({ ok: false, error: "stash failed" });

    return res.status(200).json({ ok: true, key, slug, ttl });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
