import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createHmac, webcrypto } from 'node:crypto';

// Actual route modules run with isolated environment variables and fake Redis,
// locks and mail I/O. A forgotten fetch mock throws rather than using a network.
// Run with: node --experimental-vm-modules --test tests/backend-security.test.mjs
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EMAIL = 'recipient@example.test';
const SIGNING_KEY = 'test-only-unsubscribe-key-0123456789abcdef';
const CRON_KEY = 'test-only-cron-key-0123456789abcdef';
const RESEND_KEY = `whsec_${Buffer.from('test-only-webhook-key-0123456789ab').toString('base64')}`;
const BASE = 'https://moodmap.example.test';

function harness({ redis = null, env = {}, fetch, setTimeout: timer = setTimeout } = {}) {
  const context = vm.createContext({
    Request, Response, Headers, FormData, URL, URLSearchParams,
    TextEncoder, TextDecoder, Uint8Array, AbortController, Buffer,
    crypto: webcrypto, atob, btoa, console,
    setTimeout: timer, clearTimeout,
    process: { env },
    fetch: fetch || (() => { throw new Error('Unexpected network request in backend test'); }),
  });
  const mocks = {
    '@/lib/redis': { redis },
    '@/lib/ratelimit': { tryAcquire: async () => true, release: async () => true },
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
  };
  const modules = new Map();
  async function createModule(id) {
    if (modules.has(id)) return modules.get(id);
    if (Object.hasOwn(mocks, id)) {
      const values = mocks[id];
      const sourceModule = new vm.SyntheticModule(Object.keys(values), function () {
        for (const [name, value] of Object.entries(values)) this.setExport(name, value);
      }, { context, identifier: id });
      modules.set(id, sourceModule);
      return sourceModule;
    }
    assert.ok(id.startsWith(path.join(ROOT, 'src') + path.sep), `Unexpected import: ${id}`);
    const source = await readFile(id, 'utf8');
    const sourceModule = new vm.SourceTextModule(source, { context, identifier: id });
    modules.set(id, sourceModule);
    return sourceModule;
  }
  async function linker(specifier, parent) {
    if (Object.hasOwn(mocks, specifier)) return createModule(specifier);
    let target;
    if (specifier.startsWith('@/')) target = path.join(ROOT, 'src', specifier.slice(2));
    else if (specifier.startsWith('.')) target = path.resolve(path.dirname(parent.identifier), specifier);
    else throw new Error(`Unmocked external import: ${specifier}`);
    if (!path.extname(target)) target += '.js';
    return createModule(target);
  }
  return {
    env,
    async load(relative) {
      const sourceModule = await createModule(path.join(ROOT, relative));
      if (sourceModule.status === 'unlinked') await sourceModule.link(linker);
      if (sourceModule.status !== 'evaluated') await sourceModule.evaluate();
      return sourceModule.namespace;
    },
  };
}

class FakeRedis {
  constructor() {
    this.values = new Map();
    this.hashes = new Map();
    this.sets = new Map();
    this.queue = [];
    this.calls = [];
    this.failEval = 0;
  }
  record(command, ...args) { this.calls.push({ command, args }); }
  get mutations() { return this.calls.filter(({ command }) => ['set', 'eval', 'hset', 'hincrby', 'sadd', 'lpop', 'rpush'].includes(command)); }
  async get(key) { this.record('get', key); return this.values.get(key) ?? null; }
  async set(key, value, options = {}) {
    this.record('set', key, value, options);
    if (options.nx && this.values.has(key)) return null;
    this.values.set(key, value);
    return 'OK';
  }
  async hgetall(key) { this.record('hgetall', key); return this.hashes.has(key) ? { ...this.hashes.get(key) } : null; }
  async hset(key, values) { this.record('hset', key, values); this.hashes.set(key, { ...this.hashes.get(key), ...values }); return 1; }
  async hincrby(key, field, amount) {
    this.record('hincrby', key, field, amount);
    const record = this.hashes.get(key) || {};
    record[field] = Number(record[field] || 0) + amount;
    this.hashes.set(key, record);
    return record[field];
  }
  async sadd(key, value) {
    this.record('sadd', key, value);
    const set = this.sets.get(key) || new Set();
    set.add(value);
    this.sets.set(key, set);
    return 1;
  }
  async sismember(key, value) { this.record('sismember', key, value); return this.sets.get(key)?.has(value) ? 1 : 0; }
  async scard(key) { this.record('scard', key); return this.sets.get(key)?.size || 0; }
  async scan() { this.record('scan'); return ['0', [...this.hashes.keys()]]; }
  async lpop() { this.record('lpop'); return this.queue.shift() || null; }
  async rpush(_key, value) { this.record('rpush', value); this.queue.push(value); return this.queue.length; }
  async llen() { this.record('llen'); return this.queue.length; }
  async lrange(_key, start, end) { this.record('lrange'); return this.queue.slice(start, end + 1); }
  async eval(script, keys, args) {
    this.record('eval', script, keys, args);
    if (this.failEval > 0) { this.failEval--; throw new Error('Simulated Redis failure'); }
    // Model the atomic Redis contract; no live database or provider is contacted.
    if (keys[0] === 'inf:unsubscribed') {
      const [email, at, mode] = args;
      if (mode === 'legacy' && !this.hashes.has(keys[1])) return 0;
      const suppressed = this.sets.get(keys[0]) || new Set();
      suppressed.add(email);
      this.sets.set(keys[0], suppressed);
      if (this.hashes.has(keys[1])) Object.assign(this.hashes.get(keys[1]), { status: 'unsubscribed', unsubscribedAt: at, processingAt: '' });
      return 1;
    }
    assert.ok(keys[0].startsWith('inf-webhook:resend:'));
    if (this.values.has(keys[0])) return 0;
    const [kind, at, ttl, ...emails] = args;
    assert.equal(ttl, 30 * 24 * 60 * 60);
    for (const [index, email] of emails.entries()) {
      const contact = this.hashes.get(keys[index + 2]);
      if (kind === 'bounce' || kind === 'unsub') {
        const suppressed = this.sets.get(keys[1]) || new Set();
        suppressed.add(email);
        this.sets.set(keys[1], suppressed);
        if (contact) contact.status = kind === 'bounce' ? 'bounced' : 'unsubscribed';
      } else if (contact) {
        const field = kind === 'open' ? 'opens' : 'clicks';
        contact[field] = Number(contact[field] || 0) + 1;
        contact[kind === 'open' ? 'openedAt' : 'clickedAt'] = at;
      }
    }
    this.values.set(keys[0], '1');
    return 1;
  }
}

function mailEnv(extra = {}) {
  return { BASE_URL: BASE, EMAIL_FROM: 'MoodMap <test@example.test>', RESEND_API_KEY: 'test-only-resend-key-0123456789abcdef', CRON_SECRET: CRON_KEY, ...extra };
}

function formRequest(url, fields, headers = {}) {
  return new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers }, body: new URLSearchParams(fields) });
}

function webhookRequest(body, { id = 'msg_test_1', timestamp = Math.floor(Date.now() / 1000), secret = RESEND_KEY, signature, url = `${BASE}/api/influencer/webhook` } = {}) {
  const mac = createHmac('sha256', Buffer.from(secret.slice(6), 'base64')).update(`${id}.${timestamp}.${body}`).digest('base64');
  return new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'svix-id': id, 'svix-timestamp': String(timestamp), 'svix-signature': signature || `v1,${mac}` }, body });
}

async function registeredFixture() {
  const redis = new FakeRedis();
  redis.hashes.set(`inf:${EMAIL}`, { email: EMAIL, status: 'sent' });
  const h = harness({ redis, env: { INFLUENCER_UNSUBSCRIBE_SECRET: SIGNING_KEY } });
  const helper = await h.load('src/lib/influencer-unsubscribe.js');
  const url = await helper.createUnsubscribeUrl({ baseUrl: BASE, email: EMAIL, redis });
  const route = await h.load('src/app/api/influencer/unsubscribe/route.js');
  redis.calls = [];
  return { h, redis, helper, route, url, token: new URL(url).searchParams.get('token') };
}

test('all 16 retired Partner/Kudos routes return 410 before any input or I/O', async () => {
  const files = await readdir(path.join(ROOT, 'src/app/api'), { recursive: true });
  const routes = files.filter((file) => /^(partner-[^/]+|kudos)\//.test(file) && file.endsWith('/route.js'));
  assert.equal(routes.length, 16);
  const h = harness({ env: { PARTNER_MODE_ENABLED: 'true', NEXT_PUBLIC_PARTNER_MODE: 'true' }, redis: new Proxy({}, { get() { throw new Error('Redis must not be accessed'); } }) });
  const unreadableRequest = new Proxy({}, { get() { throw new Error('Disabled route must not parse caller input'); } });
  let methods = 0;
  for (const file of routes) {
    const route = await h.load(`src/app/api/${file}`);
    for (const method of ['GET', 'POST']) {
      if (!route[method]) continue;
      const response = await route[method](unreadableRequest);
      assert.equal(response.status, 410, `${file} ${method}`);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.deepEqual(await response.json(), { ok: false, error: 'partner_mode_disabled', message: 'Partner Mode is currently unavailable.', disabled: true, isValidConnection: false, hasData: false });
      methods++;
    }
  }
  assert.equal(methods, 17);
});

test('unsubscribe rejects reflected HTML and legacy GET performs no database writes', async () => {
  const redis = new FakeRedis();
  const h = harness({ redis, env: { RESEND_API_KEY: SIGNING_KEY } });
  const route = await h.load('src/app/api/influencer/unsubscribe/route.js');
  const attack = '<script>marker()</script>@example.test';
  const invalid = await route.GET(new Request(`${BASE}/api/influencer/unsubscribe?email=${encodeURIComponent(attack)}`));
  assert.equal(invalid.status, 400);
  assert.ok(!(await invalid.text()).includes('<script>'));
  const response = await route.GET(new Request(`${BASE}/api/influencer/unsubscribe?email=${EMAIL}`));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('method="post"'));
  assert.ok(!html.includes(EMAIL));
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.ok(response.headers.get('content-security-policy').includes("default-src 'none'"));
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(redis.calls.length, 0);
});

test('registered opaque token is stable across signing-key rotation and safe on GET', async () => {
  const { h, redis, helper, route, url, token } = await registeredFixture();
  assert.match(token, /^v1\.[A-Za-z0-9_-]{43}$/);
  assert.ok(!url.includes('email=') && !url.includes(EMAIL));
  h.env.INFLUENCER_UNSUBSCRIBE_SECRET = 'a-different-test-only-signing-key-0123456789';
  assert.equal(await helper.createUnsubscribeUrl({ baseUrl: BASE, email: EMAIL, redis }), url);
  redis.calls = [];
  const response = await route.GET(new Request(url));
  assert.equal(response.status, 200);
  assert.equal(redis.mutations.length, 0);
  assert.equal(redis.hashes.get(`inf:${EMAIL}`).status, 'sent');
});

test('RFC 8058 form-encoded one-click POST suppresses and is idempotent', async () => {
  const { redis, route, url } = await registeredFixture();
  for (let delivery = 0; delivery < 2; delivery++) {
    const response = await route.POST(formRequest(url, { 'List-Unsubscribe': 'One-Click' }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
  }
  assert.equal(redis.sets.get('inf:unsubscribed').size, 1);
  assert.ok(redis.sets.get('inf:unsubscribed').has(EMAIL));
  assert.equal(redis.hashes.get(`inf:${EMAIL}`).status, 'unsubscribed');
  assert.equal(redis.calls.filter(({ command }) => command === 'eval').length, 2);
});

test('RFC 8058 multipart one-click POST is supported', async () => {
  const { redis, route, url } = await registeredFixture();
  const body = new FormData();
  body.set('List-Unsubscribe', 'One-Click');
  const response = await route.POST(new Request(url, { method: 'POST', body }));
  assert.equal(response.status, 200);
  assert.ok(redis.sets.get('inf:unsubscribed').has(EMAIL));
});

test('tampered token, missing token and raw legacy one-click cannot suppress', async () => {
  const { redis, route, url, token } = await registeredFixture();
  const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A');
  for (const address of [url.replace(token, tampered), `${BASE}/api/influencer/unsubscribe?email=${EMAIL}`, `${BASE}/api/influencer/unsubscribe`]) {
    const response = await route.POST(formRequest(address, { 'List-Unsubscribe': 'One-Click' }));
    assert.equal(response.status, 400);
  }
  assert.equal(redis.mutations.length, 0);
});

test('old email links keep explicit confirmation, reject foreign origin and never mutate GET', async () => {
  const { redis, route } = await registeredFixture();
  const response = await route.GET(new Request(`${BASE}/api/influencer/unsubscribe?email=${EMAIL}`));
  const html = await response.text();
  const token = html.match(/name="token" value="([^"]+)"/)[1];
  assert.equal(redis.mutations.length, 0);
  const foreign = await route.POST(formRequest(`${BASE}/api/influencer/unsubscribe`, { token, confirm: '1' }, { Origin: 'https://elsewhere.example.test' }));
  assert.equal(foreign.status, 403);
  assert.equal(redis.mutations.length, 0);
  const confirmed = await route.POST(formRequest(`${BASE}/api/influencer/unsubscribe`, { token, confirm: '1' }, { Origin: BASE }));
  assert.equal(confirmed.status, 200);
  assert.ok(redis.sets.get('inf:unsubscribed').has(EMAIL));
});

test('legacy confirmation is signed, expires, and does not enroll unknown addresses in suppression', async () => {
  const { redis, helper, route } = await registeredFixture();
  const token = await helper.createLegacyConfirmationToken(EMAIL, Date.now() - 60 * 60 * 1000);
  assert.equal(await helper.resolveLegacyConfirmationToken(token), null);
  const response = await route.POST(formRequest(`${BASE}/api/influencer/unsubscribe`, { token, confirm: '1' }));
  assert.equal(response.status, 400);
  const active = await helper.createLegacyConfirmationToken(EMAIL);
  assert.equal(await helper.resolveLegacyConfirmationToken(active.replace(/.$/, active.endsWith('A') ? 'B' : 'A')), null);
  const unknown = await helper.createLegacyConfirmationToken('unknown@example.test');
  assert.equal((await route.POST(formRequest(`${BASE}/api/influencer/unsubscribe`, { token: unknown, confirm: '1' }))).status, 200);
  assert.ok(!redis.sets.get('inf:unsubscribed')?.has('unknown@example.test'));
});

test('unsubscribe fails with generic 503 on missing signer or database failure', async () => {
  const redis = new FakeRedis();
  const missing = await harness({ redis }).load('src/app/api/influencer/unsubscribe/route.js');
  assert.equal((await missing.GET(new Request(`${BASE}/api/influencer/unsubscribe?email=${EMAIL}`))).status, 503);
  assert.equal(redis.calls.length, 0);
  const fixture = await registeredFixture();
  fixture.redis.failEval = 1;
  const failed = await fixture.route.POST(formRequest(fixture.url, { 'List-Unsubscribe': 'One-Click' }));
  assert.equal(failed.status, 503);
  assert.ok(!(await failed.text()).includes('Redis'));
  assert.ok(!fixture.redis.sets.get('inf:unsubscribed')?.has(EMAIL));
  assert.equal((await fixture.route.POST(formRequest(fixture.url, { 'List-Unsubscribe': 'One-Click' }))).status, 200);
});

test('unsubscribe rejects oversized request bodies before any database action', async () => {
  const { redis, route, url } = await registeredFixture();
  const response = await route.POST(formRequest(url, { payload: 'x'.repeat(9000) }));
  assert.equal(response.status, 413);
  assert.equal(redis.calls.length, 0);
});

test('Svix verification agrees with the official published independent test vector', async () => {
  const helper = await harness().load('src/lib/influencer-webhook.js');
  const key = await helper.importResendWebhookKey('whsec_plJ3nmyCDGBKInavdOK15jsl');
  const body = '{"event_type":"ping","data":{"success":true}}';
  const headers = new Headers({ 'svix-id': 'msg_loFOjxBNrRLzqYUf', 'svix-timestamp': '1731705121', 'svix-signature': 'v1,rAvfW3dJ/X/qxhsaXPOyyCGmRKsaKWcsNccKXlIktD0=' });
  assert.equal(await helper.verifyResendWebhook({ key, headers, body, now: 1731705121000 }), 'msg_loFOjxBNrRLzqYUf');
  await assert.rejects(helper.verifyResendWebhook({ key, headers, body: body + ' ', now: 1731705121000 }));
});

test('webhook requires provider secret and never accepts a shared query token', async () => {
  const redis = new FakeRedis();
  const route = await harness({ redis, env: { WEBHOOK_TOKEN: 'legacy' } }).load('src/app/api/influencer/webhook/route.js');
  const result = await route.POST(new Request(`${BASE}/api/influencer/webhook?token=legacy`, { method: 'POST', body: '{}' }));
  assert.equal(result.status, 503);
  assert.equal(await result.text(), 'Service temporarily unavailable');
  assert.equal(redis.calls.length, 0);
});

test('missing, invalid, stale and future signatures cannot trigger Redis', async () => {
  const redis = new FakeRedis();
  const route = await harness({ redis, env: { RESEND_WEBHOOK_SECRET: RESEND_KEY, WEBHOOK_TOKEN: 'legacy' } }).load('src/app/api/influencer/webhook/route.js');
  const body = JSON.stringify({ type: 'email.bounced', data: { to: [EMAIL] } });
  const now = Math.floor(Date.now() / 1000);
  const requests = [
    new Request(`${BASE}/api/influencer/webhook?token=legacy`, { method: 'POST', body }),
    webhookRequest(body, { signature: 'v1,AAAA' }),
    webhookRequest(body, { timestamp: now - 601 }),
    webhookRequest(body, { timestamp: now + 601 }),
  ];
  for (const request of requests) assert.equal((await route.POST(request)).status, 401);
  assert.equal(redis.calls.length, 0);
});

test('raw-body changes and malformed JSON cannot reach webhook business operations', async () => {
  const redis = new FakeRedis();
  const route = await harness({ redis, env: { RESEND_WEBHOOK_SECRET: RESEND_KEY } }).load('src/app/api/influencer/webhook/route.js');
  const body = '{"type":"email.opened","data":{"to":["recipient@example.test"]}}';
  const signed = webhookRequest(body);
  const changed = new Request(signed.url, { method: 'POST', headers: signed.headers, body: body + '\n' });
  assert.equal((await route.POST(changed)).status, 401);
  assert.equal((await route.POST(webhookRequest('{'))).status, 400);
  assert.equal((await route.POST(webhookRequest('x'.repeat(128 * 1024 + 1)))).status, 413);
  assert.equal(redis.calls.length, 0);
});

test('verified webhook retries failed work and completed duplicate cannot increment twice', async () => {
  const redis = new FakeRedis();
  redis.hashes.set(`inf:${EMAIL}`, { email: EMAIL, status: 'sent', opens: 0 });
  redis.failEval = 1;
  const route = await harness({ redis, env: { RESEND_WEBHOOK_SECRET: RESEND_KEY } }).load('src/app/api/influencer/webhook/route.js');
  const body = JSON.stringify({ type: 'email.opened', data: { to: [EMAIL, EMAIL] } });
  assert.equal((await route.POST(webhookRequest(body))).status, 503);
  assert.equal(redis.hashes.get(`inf:${EMAIL}`).opens, 0);
  assert.equal((await route.POST(webhookRequest(body))).status, 200);
  assert.equal((await route.POST(webhookRequest(body))).status, 200);
  assert.equal(redis.hashes.get(`inf:${EMAIL}`).opens, 1);
  assert.deepEqual(redis.calls.map(({ command }) => command), ['eval', 'eval', 'eval']);
});

test('signed complaints preserve suppression and unknown open events do not create contacts', async () => {
  const redis = new FakeRedis();
  redis.hashes.set(`inf:${EMAIL}`, { email: EMAIL, status: 'sent' });
  const route = await harness({ redis, env: { RESEND_WEBHOOK_SECRET: RESEND_KEY } }).load('src/app/api/influencer/webhook/route.js');
  const complaint = JSON.stringify({ type: 'email.complained', data: { to: [EMAIL] } });
  assert.equal((await route.POST(webhookRequest(complaint, { id: 'msg_complaint' }))).status, 200);
  assert.ok(redis.sets.get('inf:unsubscribed').has(EMAIL));
  assert.equal(redis.hashes.get(`inf:${EMAIL}`).status, 'unsubscribed');
  const opened = JSON.stringify({ type: 'email.opened', data: { to: ['unknown@example.test'] } });
  assert.equal((await route.POST(webhookRequest(opened, { id: 'msg_unknown' }))).status, 200);
  assert.equal(redis.hashes.size, 1);
});

test('health requires authorization and returns unhealthy when Redis is absent or fails', async () => {
  const env = { CRON_SECRET: CRON_KEY };
  const missing = await harness({ env }).load('src/app/api/health/route.js');
  assert.equal((await missing.GET(new Request(`${BASE}/api/health`))).status, 403);
  assert.equal((await missing.GET(new Request(`${BASE}/api/health`, { headers: { Authorization: `Bearer ${CRON_KEY}` } }))).status, 503);
  const redis = new FakeRedis();
  redis.llen = async () => { throw new Error('Unavailable'); };
  const broken = await harness({ env, redis }).load('src/app/api/health/route.js');
  const result = await broken.GET(new Request(`${BASE}/api/health`, { headers: { Authorization: `Bearer ${CRON_KEY}` } }));
  assert.equal(result.status, 503);
  assert.deepEqual(await result.json(), { ok: false, error: 'outreach_unavailable' });
});

test('worker fails closed before I/O without auth or unsubscribe signing capability', async () => {
  const redis = new FakeRedis();
  const env = mailEnv({ CRON_SECRET: 'short-test-secret', RESEND_API_KEY: 'short-test-key' });
  const route = await harness({ redis, env }).load('src/app/api/influencer/worker/route.js');
  assert.equal((await route.GET(new Request(`${BASE}/api/influencer/worker`))).status, 403);
  const result = await route.GET(new Request(`${BASE}/api/influencer/worker`, { headers: { Authorization: `Bearer ${env.CRON_SECRET}` } }));
  assert.equal(result.status, 503);
  assert.equal(redis.calls.length, 0);
});

test('worker renders signed one-click headers and respects existing suppression', async () => {
  const redis = new FakeRedis();
  const suppressed = 'suppressed@example.test';
  redis.queue = [EMAIL, suppressed];
  redis.hashes.set(`inf:${EMAIL}`, { email: EMAIL, status: 'queued' });
  redis.sets.set('inf:unsubscribed', new Set([suppressed]));
  const sent = [];
  const h = harness({ redis, env: mailEnv(), fetch: async (_url, init) => { sent.push(JSON.parse(init.body)); return Response.json({ id: 'fake-email-id' }); } });
  const route = await h.load('src/app/api/influencer/worker/route.js');
  const response = await route.GET(new Request(`${BASE}/api/influencer/worker?max=2&minDelayMs=0`, { headers: { Authorization: `Bearer ${CRON_KEY}` } }));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, EMAIL);
  assert.equal(sent[0].headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  const link = sent[0].headers['List-Unsubscribe'].slice(1, -1);
  assert.match(link, /\/api\/influencer\/unsubscribe\?token=v1\./);
  assert.ok(!link.includes(EMAIL));
  assert.ok(sent[0].html.includes(link));
  const unsubscribe = await h.load('src/app/api/influencer/unsubscribe/route.js');
  assert.equal((await unsubscribe.POST(formRequest(link, { 'List-Unsubscribe': 'One-Click' }))).status, 200);
  assert.ok(redis.sets.get('inf:unsubscribed').has(EMAIL));
});

test('failed follow-ups are bounded per run and permanent failure stops later sends', async () => {
  const redis = new FakeRedis();
  for (let i = 0; i < 5; i++) {
    const email = `followup${i}@example.test`;
    redis.hashes.set(`inf:${email}`, { email, status: 'sent', followupsSent: 0, lastSent: '2020-01-01T00:00:00Z' });
  }
  let sends = 0;
  const route = await harness({ redis, env: mailEnv(), fetch: async () => { sends++; return new Response('Permanent fake error', { status: 422 }); } }).load('src/app/api/influencer/worker/route.js');
  const request = () => new Request(`${BASE}/api/influencer/worker?followups=1&max=2&minDelayMs=0`, { headers: { Authorization: `Bearer ${CRON_KEY}` } });
  const first = await route.GET(request());
  assert.equal(first.status, 200);
  assert.equal(sends, 2);
  assert.equal((await first.json()).failed, 2);
  assert.equal(redis.hashes.get('inf:followup0@example.test').followupStatus, 'failed');
  assert.equal(redis.hashes.get('inf:followup1@example.test').followupStatus, 'failed');
  await route.GET(request());
  assert.equal(sends, 4);
  assert.equal(redis.hashes.get('inf:followup0@example.test').followupAttempts, 1);
  assert.equal(redis.hashes.get('inf:followup1@example.test').followupAttempts, 1);
});

test('version checks Apple app identity and keeps trusted fallbacks/links', async () => {
  const wrong = await harness({ fetch: async () => Response.json({ results: [{ trackId: 1, version: '99.0.0', trackViewUrl: 'https://elsewhere.example.test' }] }) }).load('src/app/api/version/route.js');
  const fallback = await (await wrong.GET()).json();
  assert.equal(fallback.ios.latestVersion, '5.0.10');
  assert.equal(fallback.android.latestVersion, '5.0.8');
  assert.equal(fallback.ios.webUrl, 'https://apps.apple.com/app/id6746102626');
  const valid = await harness({ fetch: async () => Response.json({ results: [{ trackId: 6746102626, version: '5.0.11', trackViewUrl: 'javascript:ignored' }] }) }).load('src/app/api/version/route.js');
  const payload = await (await valid.GET()).json();
  assert.equal(payload.ios.latestVersion, '5.0.11');
  assert.equal(payload.ios.webUrl, 'https://apps.apple.com/app/id6746102626');
});

test('version rejects invalid configured versions and clamps external fetch timeout', async () => {
  const delays = [];
  const route = await harness({
    env: { MOODMAP_IOS_LATEST_VERSION: '<invalid>', MOODMAP_ANDROID_LATEST_VERSION: 'NaN', MOODMAP_VERSION_FETCH_TIMEOUT_MS: '999999999' },
    setTimeout: (callback, delay) => { delays.push(delay); return setTimeout(callback, 0); },
    fetch: async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Fake abort')), { once: true })),
  }).load('src/app/api/version/route.js');
  const payload = await (await route.GET()).json();
  assert.deepEqual(delays, [5000]);
  assert.equal(payload.ios.latestVersion, '5.0.10');
  assert.equal(payload.android.latestVersion, '5.0.8');
});
