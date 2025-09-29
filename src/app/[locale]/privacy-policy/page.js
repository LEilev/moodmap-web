// src/app/[locale]/privacy-policy/page.js
import {getTranslations, setRequestLocale} from 'next-intl/server';

export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});
  return {title: t('metaTitle'), description: t('metaDescription')};
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

export default async function PrivacyPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'privacy'});

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-1">
        <div className="text-xs uppercase opacity-70">{t('hero.badge')}</div>
        <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
      </header>

      <nav className="rounded-md border p-4">
        <div className="font-semibold mb-2">{t('toc.title')}</div>
        <ol className="list-decimal pl-6 space-y-1">
          {['section1','section2','section3','section4','section5','section6','section7','section8','section9','section10'].map((secKey) => (
            <li key={secKey}><a href={`#${secKey}`}>{t(`toc.sections.${secKey}`)}</a></li>
          ))}
        </ol>
      </nav>

      {['section1','section2','section3','section4','section5','section6','section7','section8','section9','section10'].map((secKey) => (
        <section id={secKey} key={secKey}>
          <h2 className="text-xl font-semibold">{t(`${secKey}.title`)}</h2>
          <p className="opacity-90">{t(`${secKey}.desc`)}</p>
          {Array.isArray(t.raw(`${secKey}.items`)) && <HtmlList items={t.raw(`${secKey}.items`)} />}
          {t(`${secKey}.note`) && <p className="opacity-80" dangerouslySetInnerHTML={{__html: t.raw(`${secKey}.note`)}} />}
        </section>
      ))}

      <footer className="pt-4 text-sm opacity-80">
        {t('closing')}
      </footer>
    </main>
  );
}
