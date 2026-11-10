/** Lock the viewport on touch browsers too, then restore the exact scroll position. */
export function lockPageScroll(win) {
  const { body } = win.document;
  const scrollX = win.scrollX || 0;
  const scrollY = win.scrollY || 0;
  const properties = ["overflow", "position", "top", "left", "right", "width"];
  const previous = Object.fromEntries(properties.map((key) => [key, body.style[key]]));
  Object.assign(body.style, {
    overflow: "hidden",
    position: "fixed",
    top: `-${scrollY}px`,
    left: "0",
    right: "0",
    width: "100%",
  });
  let unlocked = false;
  return () => {
    if (unlocked) return;
    unlocked = true;
    Object.assign(body.style, previous);
    win.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
  };
}
