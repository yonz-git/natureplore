"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SQUIRREL } from "@/components/Logo";

gsap.registerPlugin(MotionPathPlugin);

// The squirrel from the wordmark crosses A0's green button when the pointer comes onto it: it
// appears on the ground to the left, hops onto the button, crouches, and leaps up and away to the
// right as if it could fly, shrinking and fading as it goes. Once per visit of the pointer; a hover
// that comes back while it is still in the air does not start it again.
// Decoration only: no squirrel on touch screens (no hover there) or under reduced motion.
// Sits inside the button (.a02-cta), so its distances are the button's: x from its left edge,
// y from its top. Styles: .a02-squirrel in app/welcome2.css.

const TILT_SIT = -38; // degrees: the drawing dives down and right, this sits it up facing right
const TILT_LEAP = -70; // and this points its head up the leap

export default function CtaSquirrel() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const button = el?.parentElement;
      if (!el || !button || !contextSafe) return;
      const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
      let tl: gsap.core.Timeline | null = null;

      const play = contextSafe(() => {
        if (!mq.matches || tl?.isActive()) return;
        tl?.kill();
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const w = button.offsetWidth;
        const h = button.offsetHeight;
        const s = el.offsetHeight; // the squirrel's own size
        // beside the button, its feet at the button's foot, never off the left of the screen
        const ground = { x: Math.max(-3.25 * rem, 0.5 * rem - button.getBoundingClientRect().left), y: h - s };
        const perch = { x: 1.25 * rem, y: -s * 0.82 }; // on the top edge, toward the left end
        const away = { x: w + 3 * rem, y: -9 * rem };

        gsap.set(el, { x: ground.x, y: ground.y, rotation: TILT_SIT, scale: 0.9, opacity: 0, transformOrigin: "50% 100%" });
        tl = gsap
          .timeline()
          // appears where it stands
          .to(el, { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" })
          // hops up onto the button in one arc
          .to(el, {
            motionPath: { path: [{ x: ground.x + 1.5 * rem, y: perch.y - 1.75 * rem }, perch], curviness: 1.2 },
            duration: 0.38,
            ease: "power1.inOut",
          })
          // lands: a squash, then up again and crouched to spring
          .to(el, { scaleY: 0.82, scaleX: 1.1, duration: 0.08, ease: "power2.out" })
          .to(el, { scaleY: 1, scaleX: 1, duration: 0.14, ease: "power3.out" })
          .to(el, { scaleY: 0.88, scaleX: 1.06, duration: 0.1, ease: "power2.inOut" }, "+=0.06")
          // leaps away up and right, stretching out, and is gone
          .addLabel("leap")
          .to(el, { scaleY: 1.08, scaleX: 0.94, rotation: TILT_LEAP, duration: 0.16, ease: "power2.out" }, "leap")
          .to(
            el,
            {
              motionPath: { path: [{ x: perch.x + w * 0.4, y: perch.y - 3.5 * rem }, away], curviness: 1.4 },
              duration: 0.6,
              ease: "power2.out",
            },
            "leap",
          )
          .to(el, { scale: 0.55, duration: 0.44, ease: "power1.in" }, "leap+=0.16")
          .to(el, { opacity: 0, duration: 0.3, ease: "power1.out" }, "leap+=0.3");
      });

      button.addEventListener("pointerenter", play);
      return () => {
        button.removeEventListener("pointerenter", play);
        tl?.kill();
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="a02-squirrel" aria-hidden="true">
      <svg viewBox="684 51 78 92" fill="currentColor">
        <path fillRule="evenodd" d={SQUIRREL} />
      </svg>
    </span>
  );
}
