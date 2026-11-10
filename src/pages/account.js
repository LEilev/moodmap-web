// pages/account.js
import Head from "next/head";
import Link from "next/link";

export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return { props: {} };
}

export default function AccountConfirmation() {
  return (
    <>
      <Head>
        <title>Back from billing · MoodMap</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mm-handoff-main">
      <div className="mm-handoff-card">
        <Link href="/" className="mm-handoff-brand">MoodMap</Link>
        <h1>Back from billing</h1>
        <p>
          Return to MoodMap to see your subscription. If you made changes in the
          billing portal, they may take a few minutes to appear in the app.
        </p>

        <Link
          href="/"
          className="mm-handoff-primary"
        >
          ← Back to MoodMap
        </Link>

        <p className="mm-handoff-help">
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
