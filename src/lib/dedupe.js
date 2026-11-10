// Compatibility exports. Checking is read-only; completion requires a lease.
export { alreadyProcessed as isDuplicate, acquireEvent, markProcessed, releaseEvent } from "./redis-dedupe.js";
