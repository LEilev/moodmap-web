export const runtime = 'edge';

import { redis } from '@/lib/redis';
import {
  INF_QUEUE,
  INF_UNSUB,
  INF_DEAD,
  INF_PAUSE,
  INF_WORKER_LOCK,
  INF_RECONCILE_LOCK,
  infKey,
  nowISO
} from '@/lib/inf-keys';
import { initialTemplate, followupTemplate } from '@/lib/email-templates';
import { tryAcquire, release } from '@/lib/ratelimit';

const RESEND_API = 'https://api.resend.com/emails';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normEmail(v) {
  return String(v || '').trim().toLowerCase();
}

function maskEmail(email) {
  const s = normEmail(email);
  const [local, domain] = s.split('@');
  if (!local || !domain) return s;
  if (local.length <= 2) return `${local[0] || '*'}*@${domain}`;
  return `${local[0]}***${local.slice(-1)}@${domain}`;
}

function parseIntClamped(v, def, min, max) {
  const n = parseInt(String(v ?? ''), 10);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, n));
}

async function sendEmail({ to, subject, html, listUnsub, from, apiKey, idempotencyKey }) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      headers: {
        'List-Unsubscribe': listUnsub,
        // Optional: improves Gmail one-click unsubscribe behavior in some clients
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });

  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch {}
    const err = new Error(`Resend ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  // Not strictly needed, but helpful when debugging
  try { return await res.json(); } catch { return { ok: true }; }
}

/**
 * Reconcile stuck "processing" items:
 * If a previous worker crashed after LPOP, the email may be missing from INF_QUEUE
 * but stuck with status=processing. We requeue stale processing items.
 *
 * This runs at most once per 10 minutes (INF_RECONCILE_LOCK).
 */
async function reconcileStaleProcessing({ staleMs = 10 * 60 * 1000, maxKeys = 1500 } = {}) {
  const ok = await tryAcquire(INF_RECONCILE_LOCK, 600);
  if (!ok) return { ran: false, requeued: 0 };

  let requeued = 0;
  let cursor = '0';
  let seen = 0;
  let guard = 0;

  do {
    const res = await redis.scan(cursor, { match: 'inf:*', count: 200 });
    let nextCursor = '0';
    let keys = [];

    if (Array.isArray(res)) {
      nextCursor = String(res[0] ?? '0');
      keys = Array.isArray(res[1]) ? res[1] : [];
    } else if (res && typeof res === 'object') {
      nextCursor = String(res.cursor ?? res[0] ?? '0');
      keys = Array.isArray(res.keys) ? res.keys : (Array.isArray(res.values) ? res.values : []);
    }

    for (const key of keys) {
      if (!key) continue;
      if (key === INF_QUEUE || key === INF_UNSUB || key === INF_DEAD) continue;

      let h;
      try { h = await redis.hgetall(key); } catch { continue; }
      if (!h || Object.keys(h).length === 0) continue;

      seen++;
      if (seen > maxKeys) break;

      const st = String(h.status || '').toLowerCase();
      if (st !== 'processing') continue;

      const processingAt = h.processingAt ? Date.parse(h.processingAt) : NaN;
      const ageOk = Number.isFinite(processingAt) ? (Date.now() - processingAt > staleMs) : true;
      if (!ageOk) continue;

      const email = normEmail(h.email || key.replace(/^inf:/, ''));
      if (!email) continue;

      // If they unsubscribed while stuck, do not requeue
      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) {
        await redis.hset(key, { status: 'unsubscribed', processingAt: '' });
        continue;
      }

      await redis.hset(key, { status: 'queued', processingAt: '', lastError: 'stale_processing_requeued' });
      await redis.rpush(INF_QUEUE, email);
      requeued++;
    }

    cursor = nextCursor;
    guard++;
    if (guard > 50) break;
    if (seen > maxKeys) break;
  } while (cursor !== '0');

  return { ran: true, requeued };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  const followups = searchParams.get('followups') === '1';
  const dry = searchParams.get('dry') === '1';

  const max = parseIntClamped(searchParams.get('max'), 5, 1, 25);
  const domainCap = parseIntClamped(searchParams.get('domainCap'), Number(process.env.DOMAIN_CAP || 2), 1, 10);
  const maxAttempts = parseIntClamped(searchParams.get('maxAttempts'), Number(process.env.MAX_ATTEMPTS || 3), 1, 10);
  const minDelayMs = parseIntClamped(searchParams.get('minDelayMs'), Number(process.env.MIN_DELAY_MS || 600), 0, 2000);

  const baseUrl = process.env.BASE_URL;
  const from = process.env.EMAIL_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  if (!baseUrl || !from || !apiKey) {
    return json({ error: 'missing_env', need: ['BASE_URL', 'EMAIL_FROM', 'RESEND_API_KEY'] }, 500);
  }

  // Pause switch
  const paused = await redis.get(INF_PAUSE);
  if (paused) {
    return json({ ok: true, paused: true, didWork: false }, 200);
  }

  // Global lock (prevents overlapping cron/manual triggers)
  const gotLock = await tryAcquire(INF_WORKER_LOCK, 55);
  if (!gotLock) {
    return json({ ok: true, skipped: true, reason: 'locked' }, 200);
  }

  const result = {
    ok: true,
    mode: followups ? 'followups' : 'queue',
    dryRun: dry,

    max,
    domainCap,
    maxAttempts,
    minDelayMs,

    sent: 0,
    requeued: 0,
    failed: 0,
    skipped: 0,
    errors: 0,

    // masked samples for debugging without leaking full list
    sentSample: [],
    skippedSample: [],
    errorSample: [],

    backoff429: false,
    reconciled: { ran: false, requeued: 0 },

    queueLen: 0
  };

  try {
    // Reconcile stale processing only for queue mode (not needed for followups scan)
    if (!followups && !dry) {
      result.reconciled = await reconcileStaleProcessing();
    }

    if (!followups) {
      // QUEUE DRAIN (initial outreach)
      const domainCounts = {};

      // Dry-run: peek without mutating queue
      let peek = [];
      if (dry) {
        if (typeof redis.lrange === 'function') {
          peek = await redis.lrange(INF_QUEUE, 0, max - 1);
        } else if (typeof redis.lindex === 'function') {
          for (let i = 0; i < max; i++) {
            const v = await redis.lindex(INF_QUEUE, i);
            if (!v) break;
            peek.push(v);
          }
        } else {
          return json({ error: 'dry_run_not_supported', detail: 'redis.lrange/lindex not available' }, 500);
        }

        for (const raw of peek) {
          const email = normEmail(raw);
          if (!email) continue;

          const masked = maskEmail(email);

          const isUnsub = await redis.sismember(INF_UNSUB, email);
          if (isUnsub) {
            result.skipped++;
            if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: 'unsubscribed' });
            continue;
          }

          const key = infKey(email);
          const inf = await redis.hgetall(key);
          const st = String(inf?.status || 'queued').toLowerCase();

          if (['sent', 'bounced', 'unsubscribed', 'failed'].includes(st)) {
            result.skipped++;
            if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: `status:${st}` });
            continue;
          }

          const domain = email.split('@')[1] || '';
          if (domain) {
            domainCounts[domain] = domainCounts[domain] || 0;
            if (domainCounts[domain] >= domainCap) {
              result.skipped++;
              if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: 'domain_cap' });
              continue;
            }
            domainCounts[domain] += 1;
          }

          result.sent++;
          if (result.sentSample.length < 15) result.sentSample.push({ email: masked, note: 'would_send' });
        }

        // Reset "sent" in dry-run to reflect "would send"
        return json(result, 200);
      }

      // Real run: pop up to max items and process
      for (let i = 0; i < max; i++) {
        const raw = await redis.lpop(INF_QUEUE);
        if (!raw) break;

        const email = normEmail(raw);
        const masked = maskEmail(email);
        if (!email) {
          result.skipped++;
          if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: 'empty_email' });
          continue;
        }

        // Pause flag check between items
        const pauseNow = await redis.get(INF_PAUSE);
        if (pauseNow) {
          // Put current email back since we didn't process it
          await redis.rpush(INF_QUEUE, email);
          break;
        }

        const isUnsub = await redis.sismember(INF_UNSUB, email);
        const key = infKey(email);

        if (isUnsub) {
          // Never send; mark and drop
          await redis.hset(key, { status: 'unsubscribed', processingAt: '' });
          result.skipped++;
          if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: 'unsubscribed' });
          continue;
        }

        let inf = await redis.hgetall(key);
        if (!inf || Object.keys(inf).length === 0) {
          // Queue contained an email with no hash; create minimal record
          await redis.hset(key, {
            email,
            name: '',
            handle: '',
            followers: 0,
            status: 'queued',
            attempts: 0,
            createdAt: nowISO(),
            processingAt: '',
            lastError: '',
            lastSent: '',
            followupsSent: 0,
            openedAt: '',
            clickedAt: '',
            opens: 0,
            clicks: 0,
          });
          inf = await redis.hgetall(key);
        }

        const st = String(inf.status || 'queued').toLowerCase();
        if (['sent', 'bounced', 'unsubscribed', 'failed'].includes(st)) {
          result.skipped++;
          if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: `status:${st}` });
          continue;
        }

        // Per-domain cap inside one invocation
        const domain = email.split('@')[1] || '';
        if (domain) {
          domainCounts[domain] = domainCounts[domain] || 0;
          if (domainCounts[domain] >= domainCap) {
            await redis.rpush(INF_QUEUE, email);
            result.skipped++;
            if (result.skippedSample.length < 15) result.skippedSample.push({ email: masked, reason: 'domain_cap_requeued' });
            continue;
          }
        }

        // Mark processing
        await redis.hset(key, { status: 'processing', processingAt: nowISO() });

        const { subject, html, listUnsub } = initialTemplate({
          baseUrl,
          email,
          name: inf?.name,
          handle: inf?.handle,
        });

        try {
          await sendEmail({
            to: email,
            subject,
            html,
            listUnsub,
            from,
            apiKey,
            idempotencyKey: `initial:${email}`,
          });

          await redis.hset(key, {
            status: 'sent',
            lastSent: nowISO(),
            processingAt: '',
            lastError: '',
          });

          result.sent++;
          if (result.sentSample.length < 15) result.sentSample.push({ email: masked });

          if (domain) domainCounts[domain] = (domainCounts[domain] || 0) + 1;

          if (minDelayMs > 0 && i < max - 1) await sleep(minDelayMs);
        } catch (e) {
          const statusCode = Number(e?.status || 0) || null;
          const msg = String(e?.message ?? e);

          result.errors++;
          if (result.errorSample.length < 15) {
            result.errorSample.push({ email: masked, error: msg, status: statusCode ?? undefined });
          }

          // Fatal misconfig: don't burn the list into failed. Requeue and stop.
          if (statusCode === 401 || statusCode === 403) {
            await redis.hset(key, { status: 'queued', processingAt: '', lastError: msg });
            await redis.rpush(INF_QUEUE, email);
            result.requeued++;
            break;
          }

          // Count attempt
          let attemptsNow = 1;
          try {
            attemptsNow = await redis.hincrby(key, 'attempts', 1);
          } catch {
            // fallback best-effort
            const prev = parseInt(inf?.attempts ?? '0', 10);
            attemptsNow = (Number.isFinite(prev) ? prev : 0) + 1;
            await redis.hset(key, { attempts: attemptsNow });
          }

          await redis.hset(key, { processingAt: '', lastError: msg });

          const is429 = (statusCode === 429) || msg.includes('Resend 429');
          const isPermanent =
            statusCode === 400 ||
            statusCode === 422;

          const giveUp = isPermanent || attemptsNow >= maxAttempts;

          if (giveUp) {
            await redis.hset(key, { status: 'failed' });
            await redis.sadd(INF_DEAD, email);
            result.failed++;
          } else {
            await redis.hset(key, { status: 'queued' });
            await redis.rpush(INF_QUEUE, email);
            result.requeued++;
          }

          if (is429) {
            result.backoff429 = true;
            break;
          }

          // tiny delay to avoid hot looping on immediate failures
          if (minDelayMs > 0) await sleep(Math.min(300, minDelayMs));
        }
      }
    } else {
      // FOLLOWUPS (SCAN instead of KEYS)
      const FOLLOWUP_AGE_DAYS = parseIntClamped(searchParams.get('followupDays'), 7, 1, 60);
      const cutoffMs = Date.now() - FOLLOWUP_AGE_DAYS * 24 * 60 * 60 * 1000;

      // Dry-run is allowed; no state changes/sends
      let sentThisRun = 0;

      let cursor = '0';
      let guard = 0;

      do {
        const res = await redis.scan(cursor, { match: 'inf:*', count: 200 });
        let nextCursor = '0';
        let keys = [];

        if (Array.isArray(res)) {
          nextCursor = String(res[0] ?? '0');
          keys = Array.isArray(res[1]) ? res[1] : [];
        } else if (res && typeof res === 'object') {
          nextCursor = String(res.cursor ?? res[0] ?? '0');
          keys = Array.isArray(res.keys) ? res.keys : (Array.isArray(res.values) ? res.values : []);
        }

        for (const key of keys) {
          if (sentThisRun >= max) break;
          if (!key || key === INF_QUEUE || key === INF_UNSUB || key === INF_DEAD) continue;

          let inf;
          try { inf = await redis.hgetall(key); } catch { continue; }
          if (!inf || Object.keys(inf).length === 0) continue;

          const st = String(inf.status || '').toLowerCase();
          if (st !== 'sent') continue;

          const fuSent = parseInt(inf.followupsSent || '0', 10);
          if (fuSent > 0) continue;

          const lastSentMs = inf.lastSent ? Date.parse(inf.lastSent) : NaN;
          if (!Number.isFinite(lastSentMs) || lastSentMs > cutoffMs) continue;

          const email = normEmail(inf.email || key.replace(/^inf:/, ''));
          if (!email) continue;

          const isUnsub = await redis.sismember(INF_UNSUB, email);
          if (isUnsub) continue;

          const masked = maskEmail(email);

          // Optional throttle per run (reuse domainCap logic)
          // (This is simplistic; followups are usually low volume.)
          const { subject, html, listUnsub } = followupTemplate({
            baseUrl,
            email,
            name: inf?.name,
            handle: inf?.handle,
          });

          if (dry) {
            result.sent++;
            if (result.sentSample.length < 15) result.sentSample.push({ email: masked, note: 'would_send_followup' });
            sentThisRun++;
            continue;
          }

          // Pause between keys
          const pauseNow = await redis.get(INF_PAUSE);
          if (pauseNow) break;

          try {
            await sendEmail({
              to: email,
              subject,
              html,
              listUnsub,
              from,
              apiKey,
              idempotencyKey: `followup:${email}`,
            });

            await redis.hset(key, {
              lastSent: nowISO(),
              followupsSent: 1,
              lastError: '',
            });

            result.sent++;
            if (result.sentSample.length < 15) result.sentSample.push({ email: masked });
            sentThisRun++;

            if (minDelayMs > 0) await sleep(minDelayMs);
          } catch (e) {
            const statusCode = Number(e?.status || 0) || null;
            const msg = String(e?.message ?? e);

            result.errors++;
            if (result.errorSample.length < 15) result.errorSample.push({ email: masked, error: msg, status: statusCode ?? undefined });

            // Track followup-specific attempts (so we don't poison initial attempts)
            try {
              await redis.hincrby(key, 'followupAttempts', 1);
              await redis.hset(key, { followupLastError: msg });
            } catch {
              // ignore
            }

            if (statusCode === 429 || msg.includes('Resend 429')) {
              result.backoff429 = true;
              sentThisRun = max; // force stop
              break;
            }

            if (minDelayMs > 0) await sleep(Math.min(300, minDelayMs));
          }
        }

        cursor = nextCursor;
        guard++;
        if (guard > 50) break;
        if (sentThisRun >= max) break;
      } while (cursor !== '0');
    }

    // return queue length snapshot
    try { result.queueLen = await redis.llen(INF_QUEUE); } catch { result.queueLen = 0; }

    return json(result, 200);
  } catch (e) {
    return json({ error: 'worker_failed', message: String(e?.message ?? e) }, 500);
  } finally {
    await release(INF_WORKER_LOCK);
  }
}
