const retiredKey = (key) => key === "mm_referral_slug_v1" || /^_?promotekit(?:[_:-]|$)/i.test(key);

/** Local cleanup only. Never reads a URL, sends a request, or changes an Analytics cookie. */
export function clearReferral(win) {
  for (const name of ["localStorage", "sessionStorage"]) {
    try {
      const storage = win[name];
      const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
      keys.filter((key) => key && retiredKey(key)).forEach((key) => storage.removeItem(key));
    } catch { /* Storage may be blocked. */ }
  }
  try { delete win.promotekit_referral; } catch { /* An old vendor global may be non-configurable. */ }

  const hostname = win.location.hostname;
  const domains = new Set(["", hostname, `.${hostname}`]);
  if (hostname === "moodmap-app.com" || hostname.endsWith(".moodmap-app.com")) {
    domains.add("moodmap-app.com");
    domains.add(".moodmap-app.com");
  }
  const paths = new Set(["/"]);
  const segments = win.location.pathname.split("/").filter(Boolean);
  segments.forEach((_, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    paths.add(path);
    paths.add(`${path}/`);
  });
  try {
    win.document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      if (!retiredKey(name)) return;
      domains.forEach((domain) => paths.forEach((path) => {
        win.document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
      }));
    });
  } catch { /* Cookie access may be blocked; tracking remains retired regardless. */ }
}
