import "../app/globals.css";
import "../app/polish.css";
import { useRouter } from "next/router";
import SitePrivacy, { PrivacyPreferencesButton } from "../components/SitePrivacy";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <div id="site-shell" className="min-h-screen">
      <SitePrivacy path={router.asPath} />
      <a href="#main-content" className="mm-skip-link">Skip to content</a>
      <div id="main-content" tabIndex={-1}>
        <Component {...pageProps} />
      </div>
      <footer className="mm-service-footer" aria-label="Privacy and support">
        <PrivacyPreferencesButton />
        <a className="mm-link" href="/privacy-policy">Privacy policy</a>
        <a className="mm-link" href="/support">Support</a>
      </footer>
    </div>
  );
}
