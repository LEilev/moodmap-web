// src/app/[locale]/page.js
import {useTranslations} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';
import {Map, BellRing, Sparkles, Shield, Smartphone, RefreshCcw} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

// Locale-aware Link
const {Link} = createNavigation({
  locales: ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'],
  localePrefix: 'as-needed'
});

export async function generateMetadata({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'home'});
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  // Del tittel i to linjer ved første punktum
  const tagline = t('hero.title');
  let taglinePart1 = tagline;
  let taglinePart2 = '';
  const splitIndex = tagline.indexOf('. ');
  if (splitIndex !== -1) {
    taglinePart1 = tagline.slice(0, splitIndex + 1);
    taglinePart2 = tagline.slice(splitIndex + 2);
  }

  const features = [
    {Icon: Map,      title: t('features.cycleOverview.title'),  body: t('features.cycleOverview.body')},
    {Icon: BellRing, title: t('features.survivalAlerts.title'), body: t('features.survivalAlerts.body')},
    {Icon: Sparkles, title: t('features.tipsIntimacy.title'),   body: t('features.tipsIntimacy.body')},
    {Icon: Sparkles, title: t('features.selfcards.title'),      body: t('features.selfcards.body')}
  ];

  const trustSegments = t('cta.subnote').split('•').map((s) => s.trim());
  const trustIcons = [Shield, RefreshCcw, Smartphone];

  return (
    <main>
      {/* Hero */}
      <section id="hero" className="relative isolate bg-primary-blue text-center px-6 pt-20 pb-14 sm:pt-24 sm:pb-16">
        {/* Glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10" />

        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            {taglinePart1}
          </span>
          {taglinePart2 && (
            <>
              {' '}
              <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {taglinePart2}
              </span>
            </>
          )}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-blue-100">
          {t('hero.description')}
        </p>

        {/* Store-knapper */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4" id="download">
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {tCommon('cta.appStore')}
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_16px_36px_rgba(37,99,235,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            {tCommon('cta.playStore')}
          </a>
        </div>

        {/* Tillitsmerker */}
        <div className="mt-9 flex justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[13px] text-blue-100 ring-1 ring-white/10 backdrop-blur">
            {trustSegments.map((text, i) => {
              const IconTag = trustIcons[i];
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span className="opacity-30">•</span>}
                  <span className="inline-flex items-center gap-1.5">
                    {IconTag && <IconTag className="h-4 w-4 opacity-90" aria-hidden="true" />}
                    {text}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-3xl mx-auto text-center my-16 sm:my-20 px-6">
        <h2 className="text-2xl font-semibold mb-3">{t('about.heading')}</h2>
        <p className="text-blue-100">{t('about.body')}</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-primary-blue pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 text-left ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
                <feat.Icon className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-white">{feat.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-blue-100">{feat.body}</p>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-center text-white py-8 px-6">
        <p>
          {t('contact.label')}{' '}
          <a href={`mailto:${t('contact.email')}`} className="underline">
            {t('contact.email')}
          </a>
        </p>
        <p className="mt-1">
          <Link href="/privacy-policy" className="underline">
            {tCommon('footer.privacyPolicy')}
          </Link>
        </p>
        <p className="mt-2">
          {tCommon('footer.copyright')}
        </p>
      </footer>
    </main>
  );
}
