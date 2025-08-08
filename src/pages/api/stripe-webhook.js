// pages/api/stripe-webhook.js
// -----------------------------------------------------------------------------
// v4.0.10 – no 'micro' dep (raw body helper) + correct rcSync import path
//           includes v4.0.9 metadata-guard + email-hash app_user_id
// -----------------------------------------------------------------------------

import Stripe from "stripe";
import { alreadyProcessed, markProcessed } from "@/lib/redis-dedupe";
import { rcSync } from "@/lib/rcSync"; // ← fixed path
import crypto from "crypto";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const hashEmail = (e) =>
  e ? crypto.createHash("sha256").update(e.trim().toLowerCase()).digest("hex") : null;

// Minimal raw body helper (avoids 'micro' dependency)
async function getRawBody(req) {
  return await new Promise((resolve, reject) => {
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

// Copy metadata to subscription/customer/invoice
async function copyMetadata(stripeObj, { app_user_id, ref_code }) {
  const meta = {};
  if (app_user_id) meta.app_user_id = app_user_id;
  if (ref_code) meta.ref_code = ref_code;

  try {
    if (stripeObj.subscription) {
      await stripe.subscriptions.update(stripeObj.subscription, { metadata: meta });
    }
    if (stripeObj.customer) {
      await stripe.customers.update(stripeObj.customer, { metadata: meta });
    }
    if (stripeObj.id && (stripeObj.object === "invoice" || String(stripeObj.id).startsWith("in_"))) {
      await stripe.invoices.update(stripeObj.id, { metadata: meta });
    }
  } catch (err) {
    console.warn("[wh] copyMetadata fail", err?.message || err);
  }
}

// Extract keys per event
async function extractKeys(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object;
      let refCode = cs.metadata?.ref_code || null;

      if (!refCode && cs.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(cs.subscription);
          refCode = sub.metadata?.ref_code || null;
        } catch (e) {
          console.warn("[wh] ref_code fallback failed", e.message);
        }
      }

      let email = cs.customer_details?.email || null;
      if (!email && cs.customer) {
        const cust = await stripe.customers.retrieve(cs.customer);
        email = cust?.email || null;
      }
      const appUserId = email ? hashEmail(email) : (cs.metadata?.app_user_id || null);

      return {
        appUserId,
        fetchToken: cs.subscription,
        subId: cs.subscription,
        customerId: cs.customer,
        refCode,
        latestInvoice: cs.invoice,
      };
    }

    case "invoice.paid":
    case "invoice.payment_succeeded":
    case "invoice.updated":
    case "invoice.payment_failed": {
      const inv = event.data.object;
      const subId = inv.subscription;

      // Ensure ref_code (prefer invoice, fallback subscription)
      let ensuredRef = inv.metadata?.ref_code || null;
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
      let appUserId = email ? hashEmail(email) : undefined;
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
}

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buf = await getRawBody(req); // ← no 'micro'
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[wh] webhook signature failed", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;
  if (await alreadyProcessed(eventId)) {
    return res.status(200).send("[wh] duplicate event skipped");
  }

  try {
    const keys = await extractKeys(event);
    if (!keys) {
      await markProcessed(eventId);
      return res.status(200).send("[wh] unhandled event type");
    }

    await copyMetadata(event.data.object, {
      app_user_id: keys.appUserId,
      ref_code: keys.refCode,
    });

    if (event.type === "checkout.session.completed" && keys.latestInvoice) {
      try {
        await stripe.invoices.update(keys.latestInvoice, {
          metadata: {
            app_user_id: keys.appUserId,
            ref_code: keys.refCode,
          },
        });
      } catch (err) {
        console.warn("[wh] invoice meta update (cs.completed) failed", err?.message || err);
      }
    }

    const rcOk = await rcSync({
      data: { object: { id: keys.fetchToken, metadata: { app_user_id: keys.appUserId } } },
    });

    await markProcessed(eventId);
    return res
      .status(rcOk ? 202 : 200)
      .send(rcOk ? "[wh] processed + RC sync" : "[wh] processed (no RC sync)");
  } catch (err) {
    console.error("[wh] handler error", err?.message || err);
    return res.status(500).send("Webhook handler error");
  }
}
