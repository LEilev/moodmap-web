// rcSync.js
// -------------------------------------------------------------
// v1.1.0  ·  Strict app_user_id from metadata only
//           One axios instance w/ retry + jitter
// -------------------------------------------------------------
import axios from "axios";
import axiosRetry from "axios-retry";

/** Single axios client w/ retry */
const http = axios.create({ timeout: 8_000 });
axiosRetry(http, {
  retries: 3,
  retryDelay: (n) => Math.pow(n, 2) * 200, // 0.2s, 0.8s, 1.8s
  retryCondition: (err) =>
    err.code === "ECONNABORTED" ||
    err.response?.status >= 500 ||
    err.response?.status === 429,
});

/**
 * Syncs a Stripe invoice/subscription event to RevenueCat.
 * Expects event.data.object to carry metadata.app_user_id (string),
 * and either .subscription (for sessions) or .id (for invoice).
 *
 * @param {object} stripeEvent  – Stripe event (or a shape-alike)
 * @returns {Promise<boolean>}  – true on 2xx, false on error
 */
export async function rcSync(stripeEvent) {
  try {
    const obj = stripeEvent?.data?.object || {};
    const appUserId = obj?.metadata?.app_user_id || null; // ← strict; no client_reference_id fallback
    const fetchToken = obj.subscription || obj.id;

    if (!appUserId || !fetchToken) return false;

    await http.post(
      "https://api.revenuecat.com/v1/receipts",
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          "X-Platform": "stripe",
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
      }
    );

    return true;
  } catch (e) {
    console.error("[rcSync] fail", e?.message || e);
    return false;
  }
}
