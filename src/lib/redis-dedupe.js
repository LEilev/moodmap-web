import { randomUUID } from "node:crypto";
import { paymentRedis } from "./payment-redis.js";

// Old bare event-id keys were reservations, not proof of completion. Use a new
// namespace and separate the short processing lease from durable completion.
const CLAIM_SCRIPT = `
if redis.call('GET', KEYS[1]) then return 'processed' end
if redis.call('SET', KEYS[2], ARGV[1], 'NX', 'EX', ARGV[2]) then return 'acquired' end
return 'busy'`;
const COMPLETE_SCRIPT = `
if redis.call('GET', KEYS[2]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], '1', 'EX', ARGV[2])
redis.call('DEL', KEYS[2])
return 1`;
const RELEASE_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end
return 0`;

export function createEventStore({ command = paymentRedis, prefix = "stripe:event:v2", leaseSeconds = 180, retentionSeconds = 604800 } = {}) {
  const keys = (id) => {
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,256}$/.test(id)) throw new Error("Invalid event identifier");
    return [`${prefix}:done:${id}`, `${prefix}:lock:${id}`];
  };
  return {
    async alreadyProcessed(id) { return (await command(["GET", keys(id)[0]])) !== null; },
    async acquire(id) {
      const token = randomUUID();
      const state = await command(["EVAL", CLAIM_SCRIPT, "2", ...keys(id), token, String(leaseSeconds)]);
      if (!["processed", "busy", "acquired"].includes(state)) throw new Error("Invalid lease response");
      return { state, token: state === "acquired" ? token : null };
    },
    async complete(id, token) {
      if (!token) throw new Error("A processing lease is required");
      const result = await command(["EVAL", COMPLETE_SCRIPT, "2", ...keys(id), token, String(retentionSeconds)]);
      if (Number(result) !== 1) throw new Error("Processing lease expired before completion");
    },
    async release(id, token) {
      if (token) await command(["EVAL", RELEASE_SCRIPT, "1", keys(id)[1], token]);
    },
  };
}
export const stripeEventStore = createEventStore();
export const alreadyProcessed = (id) => stripeEventStore.alreadyProcessed(id);
export const acquireEvent = (id) => stripeEventStore.acquire(id);
export const markProcessed = (id, token) => stripeEventStore.complete(id, token);
export const releaseEvent = (id, token) => stripeEventStore.release(id, token);
