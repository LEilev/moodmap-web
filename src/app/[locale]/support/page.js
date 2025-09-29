import {getTranslations} from 'next-intl/server';
import {unstable_setRequestLocale} from 'next-intl/server';

export async function generateMetadata({params: {locale}}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'support'});
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function SupportPage({params: {locale}}) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'support'});

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="opacity-90 mb-6">{t('subtitle')}</p>
      <p className="opacity-80 mb-6">{t('dm')}</p>

      <div className="space-y-3">
        <div>
          <div className="text-sm font-semibold">{t('labels.email')}</div>
          <a className="underline" href="mailto:support@moodmap-app.com">
            {t('values.email')}
          </a>
        </div>
        <div>
          <div className="text-sm font-semibold">{t('labels.phone')}</div>
          <div>{t('values.phone')}</div>
        </div>
        <div>
          <div className="text-sm font-semibold">{t('labels.address')}</div>
          <address className="not-italic">
            <div>{t('values.addressLine1')}</div>
            <div>{t('values.addressLine2')}</div>
            <div>{t('values.addressLine3')}</div>
            <div>{t('values.addressLine4')}</div>
          </address>
        </div>
      </div>
    </main>
  );
}
