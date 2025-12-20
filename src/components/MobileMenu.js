"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

function MenuLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-2xl px-4 py-3 text-base font-semibold text-white/90
                 transition-colors hover:bg-white/10 hover:text-white
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
    >
      {children}
    </Link>
  );
}

export default function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);

    // Lock scroll behind the modal
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first interactive element for better UX
    const t = setTimeout(() => {
      const firstLink = panelRef.current?.querySelector("a");
      firstLink?.focus?.();
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 sm:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop (darker + blur, so text behind doesn't bleed through) */}
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Panel */}
      <div className="relative mx-auto mt-3 w-[92%] max-w-sm">
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-3xl
                     bg-[#0B1120]/92 ring-1 ring-white/15
                     shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          {/* Subtle inner glow (premium) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full
                       bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full
                       bg-gradient-to-tr from-blue-500/18 to-emerald-400/18 blur-3xl"
          />

          {/* Header row */}
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="text-sm font-semibold text-white/80">Menu</div>

            <button
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full
                         bg-white/10 ring-1 ring-white/15
                         transition hover:bg-white/15
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
            >
              <X className="h-5 w-5 text-white/90" aria-hidden />
            </button>
          </div>

          {/* Links */}
          <nav className="relative p-3">
            <MenuLink href="/#about" onClick={onClose}>
              About
            </MenuLink>
            <MenuLink href="/#download" onClick={onClose}>
              Download
            </MenuLink>
            <MenuLink href="/support" onClick={onClose}>
              Support
            </MenuLink>
            <MenuLink href="/pro" onClick={onClose}>
              Pro
            </MenuLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
