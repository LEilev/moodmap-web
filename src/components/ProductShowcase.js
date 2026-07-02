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

export default function ProductShowcase({ surfaces = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSurface = surfaces[activeIndex] ?? surfaces[0];

  if (!activeSurface) {
    return null;
  }

  return (
    <div className="mm-product-showcase" data-reveal>
      <div className="mm-showcase-copy">
        <span className="mm-section-label">Inside today’s read</span>
        <h2>What changed. What matters. What to avoid. What to do.</h2>
        <p>
          One PMS day, shown as a controlled intelligence stack — the read, the room, the tripwire,
          and the cleaner move.
        </p>

        <div className="mm-showcase-tabs" role="tablist" aria-label="MoodMap product layers">
          {surfaces.map((surface, index) => {
            const isActive = index === activeIndex;
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
        className="mm-showcase-preview"
        role="tabpanel"
        aria-labelledby={`mm-showcase-tab-${activeIndex}`}
      >
        <div className="mm-showcase-preview__header">
          <span>Live app layer</span>
          <strong>{activeSurface.kicker}</strong>
        </div>

        <DeviceShot
          src={activeSurface.screenshotPath}
          alt={activeSurface.alt}
          className={[
            "mm-device-shot--showcase",
            activeSurface.shotClass,
          ].filter(Boolean).join(" ")}
        />

        <p className="mm-showcase-preview__caption">{activeSurface.title}</p>
      </div>
    </div>
  );
}
