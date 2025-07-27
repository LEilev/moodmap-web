// pages/tracking-test.js
import Head from 'next/head';

export default function TrackingTest() {
  return (
    <>
      <Head>
        {/* PromoteKit script – used to trigger UI unlock in dashboard */}
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="88e4dc38-2a9b-412b-905d-5b91bb454187"
        ></script>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-white text-black p-8">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">PromoteKit Tracking Test</h1>
          <p className="text-lg">
            This page is used to confirm the PromoteKit script is installed.
          </p>
          <p className="mt-2 text-sm opacity-70">
            After visiting this page, go back to PromoteKit and mark Step 4 as complete.
          </p>
        </div>
      </main>
    </>
  );
}
