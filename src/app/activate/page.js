// app/activate/page.js
// ----------------------------------------------------------
// Åpnes av universal‑link   moodmap-app.com/activate?u=…
// ----------------------------------------------------------
//  • iOS/Android: appen håndterer lenken og Safari/Chrome
//    viser aldri denne HTML‑en
//  • Fallback: etter 3 s send brukeren til App Store
// ----------------------------------------------------------

export const runtime = 'edge'; // superrask 200‑respons

export default function ActivatePage() {
  const FALLBACK = 'https://apps.apple.com/us/app/moodmap-moodcoaster/id6746102626'; // ← din faktiske App Store‑lenke

  return (
    <html lang="en">
      <head>
        <title>MoodMap • Activate</title>

        {/* 1 – Meta‑refresh fallback */}
        <meta httpEquiv="refresh" content={`3;url=${FALLBACK}`} />

        {/* 2 – JS‑fallback for eldre nettlesere */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function () {
                window.location.href = '${FALLBACK}';
              }, 3000);
            `,
          }}
        />

        <style>{'body{background:#0A297A;margin:0}'}</style>
      </head>
      <body />
    </html>
  );
}
