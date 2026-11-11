import { FaApple, FaGooglePlay } from "react-icons/fa";
import { PRODUCT } from "../lib/product";

export default function StoreButtons({
  compact = false,
  placement = compact ? "home-end" : "home-hero",
  context = "/",
  id = compact ? undefined : "download",
}) {
  return (
    <div
      id={id}
      data-mm-placement={placement}
      data-mm-context={context}
      className={["mm-store-row", compact ? "mm-store-row--center" : ""].filter(Boolean).join(" ")}
    >
      <a href={PRODUCT.appStoreUrl} className="store-btn" aria-label="Download MoodMap for iPhone on the App Store">
        <span className="store-btn__icon" aria-hidden="true"><FaApple /></span>
        <span className="store-btn__copy"><small>App Store</small><strong>Download for iPhone</strong></span>
      </a>
      <a href={PRODUCT.playStoreUrl} className="store-btn" aria-label="Get MoodMap on Google Play">
        <span className="store-btn__icon" aria-hidden="true"><FaGooglePlay /></span>
        <span className="store-btn__copy"><small>Google Play</small><strong>Get on Google Play</strong></span>
      </a>
    </div>
  );
}
