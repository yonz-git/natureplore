"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import Logo from "@/components/Logo";
import { playIntro, WELCOME_OPENING, WELCOME_PACE, WELCOME_START } from "@/lib/intro-timeline";
import { followProgress } from "@/lib/welcome-progress";

// The logo on A0 · Welcome. The page opens with no logo at all: the timeline (lib/intro-timeline.ts)
// is built and held at its first frame, where every piece is still off the screen and the drawing is
// transparent. The scroll is the background's, not the logo's: it opens the photograph, and as that
// circle starts to open the logo starts and then plays at its own speed, whatever the scroll
// does from there. When it has built itself it stands a moment, the wordmark lifts off letter by
// letter, and the symbol alone shrinks into the top left corner; only when it lands does the rest of
// A0 come in, which is what the a0-open class below starts (app/welcome.css).
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
const DISSOLVE = 0.38; // seconds the wordmark takes to go
const TRAVEL = 1.15; // seconds, the symbol flying to its corner
// The symbol does not slide to its corner, it flies there: up along one gentle arc, the bird on it
// flapping, shrinking as it goes. It lifts first and then glides left into the corner, a single
// curve with no turns back. The line is fractions of the way from the corner (0) back to where the
// symbol starts (1), so it fits every screen; flown from 1 to 0.
const ROUTE = [{ x: 0, y: 0 }, { x: 0.12, y: 0.04 }, { x: 0.42, y: 0.24 }, { x: 0.78, y: 0.62 }, { x: 1, y: 1 }];
// Rounded twice (Chaikin: every corner cut at a quarter and three quarters of its sides), it keeps
// its two ends and runs as one smooth line.
const rounded = (points: { x: number; y: number }[]) => [
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
const FLIGHT = rounded(rounded(ROUTE));
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

  useGSAP(() => {
    const el = mark.current;
    const target = slot.current;
    if (!el || !target) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 }); // centred on the point app/welcome.css puts it at
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
      };
    };
    const fly = () => {
      const letters = el.querySelectorAll(".wordmark > *");
      const landing = corner();
      const open = () => {
        done = true;
        // the scroll has done its work: the page stops being a scroller and is A0 alone, so there
        // is nothing left to scroll back up into (app/welcome.css)
        stage?.classList.add("a0-open", "a0-done");
        scrollTo(0, 0);
      };
      if (!landing) return open();
      // the translation at each point of the line: none where the symbol starts, all of it in the corner
      const path = [...FLIGHT].reverse().map((f) => ({ x: landing.x * (1 - f.x), y: landing.y * (1 - f.y) }));
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
        // the bird beats its wing the whole way up, and has it folded as the symbol lands
        .to(wing, {
          keyframes: [{ rotation: -12, duration: 0.12 }, { rotation: 22, duration: 0.18 }, { rotation: 0, duration: 0.14 }],
          ease: "sine.inOut",
          repeat: Math.max(0, Math.round(TRAVEL / FLAP) - 1),
        }, flyAt);
    };

    const intro = playIntro(el, { onWarm() {}, onOpen() {}, onFly: fly }, true);
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

    // the landing is in pixels from the middle of the page, so a window that changes size once it has
    // landed has to have it worked out again
    const resize = () => {
      if (!done) return;
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      const landing = corner();
      if (landing) gsap.set(el, landing);
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
      {/* where it is going: the corner it takes on A0, empty and unseen until it gets there */}
      <div className="a0-mark-slot a0-mark-corner" ref={slot} aria-hidden="true" />
      {/* what it becomes once there: the symbol in the button's lime, faded in over the built logo
          as that fades out (app/welcome.css) */}
      <div className="a0-mark-lit a0-mark-corner" aria-hidden="true">
        <Logo symbol />
      </div>
    </>
  );
}
