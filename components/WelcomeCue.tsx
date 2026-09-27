"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import { MUSH_POP } from "@/lib/intro-timeline";
import { followProgress } from "@/lib/welcome-progress";

gsap.registerPlugin(SplitText);

// "Scroll", and the mushroom under it. The letters lift a little, one after another, every two
// seconds, and the mushroom pushes up out of the ground between them and thinks better of it, which
// is the page asking to be scrolled without another word.
// Then the scroll takes the offer up: the mushroom leaves its spot, grows and travels to where it
// belongs in the logo, arriving as the logo starts to build itself (components/WelcomeLogo.tsx), and
// hands over to the logo's own mushroom there. Scrolling back to the top puts it in the ground again.
// Not run for a reader who asked for less motion: then it is the word on its own, still.

const FIRST = 3.1; // seconds, the cue's own arrival is over by here
const EVERY = 2; // seconds between one hop and the next
const LEAVES = 0.02; // of the scroll: the mushroom is on its way by here
const ARRIVES = 0.45; // and in the logo by here, which is when the logo starts (WelcomeLogo)
const HOPS = 3; // arcs it makes on the way over
const RISE = 90; // px, how high the first arc takes it
const HANDOVER = 0.9; // seconds after the logo starts, when its own mushroom pops into the same place
const GROUND = "#FAFBF5"; // --color-on-field, the cue's own colour
const LOGO_INK = "#AEB779"; // --color-marker-label, what the logo is drawn in

// the mushroom's own corner of the logo, in the logo's viewBox units
const MUSH = { x: 112, y: 147, w: 60, h: 59 };
const LOGO = { w: 1729.5, h: 425.2 };

const glide = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const at = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)));

export default function WelcomeCue({ text }: { text: string }) {
  const cue = useRef<HTMLDivElement>(null);
  const mush = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const word = cue.current?.querySelector("span");
      const sprout = mush.current;
      if (!word || !sprout || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // the wait: the letters, then the mushroom half a beat behind them
      const split = SplitText.create(word, { type: "chars" });
      const cap = sprout.firstElementChild;
      gsap.set(cap, { yPercent: 118 }); // in the ground, not even its tip showing
      const waiting = gsap
        .timeline({ repeat: -1, repeatDelay: EVERY, delay: FIRST })
        .to(split.chars, {
          y: -8,
          stagger: { each: 0.05, from: "start" },
          duration: 0.32,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        })
        // only its head comes up: the ground line is the box, and this leaves the stem under it
        .to(cap, { yPercent: 57, duration: 0.5, ease: "back.out(2)", yoyo: true, repeat: 1 }, 0.18);

      // where it is going: the spot below the logo where the logo's own mushroom pops in, worked out
      // from the logo's own box
      const journey = () => {
        const mark = document.querySelector(".a0-mark");
        const from = sprout.getBoundingClientRect();
        const box = mark?.getBoundingClientRect();
        if (!box?.width || !from.width) return null;
        return {
          x: box.left + ((MUSH.x + MUSH_POP.x + MUSH.w / 2) / LOGO.w) * box.width - (from.left + from.width / 2),
          y: box.top + ((MUSH.y + MUSH_POP.y + MUSH.h / 2) / LOGO.h) * box.height - (from.top + from.height / 2),
          scale: ((MUSH.w / LOGO.w) * box.width) / from.width,
        };
      };

      let going: ReturnType<typeof journey> = null;
      let handing: gsap.core.Tween | null = null;
      let placed = -1;
      const follow = (p: number) => {
        if (p === placed) return;
        placed = p;
        if (p < LEAVES) {
          if (!going) return;
          going = null;
          handing?.kill();
          handing = null;
          delete sprout.dataset.out;
          gsap.set(sprout, { clearProps: "transform,opacity,color" });
          gsap.set(cap, { yPercent: 118 });
          waiting.restart(true);
          return;
        }
        if (!going) {
          waiting.pause();
          sprout.dataset.out = ""; // out of the ground, and out of what clipped it
          gsap.set(cap, { yPercent: 0 });
          going = journey();
          if (!going) return;
        }
        const run = at(p, LEAVES, ARRIVES);
        const t = glide(run);
        // it hops its way over, the arcs flattening as it gets there, and takes the logo's colour
        const hop = Math.abs(Math.sin(run * Math.PI * HOPS)) * RISE * (1 - run * 0.7);
        gsap.set(sprout, {
          x: going.x * t,
          y: going.y * t - hop,
          scale: 1 + (going.scale - 1) * t,
          rotation: Math.sin(run * Math.PI * HOPS * 2) * 8,
          color: gsap.utils.interpolate(GROUND, LOGO_INK, Math.min(1, run * 1.4)),
        });
        // in place, waiting for the logo's own mushroom to pop in under it
        if (run >= 1 && !handing) {
          handing = gsap.to(sprout, { opacity: 0, duration: 0.25, delay: HANDOVER, ease: "none" });
        }
      };

      return followProgress(follow);
    },
    { scope: cue },
  );

  return (
    <>
      <div className="a0-cue" aria-hidden="true" ref={cue}>
        <span>{text}</span>
      </div>
      {/* the ground it comes out of is the clip: it waits below the line until it pushes up. It is
          its own element, outside the cue, because the scroll fades the cue and the mushroom leaves
          on the same scroll instead. */}
      <div className="a0-mush" aria-hidden="true" ref={mush}>
        <svg viewBox={`${MUSH.x} ${MUSH.y} ${MUSH.w} ${MUSH.h}`} fill="currentColor" aria-hidden="true">
          <path d="M119.53 180.75C114.68 178.02 112.85 171.65 114.68 165.29C118 155.27 128.93 149.22 140.14 148.61C152.58 148 163.48 154.97 168.03 164.68C171.97 173.16 169.25 180.45 161.68 181.36C155.31 182.25 151.62 180.36 150.06 176.98C154.75 178.29 158.63 175.59 159.25 171.96C160.26 166.02 153.24 159.55 148.03 158.69C140.74 157.49 136.52 160.41 135.59 167.08C134.39 175.27 143.38 178.5 149.45 183.35C155.52 188.2 155.6 194.09 154.09 199.24C152.88 203.48 146.81 205.3 141.96 203.79C137.11 202.26 136.19 200.14 136.19 195.59C136.19 192.27 135.59 188.92 135.59 186.2C135.59 182.87 134.39 181.05 131.34 181.36C127.4 182.57 122.55 182.57 119.53 180.75Z" />
        </svg>
      </div>
    </>
  );
}
