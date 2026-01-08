// src/lib/inf-keys.js

export const INF_QUEUE = 'inf:queue';
export const INF_UNSUB = 'inf:unsubscribed';

// New keys for robustness/ops
export const INF_DEAD = 'inf:dead';                 // set of permanently failed emails
export const INF_PAUSE = 'inf:pause';               // "1" => worker pauses
export const INF_WORKER_LOCK = 'inf:worker_lock';   // global worker mutex
export const INF_RECONCILE_LOCK = 'inf:reconcile_lock'; // throttles stale-processing reconcile

export const infKey = (email) => `inf:${email.trim().toLowerCase()}`;
export const nowISO = () => new Date().toISOString();
export const addDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};
