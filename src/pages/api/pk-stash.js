import { paymentRedis } from "../../lib/payment-redis.js";
export const config = { maxDuration: 5 };

// Optional affiliate attribution never blocks checkout. Unlike payment state,
// this hint can be lost safely; do not expose Redis keys in the public response.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.setHeader("Allow", "GET").status(405).end();
  const { uid, slug } = req.query || {};
  if (typeof uid !== "string" || !/^[A-Za-z0-9_-]{6,128}$/.test(uid) || typeof slug !== "string" || !/^[A-Za-z0-9_-]{1,32}$/.test(slug)) return res.status(400).json({ ok: false });
  try {
    // Correct REST form: full command array posted to the Redis base URL.
    await paymentRedis(["SETEX", `ref:${uid}`, "900", JSON.stringify({ slug, ts: Date.now() })]);
    return res.status(200).json({ ok: true });
  } catch { return res.status(204).end(); }
}
