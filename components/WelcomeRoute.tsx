"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// The route drawn across the photograph on A0 · Welcome, with the four things the map holds. A picture
// of what the map holds, not a control. It draws itself as the page lands: after the opening, on the
// frame the logo reaches its corner (a0-open, set by components/WelcomeLogo.tsx), and at once on the
// still page. Each stop lights as the line reaches it. Scrolling back up hides it again, ready to draw
// the next time. Layout: app/welcome2.css.

// the four stops, in the order the line reaches them
const STOPS = ["Routes near you", "Spots to stop at", "Organisms", "Notable this season"];

// one path per size, in that size's board coordinates
const ROUTE = {
  phone: { box: "0 0 390 844", d: "M300 190 C 220 200, 100 220, 116 300 S 300 340, 282 410 S 70 460, 96 520" },
  desk: { box: "0 0 1440 900", d: "M1240 180 C 1060 190, 780 230, 820 320 S 1210 390, 1180 470 S 800 560, 860 640" },
};

export default function WelcomeRoute() {
  const root = useRef<HTMLDivElement>(null);

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
        tl = gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .set(el, { autoAlpha: 1 })
          .fromTo(
            el.querySelectorAll(".a02-line path"),
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" },
            0.2,
          )
          // the dot grows, never the stop, which keeps its own translate for centring
          .fromTo(el.querySelectorAll(".a02-stop"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.43 }, 0.2)
          .fromTo(el.querySelectorAll(".a02-dot"), { scale: 0.6 }, { scale: 1, duration: 0.5, stagger: 0.43 }, 0.2);
      };
      const hide = () => {
        tl?.kill();
        tl = null;
        gsap.set(el, { autoAlpha: 0 });
      };

      // the still page, or reduced motion, where the page is A0 from the start (app/welcome.css)
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
          <path d={ROUTE[size].d} pathLength={1} />
        </svg>
      ))}
      {STOPS.map((stop, i) => (
        <div key={stop} className={`a02-stop a02-stop-${i + 1}`}>
          <span className="a02-dot" />
          <span className="a02-label">{stop}</span>
        </div>
      ))}
    </div>
  );
}
