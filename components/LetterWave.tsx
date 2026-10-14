"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// A label whose letters ride one small wave when the pointer comes onto the control around it: each
// letter bobs up and back down once, one after another from the first, so a single ripple runs
// along the word and stops. Leaving before it has run settles them back onto the line.
// Mouse and pen only, and nothing under reduced motion; there the label is plain text. A reader's
// software gets the plain text either way, the split letters are decoration.

const LIFT = 0.15; // of the font size, how high a letter rises
const RISE = 0.4; // seconds, a letter going up (and again coming down)
const STAGGER = 0.06; // seconds between one letter and the next

export default function LetterWave({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const control = el?.closest<HTMLElement>("a, button");
      if (!el || !control || !contextSafe) return;
      const mq = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
      if (!mq.matches) return;
      const split = SplitText.create(el, { type: "chars", aria: "none" });
      let wave: gsap.core.Tween | null = null;
      let settle: gsap.core.Tween | null = null;

      const over = contextSafe((e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        settle?.kill();
        wave?.kill();
        wave = gsap.to(split.chars, {
          y: -LIFT * parseFloat(getComputedStyle(el).fontSize),
          duration: RISE,
          ease: "sine.inOut",
          stagger: { each: STAGGER, from: "start", repeat: 1, yoyo: true },
        });
      });
      const out = contextSafe((e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        wave?.kill();
        wave = null;
        settle = gsap.to(split.chars, { y: 0, duration: 0.3, ease: "sine.out", overwrite: true });
      });

      control.addEventListener("pointerenter", over);
      control.addEventListener("pointerleave", out);
      return () => {
        control.removeEventListener("pointerenter", over);
        control.removeEventListener("pointerleave", out);
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </>
  );
}
