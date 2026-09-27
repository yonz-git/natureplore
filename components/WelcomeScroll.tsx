"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { publishProgress } from "@/lib/welcome-progress";

// The welcome page's scroll progress, 0 to 1, written as --a0-p on every element app/welcome.css scrubs
// with it. The value chases the real scroll position instead of jumping to it, so a mouse wheel's steps
// come out as one glide. The scrolling itself stays native.
// It also grows the circle the photograph opens in (the lens, the photograph inside it, the rim): sizes
// and timing are in app/welcome.css, this only sets three scales, through GSAP.
// The circle opens where the reader is looking: on the frame it starts, the centre is moved to the
// pointer, the same place components/WelcomeReveal.tsx has been showing the photograph through. The
// centre is held there for the whole opening, so the circle grows rather than drifts, and it is given
// back when the scroll returns to the top, ready for wherever the pointer is the next time.
// Without a pointer, on a touch screen or a keyboard, the centre stays where app/welcome.css puts it.
// The same progress goes to lib/welcome-progress.ts, where components/WelcomeLogo.tsx picks it up to
// build the logo under the scroll.

const SETTLE = 140; // ms, the time constant of the chase: about 95% of the way after three of these

export default function WelcomeScroll() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>(".a0s");
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scrubbed = [...root.querySelectorAll<HTMLElement>("*")].filter((el) =>
      getComputedStyle(el).animationName.includes("a0s-"),
    );

    const stage = root.querySelector<HTMLElement>(".a02")!;
    const lens = root.querySelector<HTMLElement>(".a0-lens")!;
    const photo = root.querySelector<HTMLElement>(".a02-photo")!;
    const orb = root.querySelector<HTMLElement>(".a0-orb")!;
    const num = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name));
    const from = num(lens, "--a0-s");
    const to = num(lens, "--a0-e");
    const rim = num(orb, "--a0-rim");

    // where the pointer is, kept as it moves; a touch says nothing about where someone is looking
    let pointer: { x: number; y: number } | null = null;
    const remember = (e: PointerEvent) => {
      if (e.pointerType !== "touch") pointer = { x: e.clientX, y: e.clientY };
    };

    // The centre of the circle, in the stage's own pixels: taken on the frame it starts to open and
    // held until the scroll is back at the top. The photograph is placed and counter-scaled around
    // this same point, from here rather than from the CSS, because GSAP takes an element's translate
    // into its own transform the first time it sets one: a translate left to a custom property would
    // be read once and then never again, and the photograph would slide as the circle grew.
    const read = (name: string, of: number) => {
      const v = getComputedStyle(root).getPropertyValue(name).trim();
      return v.endsWith("%") ? (parseFloat(v) / 100) * of : parseFloat(v) || 0;
    };
    let centred = false;
    let centreX = 0;
    let centreY = 0;
    const centre = () => {
      const box = stage.getBoundingClientRect();
      if (!box.width || !box.height) return;
      centred = true;
      if (pointer) {
        gsap.set(root, {
          "--a0-cx": `${(((pointer.x - box.left) / box.width) * 100).toFixed(2)}%`,
          "--a0-cy": `${(((pointer.y - box.top) / box.height) * 100).toFixed(2)}%`,
        });
      }
      centreX = read("--a0-cx", box.width);
      centreY = read("--a0-cy", box.height);
    };
    const uncentre = () => {
      centred = false;
      gsap.set(root, { clearProps: "--a0-cx,--a0-cy" });
    };

    // when the opening has played out the page stops being a scroller (app/welcome.css, a0-done):
    // the circle and its rim are finished with, and what they left behind is theirs to clear
    const finish = () => {
      gsap.set([lens, photo, orb], { clearProps: "transform,translate,rotate,scale" });
      for (const el of [lens, photo, orb]) el.style.visibility = "";
    };

    let shown = NaN; // nothing shown yet: the first frame goes straight to where the page is
    let last = 0; // 0 while asleep: a frame that wakes the chase has no earlier frame to measure from
    let raf = 0;
    const frame = (now: number) => {
      if (root.classList.contains("a0-done")) return finish();
      const target = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const dt = last ? now - last : 16;
      shown = Number.isNaN(shown) ? target : shown + (target - shown) * (1 - Math.exp(-dt / SETTLE));
      if (Math.abs(target - shown) < 0.0002) shown = target;
      for (const el of scrubbed) el.style.setProperty("--a0-p", shown.toFixed(4));
      publishProgress(shown);
      const open = Math.min(1, Math.max(0, (shown - from) / (to - from)));
      if (open > 0 && !centred) centre();
      else if (open <= 0 && centred) uncentre();
      const scale = Math.max(open, 0.002);
      gsap.set(lens, { scale });
      gsap.set(photo, {
        x: -centreX,
        y: -centreY,
        scale: 1 / scale,
        transformOrigin: `${centreX}px ${centreY}px`,
      });
      gsap.set(orb, { scale: scale * rim });
      lens.style.visibility = open > 0 ? "visible" : "hidden";
      orb.style.visibility = open > 0 && open < 1 ? "visible" : "hidden"; // at the end the rim is far off the page
      last = shown === target ? 0 : now;
      raf = last ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    // the centre is in pixels, so a window that changes size has to have it again
    const remeasure = () => {
      if (centred) centre();
      wake();
    };
    addEventListener("pointermove", remember, { passive: true });
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", remeasure);
    wake();
    return () => {
      removeEventListener("pointermove", remember);
      removeEventListener("scroll", wake);
      removeEventListener("resize", remeasure);
      cancelAnimationFrame(raf);
    };
  });
  return null;
}
