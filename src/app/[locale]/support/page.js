// src/app/[locale]/support/page.js
import { useTranslations } from 'next-intl';
import Link from '@/components/LocaleLink';
import { Mail, Phone, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const supportMessages = (await import(`../../../../locales/${locale}/support.json`)).default;
  return {
    title: supportMessages.metaTitle,
    description: supportMessages.metaDescription
  };
}

export default function SupportPage() {
  const t = useTranslations('support');

  return (
    <main className="relative isolate min-h-screen flex flex-col items-center bg-primary-blue text-white px-6 py-16">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] 
        rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-48 h-[36rem] w-[36rem] 
        rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10" />

      <div className="max-w-xl w-full space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-lg text-blue-100">{t('subtitle')}</p>
          <p className="mt-2 text-sm text-blue-100/90">{t('dm')}</p>
        </header>

        {/* Contact cards */}
        <section className="grid gap-6">
          {/* Email Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl 
              bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <Mail className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.email')}</h2>
            <p className="mt-1">
              <a href={`mailto:${t('values.email')}`} className="underline decoration-white/40 hover:decoration-white/70">
                {t('values.email')}
              </a>
            </p>
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full 
              bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
          </article>

          {/* Phone Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl 
              bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <Phone className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.phone')}</h2>
            <p className="mt-1">
              <a href={`tel:${t('values.phone')}`} className="underline decoration-white/40 hover:decoration-white/70">
                {t('values.phone')}
              </a>
            </p>
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full 
              bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
          </article>

          {/* Address Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl 
              bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <MapPin className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">{t('labels.address')}</h2>
            <address className="not-italic leading-relaxed mt-1 text-blue-100">
              {t('values.addressLine1')}<br />
              {t('values.addressLine2')}<br />
              {t('values.addressLine3')}<br />
              {t('values.addressLine4')}
            </address>
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full 
              bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
          </article>
        </section>

        {/* Back CTA */}
        <footer className="text-center pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white 
              bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(59,130,246,0.35)] 
              hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)] focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            ← Back to the app
          </Link>
        </footer>
      </div>
    </main>
  );
}
