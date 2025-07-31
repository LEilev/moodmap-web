// pages/buy.js
/**
 * MoodMap “vanity” purchase redirect  (v2 – no Stripe metadata param)
 *
 *   /buy?ref=sophie&type=yearly
 *   └─▶ https://buy.stripe.com/...   (Payment Link)
 *
 *  • ref | via  →  client_reference_id
 *  • type        →  selects monthly | yearly Payment Link
 *  • pk_*        →  passed through for PromoteKit attribution
 *
 *  NOTE: Stripe Payment Links reject unknown query keys when they look
 *        like nested objects (metadata[foo]=bar).  Flat pk_* keys are fine.
 */

export async function getServerSideProps({ query, res }) {
  /* ------------------------------------------------------------------ */
  /* 1. Parse & sanitise input                                          */
  /* ------------------------------------------------------------------ */
  const rawRef  = query.ref ?? query.via ?? 'default';
  const rawType = query.type ?? 'monthly';

  const ref  = /^[\w-]{1,32}$/.test(rawRef) ? rawRef : 'default';
  const type = rawType === 'yearly' ? 'yearly' : 'monthly';

  /* ------------------------------------------------------------------ */
  /* 2. Choose Payment Link                                             */
  /* ------------------------------------------------------------------ */
  const PLAN_LINKS = {
    monthly: 'https://buy.stripe.com/14A4gAaMb3roc3Y73j3ks00',
    yearly:  'https://buy.stripe.com/7sI02ZfFecfCYJ73kk',
  };
  const url = new URL(PLAN_LINKS[type]);

  /* ------------------------------------------------------------------ */
  /* 3. Inject allowed Stripe params                                    */
  /* ------------------------------------------------------------------ */
  url.searchParams.set('client_reference_id', ref);
  url.searchParams.set('type', type);          // eg. for internal analytics

  /* 4. Preserve PromoteKit pk_* params (harmless for Stripe) */
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('pk_')) url.searchParams.set(k, v);
  }

  /* ------------------------------------------------------------------ */
  /* 5. Redirect                                                        */
  /* ------------------------------------------------------------------ */
  res.writeHead(302, { Location: url.toString() });
  res.end();

  return { props: {} }; // page is never rendered client‑side
}

/* eslint-disable react/display-name */
export default () => null;
