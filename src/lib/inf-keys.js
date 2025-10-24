export const INF_QUEUE = 'inf:queue';
export const INF_UNSUB = 'inf:unsubscribed';
export const infKey = (email) => `inf:${email.trim().toLowerCase()}`;
export const nowISO = () => new Date().toISOString();
export const addDaysISO = (days) => { const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString(); };
