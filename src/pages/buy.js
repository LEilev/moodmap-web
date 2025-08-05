// pages/buy.js
// -------------------------------------------------------------
// v2.0.0   • assert plan‑link   • UA log   • safe fallback
// -------------------------------------------------------------
export async function getServerSideProps({ query, req, res }) {
  const rawVia = query.via ?? query.ref ?? 'default';
  const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : 'default';
  const type = query.type === 'yearly' ? 'yearly' : 'monthly';

  const PLAN_LINKS = {
    monthly: 'https://buy.stripe.com/14A4gAaMb3roc3Y73j3ks00',
    yearly:  process.env.STRIPE_YEARLY_LINK ?? '',
  };
  if (!PLAN_LINKS[type])
    throw new Error(`[buy] Missing Stripe link for type=${type}`);

  const url = new URL(PLAN_LINKS[type]);
  url.searchParams.set('client_reference_id', via);
  url.searchParams.set('metadata[ref_code]', via);
  url.searchParams.set('type', type);

  Object.entries(query).forEach(([k, v]) => {
    if (k.startsWith('pk_')) url.searchParams.set(k, v.toString());
  });

  console.info('[buy] ➜', {
    ip: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress,
    ua: req.headers['user-agent']?.slice(0, 80),
    via,
    type,
    pk: Object.keys(query).filter((k) => k.startsWith('pk_')).length,
  });

  res.writeHead(302, { Location: url.toString() });
  res.end();
  return { props: {} };
}

export default () => null;
