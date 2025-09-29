import {getTranslations} from 'next-intl/server';
import {unstable_setRequestLocale} from 'next-intl/server';

export async function generateMetadata({params: {locale}}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'home'});
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function HomePage({params: {locale}}) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'home'});

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
        <p className="text-lg opacity-90">{t('hero.description')}</p>
        <p className="text-sm opacity-70">{t('cta.subnote')}</p>
      </header>

      <section className="space-y-2 mb-12">
        <h2 className="text-2xl font-semibold">{t('about.heading')}</h2>
        <p className="opacity-90">{t('about.body')}</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.cycleOverview.title')}</h3>
          <p className="text-sm opacity-90">{t('features.cycleOverview.body')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.survivalAlerts.title')}</h3>
          <p className="text-sm opacity-90">{t('features.survivalAlerts.body')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.tipsIntimacy.title')}</h3>
          <p className="text-sm opacity-90">{t('features.tipsIntimacy.body')}</p>
        </article>
        <article className="rounded-xl border p-4">
          <h3 className="font-semibold">{t('features.selfcards.title')}</h3>
          <p className="text-sm opacity-90">{t('features.selfcards.body')}</p>
        </article>
      </section>

      <footer className="text-sm opacity-80">
        <span>{t('contact.label')}</span>{' '}
        <a className="underline" href="mailto:support@moodmap-app.com">
          {t('contact.email')}
        </a>
      </footer>
    </main>
  );
}
