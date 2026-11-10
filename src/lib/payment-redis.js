// Critical payment operations fail closed without a durable shared store.
export async function paymentRedis(command, { fetcher = fetch, env = process.env } = {}) {
  const url = env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Payment store is not configured");
  const response = await fetcher(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`Payment store HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error("Payment store rejected the operation");
  return data.result;
}
const LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count`;
export async function paymentRateLimit(key, limit, seconds, command = paymentRedis) {
  const count = await command(["EVAL", LIMIT_SCRIPT, "1", key, String(seconds)]);
  if (!Number.isFinite(Number(count))) throw new Error("Invalid rate limit response");
  return Number(count) <= limit;
}
