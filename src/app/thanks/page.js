// src/app/thanks/page.js
// -----------------------------------------------------------------------------
// v2.6.0  · adds ?ce=email param via server‑side redirect (once)
//         · keeps alias support (session_id/sid) and HMAC verification
// -----------------------------------------------------------------------------
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
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export default async function ThanksPage({ searchParams = {} }) {
  /* ---------- 0 · Query params & alias ---------- */
  let {
    u = '',
    s = '',
    exp = '',
    sig = '',
    cs = '',
    session_id = '',
    sid = '',
    ce = '', // customer e‑mail (may be missing on first load)
  } = searchParams;

  if (!cs) cs = session_id || sid;

  /* ---------- 1 · Resolve from Checkout‑Session if needed ---------- */
  let email = ce;
  if (cs && !(u && s && exp && sig)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(cs, {
        expand: ['customer_details'],
      });
      u     = session.client_reference_id || session.metadata?.app_user_id || '';
      s     = cs;
      exp   = Math.floor(Date.now() / 1000) + 600; // 10 min
      sig   = generateHmacSignature(u, s, exp);
      email = session.customer_details?.email || '';
    } catch (err) {
      console.warn('[thanks] Stripe lookup failed', err.message);
      return <ThanksClient deepLink="" />;
    }
  }

  /* ---------- 2 · First‑time redirect to add ce=email ---------- */
  if (email && !ce) {
    const url = new URL('/thanks', process.env.NEXT_PUBLIC_BASE_URL || 'https://moodmap-app.com');
    url.searchParams.set('u', u);
    url.searchParams.set('s', s);
    url.searchParams.set('exp', exp);
    url.searchParams.set('sig', sig);
    url.searchParams.set('ce', email);          // new param
    redirect(url.toString());                   // one‑time 307
  }

  /* ---------- 3 · Verify HMAC ---------- */
  const isValid = verifyHmacSignature(u, s, exp, sig);
  const deepLink = isValid
    ? `https://moodmap-app.com/activate?u=${encodeURIComponent(
        u,
      )}&s=${encodeURIComponent(s)}&exp=${exp}&sig=${sig}`
    : '';

  return <ThanksClient deepLink={deepLink} />;
}
