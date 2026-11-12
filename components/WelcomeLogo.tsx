"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import Logo from "@/components/Logo";
import { playIntro, WELCOME_OPENING, WELCOME_PACE, WELCOME_START } from "@/lib/intro-timeline";
import { PATTERN_IMG, followProgress } from "@/lib/welcome-progress";

const START = WELCOME_START;
const PACE = WELCOME_PACE;
const SYM = { x: 0, y: 64.87, w: 283.81, h: 265.34 };
const LOGO = { w: 1729.5, h: 425.2 };
const HOLD = 0.58;
const DISSOLVE = 0.38;
const TRAVEL = 2.0;
const LOOP_R = 0.6;
const LOOP = Array.from({ length: 17 }, (_, i) => {
  const a = ((10 - i * 28.75) * Math.PI) / 180;
  return { x: LOOP_R * Math.cos(a), y: -0.12 + LOOP_R * Math.sin(a) };
});
const ROUTE = [
  { x: 0.772, y: 0.882 }, { x: 0.594, y: 0.9 }, { x: 0.475, y: 0.874 }, { x: 0.432, y: 0.777 },
  { x: 0.42, y: 0.633 }, { x: 0.422, y: 0.501 }, { x: 0.396, y: 0.37 }, { x: 0.327, y: 0.265 },
  { x: 0.218, y: 0.165 }, { x: 0.109, y: 0.087 }, { x: 0.04, y: 0.029 }, { x: 0, y: 0 },
];
type Pt = { x: number; y: number };
const rounded = (points: Pt[]) => [
  points[0],
  ...points.slice(0, -1).flatMap((a, i) => {
    const b = points[i + 1];
    return [
      { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
      { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 },
    ];
  }),
  points[points.length - 1],
];
const evenShrink = (to: number) => {
  const curve = gsap.parseEase("sine.inOut");
  if (Math.abs(to - 1) < 0.001) return curve;
  return (p: number) => (Math.pow(to, curve(p)) - 1) / (to - 1);
};
const FLAP = 0.44;
const OPENING = WELCOME_OPENING;
const SWAN = 2.0;
const EASE_BACK = 0.25;

export default function WelcomeLogo() {
  const mark = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = mark.current;
    const target = slot.current;
    if (!el || !target) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const fill = el.querySelector("#fieldfill");
    if (fill && !fill.querySelector(".pattern")) {
      const { href, x, y, w, h } = PATTERN_IMG;
      fill.insertAdjacentHTML("beforeend",
        `<image class="pattern" href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" />`);
    }
    el.dataset.pattern = "";
    const stage = el.closest(".a0s");
    let travel: gsap.core.Timeline | undefined;
    let done = false;
    const corner = () => {
      const box = el.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const width = (SYM.w / LOGO.w) * box.width;
      if (!width || !to.width) return null;
      const cx = box.left + ((SYM.x + SYM.w / 2) / LOGO.w) * box.width;
      const cy = box.top + ((SYM.y + SYM.h / 2) / LOGO.h) * box.height;
      const scale = to.width / width;
      const under = (of: number, point: number) => of + (point - of) * scale;
      return {
        x: to.left + to.width / 2 - under(box.left + box.width / 2, cx),
        y: to.top + to.height / 2 - under(box.top + box.height / 2, cy),
        scale,
        width,
        off: { x: cx - (box.left + box.width / 2), y: cy - (box.top + box.height / 2) },
        room: cx - to.left,
        reach: { x: to.left + to.width / 2 - cx, y: to.top + to.height / 2 - cy },
      };
    };
    const fly = () => {
      const letters = el.querySelectorAll(".wordmark > *");
      const landing = corner();
      const open = () => {
        done = true;
        stage?.classList.add("a0-open", "a0-done");
        scrollTo(0, 0);
      };
      if (!landing) return open();
      const w = landing.width;
      const loopX = Math.max(-LOOP_R * w, LOOP_R * w - landing.room);
      const marks: Pt[] = [
        ...LOOP.map((p) => ({ x: loopX + p.x * w, y: p.y * w })),
        ...ROUTE.map((f) => ({ x: landing.reach.x * (1 - f.x), y: landing.reach.y * (1 - f.y) })),
      ];
      let path = marks;
      for (let round = 0; round < 4; round++) {
        const steps = path.map((p, i) => (i ? Math.hypot(p.x - path[i - 1].x, p.y - path[i - 1].y) : 0));
        const total = steps.reduce((a, b) => a + b, 0) || 1;
        let run = 0;
        path = marks.map((m, i) => {
          run += steps[i];
          const s = Math.pow(landing.scale, run / total);
          return { x: m.x - landing.off.x * (s - 1), y: m.y - landing.off.y * (s - 1) };
        });
      }
      path = rounded(rounded([{ x: 0, y: 0 }, ...path]));
      const wing = el.querySelector(".wing");
      const flyAt = HOLD + DISSOLVE * 0.6;
      travel = gsap
        .timeline({ onComplete: open })
        .to(
          letters,
          {
            y: -18,
            opacity: 0,
            scale: 0.86,
            rotation: () => gsap.utils.random(-14, 14),
            transformOrigin: "50% 100%",
            stagger: { each: 0.022, from: "start" },
            duration: DISSOLVE,
            ease: "power2.in",
          },
          HOLD,
        )
        .to(el, { duration: TRAVEL, ease: "sine.inOut", motionPath: { path, curviness: 1 } }, flyAt)
        .to(el, { scale: landing.scale, duration: TRAVEL, ease: evenShrink(landing.scale) }, flyAt)
        .to(wing, {
          keyframes: [{ rotation: -12, duration: 0.12 }, { rotation: 22, duration: 0.18 }, { rotation: 0, duration: 0.14 }],
          ease: "sine.inOut",
          repeat: Math.max(0, Math.round(TRAVEL / FLAP) - 1),
        }, flyAt);
    };

    const intro = playIntro(el, { onWarm() {}, onOpen() {}, onFly: fly }, true);
    intro.timeline.pause(0);
    intro.timeline.timeScale(PACE * OPENING);
    let settle: gsap.core.Tween | undefined;
    intro.timeline.call(() => {
      settle = gsap.to(intro.timeline, { timeScale: PACE, duration: EASE_BACK, ease: "sine.inOut" });
    }, undefined, SWAN);

    const rewind = () => {
      settle?.kill();
      intro.timeline.timeScale(PACE * OPENING);
      travel?.kill();
      travel = undefined;
      intro.timeline.pause(0);
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      gsap.set(el.querySelectorAll(".wordmark > *"), { clearProps: "opacity,transform" });
      delete el.dataset.ready;
      el.querySelector(".sway")?.classList.remove("swaying");
      stage?.classList.remove("a0-open", "a0-done");
    };

    let started = false;
    const unfollow = followProgress((p) => {
      if (done) return;
      if (p >= START) {
        if (started) return;
        started = true;
        el.dataset.ready = "";
        intro.timeline.play();
      } else if (started) {
        started = false;
        rewind();
      }
    });

    const resize = () => {
      if (!done) return;
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      const landing = corner();
      if (landing) gsap.set(el, { x: landing.x, y: landing.y, scale: landing.scale });
    };
    addEventListener("resize", resize);

    return () => {
      removeEventListener("resize", resize);
      unfollow();
      travel?.kill();
      settle?.kill();
      intro.revert();
      stage?.classList.remove("a0-open", "a0-done");
    };
  }, { scope: mark });

  return (
    <>
      <div className="a0-mark" ref={mark} aria-hidden="true" dangerouslySetInnerHTML={{ __html: INTRO_LOGO_SVG }} />
      {}
      <div className="a0-mark-slot a0-mark-corner" ref={slot} aria-hidden="true" />
      {}
      <div className="a0-mark-lit a0-mark-corner" aria-hidden="true">
        <Logo symbol />
      </div>
    </>
  );
}
