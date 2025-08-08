// pages/buy.js
// ------------------------------------------------------------------
// v2.3.0 • Stripe Payment Links m/ metadata-ref_code + client_reference_id
// - Sender client_reference_id = via/ref
// - Bevarer pk_* query (pk_click_id etc.)
// - 302-redirect – ingen visning
// ------------------------------------------------------------------

export async function getServerSideProps({ query, req, res }) {
  // via/ref (affiliate/referrer)
  const rawVia = query.via ?? query.ref ?? 'default';
  const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : 'default';

  // type = monthly | yearly (default monthly)
  const type = query.type === 'yearly' ? 'yearly' : 'monthly';

  // >>> Sett INN dine LIVE Payment Link-URLer her <<<
  const PLAN_LINKS = {
    monthly: 'https://buy.stripe.com/YOUR_MONTHLY_PAYMENT_LINK',
    yearly:  'https://buy.stripe.com/YOUR_YEARLY_PAYMENT_LINK',
  };

  const base = PLAN_LINKS[type];
  if (!base) {
    console.error('[buy] missing link for type', type);
    res.statusCode = 400;
    res.end('Unknown plan type');
    return { props: {} };
  }

  const url = new URL(base);

  // Stripe-whitelisted params
  url.searchParams.set('client_reference_id', via);
  url.searchParams.set('type', type);

  // Bevar PromoteKit-relaterte params
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('pk_')) url.searchParams.set(k, String(v));
  }

  // Lett serverlogg for feilsøking
  try {
    console.info('[buy] ->', {
      ip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress,
      ua: req.headers['user-agent']?.slice(0, 120),
      via,
      type,
      pk_params: Object.keys(query).filter((k) => k.startsWith('pk_')),
    });
  } catch (_) {}

  // 302 redirect til Stripe
  res.writeHead(302, { Location: url.toString() });
  res.end();
  return { props: {} };
}

export default function BuyRedirect() {
  return null;
}
