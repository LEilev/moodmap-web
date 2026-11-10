import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { CheckoutError, verifyCheckout, hashCheckoutEmail, createReceiptToken, verifyReceiptToken } from "../src/lib/checkout-access.js";
import { verifyHmacSignature, generateHmacSignature } from "../src/lib/universal-link.js";
import { createEventStore } from "../src/lib/redis-dedupe.js";
import { paymentRedis } from "../src/lib/payment-redis.js";
import { fulfillStripeEvent } from "../src/lib/stripe-fulfillment.js";
import { createUniversalLinkHandler } from "../src/pages/api/universal-link.js";
import { createReceiptHandler } from "../src/pages/api/send-receipt.js";
import { createStripeWebhookHandler } from "../src/pages/api/stripe-webhook.js";
import { catchupAuthorization, createCatchupHandler } from "../src/pages/api/stripe-catchup.js";

const SID = "cs_test_moodmap_local_test_12345";
const USER = hashCheckoutEmail("buyer@example.com");
const env = { STRIPE_SECRET_KEY: "sk_test_local_only_not_valid", RESEND_API_KEY: "re_local_only_not_valid", STRIPE_WEBHOOK_SECRET: "whsec_local_only" };
const paid = () => ({ id: SID, mode: "subscription", status: "complete", payment_status: "paid", customer_details: { email: "Buyer@example.com" }, customer: { id: "cus_local", email: "buyer@example.com" }, subscription: { id: "sub_local", status: "active", metadata: {}, customer: "cus_local", items: { data: [{ price: { id: "price_premium" } }] } } });
function response() {
  return { statusCode: 200, headers: {}, body: null, setHeader(key, value) { this.headers[key] = value; return this; }, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; }, end(value) { this.body = value; return this; }, send(value) { this.body = value; return this; } };
}
function request(body = {}, method = "POST") { return { method, headers: {}, body }; }
function fakeStore() {
  const done = new Set(), locks = new Map();
  const calls = [];
  return { done, locks, calls,
    async acquire(id) { calls.push(["acquire", id]); if (done.has(id)) return { state: "processed" }; if (locks.has(id)) return { state: "busy" }; const token = `lease_${calls.length}`; locks.set(id, token); return { state: "acquired", token }; },
    async complete(id, token) { assert.equal(locks.get(id), token); calls.push(["complete", id]); done.add(id); locks.delete(id); },
    async release(id, token) { calls.push(["release", id]); if (locks.get(id) === token) locks.delete(id); },
  };
}
function fakeStripe(session = paid()) {
  return { checkout: { sessions: { retrieve: async () => session } }, subscriptions: { retrieve: async () => session.subscription, update: async () => ({}) }, customers: { retrieve: async () => session.customer, update: async () => ({}) }, invoices: { update: async () => ({}), retrieve: async () => ({ id: "in_local", subscription: "sub_local", customer_email: "buyer@example.com" }) } };
}
const event = () => ({ id: "evt_local_1", type: "checkout.session.completed", data: { object: paid() } });
function webhookRequest() { const req = Readable.from([Buffer.from("local signed fixture")]); req.method = "POST"; req.headers = { "stripe-signature": "test" }; return req; }

test("checkout verification accepts a paid active subscription and derives its identity", async () => {
  const result = await verifyCheckout(SID, { stripe: fakeStripe(), env });
  assert.equal(result.email, "buyer@example.com"); assert.equal(result.userId, USER);
});
for (const [description, mutate, code] of [
  ["unpaid checkout", (s) => { s.payment_status = "unpaid"; }, "payment_pending"],
  ["incomplete checkout", (s) => { s.status = "open"; }, "payment_pending"],
  ["cancelled subscription", (s) => { s.subscription.status = "canceled"; }, "subscription_unavailable"],
  ["unrelated one-time payment", (s) => { s.mode = "payment"; }, "invalid_checkout"],
]) test(`checkout rejects ${description}`, async () => {
  const session = paid(); mutate(session);
  await assert.rejects(verifyCheckout(SID, { stripe: fakeStripe(session), env }), (e) => e instanceof CheckoutError && e.code === code);
});
test("checkout preserves the established subscription identity across email changes", async () => {
  const session = paid(); session.subscription.metadata.app_user_id = "mm_existing_identity";
  assert.equal((await verifyCheckout(SID, { stripe: fakeStripe(session), env })).userId, "mm_existing_identity");
});
test("checkout honors configured product restrictions", async () => {
  await assert.rejects(verifyCheckout(SID, { stripe: fakeStripe(), env: { ...env, STRIPE_PREMIUM_PRICE_IDS: "price_other" } }), { code: "invalid_product" });
});
test("a legitimate trial/coupon still requires an active or trialing subscription", async () => {
  const session = paid(); session.payment_status = "no_payment_required"; session.subscription.status = "trialing";
  assert.equal((await verifyCheckout(SID, { stripe: fakeStripe(session), env })).sessionId, SID);
});
test("receipt proof rejects alteration, another session, expiry and the native shared secret", () => {
  const now = 1800000000000;
  const token = createReceiptToken(SID, { env, now });
  assert.equal(verifyReceiptToken(token, SID, { env, now }).s, SID);
  assert.equal(verifyReceiptToken(`${token}0`, SID, { env, now }), null);
  assert.equal(verifyReceiptToken(token, `${SID}other`, { env, now }), null);
  assert.equal(verifyReceiptToken(token, SID, { env, now: now + 1800001 }), null);
  assert.equal(verifyReceiptToken(token, SID, { env: { HMAC_SECRET: env.STRIPE_SECRET_KEY }, now }), null);
});
test("activation signature validation handles malformed hex without throwing", () => {
  const original = process.env.HMAC_SECRET; process.env.HMAC_SECRET = "fake_local_activation_key";
  try {
    const exp = Math.floor(Date.now() / 1000) + 600;
    const sig = generateHmacSignature(USER, SID, exp);
    assert.equal(verifyHmacSignature(USER, SID, exp, sig), true);
    for (const bad of ["", "xx", sig.slice(2), `${sig}00`, null]) assert.equal(verifyHmacSignature(USER, SID, exp, bad), false);
    assert.equal(verifyHmacSignature(USER, SID, 1, sig), false);
  } finally { if (original === undefined) delete process.env.HMAC_SECRET; else process.env.HMAC_SECRET = original; }
});
test("signing endpoint refuses invented identity and never signs an unpaid checkout", async () => {
  let signed = 0;
  const makeLink = () => { signed++; return "https://moodmap-app.com/activate"; };
  const handler = createUniversalLinkHandler({ verify: async () => ({ userId: USER }), makeLink, limit: async () => true });
  const mismatch = response(); await handler(request({ sessionId: SID, userId: "someone_else" }), mismatch);
  assert.equal(mismatch.statusCode, 403); assert.equal(signed, 0);
  const unpaid = createUniversalLinkHandler({ verify: async () => { throw new CheckoutError("payment_pending", 409); }, makeLink, limit: async () => true });
  const res = response(); await unpaid(request({ sessionId: SID }), res);
  assert.equal(res.statusCode, 409); assert.equal(signed, 0);
});
test("receipt endpoint rejects the previous arbitrary email/link interface before any I/O", async () => {
  let calls = 0;
  const handler = createReceiptHandler({ fetcher: async () => { calls++; }, verify: async () => { calls++; }, env });
  const res = response(); await handler(request({ email: "other@example.com", link: "https://example.com" }), res);
  assert.equal(res.statusCode, 400); assert.equal(calls, 0);
});
test("receipt uses verified recipient and own link, then deduplicates a retry", async () => {
  const token = createReceiptToken(SID, { env });
  const sent = []; const store = fakeStore();
  const handler = createReceiptHandler({ env, store, verifyProof: (t, s) => verifyReceiptToken(t, s, { env }), verify: async () => ({ email: "buyer@example.com", userId: USER }), limit: async () => true,
    makeLink: () => "https://moodmap-app.com/activate?s=fixture&sig=safe", fetcher: async (url, init) => { sent.push({ url, init, body: JSON.parse(init.body) }); return { ok: true }; } });
  const body = { sessionId: SID, receiptToken: token, email: "attacker@example.com", link: "https://example.com/phish" };
  const first = response(); await handler(request(body), first);
  const second = response(); await handler(request(body), second);
  assert.equal(first.statusCode, 200); assert.equal(second.statusCode, 200); assert.equal(sent.length, 1);
  assert.equal(sent[0].body.to, "buyer@example.com"); assert.match(sent[0].body.html, /moodmap-app\.com\/activate/); assert.doesNotMatch(sent[0].body.html, /attacker|example\.com\/phish/);
  assert.match(sent[0].init.headers["Idempotency-Key"], /^moodmap-receipt\//);
});
test("receipt provider failure remains retryable and is never marked sent", async () => {
  const token = createReceiptToken(SID, { env }); const store = fakeStore(); let calls = 0;
  const handler = createReceiptHandler({ env, store, verifyProof: (t, s) => verifyReceiptToken(t, s, { env }), verify: async () => ({ email: "buyer@example.com", userId: USER }), limit: async () => true, makeLink: () => "https://moodmap-app.com/activate", fetcher: async () => ({ ok: ++calls > 1 }) });
  const body = { sessionId: SID, receiptToken: token };
  const first = response(); await handler(request(body), first);
  assert.equal(first.statusCode, 502); assert.equal(store.done.size, 0); assert.equal(store.locks.size, 0);
  const retry = response(); await handler(request(body), retry);
  assert.equal(retry.statusCode, 200); assert.equal(store.done.size, 1);
});
test("receipt quota rejection does not send or retain a lease", async () => {
  const token = createReceiptToken(SID, { env }); const store = fakeStore(); let sent = 0;
  const handler = createReceiptHandler({ env, store, verifyProof: (t, s) => verifyReceiptToken(t, s, { env }), verify: async () => ({ email: "buyer@example.com", userId: USER }), limit: async () => false, fetcher: async () => { sent++; } });
  const res = response(); await handler(request({ sessionId: SID, receiptToken: token }), res);
  assert.equal(res.statusCode, 429); assert.equal(sent, 0); assert.equal(store.locks.size, 0);
});
test("checking processed state is read-only, and lost lease cannot mark completion", async () => {
  const calls = []; const store = createEventStore({ command: async (command) => { calls.push(command); return command[0] === "GET" ? null : 0; } });
  assert.equal(await store.alreadyProcessed("evt_test"), false); assert.deepEqual(calls[0], ["GET", "stripe:event:v2:done:evt_test"]);
  await assert.rejects(store.complete("evt_test", "wrong_owner"), /lease expired/);
});
test("payment store fails closed on missing config and Redis application errors", async () => {
  await assert.rejects(paymentRedis(["GET", "test"], { env: {} }), /not configured/);
  await assert.rejects(paymentRedis(["GET", "test"], { env: { UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test" }, fetcher: async () => ({ ok: true, json: async () => ({ error: "permission denied" }) }) }), /rejected/);
});
test("fulfillment uses the correct SETEX order and makes RC failure retryable", async () => {
  const fixture = event(); fixture.data.object.invoice = "in_local"; const commands = [];
  await assert.rejects(fulfillStripeEvent(fixture, { stripe: fakeStripe(), command: async (c) => { commands.push(c); return c[0] === "SETEX" ? "OK" : null; }, sync: async () => false }), /sync failed/);
  const setex = commands.find((c) => c[0] === "SETEX");
  assert.equal(setex[1], "inv:in_local"); assert.equal(setex[2], "900"); assert.equal(JSON.parse(setex[3]).app_user_id, USER);
});
test("delayed checkout payment does not synchronize access until confirmed", async () => {
  const fixture = event(); fixture.data.object.payment_status = "unpaid"; let synced = 0;
  await fulfillStripeEvent(fixture, { stripe: fakeStripe(), command: async () => null, sync: async () => { synced++; return true; } });
  assert.equal(synced, 0);
  fixture.type = "checkout.session.async_payment_succeeded"; fixture.data.object.payment_status = "paid";
  await fulfillStripeEvent(fixture, { stripe: fakeStripe(), command: async () => null, sync: async () => { synced++; return true; } });
  assert.equal(synced, 1);
});
test("subscription lifecycle synchronization never writes back to the same subscription", async () => {
  const stripe = fakeStripe(); let updates = 0, syncs = 0;
  stripe.subscriptions.update = async () => { updates++; };
  const subscription = paid().subscription;
  subscription.metadata.app_user_id = USER;
  for (const type of ["customer.subscription.updated", "customer.subscription.deleted"]) {
    await fulfillStripeEvent({ id: `evt_${type.replaceAll(".", "_")}`, type, data: { object: subscription } }, {
      stripe, command: async () => null, sync: async () => { syncs++; return true; },
    });
  }
  assert.equal(updates, 0); assert.equal(syncs, 2);
});
test("webhook returns failure on RC failure, releases lease, then completes retry once", async () => {
  const store = fakeStore(); const stripe = fakeStripe(); stripe.webhooks = { constructEvent: () => event() }; let attempts = 0;
  const handler = createStripeWebhookHandler({ env, getStripe: () => stripe, store, fulfill: (e) => fulfillStripeEvent(e, { stripe, command: async () => null, sync: async () => ++attempts > 1 }) });
  const first = response(); await handler(webhookRequest(), first);
  assert.equal(first.statusCode, 500); assert.equal(store.done.size, 0); assert.equal(store.locks.size, 0);
  const retry = response(); await handler(webhookRequest(), retry);
  assert.equal(retry.statusCode, 200); assert.equal(store.done.size, 1);
  const duplicate = response(); await handler(webhookRequest(), duplicate);
  assert.equal(duplicate.body.deduped, true); assert.equal(attempts, 2);
});
test("parallel webhook delivery stays retryable while first attempt is in flight", async () => {
  const store = fakeStore(); let release; const gate = new Promise((resolve) => { release = resolve; }); let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const handler = createStripeWebhookHandler({ env, getStripe: () => ({ webhooks: { constructEvent: () => event() } }), store, fulfill: async () => { entered(); await gate; } });
  const first = response(); const pending = handler(webhookRequest(), first); await started;
  const duplicate = response(); await handler(webhookRequest(), duplicate);
  assert.equal(duplicate.statusCode, 503); assert.equal(store.done.size, 0);
  release(); await pending; assert.equal(first.statusCode, 200);
});
test("webhook rejects forged signatures without acquiring a lease", async () => {
  const store = fakeStore(); const handler = createStripeWebhookHandler({ env, store, getStripe: () => ({ webhooks: { constructEvent: () => { throw new Error("bad signature"); } } }) });
  const res = response(); await handler(webhookRequest(), res);
  assert.equal(res.statusCode, 400); assert.equal(store.calls.length, 0);
});
test("catchup is unavailable without a configured secret and denies wrong auth", async () => {
  assert.deepEqual(catchupAuthorization({ headers: {}, query: {} }, {}), { ok: false, status: 503 });
  assert.equal(catchupAuthorization({ headers: { authorization: "Bearer wrong" } }, { CRON_SECRET: "test_secret" }).ok, false);
  assert.equal(catchupAuthorization({ headers: { authorization: "Bearer test_secret" } }, { CRON_SECRET: "test_secret" }).ok, true);
  let touched = false; const handler = createCatchupHandler({ env: {}, getStripe: () => { touched = true; } });
  const res = response(); await handler(request({}, "GET"), res);
  assert.equal(res.statusCode, 503); assert.equal(touched, false);
});
