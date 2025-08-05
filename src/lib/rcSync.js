// rcSync.js
// -------------------------------------------------------------
// v1.0.2  ·  Shares axios‑instance w/ retry + jitter
// -------------------------------------------------------------
import axios from 'axios';
import axiosRetry from 'axios-retry';

/* one axios instance w/ global retry */
const http = axios.create({ timeout: 8_000 });
axiosRetry(http, {
  retries: 3,
  retryDelay: (n) => Math.pow(n, 2) * 200, // 0.2 s, 0.8 s, 1.8 s
  retryCondition: (err) =>
    err.code === 'ECONNABORTED' ||
    err.response?.status >= 500 ||
    err.response?.status === 429,
});

export async function rcSync(stripeEvent) {
  const inv = stripeEvent.data.object;
  const appUserId =
    inv.metadata?.app_user_id || inv.metadata?.client_reference_id;
  const fetchToken = inv.subscription || inv.id;

  if (!appUserId || !fetchToken) return false;

  try {
    await http.post(
      'https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          'X-Platform': 'stripe',
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
      },
    );
    return true;
  } catch (e) {
    console.error('[rcSync] fail', e.message);
    return false;
  }
}
