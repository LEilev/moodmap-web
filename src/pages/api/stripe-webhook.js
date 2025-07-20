// src/pages/api/stripe-webhook.js
// -------------------------------------------------------------
// Production‑ready Stripe → RevenueCat bridge for Vercel / Next.js
//
// ENV (Vercel):
//   STRIPE_SECRET_KEY            sk_live_...
//   STRIPE_WEBHOOK_SECRET        whsec_...
//   RC_STRIPE_PUBLIC_API_KEY     pub_stripe_...
//   REDIS_URL                    (optional) redis://:pwd@host:port
//
// © 2025 MoodMap. MIT.

import Stripe from 'stripe'
import axios from 'axios'
import { createClient } from 'redis'

// ---------- 1. Init ---------- //
export const config = { api: { bodyParser: false } }      // keep raw body

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
})

const redis =
  process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null

const EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_succeeded',       // future‑proof
  'invoice.updated',
  'invoice.payment_failed',
  'charge.refunded',
])

// ---------- 2. Handler ---------- //
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  /** @type {Buffer} */
  const rawBody = await readRawBody(req)
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[stripe‑webhook] ❌  Bad sig', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (!EVENTS.has(event.type)) return res.status(200).end()

  try {
    // ----- 2a. Idempotency guard -----
    if (await alreadyProcessed(event.id)) return res.status(200).end()

    // ----- 2b. Extract keys RevenueCat needs -----
    const { appUserId, fetchToken } = await extractRcKeys(event)

    if (!appUserId || !fetchToken) {
      throw new Error('appUserId / fetchToken mangler – sjekk metadata‐oppsett')
    }

    // ----- 2c. Push to RC -----
    await axios.post(
      'https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          'X-Platform': 'stripe',
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
        timeout: 8_000,
      }
    )

    await markProcessed(event.id)
    return res.status(200).json({ ok: true })
  } catch (err) {
    // Stripe retryer kicker inn hvis vi ikke svarer 2xx
    console.error('[stripe‑webhook] ❌  Sync error', err)
    return res.status(500).end()
  }
}

// ---------- 3. Helpers ---------- //

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject)
  })
}

// Redis SETNX, TTL 24 h
async function alreadyProcessed(id) {
  if (!redis) return false
  await redis.connect()
  const dup = !(await redis.set(id, 1, { NX: true, EX: 86_400 }))
  await redis.disconnect()
  return dup
}
async function markProcessed(id) {
  if (!redis) return
  await redis.connect()
  await redis.set(id, 1, { NX: true, EX: 86_400 })
  await redis.disconnect()
}

/**
 * @param {Stripe.Event} event
 * @returns {Promise<{appUserId?:string, fetchToken?:string}>}
 */
async function extractRcKeys(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      /** @type {Stripe.Checkout.Session} */
      const cs = event.data.object
      return {
        appUserId: cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.id,
      }
    }

    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      /** @type {Stripe.Subscription} */
      const sub = event.data.object
      return {
        appUserId: sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
      }
    }

    case 'invoice.paid':
    case 'invoice.payment_succeeded':
    case 'invoice.updated':
    case 'invoice.payment_failed': {
      /** @type {Stripe.Invoice} */
      const inv = event.data.object
      const subId = inv.subscription                           // may be null for one‑off
      const metaId =
        inv.metadata?.app_user_id || inv.metadata?.client_reference_id

      // ‑‑ Fallback: fetch subscription to grab metadata if invoice lacks it
      const appUserId =
        metaId ||
        (subId
          ? (await stripe.subscriptions.retrieve(subId)).metadata
              ?.app_user_id
          : undefined)

      return { appUserId, fetchToken: subId || inv.id }
    }

    case 'charge.refunded': {
      /** @type {Stripe.Charge} */
      const ch = event.data.object
      // charge may not carry app_user_id: fall back to customer metadata
      let appUserId = ch.metadata?.app_user_id
      if (!appUserId && ch.customer) {
        const cust = await stripe.customers.retrieve(ch.customer)
        appUserId = cust.metadata?.app_user_id
      }
      return { appUserId, fetchToken: ch.invoice || ch.id }
    }

    default:
      return {}
  }
}
