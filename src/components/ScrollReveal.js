"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!elements.length) return;

    const revealVisibleElements = () => {
      const threshold = window.innerHeight * 0.92;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < threshold) {
          el.setAttribute("data-revealed", "true");
        }
      });
    };

    revealVisibleElements();
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => {
      if (el.getAttribute("data-revealed") !== "true") observer.observe(el);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
