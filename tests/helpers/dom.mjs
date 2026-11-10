import { JSDOM } from "jsdom";

export function installDom(url = "https://moodmap-app.com/") {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { url, pretendToBeVisual: true });
  const win = dom.window;
  const originals = new Map();
  const globals = {
    window: win, self: win, document: win.document, navigator: win.navigator,
    HTMLElement: win.HTMLElement, Element: win.Element, Node: win.Node,
    CustomEvent: win.CustomEvent, MutationObserver: win.MutationObserver,
    getComputedStyle: win.getComputedStyle.bind(win),
    requestAnimationFrame: win.requestAnimationFrame.bind(win),
    cancelAnimationFrame: win.cancelAnimationFrame.bind(win),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  for (const [name, value] of Object.entries(globals)) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  const queries = new Map();
  win.matchMedia = (query) => {
    if (!queries.has(query)) {
      const listeners = new Set();
      queries.set(query, {
        media: query, matches: false,
        addEventListener: (_name, listener) => listeners.add(listener),
        removeEventListener: (_name, listener) => listeners.delete(listener),
        addListener: (listener) => listeners.add(listener),
        removeListener: (listener) => listeners.delete(listener),
        setMatches(value) {
          this.matches = value;
          for (const listener of listeners) listener({ matches: value, media: query });
        },
      });
    }
    return queries.get(query);
  };
  const scrollCalls = [];
  win.scrollTo = (...args) => scrollCalls.push(args);
  return {
    window: win, queries, scrollCalls,
    restore() {
      win.close();
      for (const [name, descriptor] of originals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
    },
  };
}
