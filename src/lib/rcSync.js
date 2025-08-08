// src/lib/rcSync.js
import axios from "axios";

const RC_URL = "https://api.revenuecat.com/v1/incoming-webhooks/stripe/app2r0feC8610"; // behold din endepunkt-URL
const KEY    = process.env.RC_STRIPE_PUBLIC_API_KEY;

export async function rcSync(evt) {
  try {
    const res = await axios.post(RC_URL, evt, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300) return true;

    console.error("[rcSync] non-2xx", { status: res.status, data: res.data });
    return false;
  } catch (e) {
    const status = e?.response?.status;
    const data   = e?.response?.data;
    console.error("[rcSync] fail", { status, data, message: e?.message });
    return false;
  }
}
