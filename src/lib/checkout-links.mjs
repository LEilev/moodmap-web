// Retired web checkout: legacy callers can only reach the app-store information page.
// Deliberately ignore every former payment, referral, and query parameter.
export function checkoutHref() {
  return "/pro";
}
