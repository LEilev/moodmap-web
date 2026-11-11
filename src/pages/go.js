// Web purchases are retired. Keep old links useful without forwarding customer,
// referral or token query parameters to the public Premium+ page.
export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return { redirect: { destination: "/pro", permanent: false } };
}

export default function RetiredReferralCheckout() {
  return null;
}
