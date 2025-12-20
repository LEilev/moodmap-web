import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Support – MoodMap",
  description: "How to reach the MoodMap team.",
};

export default function SupportPage() {
  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white px-6 py-14 sm:py-16">
      {/* Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-48 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-400/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />

      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            We’re here to help.
          </h1>

          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            We read every message and respond personally. Email is the fastest — Discord works too.
          </p>

          <p className="mt-2 text-sm text-white/60">
            You’ll get a human reply — no ticket ping‑pong.
          </p>
        </header>

        {/* Cards */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Email */}
          <article className="glass-card glass-card-hover p-6 group">
            <span className="glass-icon">
              <Mail className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="mt-1">
              <a className="mm-link" href="mailto:support@moodmap-app.com">
                support@moodmap-app.com
              </a>
            </p>
            <div aria-hidden="true" className="glass-gloss" />
          </article>

          {/* Phone */}
          <article className="glass-card glass-card-hover p-6 group">
            <span className="glass-icon">
              <Phone className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Phone</h2>
            <p className="mt-1">
              <a className="mm-link" href="tel:+4792997273">
                +47 929 97 273
              </a>
            </p>
            <div aria-hidden="true" className="glass-gloss" />
          </article>

          {/* Discord */}
          <article className="glass-card glass-card-hover p-6 group md:col-span-1">
            <span className="glass-icon" aria-hidden>
              {/* Discord logo (inline svg) */}
              <svg
                className="h-6 w-6 text-white drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.369A19.791 19.791 0 0016.557 3.5c-.18.333-.37.77-.507 1.12a18.128 18.128 0 00-5.09 0 13.078 13.078 0 00-.517-1.12 19.736 19.736 0 00-3.76.869C3.866 7.363 3.3 10.262 3.5 13.106a19.9 19.9 0 005.965 3.022c.244-.333.465-.686.66-1.056-.363-.139-.716-.308-1.056-.509.089-.064.175-.13.257-.198a13.021 13.021 0 007.256 0c.083.068.169.134.257.198-.34.201-.693.37-1.056.509.195.37.416.723.66 1.056a19.9 19.9 0 005.964-3.022c.336-3.076-.573-5.94-2.296-8.737zM9.438 12.192c-.832 0-1.508-.781-1.508-1.742 0-.96.676-1.742 1.508-1.742.832 0 1.508.781 1.508 1.742 0 .96-.676 1.742-1.508 1.742zm5.125 0c-.832 0-1.508-.781-1.508-1.742 0-.96.676-1.742 1.508-1.742.832 0 1.508.781 1.508 1.742 0 .96-.676 1.742-1.508 1.742z" />
              </svg>
            </span>

            <h2 className="text-xl font-semibold">Discord</h2>
            <p className="mt-1">
              <a
                className="mm-link"
                href="https://discord.gg/eeP9vBK6Vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the MoodMap Lounge
              </a>
            </p>
            <p className="mt-1.5 text-sm text-white/70">
              Chat with us, share feedback, and get early access to updates.
            </p>
            <div aria-hidden="true" className="glass-gloss" />
          </article>

          {/* Address */}
          <article className="glass-card glass-card-hover p-6 group md:col-span-1">
            <span className="glass-icon">
              <MapPin className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Mailing address</h2>
            <address className="not-italic leading-relaxed mt-1 text-white/70">
              MoodMap<br />
              Fageråsveien&nbsp;4<br />
              1415&nbsp;Oppegård<br />
              Norway
            </address>
            <div aria-hidden="true" className="glass-gloss" />
          </article>
        </section>

        {/* Back button */}
        <div className="mt-12 text-center">
          <Link href="/" className="btn-primary">
            ← Back to the app
          </Link>
        </div>
      </div>
    </main>
  );
}
