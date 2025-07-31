// pages/buy.js
/**
 * MoodMap “vanity” purchase redirect
 *
 *   /buy?ref=sophie&type=yearly
 *   └─▶ https://buy.stripe.com/...  (Payment Link)
 *
 *  • `ref`  (alias `via`)  = PromoteKit creator‑kode → Stripe client_reference_id
 *  • `type` = monthly | yearly      → velger riktig Payment Link
 *  • Alle pk_*‑parametre fra PromoteKit beholdes (for attribution)
 *
 * Endre PLAN_LINKS hvis du lager nye Payment Links i Stripe Dashboard.
 */

export async function getServerSideProps({ query, res }) {
  /* ------------------------------------------------------------------ */
  /* 1. Parse & valider query                                           */
  /* ------------------------------------------------------------------ */
  const rawRef  = query.ref ?? query.via ?? 'default';
  const rawType = query.type ?? 'monthly';

  // tillat a‑z, 0‑9, bindestrek/underscore, 1‑32 tegn
  const ref  = /^[\w-]{1,32}$/.test(rawRef) ? rawRef : 'default';
  const type = rawType === 'yearly' ? 'yearly' : 'monthly';

  /* ------------------------------------------------------------------ */
  /* 2. Velg Stripe Payment Link                                        */
  /* ------------------------------------------------------------------ */
  const PLAN_LINKS = {
    monthly: 'https://buy.stripe.com/4gwbLq3dO3YJ3jka00',
    yearly:  'https://buy.stripe.com/7sI02ZfFecfCYJ73kk',
  };
  const baseUrl = PLAN_LINKS[type];

  /* ------------------------------------------------------------------ */
  /* 3. Bygg endelig URL                                                */
  /* ------------------------------------------------------------------ */
  const url = new URL(baseUrl);

  // Stripe leser client_reference_id direkte fra query
  url.searchParams.set('client_reference_id', ref);

  // Ekstra: lagre creator‑koden som metadata[ref_code] i Stripe‑sesjonen
  url.searchParams.set('metadata[ref_code]', ref);

  // Behold valgte plan for intern analyse
  url.searchParams.set('type', type);

  // Behold alle pk_*‑parametre fra PromoteKit for konverterings‑matching
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('pk_')) url.searchParams.set(k, v);
  }

  /* ------------------------------------------------------------------ */
  /* 4. Redirect → Stripe                                               */
  /* ------------------------------------------------------------------ */
  res.writeHead(302, { Location: url.toString() });
  res.end();

  return { props: {} }; // siden rendres aldri
}

/* eslint-disable react/display-name */
export default () => null;
