// pages/buy.js
/**
 * MoodMap “vanity” purchase redirect
 *
 * /buy?ref=sophie&type=yearly   →  https://links.promotekit.com/moodmap?ref=sophie&type=yearly
 * /buy                          →  https://links.promotekit.com/moodmap?ref=default&type=monthly
 *
 * If you later want to point directly to Stripe Payment Links
 * just replace the PLAN_LINKS map.
 */

export async function getServerSideProps({ query, res }) {
  // ------------------ 1. Parse & validate ------------------
  const rawRef  = query.ref  ?? 'default';
  const rawType = query.type ?? 'monthly';

  // allow a‑z, 0‑9, dash/underscore, 1‑32 chars
  const ref = /^[\w-]{1,32}$/.test(rawRef) ? rawRef : 'default';
  const type = rawType === 'yearly' ? 'yearly' : 'monthly';

  // ------------------ 2. Resolve target URL ------------------
  /* PromoteKit tracking link (keep as is) */
  const target = `https://links.promotekit.com/moodmap?ref=${encodeURIComponent(
    ref,
  )}&type=${type}`;

  /* --- If you prefer Stripe Payment Links directly ----------
     const PLAN_LINKS = {
       monthly: 'https://buy.stripe.com/4gwbLq3dO3YJ3jka00',
       yearly:  'https://buy.stripe.com/7sI02ZfFecfCYJ73kk',
     };
     const target = PLAN_LINKS[type] +
       `?client_reference_id=${encodeURIComponent(ref)}&ref_code=${encodeURIComponent(ref)}`;
     ---------------------------------------------------------- */

  // ------------------ 3. Issue 302 ------------------
  res.writeHead(302, { Location: target });
  res.end();

  // This page never actually renders
  return { props: {} };
}

/* eslint-disable react/display-name */
export default () => null;
