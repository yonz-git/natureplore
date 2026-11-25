"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const STOPS = ["Guided routes", "Spots to stop at", "Organisms", "Notable this season"];

const ROUTE = {
  phone: { box: "0 170 390 370", d: "M300 190 C 220 200, 100 220, 116 300 S 300 340, 282 410 S 70 460, 96 520" },
  desk: { box: "0 0 1440 900", d: "M1240 171 C 1060 181, 780 221, 820 311 S 1210 381, 1180 461 S 800 631, 860 729" },
};

const DRAW = 1.6;
const UNDER = 0.4;
const FADE = 14;

function stopsAlong(path: SVGPathElement) {
  const nums = (path.getAttribute("d") ?? "").split(/(?=[MCS])/).map((seg) => seg.match(/-?[\d.]+/g)!.map(Number));
  const points = nums.map((n) => ({ x: n[n.length - 2], y: n[n.length - 1] }));
  const total = path.getTotalLength();
  const steps = 400;
  return points.map(({ x, y }) => {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i <= steps; i++) {
      const pt = path.getPointAtLength((total * i) / steps);
      const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
      if (d < bestD) [best, bestD] = [i / steps, d];
    }
    return best;
  });
}

export default function WelcomeRoute() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const main = el?.parentElement?.querySelector<HTMLElement>(".a02-main");
    if (!el || !main) return;
    const place = () => {
      el.style.setProperty("--main-top", `${main.offsetTop}px`);
      requestAnimationFrame(quiet);
    };
    const quiet = () => {
      const labels = Array.from(el.querySelectorAll<HTMLElement>(".a02-label"));
      el.querySelectorAll<SVGSVGElement>(".a02-line").forEach((svg) => {
        const box = svg.getBoundingClientRect();
        if (!box.width) return;
        const layers = labels.map((label) => {
          const r = label.getBoundingClientRect();
          const rx = r.width * 0.62 + FADE;
          const ry = r.height * 0.75 + FADE;
          const solid = Math.round(((r.width * 0.62) / rx) * 100);
          return `radial-gradient(${rx}px ${ry}px at ${r.left - box.left + r.width / 2}px ${r.top - box.top + r.height / 2}px, rgb(0 0 0 / ${UNDER}) ${solid}%, #000 100%)`;
        });
        svg.style.maskImage = layers.join(", ");
        svg.style.maskComposite = layers.map(() => "intersect").join(", ");
      });
    };
    const watch = new ResizeObserver(place);
    watch.observe(main);
    watch.observe(el.parentElement!);
    place();
    document.fonts?.ready.then(quiet);
    return () => watch.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const stage = el.closest(".a0s");
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      let tl: gsap.core.Timeline | null = null;
      const draw = () => {
        tl?.kill();
        if (reduce) {
          tl = gsap.timeline().fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" });
          return;
        }
        const paths = Array.from(el.querySelectorAll<SVGPathElement>(".a02-line path"));
        const lengths = paths.map((path) => path.getTotalLength());
        const shown = paths.findIndex((path) => getComputedStyle(path.parentElement!).display !== "none");
        const at = stopsAlong(paths[Math.max(shown, 0)]);
        const stops = Array.from(el.querySelectorAll<HTMLElement>(".a02-stop")).map((stop) => Array.from(stop.children));
        const dots = Array.from(el.querySelectorAll<HTMLElement>(".a02-dot"));
        const lit = stops.map(() => false);
        paths.forEach((path, i) => gsap.set(path, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }));
        gsap.set(stops.flat(), { autoAlpha: 0 });
        gsap.set(dots, { scale: 0.6 });
        const draw = { p: 0 };
        tl = gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .to(draw, {
            p: 1,
            duration: DRAW,
            ease: "sine.inOut",
            onUpdate() {
              paths.forEach((path, i) => (path.style.strokeDashoffset = String(lengths[i] * (1 - draw.p))));
              at.forEach((f, i) => {
                if (lit[i] || draw.p < f) return;
                lit[i] = true;
                gsap.to(stops[i], { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
                gsap.to(dots[i], { scale: 1, duration: 0.5, ease: "back.out(2)" });
              });
            },
            onComplete() {
              gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
            },
          }, 0.15);
      };
      const hide = () => {
        tl?.kill();
        tl = null;
        gsap.killTweensOf(el.querySelectorAll(".a02-stop > *"));
        gsap.set(el, { autoAlpha: 0 });
      };

      if (!stage || reduce) return draw();
      const sync = () => {
        const open = stage.classList.contains("a0-open");
        if (open && !tl) draw();
        else if (!open && tl) hide();
      };
      const watch = new MutationObserver(sync);
      watch.observe(stage, { attributes: true, attributeFilter: ["class"] });
      sync();
      return () => watch.disconnect();
    },
    { scope: root },
  );

  return (
    <div className="a02-route" ref={root} aria-hidden="true">
      {(["phone", "desk"] as const).map((size) => (
        <svg key={size} className={`a02-line a02-line-${size}`} viewBox={ROUTE[size].box} preserveAspectRatio="none">
          <path d={ROUTE[size].d} />
        </svg>
      ))}
      {STOPS.map((stop, i) => (
        <div key={stop} className={`a02-stop a02-stop-${i + 1}`}>
          <span className="a02-dot glow-dot" />
          <span className="a02-label">{stop}</span>
        </div>
      ))}
    </div>
  );
}
