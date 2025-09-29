// src/app/[locale]/pro/page.js
import {getTranslations, setRequestLocale} from 'next-intl/server';

export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pro'});
  return {title: t('metaTitle'), description: t('metaDescription')};
}

export default async function ProPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'pro'});

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="text-center space-y-3 mb-10">
        <div className="text-xs uppercase opacity-70">{t('hero.badge')}</div>
        <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
        <p className="opacity-90">{t('hero.subtitle')}</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.dailyConnection.title')}</h3>
          <p className="text-sm opacity-90">{t('features.dailyConnection.desc')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.smartTiming.title')}</h3>
          <p className="text-sm opacity-90">{t('features.smartTiming.desc')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.hormoneAware.title')}</h3>
          <p className="text-sm opacity-90">{t('features.hormoneAware.desc')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.calmClarity.title')}</h3>
          <p className="text-sm opacity-90">{t('features.calmClarity.desc')}</p>
        </article>
      </section>

      <section className="text-center space-y-3">
        <h2 className="text-2xl font-semibold">{t('ready.title')}</h2>
        <p className="opacity-90">{t('ready.subtitle')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button className="rounded-md border px-3 py-2">{t('cta.yearly.label')}</button>
          <button className="rounded-md border px-3 py-2">{t('cta.monthly.label')}</button>
        </div>
        <p className="text-xs opacity-70">{t('cta.disclaimer')}</p>
      </section>
    </main>
  );
}
