// pages/account.js
import Head from "next/head";

export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return { props: {} };
}

export default function AccountConfirmation() {
  return (
    <>
      <Head>
        <title>Account updated · MoodMap</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-primary-blue text-white font-geist-sans px-6">
      <div className="w-full max-w-lg bg-white/10 rounded-2xl shadow-xl py-16 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          ✅ Subscription updated!
        </h1>
        <p className="text-lg mb-8">
          Your billing details have been saved. Changes may take a few minutes
          to appear inside the app.
        </p>

        <a
          href="/"
          className="inline-block bg-white/90 hover:bg-white text-primary-blue font-semibold text-lg rounded-xl px-8 py-4 transition-colors"
        >
          ← Back to MoodMap
        </a>

        <p className="text-sm opacity-80 mt-10">
          Need help? E‑mail 
          <a
            href="mailto:support@moodmap-app.com"
            className="underline hover:text-white"
          >
            support@moodmap-app.com
          </a>
          .
        </p>
      </div>
      </main>
    </>
  );
}
