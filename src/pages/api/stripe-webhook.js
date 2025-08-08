// src/pages/api/stripe-webhook.js
import Stripe from "stripe";
import crypto from "crypto";
import { alreadyProcessed, markProcessed } from "@/lib/redis-dedupe";
import { rcSync } from "@/lib/rcSync";

export const config = { api: { bodyParser: false }, maxDuration: 30 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// --- Upstash REST (hint-cache for invoice) ---
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function kvSet(key, val, ttl = 900) {
  if (!(UPSTASH_URL && UPSTASH_TOKEN)) return;
  const enc = encodeURIComponent(JSON.stringify(val));
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${enc}?EX=${ttl}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
}

async function kvGet(key) {
  if (!(UPSTASH_URL && UPSTASH_TOKEN)) return null;
  const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!r.ok) return null;
  const { result } = await r.json();
  try {
    return result ? JSON.parse(result) : null;
  } catch {
    return null;
  }
}

// --- utils ---
function hashEmail(email) {
  return crypto.createHash("sha256").update(String(email).trim().toLowerCase()).digest("hex");
}

async function getRawBody(req) {
  return await new Promise((resolve, reject) => {
    try {
      let data = [];
      req.on("data", (chunk) => data.push(chunk));
      req.on("end", () => resolve(Buffer.concat(data)));
      req.on("error", reject);
    } catch (e) {
      reject(e);
    }
  });
}

// copy metadata to subscription/customer/(invoice)
async function copyMetadata(stripeObj, { app_user_id, ref_code }) {
  const meta = {};
  if (app_user_id) meta.app_user_id = app_user_id;
  if (ref_code) meta.ref_code = ref_code;

  if (!Object.keys(meta).length) return;

  try {
    if (stripeObj.object === "subscription") {
      await stripe.subscriptions.update(stripeObj.id, { metadata: meta });
    } else if (stripeObj.object === "invoice") {
      await stripe.invoices.update(stripeObj.id, { metadata: meta });
    } else if (stripeObj.object === "customer") {
      await stripe.customers.update(stripeObj.id, { metadata: meta });
    }
  } catch (e) {
    console.warn("[wh] copyMetadata failed", e?.message || e);
  }
}

// pull out interesting fields per event
async function extractKeys(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object;

      // Pick refCode (include client_reference_id!)
      let refCode = null;
      if (cs.metadata?.ref_code) refCode = cs.metadata.ref_code;
      else if (cs.client_reference_id) refCode = cs.client_reference_id;
      else if (cs.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(cs.subscription);
          refCode = sub.metadata?.ref_code || null;
        } catch (e) {
          console.warn("[wh] ref_code fallback (sub) failed", e.message);
        }
      }
      if (!refCode && cs.customer) {
        try {
          const cust = await stripe.customers.retrieve(cs.customer);
          refCode = cust.metadata?.ref_code || null;
        } catch (e) {
          console.warn("[wh] ref_code fallback (cust) failed", e.message);
        }
      }

      let email = cs.customer_details?.email || null;
      if (!email && cs.customer) {
        const cust = await stripe.customers.retrieve(cs.customer);
        email = cust?.email || null;
      }
      const appUserId = email ? hashEmail(email) : cs.metadata?.app_user_id || null;

      const keys = {
        appUserId,
        fetchToken: cs.subscription,
        subId: cs.subscription,
        customerId: cs.customer,
        refCode,
        latestInvoice: cs.invoice,
      };

      // Update first invoice ASAP + verify + drop Redis hint
      try {
        if (keys.latestInvoice && (keys.refCode || keys.appUserId)) {
          await stripe.invoices.update(keys.latestInvoice, {
            metadata: {
              ...(keys.refCode ? { ref_code: keys.refCode } : {}),
              ...(keys.appUserId ? { app_user_id: keys.appUserId } : {}),
            },
          });
          const check = await stripe.invoices.retrieve(keys.latestInvoice);
          console.info("[wh] invoice.meta after cs.completed", {
            invId: keys.latestInvoice,
            ref_code: check.metadata?.ref_code || null,
            app_user_id: check.metadata?.app_user_id || null,
          });
          await kvSet(
            `inv:${keys.latestInvoice}`,
            {
              ref_code: check.metadata?.ref_code || keys.refCode || null,
              app_user_id: check.metadata?.app_user_id || keys.appUserId || null,
            },
            900
          );
        }
      } catch (e) {
        console.warn("[wh] cs.completed invoice update/hint failed", e?.message || e);
      }

      return keys;
    }

    case "invoice.paid":
    case "invoice.payment_succeeded":
    case "invoice.updated":
    case "invoice.payment_failed": {
      const inv = event.data.object;
      const subId = inv.subscription;

      // Redis hint wins the race
      const hint = await kvGet(`inv:${inv.id}`);
      let ensuredRef = hint?.ref_code || inv.metadata?.ref_code || null;
      if (!ensuredRef && subId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subId);
          ensuredRef = sub.metadata?.ref_code || null;
        } catch (e) {
          console.warn("[wh] ref_code fallback (invoice.*) failed", e?.message);
        }
      }

      // Email → app_user_id
      let email = inv.customer_email || null;
      if (!email && inv.customer) {
        try {
          const cust = await stripe.customers.retrieve(inv.customer);
          email = cust?.email || null;
        } catch (e) {
          console.warn("[wh] fetch customer email fail", e?.message);
        }
      }
      let appUserId = email ? hashEmail(email) : hint?.app_user_id || undefined;
      if (!appUserId && subId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subId);
          appUserId = sub.metadata?.app_user_id;
        } catch (e) {
          console.warn("[wh] fetch sub metadata fail", e?.message);
        }
      }

      // Backfill invoice.metadata if missing
      const needsRef = !inv.metadata?.ref_code && ensuredRef;
      const needsUser = !inv.metadata?.app_user_id && appUserId;
      if (needsRef || needsUser) {
        try {
          await stripe.invoices.update(inv.id, {
            metadata: {
              ref_code: needsRef ? ensuredRef : inv.metadata?.ref_code,
              app_user_id: needsUser ? appUserId : inv.metadata?.app_user_id,
            },
          });
          console.info("[wh] backfilled invoice.metadata", {
            id: inv.id,
            ref_code: needsRef ? ensuredRef : inv.metadata?.ref_code || null,
            app_user_id: needsUser ? appUserId : inv.metadata?.app_user_id || null,
          });
        } catch (e) {
          console.warn("[wh] backfill invoice metadata fail", e?.message);
        }
      }

      return {
        appUserId,
        fetchToken: inv.id,
        subId,
        customerId: inv.customer,
        refCode: ensuredRef || inv.metadata?.ref_code || null,
      };
    }
  }
  return null;
}

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buf = await getRawBody(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[wh] webhook signature failed", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;
  if (await alreadyProcessed(eventId)) {
    console.info("[wh] duplicate skip", { id: eventId, type: event.type });
    return res.status(200).send("[wh] duplicate event skipped");
  }

  try {
    const keys = await extractKeys(event);
    if (!keys) {
      await markProcessed(eventId);
      return res.status(200).send("[wh] unhandled event type");
    }

    // copy base metadata onto the originating object too
    await copyMetadata(event.data.object, {
      app_user_id: keys.appUserId,
      ref_code: keys.refCode,
    });

    const rcOk = await rcSync({
      data: { object: { id: keys.fetchToken, subscription: keys.subId, metadata: { app_user_id: keys.appUserId } } },
    });

    await markProcessed(eventId);
    return res.status(rcOk ? 202 : 200).send(rcOk ? "[wh] processed + RC sync" : "[wh] processed (no RC sync)");
  } catch (err) {
    console.error("[wh] handler error", err?.message || err);
    return res.status(500).send("Webhook handler error");
  }
}
