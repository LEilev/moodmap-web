// pages/api/stripe-webhook.js                       v4.0.7
// -----------------------------------------------------------------------------
//  Δ  checkout.session.completed: fallback henter ref_code fra Subscription
//     hvis cs.metadata.ref_code mangler. copyMetadata() oppdaterer fortsatt:
//     • subscription   • customer   • første invoice
// -----------------------------------------------------------------------------
//  Øvrig funksjonalitet beholdt: Redis-dedupe, RC-sync, logging/timeout.
// -----------------------------------------------------------------------------
import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';

export const config = { api: { bodyParser: false }, maxDuration: 30 };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
const redis  = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;
if (redis) redis.connect().catch(() => console.warn('[redis] connect fail'));

axiosRetry(axios, { retries: 3, retryDelay: n => n * 300,
  retryCondition: e => e.code === 'ECONNABORTED' || e.response?.status >= 500 || e.response?.status === 429 });

const EVENTS = new Set([
  'checkout.session.completed','customer.subscription.created','customer.subscription.deleted',
  'invoice.paid','invoice.payment_succeeded','invoice.updated','invoice.payment_failed','charge.refunded',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.setHeader('Allow','POST').status(405).end();
  const raw = await readRaw(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'],
                                           process.env.STRIPE_WEBHOOK_SECRET_PROD);
  } catch (err) {
    console.error('[wh] bad sig', err.message); return res.status(400).end();
  }
  if (!EVENTS.has(event.type) || await alreadyProcessed(event.id)) return res.status(200).end();

  try {
    const { appUserId, fetchToken, subId, customerId, refCode, latestInvoice } = await extractKeys(event);
    if (!appUserId || !fetchToken) {
      console.warn('[wh] skip – missing ids', { id:event.id, type:event.type });
      await markProcessed(event.id); return res.status(200).end();
    }

    /* 1 · RevenueCat */
    const rcPromise = axios.post('https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      { headers:{'X-Platform':'stripe',Authorization:`Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`}, timeout:8_000 });

    /* 2 · Metadata → sub / customer / first invoice */
    const metaPromise = copyMetadata({ subId, customerId, latestInvoice, appUserId, refCode });

    const [rcRes] = await Promise.allSettled([rcPromise, metaPromise]);
    const rcOk = rcRes.status === 'fulfilled';

    await markProcessed(event.id);
    res.status(rcOk ? 202 : 200).json({ ok: rcOk });
  } catch (err) {
    console.error('[wh] ❌', err); return res.status(500).end();
  }
}

/* ---------------- helpers ---------------- */

function readRaw(req){
  return new Promise((r,j)=>{const b=[];req.on('data',c=>b.push(c)).on('end',()=>r(Buffer.concat(b))).on('error',j);});
}
async function alreadyProcessed(id){ if(!redis) return false; return !(await redis.set(id,1,{NX:true,EX:86_400})); }
async function markProcessed(id){ if(redis) await redis.set(id,1,{NX:true,EX:86_400}); }

/* copy both app_user_id & ref_code */
async function copyMetadata({ subId, customerId, latestInvoice, appUserId, refCode }) {
  if (!subId && !customerId && !latestInvoice) return;
  const meta = { app_user_id: appUserId };
  if (refCode) meta.ref_code = refCode;

  const tasks = [];
  if (subId)         tasks.push(stripe.subscriptions.update(subId, { metadata: meta }));
  if (customerId)    tasks.push(stripe.customers.update(customerId,  { metadata: meta }));
  if (latestInvoice) tasks.push(stripe.invoices.update(latestInvoice, { metadata: meta }));
  return Promise.all(tasks);
}

/* extract keys incl. refCode & latestInvoice (patched for CS fallback) */
async function extractKeys(event){
  switch(event.type){
    case 'checkout.session.completed': {
      const cs = event.data.object;
      let refCode = cs.metadata?.ref_code || null;

      // PATCH: fallback til subscription.metadata.ref_code dersom CS mangler det
      if (!refCode && cs.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(cs.subscription);
          refCode = sub.metadata?.ref_code || null;
        } catch (e) {
          console.warn('[wh] ref_code fallback failed', e.message);
        }
      }

      return {
        appUserId : cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.subscription,                      // sub_…
        subId     : cs.subscription,
        customerId: cs.customer,
        refCode,
        latestInvoice: cs.invoice,                        // første invoice
      };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      return {
        appUserId : sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
        subId     : sub.id,
        customerId: sub.customer,
        refCode   : sub.metadata?.ref_code,
      };
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
    case 'invoice.updated':
    case 'invoice.payment_failed': {
      const inv = event.data.object;
      const subId = inv.subscription;
      const metaId = inv.metadata?.app_user_id || inv.metadata?.client_reference_id;
      const appUserId = metaId ||
        (subId ? (await stripe.subscriptions.retrieve(subId)).metadata?.app_user_id : undefined);
      const refCode = inv.metadata?.ref_code ||
        (subId ? (await stripe.subscriptions.retrieve(subId)).metadata?.ref_code : undefined);
      return {
        appUserId,
        fetchToken: inv.id,                               // invoice id
        subId,
        customerId: inv.customer,
        refCode,
      };
    }
    case 'charge.refunded': {
      const ch = event.data.object;
      let appUserId = ch.metadata?.app_user_id || ch.metadata?.client_reference_id;
      let refCode   = ch.metadata?.ref_code;
      if (!appUserId && ch.customer) {
        const cust = await stripe.customers.retrieve(ch.customer);
        appUserId = cust.metadata?.app_user_id;
        refCode   = refCode || cust.metadata?.ref_code;
      }
      return { appUserId, fetchToken: ch.invoice || ch.id, refCode };
    }
    default: return {};
  }
}
