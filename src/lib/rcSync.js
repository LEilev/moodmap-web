// Centralises the call to RevenueCat so webhook & cron share code
import axios from 'axios';

export async function rcSync(stripeEvent) {
  const inv = stripeEvent.data.object;
  const appUserId =
    inv.metadata?.app_user_id || inv.metadata?.client_reference_id;
  const fetchToken = inv.subscription || inv.id;

  if (!appUserId || !fetchToken) return false;

  try {
    await axios.post(
      'https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          'X-Platform': 'stripe',
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
        timeout: 8000,
      },
    );
    return true;
  } catch (e) {
    console.error('[rcSync] failed', e.message);
    return false;
  }
}
