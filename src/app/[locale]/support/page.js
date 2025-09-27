// src/app/[locale]/support/page.js
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { Mail, Phone, MapPin } from 'lucide-react';

// Dynamic metadata using translations
import { getTranslations } from 'next-intl/server';
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'support' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function SupportPage() {
  const t = useTranslations('support');  // Translator for 'support' namespace

  return (
    <main className="relative isolate min-h-screen flex flex-col items-center bg-primary-blue text-white px-6 py-16">
      {/* Subtle background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 ..."/>
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-48 ..."/>

      <div className="max-w-xl w-full space-y-10">
        {/* ───────────── Header ───────────── */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {t('title') /* e.g. "Need a hand?" */}
          </h1>
          <p className="text-lg text-blue-100">
            {t('subtitle') /* e.g. "MoodMap is indie-built (by me Eilev)..." */}
          </p>
          <p className="mt-2 text-sm text-blue-100/90">
            {t('dm') /* e.g. "Prefer DM? I’m also on Instagram, but email is fastest..." */}
          </p>
        </header>

        {/* ───────────── Contact Cards ───────────── */}
        <section className="grid gap-6">
          {/* Email Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 ...">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 ...">
              <Mail className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.email')}</h2>
            <p className="mt-1">
              <a className="underline decoration-white/40 hover:decoration-white/70" href={`mailto:${t('values.email')}`}>
                {t('values.email')}
              </a>
            </p>
            {/* gloss effect */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl ..."/>
          </article>

          {/* Phone Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 ...">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 ...">
              <Phone className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.phone')}</h2>
            <p className="mt-1">
              <a className="underline decoration-white/40 hover:decoration-white/70" href={`tel:${t('values.phone')}`}>
                {t('values.phone')}
              </a>
            </p>
            {/* gloss */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl ..."/>
          </article>

          {/* Address Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 ...">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 ...">
              <MapPin className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.address')}</h2>
            <address className="not-italic leading-relaxed mt-1 text-blue-100">
              {t('values.addressLine1')}<br/>
              {t('values.addressLine2')}<br/>
              {t('values.addressLine3')}<br/>
              {t('values.addressLine4')}
            </address>
            {/* gloss */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl ..."/>
          </article>
        </section>

        {/* ───────────── Footer: Back to the app button ───────────── */}
        <footer className="text-center pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            {t('backToApp') /* e.g. "← Back to the app" */}
          </Link>
        </footer>
      </div>
    </main>
  );
}
