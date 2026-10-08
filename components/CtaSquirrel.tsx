"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SQUIRREL } from "@/components/Logo";

gsap.registerPlugin(MotionPathPlugin);

// The squirrel from the wordmark lives on A0's green button while the pointer is on it: it appears
// on the ground to the left, hops onto the button, skips along its top to the right end and sits
// there for as long as the pointer stays. When the pointer leaves, or the button is clicked, it
// leaps up and away to the right as if it could fly, shrinking and fading as it goes; a click waits
// for most of that leap before it opens the map.
// It takes the button's own fill, the primary to primary-deep gradient.
// Decoration only: no squirrel on touch screens (no hover there) or under reduced motion, and a
// click there opens the map at once.
// Sits inside the button (.a02-cta), so its distances are the button's: x from its left edge,
// y from its top. Styles: .a02-squirrel in app/welcome2.css.

const TILT_SIT = -38; // degrees: the drawing dives down and right, this sits it up facing right
const TILT_RUN = -52; // stretched out along the button's top
const TILT_LEAP = -70; // and this points its head up the leap
// the skip along the top, in the rhythm "tak tak, .. taktak tak": each hop's share of the distance,
// its length in seconds, how high it goes in rem, and the pause after it
const HOPS = [
  { share: 1, time: 0.24, lift: 0.55, rest: 0.14 },
  { share: 1, time: 0.24, lift: 0.55, rest: 0.7 }, // the "..": it stops and looks up
  { share: 0.6, time: 0.15, lift: 0.3, rest: 0.03 },
  { share: 0.6, time: 0.15, lift: 0.3, rest: 0.28 },
  { share: 1, time: 0.26, lift: 0.6, rest: 0 },
];
const LEAP = 0.6; // seconds, the flight away
const OPEN_AFTER = 0.4; // seconds into the flight, a click opens the map

export default function CtaSquirrel() {
  const ref = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const button = el?.parentElement as HTMLAnchorElement | null | undefined;
      if (!el || !button || !contextSafe) return;
      const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
      let state: "idle" | "on" | "away" = "idle";
      let tl: gsap.core.Timeline | null = null;
      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

      const enter = contextSafe(() => {
        if (!mq.matches || state !== "idle") return;
        state = "on";
        tl?.kill();
        const r = rem();
        const w = button.offsetWidth;
        const h = button.offsetHeight;
        const s = el.offsetHeight; // the squirrel's own size
        // beside the button, its feet at the button's foot, never off the left of the screen
        const ground = { x: Math.max(-3.25 * r, 0.5 * r - button.getBoundingClientRect().left), y: h - s };
        const perch = { x: 1.25 * r, y: -s * 0.82 }; // on the top edge, toward the left end
        const end = w - el.offsetWidth - 0.75 * r; // the right end of the top, clear of the curve
        const step = (end - perch.x) / HOPS.reduce((sum, hop) => sum + hop.share, 0);

        gsap.set(el, { x: ground.x, y: ground.y, rotation: TILT_SIT, scale: 0.9, opacity: 0, transformOrigin: "50% 100%" });
        tl = gsap
          .timeline()
          // appears where it stands
          .to(el, { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" })
          // hops up onto the button in one arc
          .to(el, {
            motionPath: { path: [{ x: ground.x + 1.5 * r, y: perch.y - 1.75 * r }, perch], curviness: 1.2 },
            duration: 0.38,
            ease: "power1.inOut",
          })
          // lands with a squash
          .to(el, { scaleY: 0.82, scaleX: 1.1, duration: 0.08, ease: "power2.out" })
          .to(el, { scaleY: 1, scaleX: 1, duration: 0.12, ease: "power3.out" })
          // skips along the top to the right end, and sits up there
          .to(el, { rotation: TILT_RUN, duration: 0.12, ease: "power2.out" });
        let x = perch.x;
        HOPS.forEach((hop, i) => {
          x += step * hop.share;
          const last = i === HOPS.length - 1;
          tl!
            .addLabel(`hop${i}`)
            .to(el, { x, duration: hop.time, ease: "power1.inOut" }, `hop${i}`)
            .to(el, { y: perch.y - hop.lift * r, duration: hop.time / 2, ease: "sine.out" }, `hop${i}`)
            .to(el, { y: perch.y, duration: hop.time / 2, ease: "sine.in" }, `hop${i}+=${hop.time / 2}`)
            // each landing a small squash
            .to(el, { scaleY: 0.86, scaleX: 1.08, duration: 0.06, ease: "power2.out" })
            .to(el, { scaleY: 1, scaleX: 1, duration: 0.1, ease: "power3.out", rotation: last ? TILT_SIT : TILT_RUN });
          // the long pause: it sits up, looks, and leans in again
          if (hop.rest > 0.4) {
            tl!
              .to(el, { rotation: TILT_SIT + 6, duration: 0.16, ease: "power2.out" })
              .to(el, { rotation: TILT_RUN, duration: 0.12, ease: "power2.inOut" }, `>+=${hop.rest - 0.44}`);
          } else if (hop.rest > 0.16) {
            tl!.to({}, { duration: hop.rest - 0.16 }); // the landing above already took 0.16s of it
          }
        });
      });

      // leaps away up and right from wherever it is, stretching out, and is gone
      const leave = contextSafe(() => {
        if (state !== "on") return;
        state = "away";
        tl?.kill();
        const r = rem();
        const x = gsap.getProperty(el, "x") as number;
        const y = gsap.getProperty(el, "y") as number;
        const away = { x: x + 6 * r, y: y - 7 * r };
        tl = gsap
          .timeline({ onComplete: () => void (state = "idle") })
          .to(el, { scaleY: 0.88, scaleX: 1.06, duration: 0.08, ease: "power2.out" })
          .addLabel("leap")
          .to(el, { scaleY: 1.08, scaleX: 0.94, rotation: TILT_LEAP, duration: 0.16, ease: "power2.out" }, "leap")
          .to(
            el,
            {
              motionPath: { path: [{ x: x + 3 * r, y: y - 4.5 * r }, away], curviness: 1.4 },
              duration: LEAP,
              ease: "power2.out",
            },
            "leap",
          )
          .to(el, { scale: 0.55, duration: LEAP - 0.16, ease: "power1.in" }, "leap+=0.16")
          .to(el, { opacity: 0, duration: 0.3, ease: "power1.out" }, `leap+=${LEAP - 0.3}`);
      });

      // a plain click lets it fly first, then opens the map; a click to a new tab or window goes at once
      const click = contextSafe((e: MouseEvent) => {
        if (state !== "on" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        leave();
        const href = button.getAttribute("href");
        if (href) gsap.delayedCall(0.08 + OPEN_AFTER, () => router.push(href));
      });

      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
      button.addEventListener("click", click);
      return () => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("pointerleave", leave);
        button.removeEventListener("click", click);
        tl?.kill();
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="a02-squirrel" aria-hidden="true">
      <svg viewBox="684 51 78 92">
        <defs>
          {/* the button's fill, laid across the squirrel the same way */}
          <linearGradient id="a02-squirrel-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-primary)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-primary-deep)" }} />
          </linearGradient>
        </defs>
        <path fillRule="evenodd" d={SQUIRREL} fill="url(#a02-squirrel-fill)" />
      </svg>
    </span>
  );
}
