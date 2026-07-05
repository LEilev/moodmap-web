"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#trust", label: "Trust" },
  { href: "/learn", label: "Guides" },
  { href: "/support", label: "Support" },
  { href: "/pro", label: "Premium+" },
];

const BRAND_MARK_SRC = "/brand/moodmap-mark.png";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const prevOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 40);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="mm-mobile-menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="mm-mobile-menu-shell"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            type="button"
            className="mm-mobile-menu-overlay"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />

          <aside id="mobile-navigation" ref={panelRef} className="mm-mobile-panel">
            <div className="mm-mobile-panel__header">
              <div className="mm-brand-lockup text-base" aria-hidden="true">
                <span className="mm-brand-mark">
                  <img src={BRAND_MARK_SRC} alt="" width="34" height="34" />
                </span>
                <span>MoodMap</span>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="mm-mobile-menu-button mm-mobile-panel__close"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mm-mobile-nav" aria-label="Mobile navigation">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mm-mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mm-mobile-panel__cta">
              <Link href="/#download" className="mm-mobile-download" onClick={() => setOpen(false)}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download MoodMap
              </Link>
              <p>One daily read. Better timing. Context for his response, not a verdict on her.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
