"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import Logo, { WORDMARK_BOX } from "@/components/Logo";
import { playIntro, WELCOME_OPENING, WELCOME_PACE, WELCOME_START } from "@/lib/intro-timeline";
import {
  DESCENT,
  DESCENT_SECONDS,
  PATTERN_IMG,
  followDescent as followDescentLocal,
  followProgress,
  publishDescent,
} from "@/lib/welcome-progress";

// The logo on A0 · Welcome. The page opens with no logo at all: the timeline (lib/intro-timeline.ts)
// is built and held at its first frame, where every piece is still off the screen and the drawing is
// transparent. The scroll is the background's, not the logo's: it opens the photograph, and as that
// circle starts to open the logo starts and then plays at its own speed, whatever the scroll
// does from there. When it has built itself it stands a moment, then the name lifts out and lands
// at the foot of the page while the symbol shrinks into the top left corner; only when the symbol
// lands does the rest of A0 come in, which is what the a0-open class below starts (app/welcome.css).
//
// The travel is worked out from two boxes rather than written down: the logo where it stands, and the
// empty corner slot, so both sizes and every window width follow the CSS.

const START = WELCOME_START; // of the scroll: the circle has just started to open, and the logo starts
const PACE = WELCOME_PACE; // the timeline runs this much faster than it was written
// the symbol's own corner of the logo, in the logo's viewBox units: the pieces are drawn as clipped
// copies of one fill, so their boxes are the fill's and cannot be measured. These are the drawing.
const SYM = { x: 0, y: 64.87, w: 283.81, h: 265.34 };
const LOGO = { w: 1729.5, h: 425.2 };
const HOLD = 0.58; // seconds the whole logo is left standing once it is built
const DISSOLVE = 0.38; // seconds the logo's own wordmark takes to hand over to the one that lands
// The wordmark does not vanish: as the symbol takes off, the name lifts out of the logo and lands at
// the foot of the welcome (beside the corner symbol on a phone), its letters settling one by one.
// It is a second, plain wordmark (.a0-wordmark, app/welcome.css) laid exactly over the logo's own
// and flown from there, the logo's letters fading as it takes over.
const WORD = (() => {
  const [x, y, w, h] = WORDMARK_BOX.split(" ").map(Number);
  return { x, y, w, h };
})();
// For now the logo stays where it is built, whole and in its own colours, as the welcome's centre
// piece: no flight to the corner and no landing for the name (app/welcome.css, data-stay). Set to
// false to bring the flight back.
const STAY = true;
// The logo plays as the 3D film of this same timeline (video/logo-3d, build.py --film): the same
// pieces in the same motion, modelled and lit, and from the squirrel's arrival covered in leaves from
// the foot up. The drawing and its timeline still run underneath, unseen, for the beats and the
// layout. Safari plays the HEVC file with its transparency; the others the VP9 one. false: the drawing.
const FILM = false;
// The descent (lib/welcome-progress.ts), in shares of its scroll: the logo grows to BIG, leaves grow
// over it (the 3D clip, video/logo-3d build.py --welcome, scrubbed: its first frame is this drawing,
// it swells into relief and is covered from the foot up), then the leaves fall away, the name goes and
// the plain symbol flies to its corner on the sketched line, shrinking back as it goes, and A0 comes
// in as the film behind reaches the forest.
const BIG = 1.6;
// One flow, so the parts overlap and nothing stops while the next starts: the logo keeps growing all
// the while the leaves cover it, the flight sets off while the last leaves are still coming, A0 rises
// while the symbol is still landing, and the film behind rests on the forest as it lands.
const GROW_TO = 0.55; // grown by here, easing out as the flight takes over
const LEAVES = [0, 0.62]; // the leaves' clip, start to end
const CLIP_BARE = 1.4; // seconds of the clip before its first leaf (video/logo-3d, --welcome HOLD)
const FLIGHT = [0.52, 0.9]; // the flight, start to landing
const A0_AT = 0.78; // A0 starts to rise
const CROSS = 0.08; // the clip gives way to the drawing over this much of the flight's start
const WORD_FLIGHT = 1.5; // seconds, the name from the logo to its place
const WORD_SETTLE = 0.55; // seconds each letter takes to settle as it lands
const TRAVEL = 2.0; // seconds, the symbol flying to its corner, loop and all
// The symbol does not slide to its corner, it flies there, on the line the user sketched: it turns
// one loop where it stands, heads left under the heading, rises straight up beside it and curves in
// to the corner, the bird on it flapping and the symbol shrinking as it goes.
// The loop is in the symbol's own widths, so it stays round on any screen: a circle 1.2 widths
// across, just left of where the symbol starts, flown once round from the start and left off at
// its top, heading left. On a phone the symbol starts too near the edge for that, so the loop
// slides right until it clears the corner's edge (fly, below).
const LOOP_R = 0.6;
const LOOP = Array.from({ length: 17 }, (_, i) => {
  const a = ((10 - i * 28.75) * Math.PI) / 180;
  return { x: LOOP_R * Math.cos(a), y: -0.12 + LOOP_R * Math.sin(a) };
});
// The rest is fractions of the way from the corner (0) back to where the symbol starts (1), so it
// fits every screen. Measured off the sketch on a 1540 by 869 window.
const ROUTE = [
  { x: 0.772, y: 0.882 }, { x: 0.594, y: 0.9 }, { x: 0.475, y: 0.874 }, { x: 0.432, y: 0.777 },
  { x: 0.42, y: 0.633 }, { x: 0.422, y: 0.501 }, { x: 0.396, y: 0.37 }, { x: 0.327, y: 0.265 },
  { x: 0.218, y: 0.165 }, { x: 0.109, y: 0.087 }, { x: 0.04, y: 0.029 }, { x: 0, y: 0 },
];
// A hand-drawn line has corners where the hand turned; rounded twice (Chaikin: every corner cut at a
// quarter and three quarters of its sides) it keeps its shape and its two ends and flies as one
// smooth line.
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
// The symbol shrinks to a tenth of its size or less on the way, and shrunk evenly it lost most of
// its size in the last moments, snapping small just as it landed. This eases the shrink by ratio
// instead, the same share smaller in every moment of the flight, on the same curve as the flight.
const evenShrink = (to: number) => {
  const curve = gsap.parseEase("sine.inOut");
  if (Math.abs(to - 1) < 0.001) return curve;
  return (p: number) => (Math.pow(to, curve(p)) - 1) / (to - 1);
};
const FLAP = 0.44; // seconds, one wingbeat, slow and shallow so the flight reads as a glide
// The opening can play OPENING times faster again (lib/intro-timeline.ts, 1 for now), then eases back to PACE over
// EASE_BACK seconds, so the change of speed is never felt as a jolt, before the mushroom jumps.
const OPENING = WELCOME_OPENING;
const SWAN = 2.0; // timeline seconds: the ease back starts here, after the mushroom is taken over (1.9s) and before it jumps (2.3s)
const EASE_BACK = 0.25;

export default function WelcomeLogo() {
  const mark = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = mark.current;
    const target = slot.current;
    if (!el || !target) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 }); // centred on the point app/welcome.css puts it at
    if (DESCENT) {
      const fill = el.querySelector("#fieldfill");
      if (fill && !fill.querySelector(".pattern")) {
        const { href, x, y, w, h } = PATTERN_IMG;
        fill.insertAdjacentHTML("beforeend",
          `<image class="pattern" href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" />`);
      }
      el.dataset.pattern = "";
    }
    let film: HTMLVideoElement | undefined;
    if (FILM) {
      film = document.createElement("video");
      const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
      film.src = safari ? "/video/logo-film.mov" : "/video/logo-film.webm";
      film.muted = true;
      film.playsInline = true;
      film.preload = "auto";
      film.className = "a0-film";
      el.appendChild(film);
      el.dataset.film = "";
    }
    if (STAY) el.dataset.stay = "";
    const stage = el.closest(".a0s");
    let travel: gsap.core.Timeline | undefined;
    // once it has all played out the page keeps it: scrolling back up then changes nothing
    let done = false;
    // The way out, once the logo is whole: it stands there a moment, the wordmark lifts off letter by
    // letter and is gone, and the symbol alone shrinks into the corner. The whole drawing is still
    // what moves, since by then there is nothing left of it but the symbol; what is worked out here
    // is where the drawing has to go for the SYMBOL to land in the corner slot.
    // where the drawing has to go, from where it stands untransformed, for the symbol to sit in the slot
    const corner = () => {
      const box = el.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const width = (SYM.w / LOGO.w) * box.width;
      if (!width || !to.width) return null;
      const cx = box.left + ((SYM.x + SYM.w / 2) / LOGO.w) * box.width;
      const cy = box.top + ((SYM.y + SYM.h / 2) / LOGO.h) * box.height;
      const scale = to.width / width;
      // where a point of the drawing ends up once the drawing is scaled about its own centre
      const under = (of: number, point: number) => of + (point - of) * scale;
      return {
        x: to.left + to.width / 2 - under(box.left + box.width / 2, cx),
        y: to.top + to.height / 2 - under(box.top + box.height / 2, cy),
        scale,
        // for the flight: the symbol's width, where it sits off the drawing's centre, and how far the
        // symbol itself has to go
        width,
        off: { x: cx - (box.left + box.width / 2), y: cy - (box.top + box.height / 2) },
        room: cx - to.left, // from the corner's left edge to where the symbol starts
        reach: { x: to.left + to.width / 2 - cx, y: to.top + to.height / 2 - cy },
      };
    };
    // the line the symbol flies to its corner on, in the drawing's own x and y
    const flightPath = (landing: NonNullable<ReturnType<typeof corner>>) => {
      // Where the symbol itself is to be at each point of the sketch, from where it starts...
      const w = landing.width;
      const loopX = Math.max(-LOOP_R * w, LOOP_R * w - landing.room); // the loop's centre, never past the edge
      const marks: Pt[] = [
        ...LOOP.map((p) => ({ x: loopX + p.x * w, y: p.y * w })),
        ...ROUTE.map((f) => ({ x: landing.reach.x * (1 - f.x), y: landing.reach.y * (1 - f.y) })),
      ];
      // ...and where the whole drawing has to be for that, since it is the drawing that moves and
      // it shrinks on the way, which pulls the symbol in toward its centre. The shrink runs on the
      // same curve as the flight, so a point a share u of the way along the line is reached at
      // scale^u; that share is measured on the line itself, so it is settled in a few rounds.
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
      return rounded(rounded([{ x: 0, y: 0 }, ...path]));
    };
    const fly = () => {
      const letters = el.querySelectorAll(".wordmark > *");
      const landing = corner();
      const open = () => {
        done = true;
        if (DESCENT) {
          // the logo is built: the page may now go on down (WelcomeScroll), and the descent below
          // takes it from here, A0 coming in only at its end
          if (stage instanceof HTMLElement) {
            stage.dataset.logoDone = "";
            // it plays by itself, at an even pace: each part brings its own ease (grow, flight), and
            // the two films run at their own speed (see descend)
            stage.dataset.descending = "";
            descent = gsap.to({ d: 0 }, {
              d: 1,
              duration: DESCENT_SECONDS,
              ease: "none",
              onUpdate() { publishDescent(this.targets()[0].d); },
              onComplete() {
                // the page is A0 and stays as it is: no switch of layout to jump at the end, and
                // the reader's scroll stays held, as A0 is one screen (app/welcome.css)
                delete stage.dataset.descending;
              },
            });
          }
          return;
        }
        // the scroll has done its work: the page stops being a scroller and is A0 alone, so there
        // is nothing left to scroll back up into (app/welcome.css)
        stage?.classList.add("a0-open", "a0-done");
        scrollTo(0, 0);
      };
      if (STAY) {
        // it stands where it was built a moment, then the rest of A0 comes in around it
        travel = gsap.timeline({ onComplete: open }).to({}, { duration: DESCENT ? 0.05 : HOLD });
        return;
      }
      if (!landing) return open();
      const path = flightPath(landing);
      const wing = el.querySelector(".wing");
      const flyAt = HOLD + DISSOLVE * 0.6;
      travel = gsap
        .timeline({ onComplete: open })
        .to(letters, { opacity: 0, duration: DISSOLVE, ease: "power1.in" }, HOLD)
        .to(el, { duration: TRAVEL, ease: "sine.inOut", motionPath: { path, curviness: 1 } }, flyAt)
        .to(el, { scale: landing.scale, duration: TRAVEL, ease: evenShrink(landing.scale) }, flyAt)
        // the bird beats its wing the whole way up, and has it folded as the symbol lands
        .to(wing, {
          keyframes: [{ rotation: -12, duration: 0.12 }, { rotation: 22, duration: 0.18 }, { rotation: 0, duration: 0.14 }],
          ease: "sine.inOut",
          repeat: Math.max(0, Math.round(TRAVEL / FLAP) - 1),
        }, flyAt);
      // the name: laid over the logo's own wordmark, then flown to its place
      const name = word.current;
      if (name) {
        gsap.set(name, { clearProps: "transform,opacity" });
        const home = name.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        const from = {
          left: box.left + (WORD.x / LOGO.w) * box.width,
          top: box.top + (WORD.y / LOGO.h) * box.height,
          width: (WORD.w / LOGO.w) * box.width,
        };
        if (home.width && from.width) {
          const s = from.width / home.width;
          const x = from.left - home.left;
          const y = from.top - home.top;
          const parts = name.querySelectorAll("path");
          gsap.set(name, { x, y, scale: s, transformOrigin: "0 0", opacity: 0 });
          travel
            .to(name, { opacity: 1, duration: DISSOLVE, ease: "power1.out" }, HOLD)
            // it dips first, then sweeps out to its place on a long curve
            .to(name, {
              duration: WORD_FLIGHT,
              ease: "power3.inOut",
              motionPath: { path: [{ x, y }, { x: x * 0.55, y: y * 0.35 + 40 }, { x: 0, y: 0 }], curviness: 1.2 },
            }, HOLD + DISSOLVE * 0.5)
            .to(name, { scale: 1, duration: WORD_FLIGHT, ease: "power3.inOut" }, HOLD + DISSOLVE * 0.5)
            // and its letters settle one by one as it comes down
            .fromTo(parts, { y: -26, rotation: () => gsap.utils.random(-6, 6) }, {
              y: 0,
              rotation: 0,
              transformOrigin: "50% 100%",
              duration: WORD_SETTLE,
              ease: "back.out(2.2)",
              stagger: 0.035,
            }, HOLD + DISSOLVE * 0.5 + WORD_FLIGHT * 0.62)
            .set(name, { clearProps: "transform" });
        }
      }
    };

    const intro = playIntro(el, { onWarm() {}, onOpen() {}, onFly: fly }, true);

    // ---- the descent: grow, leaves, flight, A0, all from the scroll, so going back up undoes it
    const drawing = el.querySelector<SVGSVGElement>(".intro-logo");
    let leaves: HTMLVideoElement | undefined;
    let flight: gsap.core.Timeline | undefined;
    let landed = false;
    let descent: gsap.core.Tween | undefined;
    let leafAt = 0;
    let leafRaf = 0;
    if (DESCENT && drawing) {
      leaves = document.createElement("video");
      const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
      leaves.src = safari ? "/video/logo-leaves-scrub.mov" : "/video/logo-leaves-scrub.webm";
      leaves.muted = true;
      leaves.playsInline = true;
      leaves.preload = "auto";
      leaves.className = "a0-leaves";
      el.appendChild(leaves);
    }
    const seekLeaves = () => {
      leafRaf = 0;
      if (!leaves || leaves.readyState < 1) return;
      if (leaves.seeking) leafRaf = requestAnimationFrame(seekLeaves);
      else if (Math.abs(leaves.currentTime - leafAt) > 0.02) leaves.currentTime = leafAt;
    };
    leaves?.addEventListener("seeked", () => {
      if (!leafRaf && leaves && Math.abs(leaves.currentTime - leafAt) > 0.02) leafRaf = requestAnimationFrame(seekLeaves);
    });
    const share = (d: number, [a, b]: number[]) => Math.min(1, Math.max(0, (d - a) / (b - a)));
    const smooth = gsap.parseEase("sine.inOut");
    const easeOut = gsap.parseEase("sine.out");
    const descend = (d: number) => {
      if (!drawing || !leaves || !stage || !(stage instanceof HTMLElement) || !("logoDone" in stage.dataset)) return;
      // bigger, then back to its own size over the flight; on the drawing and the clip, never on the
      // box, whose place the flight is worked out from
      const s = 1 + (BIG - 1) * easeOut(share(d, [0, GROW_TO])) * (1 - smooth(share(d, FLIGHT)));
      gsap.set(drawing, { scale: s, transformOrigin: "50% 50%" });
      gsap.set(leaves, { scale: s, transformOrigin: "50% 49.14%" }); // the logo's middle in the clip's box
      // the clip in for the leaves, the drawing back for the flight
      const clip = smooth(share(d, [LEAVES[0], LEAVES[0] + 0.04])) * (1 - smooth(share(d, [FLIGHT[0], FLIGHT[0] + CROSS])));
      leaves.style.opacity = String(clip);
      drawing.style.opacity = String(1 - clip);
      // The clip from its bare frame on (CLIP_BARE): the drawing already wears that same patterned
      // logo (PATTERN_IMG), so the clip takes over without a change, and plays its leaves at the
      // speed that fits them into LEAVES; it is only sought when it has to be put somewhere.
      const length = leaves.duration || 9;
      if (d > LEAVES[0] && d < LEAVES[1] && leaves.paused && leaves.readyState >= 1) {
        leaves.playbackRate = (length - CLIP_BARE) / ((LEAVES[1] - LEAVES[0]) * DESCENT_SECONDS);
        leaves.currentTime = CLIP_BARE + share(d, LEAVES) * (length - CLIP_BARE);
        leaves.play().catch(() => {});
      } else if (d <= LEAVES[0] && leaves.currentTime > 0) {
        leaves.pause();
        leafAt = 0;
        if (!leafRaf) leafRaf = requestAnimationFrame(seekLeaves);
      }
      // the flight, built the first time it is needed, from where the box stands
      if (d >= FLIGHT[0] && !flight) {
        const landing = corner();
        if (landing) {
          const path = flightPath(landing);
          const wing = el.querySelector(".wing");
          flight = gsap
            .timeline({ paused: true })
            .to(el.querySelectorAll(".wordmark > *"), { opacity: 0, duration: DISSOLVE, ease: "power1.in" }, 0)
            .to(el, { duration: TRAVEL, ease: "sine.inOut", motionPath: { path, curviness: 1 } }, DISSOLVE * 0.6)
            .to(el, { scale: landing.scale, duration: TRAVEL, ease: evenShrink(landing.scale) }, DISSOLVE * 0.6)
            .to(wing, {
              keyframes: [{ rotation: -12, duration: 0.12 }, { rotation: 22, duration: 0.18 }, { rotation: 0, duration: 0.14 }],
              ease: "sine.inOut",
              repeat: Math.max(0, Math.round(TRAVEL / FLAP) - 1),
            }, DISSOLVE * 0.6);
        }
      }
      flight?.progress(share(d, FLIGHT));
      // landed: A0 comes in, and the corner symbol in the button's lime takes over (app/welcome.css)
      stage.classList.toggle("a0-open", d >= A0_AT);
      const atEnd = d >= FLIGHT[1];
      if (atEnd !== landed) {
        landed = atEnd;
        if (atEnd) delete el.dataset.stay;
        else el.dataset.stay = "";
      }
    };
    const unDescent = DESCENT ? followDescentLocal(descend) : () => {};
    // A paused timeline has not drawn anything yet, and the markup on its own is the finished logo, so
    // until it starts the logo is kept out of the page altogether (app/welcome.css looks for
    // data-ready), and the timeline is held on its first frame, where every piece is off the screen.
    intro.timeline.pause(0);
    intro.timeline.timeScale(PACE * OPENING);
    let settle: gsap.core.Tween | undefined;
    intro.timeline.call(() => {
      settle = gsap.to(intro.timeline, { timeScale: PACE, duration: EASE_BACK, ease: "sine.inOut" });
    }, undefined, SWAN);

    // Scrolling back above the trigger while it is still playing puts it all back: the timeline to its
    // first frame, the logo to the middle, A0 out of the page again, so coming down a second time
    // plays the whole thing. Once it has finished, nothing rewinds it.
    const rewind = () => {
      settle?.kill();
      intro.timeline.timeScale(PACE * OPENING);
      travel?.kill();
      travel = undefined;
      intro.timeline.pause(0);
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      gsap.set(el.querySelectorAll(".wordmark > *"), { clearProps: "opacity,transform" });
      if (word.current) {
        gsap.set(word.current, { clearProps: "transform,opacity" });
        gsap.set(word.current.querySelectorAll("path"), { clearProps: "transform" });
      }
      delete el.dataset.ready;
      if (film) {
        film.pause();
        film.currentTime = 0;
      }
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
        if (film) {
          // a frame later: on this one the logo is still out of the page (data-ready), and Chrome
          // pauses a video it is asked to play while it cannot be seen
          const f = film;
          f.currentTime = 0;
          requestAnimationFrame(() => {
            if (started) f.play().catch(() => f.addEventListener("canplay", () => started && f.play(), { once: true }));
          });
        }
      } else if (started) {
        started = false;
        rewind();
      }
    });

    // the landing is in pixels from the middle of the page, so a window that changes size once it has
    // landed has to have it worked out again
    const resize = () => {
      // a logo that stays in the middle (STAY) has no landing to work out: it would be sent to the corner
      if (!done || STAY) return;
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      const landing = corner();
      if (landing) gsap.set(el, { x: landing.x, y: landing.y, scale: landing.scale });
    };
    addEventListener("resize", resize);

    return () => {
      removeEventListener("resize", resize);
      unfollow();
      unDescent();
      descent?.kill();
      cancelAnimationFrame(leafRaf);
      flight?.kill();
      leaves?.remove();
      travel?.kill();
      settle?.kill();
      intro.revert();
      film?.remove();
      if (FILM) delete el.dataset.film;
      stage?.classList.remove("a0-open", "a0-done");
    };
  }, { scope: mark });

  return (
    <>
      <div className="a0-mark" ref={mark} aria-hidden="true" dangerouslySetInnerHTML={{ __html: INTRO_LOGO_SVG }} />
      {/* where it is going: the corner it takes on A0, empty and unseen until it gets there */}
      <div className="a0-mark-slot a0-mark-corner" ref={slot} aria-hidden="true" />
      {/* what it becomes once there: the symbol in the button's lime, faded in over the built logo
          as that fades out (app/welcome.css) */}
      <div className="a0-mark-lit a0-mark-corner" aria-hidden="true">
        <Logo symbol />
      </div>
      {/* the name, where it lands once it leaves the logo: unseen until then (app/welcome.css) */}
      <div className="a0-wordmark" ref={word} aria-hidden="true">
        <Logo wordmark />
      </div>
    </>
  );
}
