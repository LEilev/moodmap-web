// src/components/CommandDeckPreview.jsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COMMAND_DECK, PROOF_EXAMPLES } from "../lib/proofContent";

const DECK_ORDER = ["ops", "intel", "contact", "core"];

function clampIndex(idx, len) {
  if (len <= 0) return 0;
  const n = idx % len;
  return n < 0 ? n + len : n;
}

export default function CommandDeckPreview() {
  const examples = useMemo(() => {
    const byDeck = new Map(PROOF_EXAMPLES.map((x) => [x.deck, x]));
    const ordered = DECK_ORDER.map((d) => byDeck.get(d)).filter(Boolean);

    // Fallback: if something is missing, just return what we have.
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
  const activeDeck = active?.deck || "ops";

  const activeTabIndex = Math.max(0, DECK_ORDER.indexOf(activeDeck));

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

  // Touch swipe (mobile)
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

      const SWIPE_THRESHOLD = 55; // px
      if (delta > SWIPE_THRESHOLD) prev();
      if (delta < -SWIPE_THRESHOLD) next();
    },
    [next, prev]
  );

  // Keyboard navigation (when the deck frame is focused)
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
    <section className="px-6 pb-12 sm:pb-14">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.26em] text-white/45">
            Command Deck
          </p>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
            What MoodMap actually says
          </h2>

          <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
            {explain.general}
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-4xl">
          <div
            className="glass-card p-5 sm:p-6 relative outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-blue"
            role="region"
            aria-roledescription="carousel"
            aria-label="MoodMap command deck preview"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Header row: label + tabs + arrows */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Left meta (desktop) */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/45">
                <span className="uppercase tracking-[0.18em]">Preview</span>
                <span className="opacity-35">•</span>
                <span>
                  Briefing{" "}
                  <span className="text-white/70 font-semibold">
                    {activeIndex + 1}
                  </span>{" "}
                  <span className="text-white/45">/ {total}</span>
                </span>
              </div>

              {/* Tabs */}
              <div className="flex-1">
                <div className="relative grid grid-cols-4 rounded-full bg-white/10 ring-1 ring-white/15 p-1 overflow-hidden">
                  {/* Sliding indicator */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1 bottom-1 left-1 rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{
                      width: `calc((100% - 8px) / ${Math.max(DECK_ORDER.length, 1)})`,
                      transform: `translateX(${activeTabIndex * 100}%)`,
                    }}
                  />
                  {DECK_ORDER.map((deckKey) => {
                    const isActive = deckKey === activeDeck;
                    return (
                      <button
                        key={deckKey}
                        type="button"
                        onClick={() => goToDeck(deckKey)}
                        aria-current={isActive ? "true" : "false"}
                        className={[
                          "relative z-10 rounded-full py-2 text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-colors",
                          isActive ? "text-white" : "text-white/60 hover:text-white/80",
                        ].join(" ")}
                      >
                        {nav[deckKey]}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-white/80">{full[activeDeck]}</p>
                  <p className="mt-1 text-xs text-white/55">{explain[activeDeck]}</p>
                </div>
              </div>

              {/* Arrows (desktop) */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous deck"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                >
                  <ChevronLeft className="h-5 w-5 text-white/80" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next deck"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                >
                  <ChevronRight className="h-5 w-5 text-white/80" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
                style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
              >
                {examples.map((ex) => (
                  <div key={ex.id} className="w-full shrink-0 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/55">
                        {ex.phase} • Day {ex.day}
                      </p>
                      <p className="text-[11px] sm:text-xs text-white/45">
                        {full[ex.deck]}
                      </p>
                    </div>

                    <p className="mt-3 text-lg sm:text-xl md:text-[22px] font-semibold text-white leading-snug">
                      {ex.text}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                        Notes
                      </p>

                      <ul className="mt-3 space-y-2.5 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                        {ex.why.map((bullet, i) => (
                          <li key={`${ex.id}-${i}`} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-white/35"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile arrows (below) */}
            <div className="mt-5 flex sm:hidden items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Prev
              </button>

              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] sm:text-xs text-white/45">
              Tip: use <span className="text-white/70">←</span>/<span className="text-white/70">→</span> keys, or swipe on mobile.
            </p>

            <div aria-hidden="true" className="glass-gloss" />
          </div>
        </div>
      </div>
    </section>
  );
}
