"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin);

// The squirrel from the wordmark lives on A0's green button while the pointer is on it: it appears
// on the ground to the left, hops onto the button, hops twice along its top, runs to the right end and sits
// there for as long as the pointer stays. When the pointer leaves, or the button is clicked, it
// leaps up and away to the right as if it could fly, shrinking and fading as it goes; a click waits
// for most of that leap before it opens the map.
// It takes the button's own fill, the primary to primary-deep gradient.
// On a touch screen there is no hover, so it comes on its own as the page lands, once the button
// has arrived, and sits nibbling there; a tap sends it off before the map opens, as a click does.
// Decoration only: no squirrel under reduced motion, and a click there opens the map at once.
// Sits inside the button (.a02-cta), so its distances are the button's: x from its left edge,
// y from its top. Styles: .a02-squirrel in app/welcome2.css.

// The squirrel is the wordmark's own (components/Logo.tsx, SQUIRREL) in two pieces, cut where the
// tail's stalk meets the body: the tail, and the body with the head. At the right end it sits up
// and waits: the body changes shape into Lordicon's squirrel (wired-outline-1208), filled, sitting
// upright facing right, while the tail, its shape untouched, swings down onto its back. The eye is
// a hole that travels from the old head to the new one, and the icon's arm and haunch line is cut
// through the sitting body the same way.
const TAIL =
  "M725.93 57.79C716.69 53.81 705.07 53 695.79 57.82C682.77 64.62 678.1 79.46 688.49 91.18C700.64 104.95 715.25 97.2 730.37 106.19C742.45 113.41 718.84 112.58 727.89 122.52L735.97 118.61C747.18 109.24 749.82 68.33 725.93 57.79Z";
const BODY =
  "M727.89 122.52C727.56 122.6 724.24 123.54 723.44 120.04C723.44 124.05 723.45 125.83 725.99 127.18C728.47 128.51 738.27 123.25 744.59 130.24C747.32 133.26 745.7 135.32 748.75 137.15C750.31 138.1 752.4 139.5 752.4 139.5C751.23 138.33 753.64 136.22 751.16 133.52C753.06 132.5 751.32 140.88 758.67 137.15C758.07 136.51 758.61 135.71 758.67 134.92C759.24 132.23 758.89 128.42 755.89 127.75C756.56 126.45 757.07 126.53 757.8 126.53C754.41 123.93 752.76 128.86 751.16 127.26C749.55 125.65 751.14 121.7 745.53 118.26C740.07 114.92 736.58 118.06 735.97 118.61Z";
// The icon's body outline at rest and at the bottom of its nibble, scaled into this drawing with
// its feet on y 140. While it sits it nibbles as that icon does: the head dips to the paws, chews
// twice, and comes back up as the tail swishes, then a pause.
const SITTING =
  "M745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C749.77 127.83 749.12 133.86 749.12 135.67C749.12 135.67 752.32 135.67 752.32 135.67C753.51 135.67 754.60 136.17 755.37 136.94C756.15 137.72 756.64 138.81 756.64 140.00C756.64 140.00 739.32 140.00 739.32 140.00C724.31 140.00 723.00 116.37 736.48 116.37C744.48 116.37 744.76 110.68 744.76 110.68C744.76 110.68 745.75 102.00 745.75 102.00C745.75 102.00 749.19 107.47 749.19 107.47C756.55 108.70 755.13 111.07 757.41 114.53C756.94 117.28 753.63 118.74 750.31 118.18C750.31 118.18 750.31 118.18 750.31 118.18C749.09 118.82 748.18 120.54 747.11 122.83Z";
const NIBBLING =
  "M745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C749.77 127.83 749.12 133.86 749.12 135.67C749.12 135.67 752.32 135.67 752.32 135.67C753.51 135.67 754.60 136.17 755.37 136.94C756.15 137.72 756.64 138.81 756.64 140.00C756.64 140.00 739.32 140.00 739.32 140.00C724.31 140.00 723.00 116.37 736.48 116.37C744.48 116.37 747.03 110.61 747.03 110.61C747.03 110.61 751.02 102.83 751.02 102.83C751.02 102.83 752.56 109.32 752.56 109.32C759.08 113.46 756.77 115.15 757.54 119.35C756.00 121.79 752.26 121.85 749.31 119.98C749.31 119.98 749.31 119.98 749.31 119.98C748.71 120.34 748.18 120.54 747.11 122.83Z";
const CHEWING =
  "M745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C749.77 127.83 749.12 133.86 749.12 135.67C749.12 135.67 752.32 135.67 752.32 135.67C753.51 135.67 754.60 136.17 755.37 136.94C756.15 137.72 756.64 138.81 756.64 140.00C756.64 140.00 739.32 140.00 739.32 140.00C724.31 140.00 723.00 116.37 736.48 116.37C744.48 116.37 746.12 110.64 746.12 110.64C746.12 110.64 748.91 102.50 748.91 102.50C748.91 102.50 751.21 108.58 751.21 108.58C758.07 111.56 756.11 113.52 757.49 117.42C756.38 119.99 752.81 120.61 749.71 119.26C749.71 119.26 749.71 119.26 749.71 119.26C748.86 119.73 748.18 120.54 747.11 122.83Z";
const ARM = {
  sit: "M747.11 122.83C747.11 122.83 755.19 120.99 755.19 120.99C755.35 120.93 755.52 120.90 755.69 120.89C756.68 120.81 757.63 121.43 757.94 122.43C758.30 123.57 757.66 124.81 756.50 125.17C756.50 125.17 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 738.67 129.51 735.85 124.69",
  nibble: "M747.11 122.83C747.11 122.83 754.06 121.37 754.06 121.37C754.21 121.28 754.37 121.23 754.54 121.19C755.50 120.96 756.55 121.42 757.01 122.34C757.56 123.44 757.14 124.75 756.03 125.31C756.03 125.31 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 738.67 129.51 735.85 124.69",
  chew: "M747.11 122.83C747.11 122.83 754.51 121.22 754.51 121.22C754.67 121.14 754.83 121.10 755.00 121.07C755.97 120.90 756.98 121.42 757.38 122.38C757.86 123.49 757.35 124.77 756.22 125.25C756.22 125.25 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 745.16 127.83 745.16 127.83C745.16 127.83 738.67 129.51 735.85 124.69",
};
const ARM_WIDTH = 1.36;
const EYE_R = 1.06;
const EYE = {
  run: { cx: 756.4, cy: 133.7 },
  sit: { cx: 751.93, cy: 112.19 },
  nibble: { cx: 753.26, cy: 114.85 },
  chew: { cx: 752.73, cy: 113.79 },
};
// where the tail goes on the sitting squirrel: turned about the foot of its stalk, onto the rump
const TAIL_ON_RUMP = { svgOrigin: "732 121", x: -1, y: 8, rotation: -16 };
const FEET = 140; // sitting, its feet are on this line of the drawing
const NOSE = 757.4; // and its nose at this x
const BOX = { x: 684, y: 51, h: 92 }; // the drawing's viewBox, which the span is sized to

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
const ARRIVED = 1.1; // seconds after the page lands, the button has arrived (.a02-cta in app/welcome.css)

export default function CtaSquirrel() {
  const ref = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const button = el?.parentElement as HTMLAnchorElement | null | undefined;
      if (!el || !button || !contextSafe) return;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
      const calm = window.matchMedia("(prefers-reduced-motion: no-preference)");
      let state: "idle" | "on" | "away" = "idle";
      let tl: gsap.core.Timeline | null = null;
      let idle: gsap.core.Timeline | null = null; // the nibbling, while it sits
      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

      const enter = contextSafe(() => {
        if (!calm.matches || state !== "idle") return;
        state = "on";
        tl?.kill();
        idle?.kill();
        const r = rem();
        const w = button.offsetWidth;
        const h = button.offsetHeight;
        const s = el.offsetHeight; // the squirrel's own size
        // beside the button, its feet at the button's foot, never off the left of the screen
        const ground = { x: Math.max(-3.25 * r, 0.5 * r - button.getBoundingClientRect().left), y: h - s };
        const perch = { x: 1.25 * r, y: -s * 0.82 }; // on the top edge, toward the left end
        const unit = s / BOX.h; // px per unit of the drawing
        // the right end of the flat top, clear of the round end, for the standing squirrel's nose
        const end = w - 1.4 * r - (NOSE - BOX.x) * unit;
        const body = el.querySelector(".a02-squirrel-body");
        const tail = el.querySelector(".a02-squirrel-tail");
        const eye = el.querySelector(".a02-squirrel-eye");
        const arm = el.querySelector(".a02-squirrel-arm");
        gsap.set(body, { morphSVG: BODY });
        gsap.set(tail, { svgOrigin: TAIL_ON_RUMP.svgOrigin, x: 0, y: 0, rotation: 0 });
        gsap.set(eye, { attr: EYE.run });
        gsap.set(arm, { attr: { d: ARM.sit }, opacity: 0 });

        gsap.set(el, { x: ground.x, y: ground.y, rotation: TILT_SIT, scale: 0.9, opacity: 0, transformOrigin: "50% 100%" });
        // once it sits, it nibbles until the pointer leaves: in seconds as they are, not at SPEED
        const nibble = () => {
          const shape = (d: string, armD: string, eyeAt: { cx: number; cy: number }, duration: number, ease: string) => [
            [body, { morphSVG: d, duration, ease }],
            [arm, { morphSVG: armD, duration, ease }],
            [eye, { attr: eyeAt, duration, ease }],
          ] as const;
          idle = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: 0.5 });
          const at = (t: number, parts: ReturnType<typeof shape>) => parts.forEach(([target, vars]) => idle!.to(target, vars, t));
          at(0, shape(NIBBLING, ARM.nibble, EYE.nibble, 0.3, "power2.inOut"));
          at(0.32, shape(CHEWING, ARM.chew, EYE.chew, 0.12, "sine.inOut"));
          at(0.44, shape(NIBBLING, ARM.nibble, EYE.nibble, 0.12, "sine.inOut"));
          at(0.58, shape(CHEWING, ARM.chew, EYE.chew, 0.12, "sine.inOut"));
          at(0.7, shape(NIBBLING, ARM.nibble, EYE.nibble, 0.12, "sine.inOut"));
          at(0.88, shape(SITTING, ARM.sit, EYE.sit, 0.34, "power2.inOut"));
          // the tail swishes down and back as the head goes down and comes up
          idle.to(tail, { rotation: TAIL_ON_RUMP.rotation - 9, duration: 0.36, ease: "sine.inOut" }, 0.06);
          idle.to(tail, { rotation: TAIL_ON_RUMP.rotation, duration: 0.5, ease: "sine.inOut" }, 0.72);
        };
        tl = gsap
          .timeline({ onComplete: () => void (state === "on" && nibble()) })
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
        // at the end it sits up: the whole squirrel levels out onto its feet while the body changes
        // into the sitting squirrel, and the tail swings down onto its rump a beat behind and settles
        tl.addLabel("sit", "-=0.06")
          .to(el, { rotation: 0, y: -(FEET - BOX.y) * unit, duration: 0.36, ease: "power2.inOut" }, "sit")
          .to(body, { morphSVG: SITTING, duration: 0.6, ease: "power2.inOut" }, "sit+=0.04")
          .to(eye, { attr: EYE.sit, duration: 0.6, ease: "power2.inOut" }, "sit+=0.04")
          .to(arm, { opacity: 1, duration: 0.3, ease: "sine.out" }, "sit+=0.36")
          .to(tail, { x: TAIL_ON_RUMP.x, y: TAIL_ON_RUMP.y, rotation: TAIL_ON_RUMP.rotation - 6, duration: 0.5, ease: "power2.inOut" }, "sit+=0.1")
          .to(tail, { rotation: TAIL_ON_RUMP.rotation, duration: 0.4, ease: "sine.inOut" }, "sit+=0.6")
          .to(el, { scaleY: 0.95, scaleX: 1.03, duration: 0.1, ease: "power2.out" }, "sit+=0.6")
          .to(el, { scaleY: 1, scaleX: 1, duration: 0.26, ease: "power3.out" }, "sit+=0.7");
      });

      // leaps away up and right from wherever it is, stretching out, and is gone
      const leave = contextSafe(() => {
        if (state !== "on") return;
        state = "away";
        tl?.kill();
        idle?.kill();
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
          // a sitting squirrel stretches back out as it goes
          .to(el.querySelector(".a02-squirrel-body"), { morphSVG: BODY, duration: 0.22, ease: "power2.out" }, "leap")
          .to(el.querySelector(".a02-squirrel-eye"), { attr: EYE.run, duration: 0.22, ease: "power2.out" }, "leap")
          .to(el.querySelector(".a02-squirrel-arm"), { opacity: 0, duration: 0.12, ease: "sine.out" }, "leap")
          .to(el.querySelector(".a02-squirrel-tail"), { x: 0, y: 0, rotation: 0, duration: 0.22, ease: "power2.out" }, "leap")
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

      // a mouse or pen brings it on and sends it off; a finger only taps, and the tap is the click
      const over = (e: PointerEvent) => void (e.pointerType !== "touch" && fine.matches && enter());
      const out = (e: PointerEvent) => void (e.pointerType !== "touch" && fine.matches && leave());

      // A touch screen: it comes as the page lands (a0-open, set by components/WelcomeLogo.tsx),
      // once the button has arrived. If the opening is scrolled back up before the end, it goes.
      const stage = button.closest(".a0s");
      let landing: gsap.core.Tween | null = null;
      const watch = new MutationObserver(() => {
        if (fine.matches) return;
        const open = stage!.classList.contains("a0-open");
        if (open && !landing && state === "idle") landing = gsap.delayedCall(ARRIVED, enter);
        if (!open) {
          landing?.kill();
          landing = null;
          if (state !== "idle") {
            tl?.kill();
            idle?.kill();
            state = "idle";
            gsap.set(el, { opacity: 0 });
          }
        }
      });
      if (stage) {
        watch.observe(stage, { attributes: true, attributeFilter: ["class"] });
        if (stage.classList.contains("a0-open") && !fine.matches) landing = gsap.delayedCall(ARRIVED, enter);
      }

      button.addEventListener("pointerenter", over);
      button.addEventListener("pointerleave", out);
      button.addEventListener("click", click);
      return () => {
        watch.disconnect();
        landing?.kill();
        button.removeEventListener("pointerenter", over);
        button.removeEventListener("pointerleave", out);
        button.removeEventListener("click", click);
        tl?.kill();
        idle?.kill();
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="a02-squirrel" aria-hidden="true">
      <svg viewBox="684 51 78 92">
        <defs>
          {/* the button's fill, laid across the squirrel the same way */}
          <linearGradient id="a02-squirrel-fill" gradientUnits="userSpaceOnUse" x1="684" y1="51" x2="762" y2="143">
            <stop offset="0" style={{ stopColor: "var(--color-primary)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-primary-deep)" }} />
          </linearGradient>
          {/* the eye, a hole through the squirrel */}
          <mask id="a02-squirrel-eye" maskUnits="userSpaceOnUse" x="600" y="0" width="300" height="250">
            <rect x="600" y="0" width="300" height="250" fill="#fff" />
            <circle className="a02-squirrel-eye" cx={EYE.run.cx} cy={EYE.run.cy} r={EYE_R} fill="#000" />
            {/* the arm and haunch line of the sitting squirrel, shown only while it sits */}
            <path
              className="a02-squirrel-arm"
              d={ARM.sit}
              fill="none"
              stroke="#000"
              strokeWidth={ARM_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            />
          </mask>
        </defs>
        <g mask="url(#a02-squirrel-eye)" fill="url(#a02-squirrel-fill)">
          <path className="a02-squirrel-tail" d={TAIL} />
          <path className="a02-squirrel-body" d={BODY} />
        </g>
      </svg>
    </span>
  );
}
