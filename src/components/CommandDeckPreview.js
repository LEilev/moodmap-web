// src/components/CommandDeckPreview.js
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { COMMAND_DECK, PROOF_EXAMPLES } from "../lib/proofContent";

const DECK_ORDER = ["support", "comms", "intimacy", "core"];

const DECK_META = {
  support: { eyebrow: "Lower the load", rgb: "34 197 94", accent: "#22C55E" },
  comms: { eyebrow: "Shorten the signal", rgb: "56 189 248", accent: "#38BDF8" },
  intimacy: { eyebrow: "Read momentum", rgb: "244 114 182", accent: "#F472B6" },
  core: { eyebrow: "Own the pressure", rgb: "129 140 248", accent: "#818CF8" },
};

function clampIndex(idx, len) {
  if (len <= 0) return 0;
  const n = idx % len;
  return n < 0 ? n + len : n;
}

export default function CommandDeckPreview() {
  const examples = useMemo(() => {
    const byDeck = new Map(PROOF_EXAMPLES.map((x) => [x.deck, x]));
    const ordered = DECK_ORDER.map((d) => byDeck.get(d)).filter(Boolean);
    return ordered.length ? ordered : PROOF_EXAMPLES;
  }, []);

  const total = examples.length;

  const deckToIndex = useMemo(() => {
    const m = new Map();
    examples.forEach((ex, i) => m.set(ex.deck, i));
    return m;
  }, [examples]);

  const [activeIndex, setActiveIndex] = useState(0);

  const active = examples[clampIndex(activeIndex, total)];
  const activeDeck = active?.deck || "support";
  const activeTabIndex = Math.max(0, DECK_ORDER.indexOf(activeDeck));
  const activeMeta = DECK_META[activeDeck] || DECK_META.support;

  const prev = useCallback(() => {
    setActiveIndex((i) => clampIndex(i - 1, total));
  }, [total]);

  const next = useCallback(() => {
    setActiveIndex((i) => clampIndex(i + 1, total));
  }, [total]);

  const goToDeck = useCallback(
    (deckKey) => {
      const idx = deckToIndex.get(deckKey);
      if (typeof idx === "number") setActiveIndex(idx);
    },
    [deckToIndex]
  );

  const touchStartX = useRef(null);

  const onTouchStart = useCallback((e) => {
    if (!e?.touches?.length) return;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current == null) return;
      const endX = e.changedTouches?.[0]?.clientX;
      if (typeof endX !== "number") return;

      const delta = endX - touchStartX.current;
      touchStartX.current = null;

      const SWIPE_THRESHOLD = 55;
      if (delta > SWIPE_THRESHOLD) prev();
      if (delta < -SWIPE_THRESHOLD) next();
    },
    [next, prev]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!e) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(total - 1);
      }
    },
    [next, prev, total]
  );

  const nav = COMMAND_DECK.commandDeckNav;
  const full = COMMAND_DECK.commandDeckFull;
  const explain = COMMAND_DECK.commandDeckExplainer;

  return (
    <section className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div data-reveal>
            <p className="mm-section-label">CommandDeck</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Four moves, one daily read.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/72">
              {explain.general}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {DECK_ORDER.map((deckKey) => {
                const meta = DECK_META[deckKey];
                return (
                  <button
                    key={deckKey}
                    type="button"
                    onClick={() => goToDeck(deckKey)}
                    className={[
                      "mm-mini-deck-button",
                      activeDeck === deckKey ? "is-active" : "",
                    ].join(" ")}
                    style={{ "--deck-rgb": meta.rgb }}
                  >
                    <span>{nav[deckKey]}</span>
                    <small>{explain[deckKey]}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="mm-command-shell outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-blue"
            role="region"
            aria-roledescription="carousel"
            aria-label="MoodMap command deck preview"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ "--deck-rgb": activeMeta.rgb, "--deck-accent": activeMeta.accent }}
            data-reveal
          >
            <div className="mm-command-shell__ambient" aria-hidden="true" />

            <div className="mm-command-topbar">
              <div>
                <span>App surface preview</span>
                <strong>
                  Briefing {activeIndex + 1} / {total}
                </strong>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button type="button" onClick={prev} aria-label="Previous deck">
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button type="button" onClick={next} aria-label="Next deck">
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mm-command-tabs" aria-label="CommandDeck categories">
              <span
                aria-hidden="true"
                className="mm-command-tabs__indicator"
                style={{ transform: `translateX(${activeTabIndex * 100}%)` }}
              />
              {DECK_ORDER.map((deckKey) => {
                const isActive = deckKey === activeDeck;
                return (
                  <button
                    key={deckKey}
                    type="button"
                    onClick={() => goToDeck(deckKey)}
                    aria-current={isActive ? "true" : "false"}
                    className={isActive ? "is-active" : ""}
                  >
                    {nav[deckKey]}
                  </button>
                );
              })}
            </div>

            <div className="mm-command-focus">
              <div className="mm-command-focus__meta">
                <span>{activeMeta.eyebrow}</span>
                <span>{full[activeDeck]}</span>
              </div>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
                  style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
                >
                  {examples.map((ex) => (
                    <article key={ex.id} className="w-full shrink-0">
                      <div className="mm-command-card">
                        <div className="mm-command-card__top">
                          <span>
                            {ex.phase} • Day {ex.day}
                          </span>
                          <span>{full[ex.deck]}</span>
                        </div>

                        <h3>{ex.text}</h3>

                        <div className="mm-command-card__notes">
                          <p>Why it matters</p>
                          <ul>
                            {ex.why.map((bullet, i) => (
                              <li key={`${ex.id}-${i}`}>
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 sm:hidden">
              <button type="button" onClick={prev} className="mm-mobile-nav-button">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Prev
              </button>
              <button type="button" onClick={next} className="mm-mobile-nav-button">
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-white/42 sm:text-xs">
              Representative guidance. Use <span className="text-white/70">←</span>/
              <span className="text-white/70">→</span> keys, or swipe on mobile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
