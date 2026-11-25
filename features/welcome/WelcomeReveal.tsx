"use client";

import { useEffect, useRef } from "react";

const SETTLE = 120;

export default function WelcomeReveal() {
  const circle = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = circle.current!;
    const p = photo.current!;
    const usable = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
    if (!matchMedia(usable).matches) return;
    const stage = c.closest(".a02")!;
    const half = c.offsetWidth / 2;

    let toX = 0;
    let toY = 0;
    let x = 0;
    let y = 0;
    let placed = false;
    let last = 0;
    let raf = 0;
    const frame = (now: number) => {
      const step = 1 - Math.exp(-(last ? now - last : 16) / SETTLE);
      x = placed ? x + (toX - x) * step : toX;
      y = placed ? y + (toY - y) * step : toY;
      placed = true;
      const there = Math.abs(toX - x) + Math.abs(toY - y) < 0.5;
      const px = Math.round(x);
      const py = Math.round(y);
      c.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      p.style.transform = `translate3d(${-px}px, ${-py}px, 0)`;
      last = there ? 0 : now;
      raf = there ? 0 : requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const box = stage.getBoundingClientRect();
      toX = e.clientX - box.left - half;
      toY = e.clientY - box.top - half;
      c.dataset.on = "";
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const leave = () => delete c.dataset.on;
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={circle} className="a0-reveal">
      <div ref={photo} className="a0-reveal-photo" />
    </div>
  );
}
