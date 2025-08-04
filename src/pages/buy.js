/**
 * MoodMap “vanity” purchase redirect  (v3 – Prod logging & ref_code)
 *
 *    /buy?via=sophie&type=yearly&pk_click_id=123
 *        └──▶ Stripe Payment Link
 *
 *  • via | ref   →  client_reference_id **and** metadata[ref_code]  (PromoteKit)
 *  • type        →  monthly | yearly     (default = monthly)
 *  • pk_*        →  passed through       (PromoteKit click fingerprint)
 */

export async function getServerSideProps(context) {
  const { query, res, req } = context;

  /* ------------------------------------------------------------------ */
  /* 1 · Sanitise query params                                          */
  /* ------------------------------------------------------------------ */
  const rawVia  = query.via ?? query.ref ?? "default";
  const rawType = query.type ?? "monthly";

  const via  = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : "default";
  const type = rawType === "yearly" ? "yearly" : "monthly";
  if (type !== rawType) console.warn("[buy] unknown plan, falling back to monthly");

  /* ------------------------------------------------------------------ */
  /* 2 · Select Payment Link                                            */
  /* ------------------------------------------------------------------ */
  const PLAN_LINKS = {
    monthly: "https://buy.stripe.com/14A4gAaMb3roc3Y73j3ks00",
    yearly:  "https://buy.stripe.com/7sI02ZfFecfCYJ73kk", // TODO: replace w/ LIVE yearly link
  };
  const url = new URL(PLAN_LINKS[type]);

  /* ------------------------------------------------------------------ */
  /* 3 · Inject Stripe‑allowed params                                   */
  /* ------------------------------------------------------------------ */
  url.searchParams.set("client_reference_id", via);
  url.searchParams.set("metadata[ref_code]", via);   // PromoteKit expects this
  url.searchParams.set("type", type);

  /* 4 · Preserve all pk_* params for PromoteKit                        */
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith("pk_")) url.searchParams.set(k, v.toString());
  }

  /* ------------------------------------------------------------------ */
  /* 5 · Log & redirect                                                 */
  /* ------------------------------------------------------------------ */
  console.info("[buy] redirect‑init", {
    ip: req.headers["x-forwarded-for"] ?? req.socket.remoteAddress,
    via,
    type,
    pk: Object.keys(query).filter((k) => k.startsWith("pk_")).length,
  });

  res.writeHead(302, { Location: url.toString() });
  res.end();
  return { props: {} };
}

/* eslint-disable react/display-name */
export default () => null;
