"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import { buildIntro, WELCOME_PACE } from "@/lib/intro-timeline";

// A test bench, not a screen of the app: plays the welcome's logo timeline frame by frame and writes
// every piece's transform, opacity and reveal into the page as JSON, for the 3D logo in
// video/logo-3d (motion.json, read by build.py --film). Open /lab/intro-sample.

const FPS = 30;
const FRAMES = 300;
// the 3D logo's pieces and the element that carries each one's whole transform
const PIECES: Record<string, string> = {
  "fronds-top": ".p-top", "fronds-middle": ".p-mid", "fronds-left": ".p-bl", "fronds-right": ".p-br",
  wing: ".wing", bird: ".bird .body", mushroom: ".mushroom", eye: ".eye",
  "n-swan@body": ".swan > g", "n-swan@head": ".swanhead",
  a: 'g[clip-path="url(#c-a)"]', t: 'g[clip-path="url(#c-t)"]', u: 'g[clip-path="url(#c-u)"]',
  "snake-tongue": ".flick",
  "r-snake-head@neck": '.snakeneck g[clip-path="url(#sn-neckbox)"]',
  "r-snake-head@head": '.snakehead g[clip-path="url(#sn-headbox)"]',
  "leaf-e": ".leafe",
  p: 'g[clip-path="url(#c-p)"]', l: 'g[clip-path="url(#c-l)"]', o: 'g[clip-path="url(#c-o)"]',
  r: 'g[clip-path="url(#c-r)"]', e: 'g[clip-path="url(#c-e)"]',
  "squirrel@body": ".squirrel > g", "squirrel@tail": ".sqtail",
};

export default function IntroSample() {
  const ref = useRef<HTMLDivElement>(null);
  const [out, setOut] = useState("");
  useEffect(() => {
    const root = ref.current!;
    const intro = buildIntro(root);
    const tl = intro.timeline;
    const svg = root.querySelector("svg") as SVGSVGElement;
    const els = Object.fromEntries(Object.entries(PIECES).map(([k, s]) => [k, root.querySelector(s) as SVGGraphicsElement]));
    const wr = Array.from(root.querySelectorAll(".wr")) as SVGRectElement[];
    const snakepath = root.querySelector(".snakepath") as SVGPathElement;
    const snakemask = root.querySelector(".snakemask") as SVGGElement;
    const spL = snakepath.getTotalLength();
    const opacity = (el: Element) => {
      let o = 1;
      for (let n: Element | null = el; n && n !== svg.parentElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || "1");
      return o;
    };
    const frames = [];
    for (let f = 0; f < FRAMES; f++) {
      tl.seek(Math.min((f / FPS) * WELCOME_PACE, tl.duration()), false);
      const inv = svg.getScreenCTM()!.inverse();
      const pieces: Record<string, number[]> = {};
      for (const [k, el] of Object.entries(els)) {
        const m = inv.multiply(el.getScreenCTM()!);
        pieces[k] = [m.a, m.b, m.c, m.d, m.e, m.f, opacity(el)].map((v) => +v.toFixed(5));
      }
      const reveal = (r: SVGRectElement) => +r.getAttribute("x")! + +r.getAttribute("width")! * (gsap.getProperty(r, "scaleX") as number);
      const masked = snakemask.getAttribute("mask") !== "none";
      frames.push({
        t: +((f / FPS) * WELCOME_PACE).toFixed(4), pieces,
        reveal: { a: reveal(wr[0]), t: reveal(wr[1]),
          snake: masked ? Math.max(0, spL - parseFloat(String(gsap.getProperty(snakepath, "strokeDashoffset")))) : 1e6 },
      });
    }
    const path = [];
    for (let s = 0; s <= spL; s += 2) { const p = snakepath.getPointAtLength(s); path.push([+p.x.toFixed(2), +p.y.toFixed(2), s]); }
    setOut(JSON.stringify({ fps: FPS, pace: WELCOME_PACE, swayFrom: 4.5, duration: tl.duration(), snakePath: path, frames }));
    return () => intro.revert();
  }, []);
  return (
    <>
      <style>{".intro-logo * { animation: none !important; }"}</style>
      <div ref={ref} style={{ width: 1729.5, height: 425.2 }} dangerouslySetInnerHTML={{ __html: INTRO_LOGO_SVG }} />
      <pre id="motion" style={{ display: "none" }}>{out}</pre>
    </>
  );
}
