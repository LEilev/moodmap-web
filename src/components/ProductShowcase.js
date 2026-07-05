"use client";

import { useState } from "react";

function DeviceShot({ src, alt, className = "" }) {
  return (
    <div className={["mm-device-shot", className].filter(Boolean).join(" ")}>
      <div className="mm-device-shot__rail" aria-hidden="true" />
      <div className="mm-device-shot__frame">
        <div className="mm-device-shot__notch" aria-hidden="true" />
        <div className="mm-device-shot__screen">
          <img key={src} src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

function CommandDeckVisual({ surface, shotClass }) {
  const reasonBullets = surface.reasonBullets ?? [];

  return (
    <div className="mm-commanddeck-showcase" aria-label={`${surface.systemLabel ?? surface.kicker} move and reason preview`}>
      <div className="mm-commanddeck-showcase__phone" aria-hidden="false">
        <DeviceShot src={surface.screenshotPath} alt={surface.alt} className={shotClass} />
      </div>

      <article className="mm-commanddeck-reason" aria-label={surface.secondaryLabel ?? "WHY layer"}>
        <span className="mm-commanddeck-reason__eyebrow">{surface.secondaryLabel ?? "WHY layer"}</span>
        <h3>{surface.reasonTitle ?? "See the reason before you move."}</h3>
        <p>{surface.reasonBody ?? surface.quote}</p>
        {reasonBullets.length ? (
          <ul>
            {reasonBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </article>

      <div className="mm-commanddeck-flow" aria-hidden="true">
        <span>Move</span>
        <span>WHY</span>
        <span>Reason</span>
      </div>
    </div>
  );
}

function ShowcaseVisual({ surface }) {
  const shotClass = [
    "mm-device-shot--showcase",
    surface.shotClass,
  ].filter(Boolean).join(" ");

  if (!surface.secondaryScreenshotPath) {
    return <DeviceShot src={surface.screenshotPath} alt={surface.alt} className={shotClass} />;
  }

  return <CommandDeckVisual surface={surface} shotClass={shotClass} />;
}

export default function ProductShowcase({ surfaces = [] }) {
  const preferredIndex = surfaces.findIndex((surface) => surface.defaultActive);
  const layeredIndex = surfaces.findIndex((surface) => surface.secondaryScreenshotPath);
  const defaultIndex = preferredIndex >= 0 ? preferredIndex : layeredIndex >= 0 ? layeredIndex : 0;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const safeActiveIndex = activeIndex >= 0 && activeIndex < surfaces.length ? activeIndex : defaultIndex;
  const activeSurface = surfaces[safeActiveIndex] ?? surfaces[0];

  if (!activeSurface) {
    return null;
  }

  const isLayered = Boolean(activeSurface.secondaryScreenshotPath);

  return (
    <div className="mm-product-showcase" data-reveal>
      <div className="mm-showcase-demo-grid">
        <div className="mm-showcase-left">
          <header className="mm-showcase-copy">
            <span className="mm-section-label">Inside today’s read</span>
            <h2
              className="mm-showcase-heading"
              aria-label="What changed. What matters. What to avoid. What to do."
            >
              <span>What changed.</span>
              <span>What matters.</span>
              <span>What to avoid.</span>
              <span>What to do.</span>
            </h2>
            <p>
              One real day shown from PMS. The same stack runs across the full cycle: context, risk, timing, and the move that prevents extra repair work.
            </p>
          </header>

          <div className="mm-showcase-tabs" role="tablist" aria-label="MoodMap product layers">
            {surfaces.map((surface, index) => {
              const isActive = index === safeActiveIndex;
              const tabId = `mm-showcase-tab-${index}`;

              return (
                <button
                  key={surface.kicker}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="mm-showcase-panel"
                  className={["mm-showcase-tab", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="mm-showcase-tab__index">0{index + 1}</span>
                  <span className="mm-showcase-tab__body">
                    <span className="mm-showcase-tab__meta">{surface.meta}</span>
                    <strong>{surface.kicker}</strong>
                    <span className="mm-showcase-tab__title">{surface.title}</span>
                    <span className="mm-showcase-tab__quote" aria-hidden={!isActive}>“{surface.quote}”</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="mm-showcase-panel"
          className={["mm-showcase-preview", isLayered ? "mm-showcase-preview--layered" : ""].filter(Boolean).join(" ")}
          role="tabpanel"
          aria-labelledby={`mm-showcase-tab-${safeActiveIndex}`}
        >
          <div className="mm-showcase-preview__header">
            <span>{isLayered ? "Action layer" : "Live app layer"}</span>
            <strong>{activeSurface.systemLabel ?? activeSurface.kicker}</strong>
          </div>

          <ShowcaseVisual surface={activeSurface} />

          <p className="mm-showcase-preview__caption">{activeSurface.title}</p>
        </div>
      </div>
    </div>
  );
}
