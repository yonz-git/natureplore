// Scrolling that moves like everything else in the app: slow in, slow out, on the --ease-move curve.
// The browser's own smooth scroll has its own short, fixed timing with no ease in, so every scroll the app
// makes for the reader (a chip's jump, a spot coming into view, a card's photos) goes through here.

/** the scroll running on each element, so a new one stops it first */
const running = new WeakMap<Element, () => void>();

/** --ease-move, cubic-bezier(0.77, 0, 0.175, 1), as an ease-in-out quart, which it follows closely */
const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/**
 * Scroll `el` to `top` and or `left`, eased in and out. Longer distances take longer, from 0.6s up to
 * 1.1s. A wheel or touch from the reader stops it where it is. Resolves when it ends or stops.
 */
export function easeScroll(el: Element, to: { top?: number; left?: number }): Promise<void> {
  running.get(el)?.();
  const y0 = el.scrollTop;
  const x0 = el.scrollLeft;
  const dy = (to.top ?? y0) - y0;
  const dx = (to.left ?? x0) - x0;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || (!dy && !dx)) {
    el.scrollTo({ top: y0 + dy, left: x0 + dx });
    return Promise.resolve();
  }
  const ms = Math.min(1100, 600 + Math.hypot(dx, dy) * 0.15);
  return new Promise((done) => {
    let start = 0;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      running.delete(el);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
      done();
    };
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    const step = (now: number) => {
      start ||= now;
      const t = Math.min(1, (now - start) / ms);
      const k = ease(t);
      el.scrollTo({ top: y0 + dy * k, left: x0 + dx * k });
      if (t < 1) frame = requestAnimationFrame(step);
      else stop();
    };
    running.set(el, stop);
    frame = requestAnimationFrame(step);
  });
}
