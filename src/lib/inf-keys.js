export const INF_QUEUE = 'inf:queue';
export const INF_UNSUB = 'inf:unsubscribed';
export const INF_DEAD = 'inf:dead';

export const INF_PAUSE = 'inf:pause';

export const INF_WORKER_LOCK = 'inf:worker_lock';
export const INF_RECONCILE_LOCK = 'inf:reconcile_lock';

export const infKey = (email) => `inf:${String(email || '').trim().toLowerCase()}`;
export const nowISO = () => new Date().toISOString();

// Optional helper (hvis du bruker den andre steder)
export const addDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString();
};
