// src/pages/api/stripe-webhook.js
// -----------------------------------------------------------------------------
// v4.0.12 – ref_code fallback inkluderer client_reference_id (cs.completed)
//           backfill første invoice før invoice.paid; e-posthash app_user_id
//           raw body (uten micro); maxDuration: 30; dedupe + rcSync
// -----------------------------------------------------------------------------

import Stripe from "stripe";
import crypto from "crypto";
import { alreadyProcessed, markProcessed } from "@/lib/redis-dedupe";
import { rcSync } from "@/lib/rcSync";

export const config = { api: { bodyParser: false }, maxDuration: 30 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const hashEmail = (e) =>
  e ? crypto.createHash("sha256").update(e.trim().toLowerCase()).digest("hex") : null;

async function getRawBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function copyMetadata(stripeObj, { app_user_id, ref_code }) {
  const meta = {};
  if (app_user_id) meta.app_user_id = app_user_id;
  if (ref_code)   meta.ref_code   = ref_code;

  try {
    if (stripeObj.subscription) {
      await stripe.subscriptions.update(stripeObj.subscription, { metadata: meta });
    }
    if (stripeObj.customer) {
      await stripe.customers.update(stripeObj.customer, { metadata: meta });
    }
    // hvis vi får en invoice som stripeObj – oppdater den også
    if (stripeObj.object === "invoice" || String(stripeObj.id || "").startsWith("in_")) {
      await stripe.invoices.update(stripeObj.id, { metadata: meta });
    }
  } catch (err) {
    console.warn("[wh] copyMetadata fail", err?.message || err);
  }
}

async function extractKeys(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object;

      // --- ref_code: metadata -> client_reference_id -> sub.metadata -> customer.metadata
      let refCode = cs.metadata?.ref_code || cs.client_reference_id || null;
      let refSource = cs.metadata?.ref_code ? "cs.metadata" :
                      cs.client_reference_id ? "cs.client_reference_id" : null;

      if (!refCode && cs.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(cs.subscription);
          refCode = sub.metadata?.ref_code || null;
          if (refCode && !refSource) refSource = "sub.metadata";
        } catch (e) {
          console.warn("[wh] ref_code fallback (sub) failed", e.message);
        }
      }
      if (!refCode && cs.customer) {
        try {
          const cust = await stripe.customers.retrieve(cs.customer);
          refCode = cust.metadata?.ref_code || null;
          if (refCode && !refSource) refSource = "customer.metadata";
        } catch (e) {
          console.warn("[wh] ref_code fallback (customer) failed", e.message);
        }
      }

      // --- app_user_id: hash(email)
      let email = cs.customer_details?.email || null;
      if (!email && cs.customer) {
        const cust = await stripe.customers.retrieve(cs.customer);
        email = cust?.email || null;
      }
      const appUserId = email ? hashEmail(email) : (cs.metadata?.app_user_id || null);

      console.info("[wh] cs.completed keys", {
        sub: cs.subscription, customer: cs.customer,
        ref_code: refCode || null, ref_source: refSource || null,
        app_user_id: appUserId ? "[hash]" : null,
        invoice: cs.invoice || null,
      });

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

      // hent ref_code dersom den mangler
      let ensuredRef = inv.metadata?.ref_code || null;
      if (!ensuredRef && subId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subId);
          ensuredRef = sub.metadata?.ref_code || null;
        } catch (e) {
          console.warn("[wh] ref_code fallback (invoice.*) failed", e?.message);
        }
      }

      // app_user_id fra e-post / sub.metadata
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

      // backfill invoice metadata hvis nødvendig
      const needsRef  = !inv.metadata?.ref_code && ensuredRef;
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
            app_user_id: needsUser ? "[hash]" : inv.metadata?.app_user_id ? "[hash]" : null,
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
  // verifiser Stripe-signatur
  let event;
  try {
    const buf = await getRawBody(req);
    event = stripe.webhooks.constructEvent(buf, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[wh] webhook signature failed", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // dedupe
  if (await alreadyProcessed(event.id)) {
    return res.status(200).send("[wh] duplicate event skipped");
  }

  try {
    const keys = await extractKeys(event);
    if (!keys) {
      await markProcessed(event.id);
      return res.status(200).send("[wh] unhandled event type");
    }

    // synk metadata bredt (sub/customer/& ev. invoice-objekt)
    await copyMetadata(event.data.object, {
      app_user_id: keys.appUserId,
      ref_code: keys.refCode,
    });

    // viktig: oppdater første invoice i cs.completed FØR invoice.paid
    if (event.type === "checkout.session.completed" && keys.latestInvoice) {
      try {
        await stripe.invoices.update(keys.latestInvoice, {
          metadata: {
            app_user_id: keys.appUserId || undefined,
            ref_code: keys.refCode || undefined,
          },
        });
        console.info("[wh] primed first invoice metadata", {
          invoice: keys.latestInvoice,
          ref_code: keys.refCode || null,
          app_user_id: keys.appUserId ? "[hash]" : null,
        });
      } catch (err) {
        console.warn("[wh] invoice meta update (cs.completed) failed", err?.message || err);
      }
    }

    // RevenueCat sync
    const rcOk = await rcSync({
      data: { object: { id: keys.fetchToken, metadata: { app_user_id: keys.appUserId } } },
    });

    await markProcessed(event.id);
    return res.status(rcOk ? 202 : 200).send(rcOk ? "[wh] processed + RC sync" : "[wh] processed (no RC sync)");
  } catch (err) {
    console.error("[wh] handler error", err?.message || err);
    return res.status(500).send("Webhook handler error");
  }
}
