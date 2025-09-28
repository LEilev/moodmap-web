import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { Crown, ShieldCheck, Sparkles, HeartHandshake, BellRing, LineChart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

/**
 * ⛔️ Do not change this logic – keep the payment flow intact.
 * Builds the `/buy` URL with plan type and forwards any via/ref/utm params.
 */
function buildPlanHref(planType, searchParams) {
  const qs = new URLSearchParams({ 
    type: planType === 'yearly' ? 'yearly' : 'monthly' 
  });
  const append = (key, value) => {
    if (value == null || value === '') return;
    if (key.toLowerCase() === 'type') return; // skip if key is 'type'
    qs.append(key, String(value));
  };
  if (searchParams) {
    if (typeof searchParams.forEach === 'function') {
      searchParams.forEach((v, k) => append(k, v));
    } else {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(vv => append(k, vv));
        else append(k, v);
      });
    }
  }
  return `/buy?${qs.toString()}`;
}

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'pro' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function ProPage({ searchParams }) {
  const t = useTranslations('pro');  // Translator for 'pro' namespace

  // Feature list content (translated titles & descriptions)
  const features = [
    { icon: HeartHandshake, title: t('features.dailyConnection.title'), desc: t('features.dailyConnection.desc') },
    { icon: BellRing,       title: t('features.smartTiming.title'),    desc: t('features.smartTiming.desc') },
    { icon: LineChart,      title: t('features.hormoneAware.title'),   desc: t('features.hormoneAware.desc') },
    { icon: ShieldCheck,    title: t('features.calmClarity.title'),    desc: t('features.calmClarity.desc') }
  ];

  return (
    <div className="relative isolate bg-primary-blue text-white">
      {/* Background glows (emerald→blue) */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] 
                   rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 
                   blur-[140px] sm:blur-[180px] md:opacity-30 -z-10" 
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] 
                   rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 
                   blur-[160px] sm:blur-[200px] md:opacity-30 -z-10" 
      />

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 
                          ring-1 ring-white/20 px-3 py-1 text-sm font-medium">
            <Crown className="h-4 w-4" aria-hidden="true" />
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 
                             bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          <p className="mt-5 text-pretty text-base sm:text-lg text-blue-100">
            {t('hero.subtitle')}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            {/* Yearly Plan Button */}
            <Link 
              href={buildPlanHref('yearly', searchParams)} 
              locale={false}
              prefetch={false} 
              aria-label={t('cta.yearly.aria')}
              className="group relative inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500
                         shadow-[0_10px_30px_rgba(16,185,129,0.35)] ring-1 ring-emerald-300/40
                         transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <span className="inline-flex items-center gap-2">
                <Crown className="h-5 w-5" aria-hidden="true" />
                {t('cta.yearly.label')}
              </span>
              <span className="ml-2 inline-flex items-center rounded-full border border-white/30 
                               bg-white/10 px-2 py-0.5 text-xs font-semibold">
                {t('cta.yearly.hint')}
              </span>
              {/* Gloss shine overlay */}
              <span 
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 
                           group-hover:opacity-100"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))' }} 
              />
            </Link>

            {/* Monthly Plan Button */}
            <Link 
              href={buildPlanHref('monthly', searchParams)} 
              locale={false}
              prefetch={false}
              aria-label={t('cta.monthly.aria')}
              className="group relative inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600
                         shadow-[0_10px_30px_rgba(59,130,246,0.35)] ring-1 ring-blue-300/45
                         transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
              {t('cta.monthly.label')}
              {/* Gloss shine overlay */}
              <span 
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 
                           group-hover:opacity-100"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))' }} 
              />
            </Link>
          </div>
          <p className="mt-3 text-xs text-blue-100">
            {t('cta.disclaimer')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div 
              key={title}
              className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 text-left 
                         ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 
                         hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
            >
              {/* Icon with gradient ring */}
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl 
                               bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 
                               shadow-inner shadow-emerald-500/10 transition-all duration-300 
                               group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
                <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
              </span>
              <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-blue-100">{desc}</p>
              {/* Subtle corner gloss */}
              <div 
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full 
                           bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 
                           group-hover:opacity-80" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Secondary CTA (bottom) */}
      <section className="px-6 pb-24 text-center">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/12 bg-white/10 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold">{t('ready.title')}</h2>
          <p className="mt-2 text-blue-100">{t('ready.subtitle')}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            <Link 
              href={buildPlanHref('yearly', searchParams)} 
              locale={false}
              prefetch={false}
              aria-label={t('cta.yearly.aria')}
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500 ring-1 ring-emerald-300/45
                         shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5 
                         hover:shadow-[0_12px_32px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <Crown className="mr-2 h-5 w-5" aria-hidden="true" />
              {t('ready.yearlyButton')}
              <span 
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 
                           group-hover:opacity-100" 
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))' }} 
              />
            </Link>
            <Link 
              href={buildPlanHref('monthly', searchParams)} 
              locale={false}
              prefetch={false}
              aria-label={t('cta.monthly.aria')}
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600 ring-1 ring-blue-300/45
                         shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 
                         hover:shadow-[0_12px_32px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              {t('ready.monthlyButton')}
              <span 
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 
                           group-hover:opacity-100" 
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))' }} 
              />
            </Link>
          </div>
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-blue-100">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>{t('ready.disclaimer')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
