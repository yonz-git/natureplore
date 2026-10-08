"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SQUIRREL } from "@/components/Logo";

gsap.registerPlugin(MotionPathPlugin);

// The squirrel from the wordmark lives on A0's green button while the pointer is on it: it appears
// on the ground to the left, hops onto the button, hops twice along its top, runs to the right end and sits
// there for as long as the pointer stays. When the pointer leaves, or the button is clicked, it
// leaps up and away to the right as if it could fly, shrinking and fading as it goes; a click waits
// for most of that leap before it opens the map.
// It takes the button's own fill, the primary to primary-deep gradient.
// Decoration only: no squirrel on touch screens (no hover there) or under reduced motion, and a
// click there opens the map at once.
// Sits inside the button (.a02-cta), so its distances are the button's: x from its left edge,
// y from its top. Styles: .a02-squirrel in app/welcome2.css.

// At the right end it sits up and waits in a pose of its own: the same squirrel, balloon tail and
// all, drawn sitting upright, facing right, in a 100 by 100 box with its feet on the bottom edge.
const SIT_TAIL =
  "M56 93 C46 87 40 78 32 69 C15 65 4 53 4 36 C4 18 18 5 33 5 C49 5 59 18 57 34 C55 48 45 56 43 66 C42 76 48 85 58 88 Z";
const SIT_BODY =
  "M47 96 C43 90 45 80 53 76 C57 68 60 60 63 52 C65 46 66 40 68 34 C69 28 72 24 76 22 L74 12 C77 13 80 17 81 21 C86 22 90 26 92 30 C93 33 90 36 86 37 C83 38 82 41 82 44 C82 48 83 50 86 52 C88 54 87 57 84 56 C82 56 80 54 79 53 C78 62 80 72 82 80 C83 86 85 92 90 96 Z";

const TILT_SIT = -38; // degrees: the drawing dives down and right, this sits it up facing right
const TILT_RUN = -52; // stretched out along the button's top
const TILT_LEAP = -70; // and this points its head up the leap
// along the top: two hops, "tak tak", then a run to the right end. Each hop's distance in rem, its
// length in seconds, how high it goes in rem, and the pause after it
const HOPS = [
  { dist: 2.25, time: 0.24, lift: 0.55, rest: 0.14 },
  { dist: 2.25, time: 0.24, lift: 0.55, rest: 0.16 },
];
const RUN_SPEED = 12; // rem a second, the run after the hops
const STRIDE = 0.1; // seconds, one bound of the run
const STRIDE_LIFT = 0.25; // rem
const LEAP = 0.6; // seconds, the flight away
const OPEN_AFTER = 0.4; // seconds into the flight, a click opens the map
// everything above is written at the pace it was drawn; the squirrel plays it this much faster
const SPEED = 2;

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
        // the right end of the top, clear of the curve, for the sitting squirrel, which is as wide as it is tall
        const end = w - s - 0.75 * r;
        const runner = el.querySelector(".a02-squirrel-run");
        const sitter = el.querySelector(".a02-squirrel-sit");
        gsap.set(runner, { opacity: 1 });
        gsap.set(sitter, { opacity: 0 });

        gsap.set(el, { x: ground.x, y: ground.y, rotation: TILT_SIT, scale: 0.9, opacity: 0, transformOrigin: "50% 100%" });
        tl = gsap
          .timeline()
          .timeScale(SPEED)
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
          // hops along the top, runs to the right end, and sits up there
          .to(el, { rotation: TILT_RUN, duration: 0.12, ease: "power2.out" });
        let x = perch.x;
        HOPS.forEach((hop, i) => {
          x = Math.min(end, x + hop.dist * r);
          tl!
            .addLabel(`hop${i}`)
            .to(el, { x, duration: hop.time, ease: "power1.inOut" }, `hop${i}`)
            .to(el, { y: perch.y - hop.lift * r, duration: hop.time / 2, ease: "sine.out" }, `hop${i}`)
            .to(el, { y: perch.y, duration: hop.time / 2, ease: "sine.in" }, `hop${i}+=${hop.time / 2}`)
            // each landing a small squash
            .to(el, { scaleY: 0.86, scaleX: 1.08, duration: 0.06, ease: "power2.out" })
            .to(el, { scaleY: 1, scaleX: 1, duration: 0.1, ease: "power3.out", rotation: TILT_RUN });
          if (hop.rest > 0.16) tl!.to({}, { duration: hop.rest - 0.16 }); // the landing took 0.16s of it
        });
        // the run: low quick bounds at an even pace, then it sits up at the end
        const run = (end - x) / (RUN_SPEED * r);
        if (run > 0.05) {
          const strides = Math.max(1, Math.round(run / STRIDE));
          tl.addLabel("run")
            .to(el, { x: end, duration: run, ease: "power1.out" }, "run")
            .to(
              el,
              { y: perch.y - STRIDE_LIFT * r, duration: run / strides / 2, ease: "sine.out", yoyo: true, repeat: strides * 2 - 1 },
              "run",
            );
        }
        // at the end it sits up: straight, its feet on the button, turning into the sitting squirrel as
        // it does, and settles with a little give
        tl.addLabel("sit", "-=0.06")
          .to(el, { rotation: 0, y: -s * 0.97, duration: 0.24, ease: "power2.out" }, "sit")
          .to(runner, { opacity: 0, duration: 0.16, ease: "sine.inOut" }, "sit")
          .to(sitter, { opacity: 1, duration: 0.16, ease: "sine.inOut" }, "sit")
          .to(el, { scaleY: 0.94, scaleX: 1.04, duration: 0.1, ease: "power2.out" }, "sit+=0.18")
          .to(el, { scaleY: 1, scaleX: 1, duration: 0.22, ease: "power3.out" });
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
          .timeScale(SPEED)
          .to(el, { scaleY: 0.88, scaleX: 1.06, duration: 0.08, ease: "power2.out" })
          .addLabel("leap")
          .to(el, { scaleY: 1.08, scaleX: 0.94, rotation: TILT_LEAP, duration: 0.16, ease: "power2.out" }, "leap")
          // a sitting squirrel stretches back out into the running one as it goes
          .to(el.querySelector(".a02-squirrel-sit"), { opacity: 0, duration: 0.12, ease: "sine.inOut" }, "leap")
          .to(el.querySelector(".a02-squirrel-run"), { opacity: 1, duration: 0.12, ease: "sine.inOut" }, "leap")
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
        if (href) gsap.delayedCall((0.08 + OPEN_AFTER) / SPEED, () => router.push(href));
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
      <svg className="a02-squirrel-run" viewBox="684 51 78 92">
        <defs>
          {/* the button's fill, laid across the squirrel the same way */}
          <linearGradient id="a02-squirrel-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-primary)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-primary-deep)" }} />
          </linearGradient>
        </defs>
        <path fillRule="evenodd" d={SQUIRREL} fill="url(#a02-squirrel-fill)" />
      </svg>
      <svg className="a02-squirrel-sit" viewBox="0 0 100 100">
        <defs>
          <mask id="a02-squirrel-eye">
            <rect width="100" height="100" fill="#fff" />
            <circle cx="83.5" cy="28" r="1.8" fill="#000" />
          </mask>
        </defs>
        <g mask="url(#a02-squirrel-eye)" fill="url(#a02-squirrel-fill)">
          <path d={SIT_TAIL} />
          <path d={SIT_BODY} />
        </g>
      </svg>
    </span>
  );
}
