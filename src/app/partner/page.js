import "../polish.css";
import Link from "next/link";
import StoreButtons from "../../components/StoreButtons";
import { PRODUCT } from "../../lib/product";

const DESCRIPTION =
  "The previous MoodMap web referral program is closed. Download MoodMap from the App Store or Google Play and choose optional Premium+ access in the app.";

export const metadata = {
  title: "Referral program closed",
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: "Referral program closed | MoodMap",
    description: DESCRIPTION,
    url: "/partner",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Referral program closed | MoodMap",
    description: DESCRIPTION,
  },
};

export default function PartnerPage() {
  return (
    <main className="mm-page mm-v2-page mm-v2-subpage relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="mm-background-field" />
      <section className="mm-v2-subhero">
        <div className="mm-container">
          <div className="mm-v2-subhero__copy max-w-3xl">
            <span className="mm-section-label">MoodMap</span>
            <h1>The referral program has closed.</h1>
            <p className="mm-v2-subhero__lead">
              The previous web referral program is no longer offered. Download
              MoodMap from the App Store or Google Play and choose optional
              Premium+ access in the app.
            </p>
            <StoreButtons placement="retired-program" context="/partner" />
            <p className="mm-v2-purchase-note">
              Questions about an earlier invitation? Contact{" "}
              <a className="mm-link" href={`mailto:${PRODUCT.supportEmail}`}>{PRODUCT.supportEmail}</a>.
            </p>
            <Link href="/pro" className="mm-v2-secondary-link">Explore MoodMap Premium+</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
