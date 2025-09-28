// src/app/[locale]/privacy-policy/page.js
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import Link from '../../components/LocaleLink';
import Script from 'next/script';
import {
  Database, BarChart3, Share2, Shield, Trash2,
  HeartOff, Bell, CheckCircle2, RefreshCcw, Mail
} from 'lucide-react';

export async function generateMetadata({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'privacy'});
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

// Små UI-komponenter
function IconRing({children}) {
  return (
    <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
      {children}
    </span>
  );
}
function GlassCard({id, children}) {
  return (
    <article id={id} className="scroll-mt-24 rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
      {children}
    </article>
  );
}

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy');
  const tCommon = useTranslations('common');
  const sectionIds = ['section1','section2','section3','section4','section5','section6','section7','section8','section9','section10'];

  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white">
      {/* Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10" />

      {/* Hero */}
      <section className="px-6 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-xs font-semibold text-blue-100">
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">{t('hero.title')}</h1>
        </div>
      </section>

      {/* Innholdsfortegnelse */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-4xl">
          {/* Mobil */}
          <details className="sm:hidden rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl">
            <summary className="list-none cursor-pointer select-none px-4 py-3 font-semibold">
              <span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(59,130,246,0.35)]">
                {t('toc.mobile')}
              </span>
            </summary>
            <nav className="px-4 pb-3 pt-2" role="navigation" aria-label={t('toc.title')} data-pp-toc>
              <ul className="space-y-1.5">
                {sectionIds.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className="block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 transition-colors duration-200">
                      {t(`toc.sections.${id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          {/* Desktop */}
          <nav className="hidden sm:block rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-5" role="navigation" aria-label={t('toc.title')} data-pp-toc>
            <div className="mb-2 text-sm font-semibold text-white/90">{t('toc.title')}</div>
            <ul className="grid grid-cols-2 gap-y-1.5">
              {sectionIds.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="inline-block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 transition-colors duration-200">
                    {t(`toc.sections.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Innhold */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Intro */}
          <GlassCard id="intro">
            <p className="text-sm mb-4"><strong>{t('intro.lastUpdated')}:</strong> {t('intro.date')}</p>
            <p className="text-sm leading-relaxed">{t('intro.text')}</p>
          </GlassCard>

          {/* 1 */}
          <GlassCard id="section1">
            <IconRing><Database className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section1.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section1.desc')}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              {t('section1.items').map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: t('section1.note')}} />
          </GlassCard>

          {/* 2 */}
          <GlassCard id="section2">
            <IconRing><BarChart3 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section2.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section2.desc')}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              {t('section2.items').map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
              ))}
            </ul>
          </GlassCard>

          {/* 3 */}
          <GlassCard id="section3">
            <IconRing><Share2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section3.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section3.desc')}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              {t('section3.items').map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
              ))}
            </ul>
          </GlassCard>

          {/* 4 */}
          <GlassCard id="section4">
            <IconRing><Shield className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section4.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section4.body')}</p>
          </GlassCard>

          {/* 5 */}
          <GlassCard id="section5">
            <IconRing><Trash2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section5.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">
              {t('section5.body').split('support@moodmap-app.com')[0]}
              <a href="mailto:support@moodmap-app.com" className="underline decoration-white/40 hover:decoration-white/70">support@moodmap-app.com</a>
              {t('section5.body').split('support@moodmap-app.com')[1]}
            </p>
          </GlassCard>

          {/* 6 */}
          <GlassCard id="section6">
            <IconRing><HeartOff className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section6.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section6.body')}</p>
          </GlassCard>

          {/* 7 */}
          <GlassCard id="section7">
            <IconRing><Bell className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section7.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section7.body')}</p>
          </GlassCard>

          {/* 8 */}
          <GlassCard id="section8">
            <IconRing><CheckCircle2 className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section8.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section8.desc')}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              {t('section8.items').map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed">
              {t('section8.note').split('support@moodmap-app.com')[0]}
              <a href="mailto:support@moodmap-app.com" className="underline decoration-white/40 hover:decoration-white/70">support@moodmap-app.com</a>
              {t('section8.note').split('support@moodmap-app.com')[1]}
            </p>
          </GlassCard>

          {/* 9 */}
          <GlassCard id="section9">
            <IconRing><RefreshCcw className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section9.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t('section9.body')}</p>
          </GlassCard>

          {/* 10 */}
          <GlassCard id="section10">
            <IconRing><Mail className="h-6 w-6 text-white drop-shadow" aria-hidden="true" /></IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">{t('section10.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed">
              {t('section10.body').split('support@moodmap-app.com')[0]}
              <a href="mailto:support@moodmap-app.com" className="underline decoration-white/40 hover:decoration-white/70">support@moodmap-app.com</a>
              {t('section10.body').split('support@moodmap-app.com')[1]}
            </p>
          </GlassCard>

          {/* Avslutning */}
          <GlassCard id="closing">
            <p className="text-sm leading-relaxed">{t('closing')}</p>
          </GlassCard>

          {/* Kontakt & tilbake-lenke */}
          <div className="pt-2 text-center">
            <a
              href="mailto:support@moodmap-app.com?subject=Privacy%20question"
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              {t('cta.email')}
            </a>
            <div className="mt-4">
              <Link href="/" className="inline-block text-sm underline decoration-white/40 hover:decoration-white/70">
                {tCommon('footer.backToApp')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOC-aktiv seksjon-highlighting */}
      <Script id="pp-toc-active" strategy="afterInteractive">
        {`
(function () {
  try {
    var sectionIds = ${JSON.stringify(sectionIds)};
    var tocNavs = Array.from(document.querySelectorAll('[data-pp-toc]'));
    if (!tocNavs.length) return;
    var allLinks = [];
    tocNavs.forEach(function(nav){ allLinks = allLinks.concat(Array.from(nav.querySelectorAll('a[href^="#"]'))); });
    var idToLinks = new Map();
    sectionIds.forEach(function (id) {
      var matches = allLinks.filter(function (a) {
        var href = a.getAttribute('href') || '';
        var hash = href.startsWith('#') ? href.slice(1) : (href.split('#')[1] || '');
        return hash === id;
      });
      idToLinks.set(id, matches);
    });
    function clearActive() {
      allLinks.forEach(function (a) {
        a.classList.remove('bg-white/10', 'text-white');
        a.classList.add('text-blue-100');
        a.setAttribute('aria-current', 'false');
      });
    }
    function setActive(id) {
      clearActive();
      var links = idToLinks.get(id) || [];
      links.forEach(function (a) {
        a.classList.add('bg-white/10', 'text-white');
        a.classList.remove('text-blue-100');
        a.setAttribute('aria-current', 'true');
      });
    }
    var initial = (location.hash || '').replace('#','');
    if (sectionIds.indexOf(initial) !== -1) setActive(initial);
    else setActive(sectionIds[0]);
    var visible = new Set();
    var currentId = initial || sectionIds[0];
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting) visible.add(id);
        else visible.delete(id);
      });
      for (var i = 0; i < sectionIds.length; i++) {
        var id2 = sectionIds[i];
        if (visible.has(id2)) {
          if (id2 !== currentId) {
            currentId = id2;
            setActive(currentId);
          }
          break;
        }
      }
    }, { root: null, rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    allLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        var href = a.getAttribute('href') || '';
        var id = href.startsWith('#') ? href.slice(1) : (href.split('#')[1] || '');
        if (id) setActive(id);
      });
    });
    window.addEventListener('pagehide', function(){ observer.disconnect(); });
  } catch (_) {}
})();
        `}
      </Script>
    </main>
  );
}
