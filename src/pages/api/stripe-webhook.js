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
import { createClient } from 'redis'
import { rcSync } from '../../lib/rcSync'

export const config = { api: { bodyParser: false } } // keep raw body

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
  'invoice.payment_succeeded',
  'invoice.updated',
  'invoice.payment_failed',
  'charge.refunded',
])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  const rawBody = await readRawBody(req)
  const signature = req.headers['stripe-signature']

  // ① allow a second secret for the CLI relay
  const endpointSecrets = [
    process.env.STRIPE_WEBHOOK_SECRET,      // real one (prod & test dashboards)
    process.env.STRIPE_CLI_WEBHOOK_SECRET,  // set only when you run `stripe listen`
  ].filter(Boolean)

  let event, verified = false
  for (const secret of endpointSecrets) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret)
      verified = true
      break
    } catch (_) {}   // try next secret
  }
  if (!verified) {
    console.error('[stripe‑webhook] ❌  Bad sig – none of the secrets matched')
    return res.status(400).send('Webhook signature verification failed.')
  }

  if (!EVENTS.has(event.type)) return res.status(200).end()

  try {
    if (await alreadyProcessed(event.id)) return res.status(200).end()

    const { appUserId, fetchToken } = await extractRcKeys(event)
    if (!appUserId || !fetchToken) {
      throw new Error('appUserId / fetchToken mangler – sjekk metadata‐oppsett')
    }

    const ok = await rcSync(event)
    if (!ok) throw new Error('rcSync failed')

    // ✅ Success log --------------------------------------------------------
    console.log('[stripe-webhook] ✅ Success:', {
      type: event.type,
      user: appUserId,
      token: fetchToken,
    })
    // ----------------------------------------------------------------------

    await markProcessed(event.id)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[stripe‑webhook] ❌  Sync error', err)
    return res.status(500).end()
  }
}

/* -------------------------------------------------------------------------- */
/* Helper functions                                                           */
/* -------------------------------------------------------------------------- */

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject)
  })
}

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

async function extractRcKeys(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const cs = event.data.object
      return {
        appUserId: cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.id,
      }
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
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
      const inv = event.data.object
      const subId = inv.subscription
      const metaId =
        inv.metadata?.app_user_id || inv.metadata?.client_reference_id

      const appUserId =
        metaId ||
        (subId
          ? (await stripe.subscriptions.retrieve(subId)).metadata?.app_user_id
          : undefined)

      return { appUserId, fetchToken: subId || inv.id }
    }
    case 'charge.refunded': {
      const ch = event.data.object
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