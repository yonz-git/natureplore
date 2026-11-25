// the photo zoom, sway and drift stay in CSS: a per-frame GSAP transform makes Chrome drop letters

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export const MUSH_IN = 1.9;
export const MUSH_POP = { x: 463, y: 578 };
const MUSH_JUMPS = [2.3, 2.95];
const BREEZE_FROM = 3.0;
const BREEZE_TO = 9.5;
const SHAKE = 0.15;
const PLANT_HOPS = 0.5;
const PLANT_HOP = 0.78;
const WARM = 5.1;
const OPEN = 6.0;
const FLY = 8.0;

export const WELCOME_PACE = 2.109;
export const WELCOME_OPENING = 1;
export const WELCOME_START = 0.17;

export type IntroBeats = { onWarm: () => void; onOpen: () => void; onFly: () => void };

const NO_BEATS: IntroBeats = { onWarm() {}, onOpen() {}, onFly() {} };
export function buildIntro(root: HTMLElement) {
  return playIntro(root, NO_BEATS, true);
}

const BIRD = [
  { x: -1991.2, y: -1074.3 }, { x: -1671.2, y: -1034.3 }, { x: -1440.8, y: -1093.9 },
  { x: -1195.5, y: -1132.7 }, { x: -1171.6, y: -1116.7 }, { x: -1180.7, y: -1091.5 },
  { x: -1203.1, y: -1028.3 }, { x: -1201.6, y: -953.8 }, { x: -1122.5, y: -880.6 },
  { x: -917.7, y: -889.3 }, { x: -820.6, y: -875.2 }, { x: -815.4, y: -816.1 },
  { x: -811.8, y: -735.4 }, { x: -790.8, y: -677.1 }, { x: -697.7, y: -674.5 },
  { x: -657.3, y: -639.2 }, { x: -655.3, y: -631.5 }, { x: -425.1, y: -542.8 },
  { x: -223.7, y: -367.8 }, { x: -77.9, y: -155.9 }, { x: 0, y: 0 },
];

export function playIntro(root: HTMLElement, beats: IntroBeats, paused = false) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let whole: gsap.core.Timeline;
  const q = (s: string) => root.querySelector(s) as SVGGraphicsElement;
  const qa = (s: string) => Array.from(root.querySelectorAll(s));
  const sway = q(".sway");

  const ctx = gsap.context(() => {
    const photo = q(".intro-photo"), veil = q(".intro-veil"), logo = q(".intro-logo");
    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, paused });
    whole = tl;

    if (photo) tl.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power3.out" }, 0);
    if (veil) tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0);
    if (reduce) {
      tl.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0.6);
      tl.call(beats.onWarm, undefined, 1.0);
      tl.call(beats.onOpen, undefined, 1.6);
      tl.call(beats.onFly, undefined, 2.2);
      return;
    }
    tl.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0);

    const plant = q(".plant"), pTop = q(".p-top"), pMid = q(".p-mid"), pBl = q(".p-bl"), pBr = q(".p-br");
    const bird = q(".bird"), wing = q(".wing"), mush = q(".mushroom"), symbol = q(".symbol");
    const swan = q(".swan"), leafe = q(".leafe"), flick = q(".flick"), squirrel = q(".squirrel");
    const wr = qa(".wr");

    gsap.set([pTop, pMid, pBl, pBr], { svgOrigin: "141 330" });
    gsap.set(plant, { svgOrigin: "141 330" });
    gsap.set(wing, { svgOrigin: "141 104" });
    gsap.set(bird, { svgOrigin: "157 103" });
    gsap.set(mush, { svgOrigin: "142 205" });
    gsap.set(symbol, { svgOrigin: "142 197" });
    gsap.set(leafe, { svgOrigin: "1108 101" });
    gsap.set(squirrel, { svgOrigin: "718.6 140.9" });
    gsap.set(wr, { transformOrigin: "0% 50%", scaleX: 0 });

    gsap.set(bird, { opacity: 0, x: BIRD[0].x, y: BIRD[0].y, rotation: -12 });
    gsap.set(mush, { opacity: 0, scale: 0, ...MUSH_POP });
    gsap.set(plant, { x: -975, y: 940, scale: 0.35 });
    gsap.set([pBl, pBr, pMid, pTop], { scale: 0.05, opacity: 0 });
    gsap.set(swan, { y: 330, opacity: 0 });
    gsap.set(leafe, { scale: 0.05, rotation: -35, opacity: 0 });
    gsap.set(squirrel, { opacity: 0 });

    tl.to(bird, { opacity: 1, duration: 0.3, ease: "sine.out" }, 0.6);
    tl.to(bird, { duration: 5.0, ease: "sine.inOut", motionPath: { path: BIRD, curviness: 1.4 } }, 0.6);
    tl.to(bird, { keyframes: [{ rotation: 8, duration: 1.05 }, { rotation: -10, duration: 1.15 }, { rotation: 6, duration: 1.05 }, { rotation: -6, duration: 0.95 }, { rotation: 0, duration: 0.8 }], ease: "sine.inOut" }, 0.6);
    tl.to(wing, { keyframes: [{ rotation: -24, duration: 0.1 }, { rotation: 44, duration: 0.15 }, { rotation: 0, duration: 0.11 }], ease: "sine.inOut", repeat: 13 }, 0.6);

    tl.to(mush, { opacity: 1, duration: 0.12, ease: "sine.out" }, MUSH_IN);
    tl.to(mush, { scale: 1, duration: 0.45, ease: "back.out(2.4)" }, MUSH_IN);
    let from = MUSH_POP;
    const jump = (at: number, to: { x: number; y: number }, rise: number, tilt: number) => {
      const apex = Math.min(from.y, to.y) - rise;
      from = to;
      tl.to(mush, { x: to.x, duration: 0.54, ease: "none" }, at + 0.12);
      tl.to(mush, { scaleX: 1.16, scaleY: 0.84, duration: 0.12, ease: "power1.out" }, at);
      tl.to(mush, { scaleX: 0.92, scaleY: 1.12, duration: 0.1, ease: "power1.out" }, at + 0.12);
      tl.to(mush, { y: apex, duration: 0.26, ease: "power2.out" }, at + 0.12);
      tl.to(mush, { rotation: tilt, duration: 0.38, ease: "sine.inOut" }, at + 0.12);
      tl.to(mush, { y: to.y, duration: 0.28, ease: "power2.in" }, at + 0.38);
      tl.to(mush, { scaleX: 1.2, scaleY: 0.8, duration: 0.08, ease: "power1.in" }, at + 0.58);
      tl.to(mush, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" }, at + 0.66);
      tl.to(mush, { rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" }, at + 0.66);
    };
    jump(MUSH_JUMPS[0], { x: MUSH_POP.x / 2, y: MUSH_POP.y / 2 }, 100, -8);
    jump(MUSH_JUMPS[1], { x: 0, y: 0 }, 130, -10);

    const fronds = [[pBl, pBr], pMid, pTop];
    fronds.forEach((f, i) => {
      tl.to(f, { opacity: 1, duration: 0.4, ease: "sine.out" }, i * 0.22);
      tl.to(f, { scale: 1, duration: 1.1, ease: "power3.out" }, i * 0.22);
    });
    const L = [[-975, 940, 0.35], [-490, 470, 0.66], [0, 0, 1]];
    let t0 = PLANT_HOPS;
    for (let h = 0; h < L.length - 1; h++) {
      const a = L[h], b = L[h + 1], s = b[2], air = PLANT_HOP;
      const top = { x: (a[0] + b[0]) / 2, y: Math.min(a[1], b[1]) - 200 };
      if (h === 0) tl.to(plant, { scaleX: a[2] * 1.03, scaleY: a[2] * 0.96, duration: 0.16, ease: "sine.inOut" }, t0 - 0.16);
      tl.to(plant, { motionPath: { path: [top, { x: b[0], y: b[1] }], curviness: 1 }, duration: air, ease: "sine.inOut" }, t0);
      tl.to(plant, { scaleX: s, scaleY: s, duration: air, ease: "sine.inOut" }, t0);
      const land = t0 + air;
      tl.to(plant, { scaleX: s * 1.03, scaleY: s * 0.96, duration: 0.14, ease: "sine.out" }, land);
      if (h === L.length - 2) tl.to(plant, { scaleX: s, scaleY: s, duration: 0.4, ease: "sine.inOut" }, land + 0.14);
      [pMid, pTop].forEach((f, i) => {
        tl.to(f, { rotation: 2.5 + i * 1.5, duration: 0.16, ease: "sine.out" }, land + i * 0.05);
        tl.to(f, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, land + 0.16 + i * 0.05);
      });
      t0 = land + 0.14;
    }
    const BREEZE = [
      { f: [pBl, pBr], foot: "141 330", lean: 3, swing: 1.3, lag: 0 },
      { f: pMid, foot: "141 268", lean: 2.5, swing: 1.5, lag: 0.2 },
      { f: pTop, foot: "141 228", lean: 2, swing: 1.7, lag: 0.4 },
    ];
    BREEZE.forEach(({ f, foot, lean, swing, lag }) => {
      const from = BREEZE_FROM + lag;
      const sways = Math.max(1, Math.floor((BREEZE_TO - from - swing) / swing));
      tl.set(f, { svgOrigin: foot }, from);
      tl.to(f, { rotation: lean, duration: swing / 2, ease: "sine.out" }, from);
      tl.to(f, { rotation: -lean, duration: swing, ease: "sine.inOut", repeat: sways - 1, yoyo: true }, ">");
      tl.to(f, { rotation: 0, duration: swing / 2, ease: "sine.inOut" }, ">");
    });

    tl.to(symbol, { scale: 1.05, duration: 0.25, ease: "sine.out" }, 5.65);
    tl.to(symbol, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, ">");

    tl.to(swan, { opacity: 1, duration: 0.35, ease: "sine.out" }, 3.2);
    tl.to(swan, { y: 0, duration: 1.3, ease: "power3.out" }, 3.2);
    const shead = q(".swanhead");
    gsap.set(shead, { svgOrigin: "568 84", rotation: 28 });
    tl.to(shead, { rotation: 0, duration: 0.45, ease: "power2.out" }, 3.65);
    const turn = gsap.quickSetter(shead, "rotation");
    const lift = gsap.quickSetter(shead, "y");
    const wave = { t: 0 };
    tl.to(wave, {
      t: 8 * SHAKE,
      duration: 8 * SHAKE,
      ease: "none",
      onUpdate: () => {
        const t = wave.t;
        const size = (1 - Math.exp(-t / 0.04)) * Math.exp(-t * 3.2);
        const swing = Math.sin((Math.PI * t) / SHAKE);
        turn(17 * size * swing);
        lift(-4 * size * Math.abs(swing));
      },
    }, 4.1);
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    qa(".ripple").forEach((r, i) => {
      gsap.set(r, { svgOrigin: `${r.getAttribute("cx")} ${r.getAttribute("cy")}` });
      tl.fromTo(r, { opacity: 0.75, scaleX: 0.3, scaleY: 0.3 }, { opacity: 0, scaleX: 4.2, scaleY: 1.6, duration: 1.3, ease: "power2.out" }, 3.3 + i * 0.3);
    });
    qa(".d1").forEach((d, i, arr) => {
      const ang = -Math.PI * (0.2 + (0.6 * i) / (arr.length - 1)) + (rnd() - 0.5) * 0.3, sp = 80 + rnd() * 100;
      const dx = Math.cos(ang) * sp, dy = Math.sin(ang) * sp * 1.5, t = 3.25 + rnd() * 0.3, dur = 0.55 + rnd() * 0.25;
      gsap.set(d, { x: (rnd() - 0.5) * 130, y: 0, scale: 0.6 + rnd() * 0.6 });
      tl.to(d, { opacity: 0.95, duration: 0.08 }, t);
      tl.to(d, { x: "+=" + dx, duration: dur, ease: "none" }, t);
      tl.to(d, { y: dy, duration: dur * 0.5, ease: "power2.out" }, t);
      tl.to(d, { y: 12, duration: dur * 0.5, ease: "power2.in" }, t + dur * 0.5);
      tl.to(d, { opacity: 0, scale: 0.2, duration: 0.18 }, t + dur - 0.14);
    });
    qa(".d2").forEach((d, i) => {
      const dir = i % 2 ? -1 : 1, dx = dir * (60 + rnd() * 90), up = -(20 + rnd() * 50), t = 4.1 + (Math.floor(i / 2) + 1) * SHAKE, dur = 0.45 + rnd() * 0.15;
      gsap.set(d, { x: dir * 10, y: (rnd() - 0.5) * 24, scale: 0.6 + rnd() * 0.6 });
      tl.to(d, { opacity: 0.95, duration: 0.05 }, t);
      tl.to(d, { x: "+=" + dx, duration: dur, ease: "power1.out" }, t);
      tl.to(d, { y: "+=" + up, duration: dur * 0.4, ease: "power2.out" }, t);
      tl.to(d, { y: "+=" + (90 + rnd() * 40), duration: dur * 0.6, ease: "power2.in" }, t + dur * 0.4);
      tl.to(d, { opacity: 0, scale: 0.2, duration: 0.16 }, t + dur - 0.12);
    });
    tl.call(() => sway.classList.add("swaying"), undefined, 4.5);
    // the drift waits: attribute transforms over an animating <use> make Chrome drop letters
    root.classList.add("intro-live");
    tl.eventCallback("onComplete", () => root.classList.remove("intro-live"));

    [4.1, 4.3].forEach((start, i) => tl.to(wr[i], { scaleX: 1, duration: 0.6, ease: "power3.out" }, start));
    const snakepath = root.querySelector(".snakepath") as SVGPathElement, snakemask = q(".snakemask");
    const spL = snakepath.getTotalLength();
    gsap.set(snakepath, { strokeDasharray: `${spL} ${spL + 120}`, strokeDashoffset: spL + 60 });
    gsap.set([wr[2], wr[3], wr[4]], { scaleX: 1.6, scaleY: 2.4 });
    tl.to(snakepath, { strokeDashoffset: 0, duration: 1.25, ease: "power1.inOut" }, 4.5);
    tl.set(snakemask, { attr: { mask: "none" } }, 5.8);
    tl.to(leafe, { opacity: 1, duration: 0.15 }, 4.9);
    tl.to(leafe, { scale: 1, rotation: 0, duration: 1.0, ease: "back.out(1.8)" }, 4.9);
    tl.to(leafe, { scaleY: 0.86, scaleX: 1.06, duration: 0.1, ease: "power1.out" }, 6.25);
    tl.to(leafe, { scaleY: 1.08, scaleX: 0.96, duration: 0.1, ease: "power1.out" }, 6.35);
    tl.to(leafe, { y: -42, duration: 0.22, ease: "power2.out" }, 6.35);
    tl.to(leafe, { y: 0, duration: 0.2, ease: "power2.in" }, 6.57);
    tl.to(leafe, { rotation: 9, duration: 0.42, ease: "sine.inOut" }, 6.35);
    tl.to(leafe, { scaleY: 0.88, scaleX: 1.1, duration: 0.07, ease: "power1.in" }, 6.77);
    tl.to(leafe, { scaleY: 1, scaleX: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }, 6.84);
    const plore = qa(".plore");
    gsap.set(wr.slice(5), { scaleX: 1 });
    gsap.set(plore, { y: 70, opacity: 0 });
    tl.to(plore, { opacity: 1, duration: 0.3, ease: "sine.out", stagger: 0.08 }, 5.9);
    tl.to(plore, { y: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.08 }, 5.9);
    tl.to(flick, { x: 6, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, 5.8);
    const snakehead = q(".snakehead"), eye = q(".eye");
    gsap.set([snakehead, flick], { svgOrigin: "1026 120" });
    tl.to([snakehead, flick], { rotation: 7, duration: 0.17, ease: "sine.inOut", yoyo: true, repeat: 5 }, 4.85);
    tl.to([snakehead, flick], { rotation: -5, duration: 0.35, ease: "power2.out" }, 5.7);
    tl.to([snakehead, flick], { rotation: 2, duration: 0.5, ease: "sine.inOut" }, 6.5);
    tl.to([snakehead, flick], { rotation: -2.5, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 7.0);
    tl.to([snakehead, flick], { rotation: 0, duration: 1.2, ease: "sine.inOut" }, 12.6);
    gsap.set(eye, { svgOrigin: "186.6 74" });
    [5.6, 8.4, 11.3].forEach((b) => tl.to(eye, { scaleY: 0.08, duration: 0.07, ease: "sine.inOut", yoyo: true, repeat: 1 }, b));

    const sq = gsap.timeline({ defaults: { ease: "power1.inOut" } });
    sq.set(squirrel, { x: -568.6, y: 195.1, rotation: -6 });
    sq.to(squirrel, { opacity: 1, duration: 0.15 }, 0);
    sq.to(squirrel, { x: -366.6, duration: 0.9, ease: "none" }, 0);
    sq.to(squirrel, { y: 186.1, duration: 0.075, ease: "sine.inOut", yoyo: true, repeat: 11 }, 0);
    sq.to(squirrel, { rotation: -3, duration: 0.15, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0);
    sq.to(squirrel, { x: -352.6, y: 159.1, rotation: -90, duration: 0.28 }, 0.9);
    sq.to(squirrel, { x: -346.6, y: 59.1, rotation: -96, duration: 0.36 }, ">");
    sq.to(squirrel, { x: -328.6, y: -35.9, rotation: -104, duration: 0.36 }, ">");
    sq.to(squirrel, { x: -290.6, y: -90.9, rotation: -115, duration: 0.36, ease: "power1.out" }, ">");
    sq.to(squirrel, { scaleX: 1.04, duration: 0.09, ease: "sine.inOut", yoyo: true, repeat: 11 }, 1.18);
    sq.to(squirrel, { x: -272.6, y: -93.9, rotation: 0, duration: 0.32, ease: "power2.out" }, ">");
    sq.to(squirrel, { scaleX: 1.14, scaleY: 0.78, rotation: -3, duration: 0.2, ease: "power1.out" }, ">");
    const leap = sq.duration();
    sq.to(squirrel, { scaleX: 1.02, scaleY: 1.06, rotation: -32, duration: 0.08, ease: "power1.in" }, leap);
    sq.to(squirrel, { x: 0, duration: 0.6, ease: "none" }, leap + 0.08);
    sq.to(squirrel, { y: -170.9, duration: 0.3, ease: "power2.out" }, leap + 0.08);
    sq.to(squirrel, { y: 0, duration: 0.3, ease: "power2.in" }, leap + 0.38);
    sq.to(squirrel, { rotation: 8, duration: 0.6, ease: "sine.inOut" }, leap + 0.08);
    sq.to(squirrel, { scaleX: 1.12, scaleY: 0.82, duration: 0.07, ease: "power1.in" }, leap + 0.68);
    sq.to(squirrel, { scaleX: 1, scaleY: 1, rotation: 4, duration: 0.5, ease: "elastic.out(1, 0.4)" }, leap + 0.75);
    sq.to(squirrel, { rotation: 0, duration: 0.45, ease: "sine.inOut" }, leap + 0.95);
    const tail = q(".sqtail");
    gsap.set(tail, { svgOrigin: "741 114", rotation: 0 });
    sq.to(tail, { rotation: 16, scaleY: 1.08, duration: 0.075, ease: "sine.inOut", yoyo: true, repeat: 11 }, 0);
    sq.to(tail, {
      keyframes: [{ rotation: -22, duration: 0.18 }, { rotation: 10, duration: 0.18 }, { rotation: -18, duration: 0.18 },
        { rotation: 12, duration: 0.18 }, { rotation: -14, duration: 0.18 }, { rotation: 8, duration: 0.18 }, { rotation: -6, duration: 0.2 }],
      ease: "sine.inOut",
    }, 0.9);
    sq.to(tail, { rotation: 22, scaleY: 0.9, duration: 0.2, ease: "power2.out" }, leap - 0.2);
    sq.to(tail, { rotation: -34, scaleY: 1.12, duration: 0.18, ease: "power2.out" }, leap + 0.04);
    sq.to(tail, { rotation: -12, duration: 0.42, ease: "sine.inOut" }, leap + 0.22);
    sq.to(tail, { rotation: 30, scaleY: 0.86, duration: 0.1, ease: "power2.in" }, leap + 0.66);
    sq.to(tail, { rotation: 0, scaleY: 1, duration: 1.1, ease: "elastic.out(1.2, 0.28)" }, leap + 0.76);
    tl.add(sq, 4.45);

    tl.call(beats.onWarm, undefined, WARM);
    tl.call(beats.onOpen, undefined, OPEN);
    tl.call(beats.onFly, undefined, FLY);
  }, root);

  return {
    get timeline() {
      return whole;
    },
    settle() {
      whole.progress(1, true);
      sway.classList.remove("swaying");
      root.classList.remove("intro-live");
    },
    revert() {
      ctx.revert();
      sway.classList.remove("swaying");
      root.classList.remove("intro-live");
    },
  };
}
