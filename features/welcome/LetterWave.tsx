"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const LIFT = 0.15;
const RISE = 0.4;
const STAGGER = 0.06;
const REST = 0.6;

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
      let wave: gsap.core.Timeline | null = null;
      let settle: gsap.core.Tween | null = null;

      const over = contextSafe((e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        settle?.kill();
        wave?.kill();
        wave = gsap.timeline({ repeat: -1, repeatDelay: REST }).to(split.chars, {
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
