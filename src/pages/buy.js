// pages/buy.js
// ------------------------------------------------------------------
// v2.3.0 • Stripe Payment Links m/ client_reference_id + pk_* videreføring
// - Leser via/ref fra query og setter client_reference_id
// - Bevarer alle pk_*-parametre (pk_click_id m.m.)
// - 302-redirect til riktig Payment Link (monthly/yearly)
// ------------------------------------------------------------------

export async function getServerSideProps({ query, req, res }) {
  // via/ref (affiliate/referrer)
  const rawVia = query.via ?? query.ref ?? 'default';
  const via = /^[\w-]{1,32}$/.test(String(rawVia)) ? String(rawVia) : 'default';

  // type = monthly | yearly (default monthly)
  const type = query.type === 'yearly' ? 'yearly' : 'monthly';

  // DINE LIVE PAYMENT LINKS (de to øverste/nyeste)
  const PLAN_LINKS = {
    monthly: 'https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03',
    yearly:  'https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04',
  };

  const base = PLAN_LINKS[type];
  if (!base) {
    res.statusCode = 400;
    res.end('Unknown plan type');
    return { props: {} };
  }

  const url = new URL(base);

  // Stripe-whitelistede params
  url.searchParams.set('client_reference_id', via); // viktig for PromoteKit
  url.searchParams.set('type', type);

  // Bevar PromoteKit-relaterte params (pk_*)
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('pk_')) url.searchParams.set(k, String(v));
  }

  // Lett serverlogg for feilsøking
  try {
    console.info('[buy] →', {
      ip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress,
      ua: (req.headers['user-agent'] || '').slice(0, 120),
      via,
      type,
      pk_params: Object.keys(query).filter((k) => k.startsWith('pk_')),
    });
  } catch {}

  // 302 redirect til Stripe
  res.writeHead(302, { Location: url.toString() });
  res.end();
  return { props: {} };
}

export default function BuyRedirect() {
  return null;
}
