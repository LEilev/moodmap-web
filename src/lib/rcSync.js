// src/lib/rcSync.js
import axios from "axios";

const RC_URL = "https://api.revenuecat.com/v1/receipts"; // official endpoint
const KEY = process.env.RC_STRIPE_PUBLIC_API_KEY;

// evt = minimal Stripe-like wrapper we pass from webhook
export async function rcSync(evt) {
  try {
    const obj = evt?.data?.object || {};
    const appUserId = obj?.metadata?.app_user_id || null;
    // fetch_token is subscription id during cs.completed, invoice id for invoice.*
    const fetchToken = obj.subscription || obj.id;

    if (!appUserId || !fetchToken) {
      console.warn("[rcSync] skip (missing app_user_id or fetch_token)", { appUserId: !!appUserId, fetchToken: !!fetchToken });
      return false;
    }

    const res = await axios.post(
      RC_URL,
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Platform": "stripe",
          Authorization: `Bearer ${KEY}`,
        },
        timeout: 15000,
        validateStatus: () => true,
      }
    );

    if (res.status >= 200 && res.status < 300) return true;

    console.error("[rcSync] non-2xx", { status: res.status, data: res.data });
    return false;
  } catch (e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    console.error("[rcSync] fail", { status, data, message: e?.message });
    return false;
  }
}
