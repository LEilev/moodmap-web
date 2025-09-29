// src/app/[locale]/privacy/page.js
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'privacy'});
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

function HtmlList({items}) {
  if (!items || !items.length) return null;
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((html, i) => (
        <li key={i}><span dangerouslySetInnerHTML={{__html: html}} /></li>
      ))}
    </ul>
  );
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-1">
        <div className="text-xs uppercase opacity-70">{t('hero.badge')}</div>
        <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
      </header>

      {/* TOC */}
      <nav className="rounded-md border p-4">
        <div className="font-semibold mb-2">{t('toc.title')}</div>
        <ol className="list-decimal pl-6 space-y-1">
          {Object.values(['section1','section2','section3','section4','section5','section6','section7','section8','section9','section10']).map((secKey, idx) => (
            <li key={secKey}><a href={`#${secKey}`}>{t(`toc.sections.${secKey}`)}</a></li>
          ))}
        </ol>
      </nav>

      {/* Seksjoner (1–10) */}
      <section id="section1">
        <h2 className="text-xl font-semibold">{t('section1.title')}</h2>
        <p className="opacity-90">{t('section1.desc')}</p>
        <HtmlList items={t.raw('section1.items')} />
        {t('section1.note') && <p className="opacity-80" dangerouslySetInnerHTML={{__html: t.raw('section1.note')}} />}
      </section>

      <section id="section2">
        <h2 className="text-xl font-semibold">{t('section2.title')}</h2>
        <p className="opacity-90">{t('section2.desc')}</p>
        <HtmlList items={t.raw('section2.items')} />
        {t('section2.note') && <p className="opacity-80" dangerouslySetInnerHTML={{__html: t.raw('section2.note')}} />}
      </section>

      <section id="section3">
        <h2 className="text-xl font-semibold">{t('section3.title')}</h2>
        <p className="opacity-90">{t('section3.desc')}</p>
        <HtmlList items={t.raw('section3.items')} />
        {t('section3.note') && <p className="opacity-80" dangerouslySetInnerHTML={{__html: t.raw('section3.note')}} />}
      </section>

      <section id="section4">
        <h2 className="text-xl font-semibold">{t('section4.title')}</h2>
        <p className="opacity-90">{t('section4.desc')}</p>
      </section>

      <section id="section5">
        <h2 className="text-xl font-semibold">{t('section5.title')}</h2>
        <p className="opacity-90">{t('section5.desc')}</p>
      </section>

      <section id="section6">
        <h2 className="text-xl font-semibold">{t('section6.title')}</h2>
        <p className="opacity-90">{t('section6.desc')}</p>
      </section>

      <section id="section7">
        <h2 className="text-xl font-semibold">{t('section7.title')}</h2>
        <p className="opacity-90">{t('section7.desc')}</p>
      </section>

      <section id="section8">
        <h2 className="text-xl font-semibold">{t('section8.title')}</h2>
        <p className="opacity-90">{t('section8.desc')}</p>
        <HtmlList items={t.raw('section8.items')} />
        {t('section8.note') && <p className="opacity-80">{t('section8.note')}</p>}
      </section>

      <section id="section9">
        <h2 className="text-xl font-semibold">{t('section9.title')}</h2>
        <p className="opacity-90">{t('section9.desc')}</p>
      </section>

      <section id="section10">
        <h2 className="text-xl font-semibold">{t('section10.title')}</h2>
        <p className="opacity-90">{t('section10.desc')}</p>
      </section>

      <footer className="pt-4 text-sm opacity-80">
        {t('closing')}
      </footer>
    </main>
  );
}
