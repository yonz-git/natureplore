"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { publishProgress } from "@/lib/welcome-progress";

const SETTLE = 140;

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
    const num = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name));
    const from = num(lens, "--a0-s");
    const to = num(lens, "--a0-e");

    let pointer: { x: number; y: number } | null = null;
    const remember = (e: PointerEvent) => {
      if (e.pointerType !== "touch") pointer = { x: e.clientX, y: e.clientY };
    };

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

    const finish = () => {
      gsap.set([lens, photo], { clearProps: "transform,translate,rotate,scale" });
      for (const el of [lens, photo]) el.style.visibility = "";
    };

    let shown = NaN;
    let last = 0;
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
      lens.style.visibility = open > 0 ? "visible" : "hidden";
      last = shown === target ? 0 : now;
      raf = last ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
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
