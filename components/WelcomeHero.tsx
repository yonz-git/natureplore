"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// The line the welcome opens on. Each letter swings up from its bottom left corner, one after
// another, so the sentence writes itself rather than arriving. SplitText makes the letters and puts
// the text back as it was when this goes away, so what a reader's software sees is the sentence.
// Where it sits and how the scroll takes it away: .a0-hero in app/welcome.css.

export default function WelcomeHero({ text }: { text: string }) {
  const line = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = line.current;
      if (!el) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const split = SplitText.create(el, { type: "chars" });
      if (reduce) {
        gsap.from(split.chars, { opacity: 0, duration: 0.4, stagger: 0.01 });
        return;
      }
      gsap.from(split.chars, {
        rotationZ: -90,
        transformOrigin: "bottom left",
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { scope: line },
  );

  return (
    <p className="a0-hero" aria-hidden="true" ref={line}>
      {text}
    </p>
  );
}
