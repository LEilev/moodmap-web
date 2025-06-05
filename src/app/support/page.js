// src/app/support/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Support – MoodMap',
  description: 'How to reach the MoodMap team when you need a hand (or a hug).',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-primary-blue text-white px-6 py-16">
      <div className="max-w-lg w-full space-y-10">
        {/* ───────────── Header ───────────── */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Need a hand?</h1>
          <p className="text-lg opacity-90">
            We’re a small indie crew, but we read every message. Reach us any way you like &rarr;
          </p>
        </header>

        {/* ───────────── Contact Cards ───────────── */}
        <section className="grid gap-6">
          {/* Email */}
          <article className="rounded-2xl bg-white/10 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold mb-2">Email</h2>
            <p>
              <a className="underline" href="mailto:moodmap.tech@gmail.com">
                moodmap.tech@gmail.com
              </a>
            </p>
          </article>

          {/* Phone */}
          <article className="rounded-2xl bg-white/10 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold mb-2">Phone</h2>
            <p>
              <a className="underline" href="tel:+47929972773">
                +47&nbsp;929&nbsp;97&nbsp;273
              </a>
            </p>
          </article>

          {/* Address */}
          <article className="rounded-2xl bg-white/10 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold mb-2">Mailing address</h2>
            <address className="not-italic leading-relaxed">
              MoodMap<br />
              Fageråsveien&nbsp;4<br />
              1415&nbsp;Oppegård<br />
              Norway
            </address>
          </article>
        </section>

        {/* ───────────── Footer link back to home ───────────── */}
        <footer className="text-center pt-8">
          <Link href="/" className="underline">
            ← Back to the app
          </Link>
        </footer>
      </div>
    </main>
  );
}
