"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import { warpText } from "@/lib/text-warp";

gsap.registerPlugin(SplitText);

// The line the welcome opens on. Each letter swings up from its bottom left corner, one after
// another, so the sentence writes itself rather than arriving. SplitText makes the letters and puts
// the text back as it was when this goes away, so what a reader's software sees is the sentence.
// Where it sits and how the scroll takes it away: .a0-hero in app/welcome.css. On a phone each of
// `lines` is a line of its own; wider, they run on as one.

export default function WelcomeHero({ lines }: { lines: string[] }) {
  const line = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = line.current;
      if (!el) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      // split into words as well, so a line can end after a word; SplitText drops a <br> written in
      // the text, so the breaks go in after it has split, and its revert takes them out again
      const split = SplitText.create(el, { type: "words,chars" });
      let word = -1;
      lines.slice(0, -1).forEach((line) => {
        word += line.split(" ").length;
        const br = document.createElement("br");
        br.className = "a0-hero-br";
        split.words[word]?.after(br);
      });
      if (reduce) {
        gsap.from(split.chars, { opacity: 0, duration: 0.4, stagger: 0.01 });
        return;
      }
      // once the letters have landed, the line is handed to the warp under the mouse (lib/text-warp.ts):
      // mouse and pen only
      const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
      let warp: ReturnType<typeof warpText> = null;
      let gone = false;
      const hand = async () => {
        await document.fonts.ready;
        if (gone || !fine) return;
        const chars = split.chars as HTMLElement[];
        warp = warpText(el, chars);
        if (warp) gsap.ticker.add(warp.frame);
      };
      gsap.from(split.chars, {
        rotationZ: -90,
        transformOrigin: "bottom left",
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => void hand(),
      });
      return () => {
        gone = true;
        if (warp) {
          gsap.ticker.remove(warp.frame);
          warp.stop();
        }
      };
    },
    { scope: line, dependencies: [lines.join("|")] },
  );

  return (
    <p className="a0-hero" aria-hidden="true" ref={line}>
      {lines.join(" ")}
    </p>
  );
}
