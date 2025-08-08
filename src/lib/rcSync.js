// src/lib/rcSync.js
import axios from "axios";

// Behold hardkodet endpoint hvis du vil, men la env kunne overstyre
const RC_URL = process.env.RC_STRIPE_WEBHOOK_URL
  || "https://api.revenuecat.com/v1/incoming-webhooks/stripe/app2r0feC8610";

const KEY = process.env.RC_STRIPE_PUBLIC_API_KEY;

// Litt defensiv validering og små retry på nett/5xx.
export async function rcSync(evt) {
  if (!RC_URL) {
    console.error("[rcSync] missing RC_URL");
    return false;
  }
  if (!KEY) {
    console.error("[rcSync] missing RC_STRIPE_PUBLIC_API_KEY");
    return false;
  }
  if (!evt || typeof evt !== "object") {
    console.error("[rcSync] invalid event payload", { type: typeof evt });
    return false;
  }

  const client = axios.create({
    baseURL: RC_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    validateStatus: () => true, // vi håndterer status selv
  });

  // Enkelt retry for 5xx / nettfeil (ikke 4xx)
  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const res = await client.post("", evt);

      if (res.status >= 200 && res.status < 300) {
        // Suksess
        return true;
      }

      // 4xx: ikke retry – logg alt vi kan
      if (res.status >= 400 && res.status < 500) {
        console.error("[rcSync] non-2xx (no retry)", {
          status: res.status,
          data: res.data,
        });
        return false;
      }

      // 5xx: logg og forsøk igjen (opp til maxAttempts)
      console.warn("[rcSync] 5xx from RC (will retry)", {
        status: res.status,
        data: res.data,
        attempt,
      });
    } catch (e) {
      // Nettfeil / timeout / axios error
      const status = e?.response?.status;
      const data = e?.response?.data;
      const message = e?.message || "unknown error";

      // Retry bare hvis ingen/5xx status – ikke ved 4xx
      if (status && status >= 400 && status < 500) {
        console.error("[rcSync] fail (no retry on 4xx)", { status, data, message });
        return false;
      }

      console.warn("[rcSync] transport error (will retry)", { status, data, message, attempt });
    }
  }

  console.error("[rcSync] exhausted retries");
  return false;
}
