# MoodMap web

Oppdatert 10. november 2026. Next.js-nettstedet for **MoodMap: Relationship Timing**.

## Ta i bruk oppdateringspakken

Pakken inneholder bare endrede og nye prosjektfiler. Pakk innholdet ut i roten av
det eksisterende `moodmap-web`-prosjektet og erstatt de tilsvarende filene. Behold
de øvrige filene og bildene. Ingen filer må slettes manuelt. Private miljøfiler,
Git-historikk, `node_modules` og `.next` er ikke med i pakken.

Bruk Node **22.22.2 eller nyere 22.x**, eller **24.15 eller nyere 24.x**. Kjør:

```sh
npm ci
npm run check
```

`check` kjører lint, regresjonstester og produksjonsbygg. Det trengs ikke ekte
tjenestenøkler for disse kontrollene. Start lokal utvikling med `npm run dev`.

## Konfigurasjon før publisering

Behold de eksisterende miljøverdiene i driftsplattformen. `.env.example` viser
navn og formål, uten hemmeligheter. Ikke kopier tomme eksempelverdier over et
fungerende produksjonsoppsett.

### 1. Resend-webhook: én nødvendig driftsendring

Sett **`RESEND_WEBHOOK_SECRET`** til signeringshemmeligheten (`whsec_…`) for det
faktiske Resend-endepunktet `/api/influencer/webhook`. Den tidligere
`WEBHOOK_TOKEN`-parameteren gir ikke lenger tilgang. Uten gyldig signeringsnøkkel
svarer ruten `503`; dette er tilsiktet, slik at usignerte hendelser ikke endrer
kontakter og statistikk.

Kontroller ved en testlevering at Resend sender Svix-signaturene, og at de leverte
e-postene DKIM-signer `List-Unsubscribe` og `List-Unsubscribe-Post`.

Nye avmeldingslenker bruker ugjennomsiktige, registrerte tokens.
`INFLUENCER_UNSUBSCRIBE_SECRET` på minst 32 tegn anbefales. Eksisterende
`CRON_SECRET`, deretter `RESEND_API_KEY`, kan brukes som formålsseparert fallback
når verdien har minst 32 tegn. Behold Redis-nøklene under `inf-unsubscribe:*` ved
migrering og backup; de gjør at allerede sendte lenker overlever nøkkelrotasjon.

Gamle e-postlenker åpner en bekreftelsesside uten mutasjon ved GET. Et eksplisitt
POST-bekreftelsestrinn støtter eksisterende kontakter. Gamle usignerte one-click
POST-er avvises; nye e-poster støtter signert one-click-avmelding. Gamle lenker
kan ikke i ettertid bevise eierskap til en e-postadresse.

### 2. Stripe og RevenueCat

De eksisterende månedlige/årlige Payment Link-adressene er bevart. Behold
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RC_STRIPE_PUBLIC_API_KEY`,
Upstash-konfigurasjonen og den eksisterende `HMAC_SECRET` som hører til appen.

Webhook-koden støtter:

- `checkout.session.completed` og `checkout.session.async_payment_succeeded`.
- `invoice.created`, `invoice.finalized`, `invoice.paid` og `invoice.payment_succeeded`.
- `invoice.payment_action_required` og `invoice.payment_failed`.
- `customer.subscription.updated`, `customer.subscription.deleted` og `charge.refunded`.

Kontroller at relevante hendelser faktisk er valgt på Stripe-endepunktet. En
mislykket RevenueCat-synk gir nå feilstatus til Stripe og kan forsøkes igjen.
En kort behandlingslås og en fullført-markør er separate, atomiske Redis-operasjoner.
Gammel reservasjon av en hendelses-ID regnes ikke som bevis på fullført arbeid.

Test kjøp, forsinket betaling, fornyelse, parallell/gjentatt webhook, midlertidig
RevenueCat-feil, kansellering og refundering i et separat testmiljø. RevenueCats
Stripe-integrasjon må fortsatt håndtere korrekt tilgang og tilbakekalling; koden
eller en bestått mocktest bekrefter ikke leverandørens dashboard-oppsett.

`/api/stripe-catchup` krever nå `STRIPE_CATCHUP_TOKEN`, `CATCHUP_TOKEN` eller
`CRON_SECRET`. Bruk `Authorization: Bearer <secret>`. Den gamle query-varianten
støttes for eksisterende operatører, men nye kall bør bruke headeren. Feil forblir
retrybare. `force=1` er kun for eksplisitt operativ gjenbehandling.

Hvis Stripe-kontoen også selger andre produkter, sett `STRIPE_PREMIUM_PRICE_IDS`
til en kommaseparert liste over MoodMaps løpende pris-ID-er. Dette avgrenser
aktivering til de tilsiktede produktene.

### 3. Aktivering og kvittering

Appens eksisterende `u/s/exp/sig`-format og e-postbaserte identitetsfallback er
bevart. Nettsiden kontrollerer Checkout og et aktivt/trial-abonnement før den
signerer en lenke. Lagret abonnementsidentitet prioriteres foran en ny e-posthash.

E-postmottaker og lenke kommer fra Stripe på serveren. Det gamle åpne grensesnittet
med klientvalgt `{ email, link }` er fjernet. Den nye takkesiden sender bare
`sessionId` og et kortlevd, serverutstedt `receiptToken`; resending har begrensninger
og idempotens. Ingen automatisk e-post sendes bare fordi noen åpner siden.

`RECEIPT_TOKEN_SECRET` kan settes separat. Ellers brukes `STRIPE_SECRET_KEY` med
eget HMAC-formål, aldri den eldre delte native-hemmeligheten. QR-koden genereres
lokalt; ingen aktiveringslenke sendes til en ekstern QR-tjeneste. Nettlenken varer
i ti minutter, e-postlenken i 24 timer. En utløpt lenke kan kontrolleres på nytt
mot Checkout. RevenueCat er fortsatt autoriteten for tilgang i native-appen.

En eventuell senere overgang til serverinnløste engangskoder krever en koordinert
native-oppdatering. Denne webpakken endrer ikke native-appen eller dens protokoll.

### 4. Partner Mode

Alle 16 tidligere Partner/Kudos-API-ruter returnerer nå `410` og `no-store` uten
å kontakte Redis. Ingen miljøvariabel kan gjenåpne den gamle koden. Dette følger
den etablerte beslutningen om deaktivert Partner Mode. Eldre klienter som prøver
disse funksjonene vil få et tydelig deaktivert svar. Ingen eksisterende pardata
er slettet av denne pakken.

### 5. Måling og personvernvalg

`NEXT_PUBLIC_GA_MEASUREMENT_ID` må være riktig GA4-ID ved bygging. App Router og
Pages Router bruker samme opplegg for valg og hendelser. Valgene lagres i inntil
180 dager og kan endres fra **Privacy choices** i bunnfeltet.

- GA4 og PromoteKit lastes først etter separat, eksplisitt opt-in.
- GPC/DNT overstyrer samtykke og holder valgfri sporing av.
- Sidevisning sendes én gang per faktisk sideovergang; query/hash sendes ikke.
- Klikk til App Store, Google Play, Premium+ og checkout har avgrensede hendelser.
- E-post, `ref_code`, rå aktiveringslenker og kunde-/sesjons-ID-er sendes ikke i hendelsene.
- `/thanks`, `/activate`, `/account` og ukjente/private ruter initialiserer ikke
  nettlesersporing. `thanks_opened` er derfor bevisst en no-op der.

Bekreft i GA4 at automatisk sidevisning/historikksporing under Enhanced Measurement
ikke dobbeltteller de manuelle sidevisningene. Verifiser én kjent testreise etter
publisering. Kjøp må følges i Stripe/RevenueCat; et butikk-klikk er ikke en
installasjon. PromoteKit-attribusjon brukes bare når referral-valget er akseptert.

## Produktinformasjon og artikler

`src/lib/product.js` er den felles produktkilden for navn, språk, modulnavn,
forsiktige gratis/Premium+-beskrivelser, webpriser og kjente revisjonsdatoer.
Oppdater den etter en verifisert apprelease, ikke ut fra eldre planer.

Etter faktiske innholdsendringer:

```sh
npm run content:sync
npm run content:check
```

Dette genererer/kontrollerer `public/llms.txt`, `public/llms-full.txt`,
`public/.well-known/llms.txt` og `public/sitemap.xml`. Bygget avviser utdaterte
genererte filer. `CONTENT_UPDATES` skal bare endres ved reelle innholdsendringer.
Opprinnelige publiseringsdatoer som ikke er kjent, skal ikke oppfinnes.

De to viktigste guide-URL-ene er bevart. De bruker en egen lesemal, praktiske
eksempler, eksisterende appbilder og direkte butikklenker. De øvrige guidene har
en avgrenset mobilrettelse. PLAN, READ, BOND og SELF beholder sine ulike oppgaver;
READ er «HOW TO SURVIVE», og BOND omfatter sex, flørt og intimitet.

Webprisene er fortsatt USD 3.99 per måned / 29.99 per år. De er merket som webpriser;
butikk-/regionpriser og eksakte tilgangsgrenser må sammenlignes med aktuell release.
Androids versjonsfallback er bevart på 5.0.8. Sett `MOODMAP_ANDROID_LATEST_VERSION`
etter en verifisert Play-release; iOS kan hentes fra den offisielle App Store-oppføringen.

## Kvalitetskontroll og faktiske begrensninger

Sluttkontrollen bestod **62 automatiserte tester** og **34 HTTP-kontroller** av
produksjonsbygget. Alle 18 offentlige sitemap-sider svarte `200`, med én hovedoverskrift,
ett `main`-landemerke, riktig canonical og lastet stilark. Kontrollene omfattet også
private sider, eldre omdirigeringer, AI-tekstfilene, avvisning i API-ene og faktisk
bildeoptimalisering. HTTP-kontrollene er ikke en visuell skjermtest.

Regresjonstestene kjører den faktiske koden med falske nøkler og simulerte tjenester.
De dekker betaling/autorisasjon, parallelle hendelser og retry, serverstyrt e-post,
avmelding/webhook-signaturer, menyens portal/fokus/rullelås/breddeovergang, tastaturfaner,
samtykke/måledata og kvitteringsgrensesnittets HTTP-/nettverksfeil.

Redis/Lua er kontrollert mot en simulert atomisk kontrakt, ikke en levende database.
Ingen ekte kjøp, utsendelser, abonnementer eller kundeoppføringer ble endret.

Produksjonsbygget og testene er kontrollert lokalt. Avhengighetenes installerte
produksjonstre hadde ingen rapporterte advisories ved kontroll 10.11.2026
(`npm audit --omit=dev`). Dette er ikke en garanti mot ukjente sårbarheter.
Lint har ingen feil; det gjenstår rådgivende Next-varsler for eksisterende,
dimensjonerte `<img>`-elementer med ferdig optimaliserte WebP-bilder/logoer.

En lokal Chromium-kjøring ble blokkert av kjøremiljøets socket-tillatelser, og
den tilgjengelige eksterne nettleseren kunne ikke nå localhost. Det hevdes derfor
ikke at denne pakken er visuelt godkjent på alle skjermstørrelser eller enheter.
DOM-tester verifiserer tilstand og semantikk; de måler ikke faktisk CSS-geometri.
CSS-oppryddingen fjerner bare ubrukte klasser, med rekkefølge/deklarasjoner for
de beholdte reglene kontrollert uendret.

Før produksjon: kontroller hjem, begge hovedguider, Premium+, Intelligence,
support og konto på telefon, iPad og desktop. Sjekk særlig 320–430 px,
768/820 px stående og 1024/1180 px liggende, med menyen åpen før rotasjon.
Prøv ekte Safari/iOS og Android, tastatur, fokus og zoom. Mål Core Web Vitals
etter publisering; ingen Lighthouse-score eller fysisk enhetstest er oppgitt her.

## Vedlikehold

Next er oppdatert innenfor 15.5-serien. Avgrensede `overrides` holder PostCSS,
source-map-js, nanoid, qs og sharp på kontrollerte rettede versjoner uten en
Next-hovedversjonsmigrering. Revurder disse ved senere rammeverkoppdateringer.
Ubrukte Redis-/Resend-/axios-retry-pakker er fjernet; eksisterende REST-integrasjoner
og Upstash-klienten er beholdt.

`polish.css` er redusert ved å fjerne beviselig ubrukte `mm-*`-selektorer. Alle
kilde- og offentlige JS/HTML-filer inngikk i brukskontrollen. Behold den etablerte
identiteten og samle framtidige komponentstiler fremfor å legge flere overstyringslag.

CI under `.github/workflows/quality.yml` kjører installasjon, lint, tester og bygg
uten produksjonshemmeligheter. Testene sender ikke meldinger og krever ingen
ekstern betalingstjeneste.
