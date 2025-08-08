// src/lib/rcSync.js
import axios from "axios";

/**
 * RevenueCat sync for Stripe abonnementer.
 * Viktig: fetch_token MÅ være Stripe subscription.id (sub_...),
 * ikke invoice.id – ellers får man 400 / code 7403 ("The receipt is not valid").
 *
 * @param {{ appUserId: string, fetchToken: string }} params
 * @returns {Promise<boolean>}
 */
export async function rcSync({ appUserId, fetchToken }) {
  if (!appUserId || !fetchToken) {
    console.warn("[rcSync] missing params", { appUserId: !!appUserId, fetchToken: !!fetchToken });
    return false;
  }

  const RC_KEY = process.env.RC_STRIPE_PUBLIC_API_KEY;
  if (!RC_KEY) {
    console.error("[rcSync] missing RC_STRIPE_PUBLIC_API_KEY");
    return false;
  }

  const data = {
    app_user_id: appUserId,
    fetch_token: fetchToken, // MUST be subscription.id for Stripe subs
  };

  try {
    const res = await axios.post(
      "https://api.revenuecat.com/v1/receipts",
      data,
      {
        headers: {
          Authorization: `Bearer ${RC_KEY}`,
          "Content-Type": "application/json",
          "X-Platform": "stripe",
        },
        // Stramme timeouts er bra i serverless
        timeout: 8000,
        validateStatus: () => true,
      }
    );

    if (res.status >= 200 && res.status < 300) {
      // Optional: logg lavt – dette kan være spammy i prod
      // console.info("[rcSync] ok", { status: res.status });
      return true;
    }

    console.error("[rcSync] non-2xx", { status: res.status, data: res.data });
    return false;
  } catch (e) {
    const status = e?.response?.status;
    const dataResp = e?.response?.data;
    console.error("[rcSync] fail", { status, data: dataResp, message: e?.message });
    return false;
  }
}
