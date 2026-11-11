"use client";

import { useEffect } from "react";

/** Bind the current policy DOM on every visit and release it on route changes. */
export default function PrivacyPolicyContents({ sectionIds }) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('[data-pp-toc] a[href^="#"]'));
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!links.length || !sections.length) return undefined;

    const validIds = new Set(sections.map(({ id }) => id));
    const visible = new Set();
    let disposed = false;
    let currentId;

    const setActive = (id) => {
      if (disposed || !validIds.has(id)) return;
      currentId = id;
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("bg-white/10", active);
        link.classList.toggle("text-white", active);
        link.classList.toggle("text-blue-100", !active);
        link.setAttribute("aria-current", String(active));
      });
    };

    const hashId = () => {
      const hash = window.location.hash.slice(1);
      try { return decodeURIComponent(hash); } catch { return hash; }
    };
    const initial = hashId();
    setActive(validIds.has(initial) ? initial : sections[0].id);

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      setActive(event.currentTarget.getAttribute("href").slice(1));
      // Leave the browser's native fragment navigation and history intact.
    };
    const onHashChange = () => setActive(hashId() || sections[0].id);
    links.forEach((link) => link.addEventListener("click", onClick));
    window.addEventListener("hashchange", onHashChange);

    let observer;
    if (typeof window.IntersectionObserver === "function") {
      observer = new window.IntersectionObserver((entries) => {
        if (disposed) return;
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) visible.add(target.id);
          else visible.delete(target.id);
        });
        const firstVisible = sections.find(({ id }) => visible.has(id));
        if (firstVisible && firstVisible.id !== currentId) setActive(firstVisible.id);
      }, { root: null, rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });
      sections.forEach((section) => observer.observe(section));
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      links.forEach((link) => link.removeEventListener("click", onClick));
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [sectionIds]);

  return null;
}
