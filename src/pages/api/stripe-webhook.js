// src/pages/api/stripe-webhook.js
import Stripe from "stripe";
import crypto from "crypto";
import { alreadyProcessed, markProcessed } from "@/lib/redis-dedupe";
import { rcSync } from "@/lib/rcSync";

/**
 * Next.js edge/runtime hints
 */
export const config = { api: { bodyParser: false }, maxDuration: 30 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// --- Upstash REST (hint-cache for invoice) ---
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// ---------- utils ----------
function hashEmail(email) {
  if (!email) return null;
  return crypto
    .createHash("sha256")
    .update(String(email).trim().toLowerCase())
    .digest("hex");
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    } catch (e) {
      reject(e);
    }
  });
}

async function upstashGet(key) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null; // fallback til prosessminne i redis-dedupe-modulen
  const url = `${UPSTASH_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const val = json?.result;
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return val || null;
  }
}

async function upstashSetEx(key, seconds, value) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  const body = JSON.stringify([
    key,
    typeof value === "string" ? value : JSON.stringify(value),
    seconds,
  ]);
  const res = await fetch(`${UPSTASH_URL}/setex`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "content-type": "application/json",
    },
    body,
  });
  return res.ok;
}

function ensureString(v) {
  if (v == null) return undefined;
  return String(v);
}

/**
 * Hent e-post fra diverse Stripe-objekter
 */
async function extractEmailFromStripe({ invoice, session }) {
  // 1) Direkte på invoice
  if (invoice?.customer_email) return invoice.customer_email;

  // 2) Fra session
  const sesEmail =
    session?.customer_details?.email ||
    session?.customer_email ||
    session?.metadata?.email;
  if (sesEmail) return sesEmail;

  // 3) Fra Stripe Customer
  const custId = invoice?.customer || session?.customer;
  if (custId) {
    try {
      const cust = await stripe.customers.retrieve(custId);
      if (!cust?.deleted && (cust?.email || cust?.metadata?.email)) {
        return cust.email || cust.metadata.email;
      }
    } catch (e) {
      console.warn("[wh] fetch customer email failed", e?.message);
    }
  }

  return null;
}

/**
 * Finn ref_code med prioritert rekkefølge
 */
async function resolveRefCode({ session, invoice, subscriptionId, redisKey }) {
  // 1) Aller først: Redis-hint
  if (redisKey) {
    const hint = await upstashGet(redisKey);
    if (hint?.ref_code) return hint.ref_code;
  }

  // 2) Fra session (metadata eller client_reference_id)
  const sesRef =
    session?.metadata?.ref_code || session?.client_reference_id || null;
  if (sesRef) return sesRef;

  // 3) Fra invoice.metadata
  if (invoice?.metadata?.ref_code) return invoice.metadata.ref_code;

  // 4) Fra subscription.metadata
  if (subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const subRef = sub?.metadata?.ref_code || null;
      if (subRef) return subRef;
    } catch (e) {
      console.warn("[wh] retrieve sub for ref_code failed", e?.message);
    }
  }

  return null;
}

/**
 * Skriv metadata på Subscription / Customer / Invoice
 */
async function writeStripeMetadata({
  subscriptionId,
  customerId,
  invoiceId,
  refCode,
  appUserId,
}) {
  const meta = {};
  if (refCode) meta.ref_code = ensureString(refCode);
  if (appUserId) meta.app_user_id = ensureString(appUserId);

  // subscription
  if (subscriptionId && Object.keys(meta).length) {
    try {
      await stripe.subscriptions.update(subscriptionId, { metadata: meta });
      console.info("[wh] wrote subscription.metadata", { subscriptionId, meta });
    } catch (e) {
      console.warn("[wh] write subscription.metadata failed", e?.message);
    }
  }

  // customer
  if (customerId && Object.keys(meta).length) {
    try {
      await stripe.customers.update(customerId, { metadata: meta });
      console.info("[wh] wrote customer.metadata", { customerId, meta });
    } catch (e) {
      console.warn("[wh] write customer.metadata failed", e?.message);
    }
  }

  // invoice
  if (invoiceId && Object.keys(meta).length) {
    try {
      const inv = await stripe.invoices.update(invoiceId, { metadata: meta });
      console.info("[wh] wrote invoice.metadata", {
        invoiceId,
        metadata: inv?.metadata,
      });
    } catch (e) {
      console.warn("[wh] write invoice.metadata failed", e?.message);
    }
  }
}

/**
 * Prime invoice.metadata i invoice.created/finalized slik at invoice.paid-snapshot bærer ref_code.
 */
async function primeInvoiceMetadata(inv) {
  const subId = inv?.subscription || null;

  // ref_code: invoice.metadata -> subscription.metadata
  let ensuredRef = inv?.metadata?.ref_code || null;
  if (!ensuredRef && subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      ensuredRef = sub?.metadata?.ref_code || null;
    } catch (e) {
      console.warn(
        "[wh] ref_code fallback (invoice.created/finalized) failed",
        e?.message
      );
    }
  }

  // app_user_id fra email
  let email = inv?.customer_email || null;
  if (!email && inv?.customer) {
    try {
      const cust = await stripe.customers.retrieve(inv.customer);
      email = cust?.email || null;
    } catch (e) {
      console.warn("[wh] fetch customer email fail", e?.message);
    }
  }
  const appUserId = email ? hashEmail(email) : null;

  try {
    const meta = {};
    if (ensuredRef) meta.ref_code = ensuredRef;
    if (appUserId) meta.app_user_id = appUserId;

    if (Object.keys(meta).length > 0) {
      await stripe.invoices.update(inv.id, {
        metadata: { ...(inv.metadata || {}), ...meta },
      });
      console.info("[wh] primed invoice.metadata (created/finalized)", {
        id: inv.id,
        ref_code: ensuredRef || null,
        app_user_id: appUserId || null,
      });
    } else {
      console.info("[wh] nothing to prime (created/finalized)", { id: inv.id });
    }
  } catch (e) {
    console.warn("[wh] prime invoice.metadata fail", e?.message);
  }
}

/**
 * RevenueCat: finn fetchToken = subscription.id (aldri invoice.id)
 */
function stripeFetchToken(obj) {
  return obj?.subscription || obj?.lines?.data?.[0]?.subscription || null;
}

// ---------- handler ----------
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let event;
  try {
    const rawBody = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error("[wh] signature verification failed", e?.message);
    return res.status(400).send("Invalid signature");
  }

  const id = event.id;
  try {
    if (await alreadyProcessed(id)) {
      console.info("[wh] duplicate – skip", id);
      return res.status(200).json({ ok: true, deduped: true });
    }

    switch (event.type) {
      // -------------------------------------------------
      // 1) Pre-prime: før invoice.paid
      // -------------------------------------------------
      case "invoice.created":
      case "invoice.finalized": {
        const inv = event.data.object;
        await primeInvoiceMetadata(inv);
        break;
      }

      // -------------------------------------------------
      // 2) Checkout Session – sett Redis-hint og backfill metadata
      // -------------------------------------------------
      case "checkout.session.completed": {
        const cs = event.data.object;

        const invoiceId = cs?.invoice || null;
        const subscriptionId = cs?.subscription || null;
        const customerId = cs?.customer || null;

        // E-post → app_user_id
        const email = await extractEmailFromStripe({
          session: cs,
          invoice: null,
        });
        const appUserId = email ? hashEmail(email) : null;

        // ref_code: metadata.ref_code > client_reference_id
        const refCode =
          cs?.metadata?.ref_code || cs?.client_reference_id || null;

        // Redis-hint for invoice
        if (invoiceId) {
          const key = `inv:${invoiceId}`;
          await upstashSetEx(key, 900, { ref_code: refCode, app_user_id: appUserId });
          console.info("[wh] set hint", {
            key,
            ref_code: refCode,
            app_user_id: appUserId,
          });
        }

        // Backfill metadata på Stripe-objekter (sub / customer / invoice)
        await writeStripeMetadata({
          subscriptionId,
          customerId,
          invoiceId,
          refCode,
          appUserId,
        });

        // RC sync (bruk alltid subscription.id som fetch_token hvis det finnes)
        const fetchToken = stripeFetchToken({ subscription: subscriptionId });
        if (fetchToken && appUserId) {
          const ok = await rcSync({ appUserId, fetchToken });
          console.info("[wh] rcSync (cs.completed)", {
            ok,
            fetchToken,
            appUserId,
          });
        }

        // Logg etter oppdatering (nyttig ved feilsøking)
        if (invoiceId) {
          try {
            const inv = await stripe.invoices.retrieve(invoiceId);
            console.info("[wh] invoice.meta after cs.completed", {
              id: inv.id,
              metadata: inv?.metadata || {},
            });
          } catch {}
        }

        break;
      }

      // -------------------------------------------------
      // 3) Invoice-events – bruk hint og ensure metadata; sync til RC
      // -------------------------------------------------
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "invoice.payment_action_required":
      case "invoice.payment_failed": {
        const inv = event.data.object;
        const subscriptionId = inv?.subscription || null;
        const customerId = inv?.customer || null;
        const invoiceId = inv?.id || null;

        // Redis-hint
        const key = invoiceId ? `inv:${invoiceId}` : null;

        // ref_code: hint > invoice.metadata > subscription.metadata
        const refCode = await resolveRefCode({
          session: null,
          invoice: inv,
          subscriptionId,
          redisKey: key,
        });

        // app_user_id fra email
        const email = await extractEmailFromStripe({
          invoice: inv,
          session: null,
        });
        const appUserId = email ? hashEmail(email) : null;

        // ensure metadata på invoice/sub/customer
        await writeStripeMetadata({
          subscriptionId,
          customerId,
          invoiceId,
          refCode,
          appUserId,
        });

        // RC sync – alltid subscription.id
        const fetchToken = stripeFetchToken(inv); // -> subscription.id
        if (fetchToken && appUserId) {
          const ok = await rcSync({ appUserId, fetchToken });
          console.info("[wh] rcSync (invoice.*)", {
            ok,
            fetchToken,
            appUserId,
            ev: event.type,
          });
        } else {
          console.info("[wh] skip rcSync (missing appUserId or fetchToken)", {
            fetchToken,
            appUserId,
            ev: event.type,
          });
        }

        break;
      }

      default: {
        // andre events ignoreres
        break;
      }
    }

    await markProcessed(id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[wh] handler error", err);
    return res
      .status(500)
      .json({ ok: false, error: String(err?.message || err) });
  }
}
