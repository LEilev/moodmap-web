// src/app/[locale]/privacy-policy/page.js
import {getTranslations} from 'next-intl/server';
import Link from '@/components/LocaleLink';
import Script from 'next/script';
import {
  Database, BarChart3, Share2, Shield, Trash2,
  HeartOff, Bell, CheckCircle2, RefreshCcw, Mail
} from 'lucide-react';

export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function IconRing({children}) {
  return (
    <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl 
      bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
      {children}
    </span>
  );
}
function GlassCard({id, children}) {
  return <article id={id} className="scroll-mt-24 rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">{children}</article>;
}
const asArray = (v) => (Array.isArray(v) ? v : []);

export default async function PrivacyPolicyPage({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});
  const tCommon = await getTranslations({locale, namespace: 'common'});

  const sectionIds = ['section1','section2','section3','section4','section5','section6','section7','section8','section9','section10'];

  const items1  = asArray(t.raw('section1.items'));
  const items2  = asArray(t.raw('section2.items'));
  const items3  = asArray(t.raw('section3.items'));
  const items4  = asArray(t.raw('section4.items'));
  const items5  = asArray(t.raw('section5.items'));
  const items6  = asArray(t.raw('section6.items'));
  const items7  = asArray(t.raw('section7.items'));
  const items8  = asArray(t.raw('section8.items'));
  const items9  = asArray(t.raw('section9.items'));
  const items10 = asArray(t.raw('section10.items'));

  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] 
        rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] 
        rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10" />

      {/* Hero */}
      <section className="px-6 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-xs font-semibold text-blue-100">
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t('hero.title')}
          </h1>
        </div>
      </section>

      {/* TOC */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-4xl">
          <details className="sm:hidden rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl">
            <summary className="list-none cursor-pointer select-none px-4 py-3 font-semibold">
              <span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-white 
                bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(59,130,246,0.35)]"
              >
                {t('toc.mobile')}
              </span>
            </summary>
            <nav className="px-4 pb-3 pt-2" role="navigation" aria-label={t('toc.title')} data-pp-toc>
              <ul className="space-y-1.5">
                {sectionIds.map((id) => (
                  <li key={id}>
                    <a 
                      href={`#${id}`} 
                      className="block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 
                        transition-colors duration-200"
                    >
                      {t(`toc.sections.${id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <nav className="hidden sm:block rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-5" role="navigation" aria-label={t('toc.title')} data-pp-toc>
            <div className="mb-2 text-sm font-semibold text-white/90">{t('toc.title')}</div>
            <ul className="grid grid-cols-2 gap-y-1.5">
              {sectionIds.map((id) => (
                <li key={id}>
                  <a 
                    href={`#${id}`} 
                    className="inline-block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 
                      transition-colors duration-200"
                  >
                    {t(`toc.sections.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Intro */}
          <GlassCard id="intro">
            <p className="text-sm mb-4">
              <strong>{t('intro.lastUpdated')}:</strong> {t('intro.date')}
            </p>
            <p className="text-sm leading-relaxed">{t('intro.text')}</p>
          </GlassCard>

          {/* Section 1 */}
          <GlassCard id="section1">
            <IconRing><Database className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section1.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section1.desc')}</p>
            {items1.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items1.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section1.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section1.note') }} />
            )}
          </GlassCard>

          {/* Section 2 */}
          <GlassCard id="section2">
            <IconRing><BarChart3 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section2.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section2.desc')}</p>
            {items2.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items2.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section2.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section2.note') }} />
            )}
          </GlassCard>

          {/* Section 3 */}
          <GlassCard id="section3">
            <IconRing><Share2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section3.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section3.desc')}</p>
            {items3.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items3.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section3.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section3.note') }} />
            )}
          </GlassCard>

          {/* Section 4 */}
          <GlassCard id="section4">
            <IconRing><Shield className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section4.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section4.desc')}</p>
            {items4.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items4.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section4.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section4.note') }} />
            )}
          </GlassCard>

          {/* Section 5 */}
          <GlassCard id="section5">
            <IconRing><Trash2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section5.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section5.desc')}</p>
            {items5.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items5.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section5.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section5.note') }} />
            )}
          </GlassCard>

          {/* Section 6 */}
          <GlassCard id="section6">
            <IconRing><HeartOff className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section6.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section6.desc')}</p>
            {items6.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items6.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section6.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section6.note') }} />
            )}
          </GlassCard>

          {/* Section 7 */}
          <GlassCard id="section7">
            <IconRing><Bell className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section7.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section7.desc')}</p>
            {items7.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items7.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section7.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section7.note') }} />
            )}
          </GlassCard>

          {/* Section 8 */}
          <GlassCard id="section8">
            <IconRing><CheckCircle2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section8.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section8.desc')}</p>
            {items8.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items8.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section8.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section8.note') }} />
            )}
          </GlassCard>

          {/* Section 9 */}
          <GlassCard id="section9">
            <IconRing><RefreshCcw className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section9.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section9.desc')}</p>
            {items9.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items9.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section9.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section9.note') }} />
            )}
          </GlassCard>

          {/* Section 10 */}
          <GlassCard id="section10">
            <IconRing><Mail className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section10.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section10.desc')}</p>
            {items10.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
                {items10.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {t('section10.note') && (
              <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('section10.note') }} />
            )}
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
