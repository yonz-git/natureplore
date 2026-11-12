const running = new WeakMap<Element, () => void>();

const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

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
