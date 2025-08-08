// app/activate/page.js
// ----------------------------------------------------------
// UL først  +  3s utsatt fallback til butikk (iOS/Android).
// - Avbryt fallback på visibilitychange/pagehide (app åpnet).
// - Ingen auto-redirect til app; iOS/Android håndterer UL selv.
// - Manuell "Open in app" knapp peker til samme UL.
// ----------------------------------------------------------

export const runtime = 'edge';

export default function ActivatePage() {
  const IOS_STORE = 'https://apps.apple.com/us/app/moodmap-moodcoaster/id6746102626';
  const ANDROID_STORE = 'https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen'; // ← bytt hvis annerledes

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>MoodMap • Activate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var cancelled = false;

                function cancelFallback() { cancelled = true; }
                document.addEventListener('visibilitychange', function () {
                  if (document.hidden) cancelFallback();
                }, { once: true });

                window.addEventListener('pagehide', cancelFallback, { once: true });

                function goStore() {
                  if (cancelled) return;
                  var ua = navigator.userAgent || '';
                  var isAndroid = /Android/i.test(ua);
                  var url = isAndroid
                    ? '${ANDROID_STORE}'
                    : '${IOS_STORE}';
                  window.location.replace(url);
                }

                // Vent 3.0s før fallback – gir OS tid til å åpne appen
                setTimeout(goStore, 3000);

                // Sett manuell knapp-lenke = denne siden (samme UL)
                document.addEventListener('DOMContentLoaded', function () {
                  var a = document.getElementById('openBtn');
                  if (a) a.setAttribute('href', window.location.href);
                });
              })();
            `,
          }}
        />
        <style>{`
          body { background:#0A297A; color:#fff; margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
          .wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; }
          .card { background:rgba(255,255,255,.06); backdrop-filter: blur(8px); border-radius:20px; padding:24px; text-align:center; width:min(560px, 92vw); }
          a.btn { display:inline-block; background:#fff; color:#000; padding:12px 18px; border-radius:999px; font-weight:600; text-decoration:none; }
          p.mono { opacity:.7; font-size:12px; margin-top:12px; }
        `}</style>
      </head>
      <body>
        <main className="wrap">
          <div className="card">
            <h1>Open MoodMap</h1>
            <p>If the app doesn’t open automatically, tap the button below.</p>
            <p><a id="openBtn" className="btn" href="#">🚀 Open in app</a></p>
            <p className="mono">If you don’t have the app, you’ll be sent to the store in a few seconds.</p>
          </div>
        </main>
      </body>
    </html>
  );
}
