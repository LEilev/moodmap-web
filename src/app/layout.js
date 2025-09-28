// src/app/layout.js
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'MoodMap',
  description:
    'Understand the cycle. Survive the chaos. MoodMap helps you navigate the hormonal cycle with clarity.'
};

export default function RootLayout({ children }) {
  const PK_SITE_ID = '88e4dc38-2a9b-412b-905d-5b91bb454187'; // PromoteKit (LIVE)

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <Script
          id="promotekit-loader"
          src="https://cdn.promotekit.com/promotekit.js"
          strategy="afterInteractive"
          data-promotekit={PK_SITE_ID}
        />
        <Script id="promotekit-helper" strategy="afterInteractive">
          {`
          (function () {
            if (window.__promotekitHelperInstalled) return;
            window.__promotekitHelperInstalled = true;
            function safeSearchParams(){try{return new URL(window.location.href).searchParams}catch(_){return null}}
            function hrefParam(n){try{var m=window.location.href.match(new RegExp('[?&]'+n+'=([^&#]+)','i'));return m?decodeURIComponent(m[1]):''}catch(_){return ''}}
            function isValidSlug(s){return /^[A-Za-z0-9_-]{1,32}$/.test(s||'')}
            function pickReferral(){
              try{
                if(window.promotekit_referral) return String(window.promotekit_referral);
                var via=''; var sp=safeSearchParams(); if(sp) via=sp.get('via')||sp.get('ref')||'';
                if(!via) via=hrefParam('via')||hrefParam('ref');
                if(!via||via==='default'||!isValidSlug(via)) return '';
                return via;
              }catch(_){return ''}
            }
            function addClientRefToBuyLinks(ref){
              if(!ref) return;
              document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(link=>{
                try{const href=link.getAttribute('href'); if(!href) return; const url=new URL(href);
                  if(!url.searchParams.has('client_reference_id')){url.searchParams.set('client_reference_id', ref); link.setAttribute('href', url.toString());}
                }catch(_){}
              })
            }
            function setClientRefOnEmbeds(ref){
              if(!ref) return;
              document.querySelectorAll('[pricing-table-id]').forEach(el=>{if(!el.getAttribute('client-reference-id')) el.setAttribute('client-reference-id', ref);});
              document.querySelectorAll('[buy-button-id]').forEach(el=>{if(!el.getAttribute('client-reference-id')) el.setAttribute('client-reference-id', ref);});
            }
            function applyRef(){const ref=pickReferral(); if(!ref) return; addClientRefToBuyLinks(ref); setClientRefOnEmbeds(ref);}
            document.addEventListener('DOMContentLoaded', function(){ setTimeout(applyRef, 1500); });
            let retries=0; const t=setInterval(function(){retries++; applyRef(); if(retries>=3) clearInterval(t);}, 1200);
          })();
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
