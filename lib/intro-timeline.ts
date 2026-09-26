// The timeline of the logo intro, A0 · Welcome, logo applied (components/Intro.tsx). Ported from the
// board's standalone page. Every number is in the logo's own units (its viewBox is 1729.5 by 425.2),
// so the motion scales with the logo.
//
// Beats: the plant grows from 0.4s and hops into place by 3.2s, the mushroom pops up at 2.0s and
// hops over by about 4.75s, the bird circles in from 0.6s and lands at 5.6s, and the symbol pulses
// at 5.65s. "nature" starts as the plant lands: the swan rises at 3.2s, "a" and "t" wipe on from
// 4.1s, the snake slithers in at 4.5s, the squirrel runs in at 4.45s. "plore" rises at 5.9s.
// onSettled fires at 8.5s, once the squirrel has landed; the snake keeps swaying until 13.8s.
//
// The photo zoom, the swan's sway and the drift in the fill are CSS animations in app/intro.css:
// a per-frame GSAP transform on those made Chrome drop letters on random frames.

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const SETTLED = 8.5;

// the bird's pen stroke, from off the top left corner to its place on the plant
const BIRD = [
  { x: -1991.2, y: -1074.3 }, { x: -1671.2, y: -1034.3 }, { x: -1440.8, y: -1093.9 },
  { x: -1195.5, y: -1132.7 }, { x: -1171.6, y: -1116.7 }, { x: -1180.7, y: -1091.5 },
  { x: -1203.1, y: -1028.3 }, { x: -1201.6, y: -953.8 }, { x: -1122.5, y: -880.6 },
  { x: -917.7, y: -889.3 }, { x: -820.6, y: -875.2 }, { x: -815.4, y: -816.1 },
  { x: -811.8, y: -735.4 }, { x: -790.8, y: -677.1 }, { x: -697.7, y: -674.5 },
  { x: -657.3, y: -639.2 }, { x: -655.3, y: -631.5 }, { x: -425.1, y: -542.8 },
  { x: -223.7, y: -367.8 }, { x: -77.9, y: -155.9 }, { x: 0, y: 0 },
];

// Builds the timeline on a fresh intro root and plays it. revert() puts every piece back and stops
// the loops, so a replay (or React running the effect twice in development) starts clean.
export function playIntro(root: HTMLElement, onSettled: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const q = (s: string) => root.querySelector(s) as SVGGraphicsElement;
  const qa = (s: string) => Array.from(root.querySelectorAll(s));
  const sway = q(".sway");

  const ctx = gsap.context(() => {
    const photo = q(".intro-photo"), veil = q(".intro-veil"), logo = q(".intro-logo");
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power3.out" }, 0);
    tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0);
    if (reduce) {
      tl.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0.6);
      tl.call(onSettled, undefined, tl.duration());
      return;
    }
    // the board's logo sat inside the veil and came up with it
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
    gsap.set(mush, { opacity: 0, scale: 0, x: 1714, y: 1307 });
    gsap.set(plant, { x: -975, y: 940, scale: 0.35 });
    gsap.set([pBl, pBr, pMid, pTop], { scale: 0.05, opacity: 0 });
    gsap.set(swan, { y: 330, opacity: 0 });
    gsap.set(leafe, { scale: 0.05, rotation: -35, opacity: 0 });
    gsap.set(squirrel, { opacity: 0 });

    // bird: flies the pen stroke from the top left corner, flapping, and lands at 5.6s
    tl.to(bird, { opacity: 1, duration: 0.3, ease: "sine.out" }, 0.6);
    tl.to(bird, { duration: 5.0, ease: "sine.inOut", motionPath: { path: BIRD, curviness: 1.4 } }, 0.6);
    tl.to(bird, { keyframes: [{ rotation: 8, duration: 1.05 }, { rotation: -10, duration: 1.15 }, { rotation: 6, duration: 1.05 }, { rotation: -6, duration: 0.95 }, { rotation: 0, duration: 0.8 }], ease: "sine.inOut" }, 0.6);
    tl.to(wing, { keyframes: [{ rotation: -24, duration: 0.1 }, { rotation: 44, duration: 0.15 }, { rotation: 0, duration: 0.11 }], ease: "sine.inOut", repeat: 13 }, 0.6);

    // mushroom: pops up at the bottom right, then wanders over in little bounces: squash, tilt
    // into the hop, land, jiggle; it pauses once to look around
    tl.to(mush, { opacity: 1, duration: 0.15, ease: "sine.out" }, 2.0);
    tl.to(mush, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 2.0);
    const M = [[1714, 1307], [1280, 1150], [1400, 850], [900, 700], [1000, 420], [420, 280], [0, 0]];
    let m0 = 2.35;
    for (let k = 0; k < M.length - 1; k++) {
      const ma = M[k], mb = M[k + 1], dir = mb[0] < ma[0] ? -1 : 1, apex = Math.min(ma[1], mb[1]) - 200, md = 0.24;
      tl.to(mush, { scaleX: 1.18, scaleY: 0.8, duration: 0.06, ease: "power1.out" }, m0);
      tl.to(mush, { scaleX: 0.9, scaleY: 1.16, rotation: dir * 16, duration: 0.09, ease: "power1.out" }, m0 + 0.06);
      tl.to(mush, { x: mb[0], duration: md, ease: "none" }, m0 + 0.06);
      tl.to(mush, { y: apex, duration: md * 0.5, ease: "power2.out" }, m0 + 0.06);
      tl.to(mush, { y: mb[1], duration: md * 0.5, ease: "power2.in" }, m0 + 0.06 + md * 0.5);
      tl.to(mush, { rotation: -dir * 8, duration: md - 0.09, ease: "sine.inOut" }, m0 + 0.15);
      tl.to(mush, { scaleX: 1.22, scaleY: 0.76, duration: 0.06, ease: "power1.in" }, m0 + 0.06 + md);
      tl.to(mush, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.24, ease: "elastic.out(1.2, 0.5)" }, m0 + 0.12 + md);
      m0 += 0.36;
      if (k === 2) {
        tl.to(mush, { keyframes: [{ rotation: -12, duration: 0.1 }, { rotation: 10, duration: 0.12 }, { rotation: 0, duration: 0.08 }], ease: "sine.inOut" }, m0 + 0.02);
        m0 += 0.3;
      }
    }
    tl.to(mush, { keyframes: [{ rotation: 7, duration: 0.1 }, { rotation: -5, duration: 0.1 }, { rotation: 0, duration: 0.25, ease: "elastic.out(1, 0.4)" }], ease: "sine.inOut" }, m0 + 0.1);

    // plant: bottom pair first, then middle, then top, small, then three hops to its place
    tl.to([pBl, pBr], { opacity: 1, duration: 0.15 }, 0.4);
    tl.to([pBl, pBr], { scale: 1, duration: 0.8, ease: "back.out(2.2)" }, 0.4);
    tl.to(pMid, { opacity: 1, duration: 0.15 }, 0.75);
    tl.to(pMid, { scale: 1, duration: 0.9, ease: "back.out(1.6)" }, 0.75);
    tl.to(pTop, { opacity: 1, duration: 0.15 }, 1.05);
    tl.to(pTop, { scale: 1, duration: 0.9, ease: "back.out(1.6)" }, 1.05);
    const L = [[-975, 940, 0.35], [-650, 627, 0.55], [-325, 313, 0.78], [0, 0, 1]];
    let t0 = 1.1;
    for (let h = 0; h < 3; h++) {
      const a = L[h], b = L[h + 1], apex = (a[1] + b[1]) / 2 - 320, s = b[2];
      tl.to(plant, { scaleX: a[2] * 0.9, scaleY: a[2] * 1.12, duration: 0.12, ease: "power1.out" }, t0);
      tl.to(plant, { x: b[0], duration: 0.52, ease: "none" }, t0);
      tl.to(plant, { y: apex, duration: 0.28, ease: "power2.out" }, t0);
      tl.to(plant, { y: b[1], duration: 0.24, ease: "power2.in" }, t0 + 0.28);
      tl.to(plant, { scaleX: s, scaleY: s, duration: 0.3, ease: "sine.inOut" }, t0 + 0.12);
      tl.to(plant, { scaleX: s * 1.12, scaleY: s * 0.86, duration: 0.08, ease: "power1.in" }, t0 + 0.52);
      tl.to(plant, { scaleX: s, scaleY: s, duration: 0.45, ease: "elastic.out(1, 0.45)" }, t0 + 0.6);
      t0 += 0.7;
    }
    // the three join: a soft pulse of the whole symbol
    tl.to(symbol, { scale: 1.05, duration: 0.25, ease: "sine.out" }, 5.65);
    tl.to(symbol, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, ">");

    // swan: rises out of the water line and shakes its head, then sways very slowly
    tl.to(swan, { opacity: 1, duration: 0.35, ease: "sine.out" }, 3.2);
    tl.to(swan, { y: 0, duration: 1.3, ease: "power3.out" }, 3.2);
    const shead = q(".swanhead");
    gsap.set(shead, { svgOrigin: "568 84", rotation: 28 });
    tl.to(shead, { rotation: -6, duration: 0.45, ease: "back.out(2)" }, 3.65);
    tl.to(shead, {
      keyframes: [
        { rotation: 16, duration: 0.09 }, { rotation: -14, duration: 0.09 }, { rotation: 13, duration: 0.09 },
        { rotation: -10, duration: 0.09 }, { rotation: 7, duration: 0.09 }, { rotation: -4, duration: 0.09 },
        { rotation: 0, duration: 0.3, ease: "elastic.out(1, 0.4)" },
      ],
      ease: "sine.inOut",
    }, 4.1);
    tl.to(shead, { y: -4, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 1 }, 4.15);
    // water: ripples and a burst of drops at the surface as the swan comes up
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
    // head shake: drops fly off left and right with each swing
    qa(".d2").forEach((d, i) => {
      const dir = i % 2 ? -1 : 1, dx = dir * (60 + rnd() * 90), up = -(20 + rnd() * 50), t = 4.12 + Math.floor(i / 2) * 0.09, dur = 0.45 + rnd() * 0.15;
      gsap.set(d, { x: dir * 10, y: (rnd() - 0.5) * 24, scale: 0.6 + rnd() * 0.6 });
      tl.to(d, { opacity: 0.95, duration: 0.05 }, t);
      tl.to(d, { x: "+=" + dx, duration: dur, ease: "power1.out" }, t);
      tl.to(d, { y: "+=" + up, duration: dur * 0.4, ease: "power2.out" }, t);
      tl.to(d, { y: "+=" + (90 + rnd() * 40), duration: dur * 0.6, ease: "power2.in" }, t + dur * 0.4);
      tl.to(d, { opacity: 0, scale: 0.2, duration: 0.16 }, t + dur - 0.12);
    });
    tl.call(() => sway.classList.add("swaying"), undefined, 4.5);
    // the fill's drift waits while the pieces move: attribute transforms over an animating <use>
    // made Chrome drop letters on random frames
    root.classList.add("intro-live");
    tl.eventCallback("onComplete", () => root.classList.remove("intro-live"));

    // "nature" wipes on left to right after the swan
    [4.1, 4.3].forEach((start, i) => tl.to(wr[i], { scaleX: 1, duration: 0.6, ease: "power3.out" }, start));
    // snake: slithers in along its own body, a stroke mask growing from the t joint, around the
    // u, up the neck to the head
    const snakepath = root.querySelector(".snakepath") as SVGPathElement, snakemask = q(".snakemask");
    const spL = snakepath.getTotalLength();
    gsap.set(snakepath, { strokeDasharray: `${spL} ${spL + 120}`, strokeDashoffset: spL + 60 });
    gsap.set([wr[2], wr[3], wr[4]], { scaleX: 1.6, scaleY: 2.4 });
    tl.to(snakepath, { strokeDashoffset: 0, duration: 1.25, ease: "power1.inOut" }, 4.5);
    tl.set(snakemask, { attr: { mask: "none" } }, 5.8);
    // the leaf on the e unfurls, then the snake's recoil nudges it into a little hop
    tl.to(leafe, { opacity: 1, duration: 0.15 }, 4.9);
    tl.to(leafe, { scale: 1, rotation: 0, duration: 1.0, ease: "back.out(1.8)" }, 4.9);
    tl.to(leafe, { scaleY: 0.86, scaleX: 1.06, duration: 0.1, ease: "power1.out" }, 6.25);
    tl.to(leafe, { scaleY: 1.08, scaleX: 0.96, duration: 0.1, ease: "power1.out" }, 6.35);
    tl.to(leafe, { y: -42, duration: 0.22, ease: "power2.out" }, 6.35);
    tl.to(leafe, { y: 0, duration: 0.2, ease: "power2.in" }, 6.57);
    tl.to(leafe, { rotation: 9, duration: 0.42, ease: "sine.inOut" }, 6.35);
    tl.to(leafe, { scaleY: 0.88, scaleX: 1.1, duration: 0.07, ease: "power1.in" }, 6.77);
    tl.to(leafe, { scaleY: 1, scaleX: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }, 6.84);
    // "plore" is its own beat: after a pause the five letters rise out of the ground together
    const plore = qa(".plore");
    gsap.set(wr.slice(5), { scaleX: 1 });
    gsap.set(plore, { y: 70, opacity: 0 });
    tl.to(plore, { opacity: 1, duration: 0.3, ease: "sine.out", stagger: 0.08 }, 5.9);
    tl.to(plore, { y: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.08 }, 5.9);
    tl.to(flick, { x: 6, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, 5.8);
    // only the snake's head moves, above the seam at y 120; the neck below it stays over the u's
    // stem so the two never separate. It weaves as it emerges, then lifts, flicks and sways.
    const snakehead = q(".snakehead"), eye = q(".eye");
    gsap.set([snakehead, flick], { svgOrigin: "1026 120" });
    tl.to([snakehead, flick], { rotation: 7, duration: 0.17, ease: "sine.inOut", yoyo: true, repeat: 5 }, 4.85);
    tl.to([snakehead, flick], { rotation: -5, duration: 0.35, ease: "power2.out" }, 5.7);
    tl.to([snakehead, flick], { rotation: 2, duration: 0.5, ease: "sine.inOut" }, 6.5);
    tl.to([snakehead, flick], { rotation: -2.5, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 7.0);
    tl.to([snakehead, flick], { rotation: 0, duration: 1.2, ease: "sine.inOut" }, 12.6);
    // the bird blinks
    gsap.set(eye, { svgOrigin: "186.6 74" });
    [5.6, 8.4, 11.3].forEach((b) => tl.to(eye, { scaleY: 0.08, duration: 0.07, ease: "sine.inOut", yoyo: true, repeat: 1 }, b));

    // squirrel: runs in, climbs the swan, leaps onto the a
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
    // run: the tail bounces against each hop
    sq.to(tail, { rotation: 16, scaleY: 1.08, duration: 0.075, ease: "sine.inOut", yoyo: true, repeat: 11 }, 0);
    // climb: it streams and flicks behind
    sq.to(tail, {
      keyframes: [{ rotation: -22, duration: 0.18 }, { rotation: 10, duration: 0.18 }, { rotation: -18, duration: 0.18 },
        { rotation: 12, duration: 0.18 }, { rotation: -14, duration: 0.18 }, { rotation: 8, duration: 0.18 }, { rotation: -6, duration: 0.2 }],
      ease: "sine.inOut",
    }, 0.9);
    // crouch: it curls up with anticipation
    sq.to(tail, { rotation: 22, scaleY: 0.9, duration: 0.2, ease: "power2.out" }, leap - 0.2);
    // leap: it whips back, drags, then overshoots on landing
    sq.to(tail, { rotation: -34, scaleY: 1.12, duration: 0.18, ease: "power2.out" }, leap + 0.04);
    sq.to(tail, { rotation: -12, duration: 0.42, ease: "sine.inOut" }, leap + 0.22);
    sq.to(tail, { rotation: 30, scaleY: 0.86, duration: 0.1, ease: "power2.in" }, leap + 0.66);
    sq.to(tail, { rotation: 0, scaleY: 1, duration: 1.1, ease: "elastic.out(1.2, 0.28)" }, leap + 0.76);
    tl.add(sq, 4.45);

    tl.call(onSettled, undefined, Math.min(SETTLED, tl.duration()));
  }, root);

  return {
    revert() {
      ctx.revert();
      sway.classList.remove("swaying");
      root.classList.remove("intro-live");
    },
  };
}
