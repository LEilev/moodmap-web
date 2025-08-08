// src/pages/api/stripe-webhook.js
import Stripe from "stripe";
import crypto from "crypto";
import { alreadyProcessed, markProcessed } from "@/lib/redis-dedupe";
import { rcSync } from "@/lib/rcSync";

export const config = { api: { bodyParser: false }, maxDuration: 30 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

/** Read raw body without 'micro' */
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

/** Hash email -> app_user_id (stable, non-PII) */
function hashEmail(email) {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

/** Copy metadata to the relevant Stripe object(s) */
async function copyMetadata(obj, meta) {
  try {
    const clean = Object.fromEntries(
      Object.entries(meta).filter(([_, v]) => !!v && v !== "null")
    );

    if (!Object.keys(clean).length) return;

    if (obj.object === "checkout.session") {
      // handled separately for first invoice (see handler below)
      if (obj.subscription) {
        await stripe.subscriptions.update(obj.subscription, { metadata: clean });
      }
      if (obj.customer) {
        await stripe.customers.update(obj.customer, { metadata: clean });
      }
    } else if (obj.object === "invoice") {
      await stripe.invoices.update(obj.id, { metadata: clean });
      if (obj.subscription) {
        await stripe.subscriptions.update(obj.subscription, { metadata: clean });
      }
      if (obj.customer) {
        await stripe.customers.update(obj.customer, { metadata: clean });
      }
    } else if (obj.object === "customer.subscription") {
      await stripe.subscriptions.update(obj.id, { metadata: clean });
      if (obj.customer) {
        await stripe.customers.update(obj.customer, { metadata: clean });
      }
    } else if (obj.object === "customer") {
      await stripe.customers.update(obj.id, { metadata: clean });
    }
  } catch (e) {
    console.warn("[wh] copyMetadata failed", e?.message || e);
  }
}

/** Pull keys we need per event */
async function extractKeys(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object;

      // --- refCode with complete fallback chain ---
      let refCode = null;
      let refSource = "";

      if (cs?.metadata?.ref_code) {
        refCode = cs.metadata.ref_code;
        refSource = "cs.metadata.ref_code";
      } else if (cs?.client_reference_id) {
        refCode = cs.client_reference_id; // critical for Payment Links
        refSource = "cs.client_reference_id";
      } else if (cs?.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(cs.subscription);
          if (sub?.metadata?.ref_code) {
            refCode = sub.metadata.ref_code;
            refSource = "subscription.metadata.ref_code";
          }
        } catch (e) {
          console.warn("[wh] ref_code fallback (sub) failed", e?.message);
        }
      }

      if (!refCode && cs?.customer) {
        try {
          const cust = await stripe.customers.retrieve(cs.customer);
          if (cust?.metadata?.ref_code) {
            refCode = cust.metadata.ref_code;
            refSource = "customer.metadata.ref_code";
          }
        } catch (e) {
          console.warn("[wh] ref_code fallback (cust) failed", e?.message);
        }
      }

      // email -> app_user_id
      let email = cs.customer_details?.email || null;
      if (!email && cs.customer) {
        try {
          const cust = await stripe.customers.retrieve(cs.customer);
          email = cust?.email || null;
        } catch {}
      }
      const appUserId = email ? hashEmail(email) : cs?.metadata?.app_user_id || null;

      return {
        appUserId,
        fetchToken: cs.subscription,
        subId: cs.subscription,
        customerId: cs.customer,
        refCode,
        refSource,
        latestInvoice: cs.invoice,
      };
    }

    case "invoice.paid":
    case "invoice.finalized":
    case "invoice.payment_succeeded": {
      const inv = event.data.object;
      const appUserId =
        inv?.metadata?.app_user_id ||
        (inv.customer_email ? hashEmail(inv.customer_email) : null);

      const refCode =
        inv?.metadata?.ref_code ||
        inv?.subscription_details?.metadata?.ref_code ||
        null;

      return {
        appUserId,
        fetchToken: inv.subscription,
        subId: inv.subscription,
        customerId: inv.customer,
        refCode,
        latestInvoice: inv.id,
      };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const refCode = sub?.metadata?.ref_code || null;
      const appUserId = sub?.metadata?.app_user_id || null;
      return {
        appUserId,
        fetchToken: sub.id,
        subId: sub.id,
        customerId: sub.customer,
        refCode,
        latestInvoice: sub.latest_invoice || null,
      };
    }

    default:
      return null;
  }
}

export default async function handler(req, res) {
  // Verify signature
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const buf = await getRawBody(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[wh] webhook signature failed", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Deduplicate by event id
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

    // (A) On first Checkout completion: write metadata to the FIRST invoice ASAP
    if (event.type === "checkout.session.completed" && keys.latestInvoice) {
      try {
        if (keys.refCode || keys.appUserId) {
          await stripe.invoices.update(keys.latestInvoice, {
            metadata: {
              ...(keys.appUserId ? { app_user_id: keys.appUserId } : {}),
              ...(keys.refCode ? { ref_code: keys.refCode } : {}),
            },
          });
          const check = await stripe.invoices.retrieve(keys.latestInvoice);
          console.info("[wh] invoice.meta after cs.completed", {
            invId: keys.latestInvoice,
            ref_code: check?.metadata?.ref_code || null,
            app_user_id: check?.metadata?.app_user_id || null,
            ref_source: keys.refSource || null,
          });
        }
      } catch (err) {
        console.warn("[wh] invoice meta update (cs.completed) failed", err?.message || err);
      }
    }

    // (B) Propagate metadata to sub/customer/(invoice) as usual
    await copyMetadata(event.data.object, {
      app_user_id: keys.appUserId,
      ref_code: keys.refCode,
    });

    // (C) RevenueCat sync (non-blocking for PromoteKit, but we log result)
    const rcOk = await rcSync({
      data: { object: { id: keys.fetchToken, metadata: { app_user_id: keys.appUserId } } },
    });

    await markProcessed(eventId);
    return res.status(rcOk ? 202 : 200).send(
      rcOk ? "[wh] processed + RC sync" : "[wh] processed (no RC sync)"
    );
  } catch (err) {
    console.error("[wh] handler error", err?.message || err);
    return res.status(500).send("Webhook handler error");
  }
}
