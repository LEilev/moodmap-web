"use client";

import { useId, useState } from "react";

export default function ProductShowcase({ surfaces = [] }) {
  const generatedId = useId().replace(/:/g, "");
  const preferredIndex = Math.max(
    0,
    surfaces.findIndex((surface) => surface.defaultActive)
  );
  const [activeIndex, setActiveIndex] = useState(preferredIndex);
  const safeIndex = activeIndex >= 0 && activeIndex < surfaces.length ? activeIndex : 0;
  const activeSurface = surfaces[safeIndex];

  if (!activeSurface) return null;

  const panelId = `mm-product-panel-${generatedId}`;

  return (
    <div className="mm-v2-showcase mm-v3-showcase" data-reveal>
      <div className="mm-v2-showcase__copy">
        <span id="product" className="mm-section-label mm-product-anchor">
          Inside MoodMap
        </span>
        <h2 id="product-heading">One daily read. Open the layer you need.</h2>
        <p>
          Start with Today’s State, then go deeper only when it helps: the full brief,
          the cycle map, the tripwire, or the practical move with its reasoning.
        </p>

        <div className="mm-v2-showcase__tabs" role="tablist" aria-label="MoodMap product views">
          {surfaces.map((surface, index) => {
            const isActive = index === safeIndex;
            const tabId = `mm-product-tab-${generatedId}-${index}`;

            return (
              <button
                key={surface.kicker}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                className={["mm-v2-showcase-tab", isActive ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveIndex(index)}
              >
                <span className="mm-v2-showcase-tab__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="mm-v2-showcase-tab__copy">
                  <span>{surface.meta}</span>
                  <strong>{surface.kicker}</strong>
                  <small>{surface.title}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={panelId}
        className="mm-v2-showcase__visual"
        role="tabpanel"
        aria-labelledby={`mm-product-tab-${generatedId}-${safeIndex}`}
      >
        <div className="mm-v2-showcase__visual-head">
          <span>{activeSurface.systemLabel ?? activeSurface.kicker}</span>
          <strong>{activeSurface.caption ?? activeSurface.title}</strong>
        </div>
        <div className="mm-v2-showcase__image-shell mm-v3-phone-stage">
          <div className="mm-v3-phone-frame mm-v3-phone-frame--showcase">
            <img
              key={activeSurface.screenshotPath}
              src={activeSurface.screenshotPath}
              alt={activeSurface.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
