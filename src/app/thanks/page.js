// src/app/thanks/page.js
// -------------------------------------------------------------
// v2.2.0  ·  Adds full verifyHmacSignature() check (P0)
// -------------------------------------------------------------
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MoodMap • Payment successful',
  robots: { index: false, follow: false },
};

import Stripe from 'stripe';
import {
  generateHmacSignature,
  verifyHmacSignature,
} from '@/lib/universal-link';
import ThanksClient from './client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export default async function ThanksPage({ searchParams = {} }) {
  let { u = '', s = '', exp = '', sig = '', cs = '' } = searchParams;

  /* ① Resolve from Checkout‑Session ID if needed */
  if (cs && !(u && s && exp && sig)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(cs, {
        expand: ['customer_details'],
      });
      u = session.client_reference_id || session.metadata?.app_user_id || '';
      s = cs;
      exp = Math.floor(Date.now() / 1000) + 600;
      sig = generateHmacSignature(u, s, exp);
    } catch (err) {
      console.warn('[thanks] Stripe lookup failed', err.message);
      return <ThanksClient deepLink="" />;
    }
  }

  /* ② Verify HMAC (new) */
  const isValid = verifyHmacSignature(u, s, exp, sig);

  const deepLink = isValid
    ? `https://moodmap-app.com/activate?u=${encodeURIComponent(
        u,
      )}&s=${encodeURIComponent(s)}&exp=${exp}&sig=${sig}`
    : '';

  return <ThanksClient deepLink={deepLink} />;
}
