"use client";

import { useEffect } from "react";

// The welcome page's scroll progress, 0 to 1, written as --a0-p on every element app/welcome.css scrubs
// with it. The value chases the real scroll position instead of jumping to it, so a mouse wheel's steps
// come out as one glide. The scrolling itself stays native.
// It also grows the circle the photograph opens in (the lens, the photograph inside it, the rim): sizes
// and timing are in app/welcome.css, this only sets three scales.

const SETTLE = 140; // ms, the time constant of the chase: about 95% of the way after three of these

export default function WelcomeScroll() {
  useEffect(() => {
    const root = document.querySelector(".a0s");
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scrubbed = [...root.querySelectorAll<HTMLElement>("*")].filter((el) =>
      getComputedStyle(el).animationName.includes("a0s-"),
    );

    const lens = root.querySelector<HTMLElement>(".a0-lens")!;
    const photo = root.querySelector<HTMLElement>(".a02-photo")!;
    const orb = root.querySelector<HTMLElement>(".a0-orb")!;
    const num = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name));
    const from = num(lens, "--a0-s");
    const to = num(lens, "--a0-e");
    const rim = num(orb, "--a0-rim");

    let shown = NaN; // nothing shown yet: the first frame goes straight to where the page is
    let last = 0; // 0 while asleep: a frame that wakes the chase has no earlier frame to measure from
    let raf = 0;
    const frame = (now: number) => {
      const target = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const dt = last ? now - last : 16;
      shown = Number.isNaN(shown) ? target : shown + (target - shown) * (1 - Math.exp(-dt / SETTLE));
      if (Math.abs(target - shown) < 0.0002) shown = target;
      for (const el of scrubbed) el.style.setProperty("--a0-p", shown.toFixed(4));
      const open = Math.min(1, Math.max(0, (shown - from) / (to - from)));
      const scale = Math.max(open, 0.002);
      lens.style.transform = `scale(${scale})`;
      photo.style.transform = `scale(${1 / scale})`;
      orb.style.transform = `scale(${scale * rim})`;
      lens.style.visibility = open > 0 ? "visible" : "hidden";
      orb.style.visibility = open > 0 && open < 1 ? "visible" : "hidden"; // at the end the rim is far off the page
      last = shown === target ? 0 : now;
      raf = last ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    wake();
    return () => {
      removeEventListener("scroll", wake);
      removeEventListener("resize", wake);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
