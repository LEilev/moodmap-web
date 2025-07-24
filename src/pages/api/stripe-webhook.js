// pages/api/stripe-webhook.js
import Stripe from 'stripe';
import axios from 'axios';
import { isDuplicate, markProcessed } from '../../lib/dedupe';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

const EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_succeeded',
  'invoice.updated',
  'invoice.payment_failed',
  'charge.refunded',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const raw = await readRaw(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (e) {
    console.error('[stripe‑webhook] bad sig', e.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();

  try {
    if (await isDuplicate(event.id)) return res.status(200).end();

    const { appUserId, fetchToken } = await rcKeys(event);
    if (!appUserId || !fetchToken) {
      throw new Error('appUserId / fetchToken mangler – sjekk metadata');
    }

    await axios.post(
      'https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          'X-Platform': 'stripe',
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
        timeout: 8_000,
      },
    );

    console.log('[stripe‑webhook] ✅', {
      type: event.type,
      user: appUserId,
      token: fetchToken,
    });

    await markProcessed(event.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[stripe‑webhook] ❌', err);
    return res.status(500).end();
  }
}

function readRaw(req) {
  return new Promise((res, rej) => {
    const chunks = [];
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => res(Buffer.concat(chunks)))
      .on('error', rej);
  });
}

async function rcKeys(evt) {
  switch (evt.type) {
    case 'checkout.session.completed': {
      const s = evt.data.object;
      return {
        appUserId: s.client_reference_id || s.metadata?.app_user_id,
        fetchToken: s.id,
      };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const sub = evt.data.object;
      return {
        appUserId:
          sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
      };
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
    case 'invoice.updated':
    case 'invoice.payment_failed': {
      const inv = evt.data.object;
      const subId = inv.subscription;
      const meta =
        inv.metadata?.app_user_id || inv.metadata?.client_reference_id;
      const appUserId =
        meta ||
        (subId
          ? (await stripe.subscriptions.retrieve(subId)).metadata?.app_user_id
          : undefined);
      return { appUserId, fetchToken: subId || inv.id };
    }
    case 'charge.refunded': {
      const ch = evt.data.object;
      let appUserId = ch.metadata?.app_user_id;
      if (!appUserId && ch.customer) {
        const cust = await stripe.customers.retrieve(ch.customer);
        appUserId = cust.metadata?.app_user_id;
      }
      return { appUserId, fetchToken: ch.invoice || ch.id };
    }
    default:
      return {};
  }
}
