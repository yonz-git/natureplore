"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FILM_SECONDS } from "@/lib/welcome-progress";

// The photograph behind the welcome breathes: it zooms in over 40 seconds, then back out over the next 40,
// and round again, so the picture is never quite still and never runs away either. It runs on the
// photograph's own layer (.a02-photo-in), never on the box the scroll moves, so the two never write
// one transform. Someone who asked for less motion gets none of it.
//
// With BG_VIDEO set, a film takes the photograph's place: the drone shot over the lake, run
// backwards, sinking from the lake's edge into the forest (video/background.mp4, 4.6 to 11.5 s,
// reversed). It holds on its first frame through the opening, then glides on its own clock
// (FILM_SECONDS, lib/welcome-progress.ts).
// null: the photograph and its zoom.
const BG_VIDEO: string | null = "/video/welcome-forest-down.mp4";

const ZOOM = 1.6;
const OVER = 40; // seconds, in; the same again out

// in over OVER seconds and back out, round again; nothing for someone who asked for less motion
function breathe(target: gsap.TweenTarget) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
  return gsap.fromTo(target, { scale: 1 }, {
    scale: ZOOM,
    duration: OVER,
    ease: "sine.inOut",
    transformOrigin: "50% 50%",
    yoyo: true,
    repeat: -1,
  });
}

// Over the forest the zoom cannot set off from rest as the photograph's does: it would sit still for
// the first seconds after the film stops. It sets off at its full speed instead while the film slows
// (from HANDOVER of the film's run), eases into its first turn, then breathes like the photograph.
const HANDOVER = 0.6;
function settleIn(target: HTMLElement) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
  return gsap.timeline()
    .fromTo(target, { scale: 1 }, { scale: ZOOM, duration: OVER, ease: "sine.out", transformOrigin: "50% 50%" })
    .to(target, { scale: 1, duration: OVER, ease: "sine.inOut", yoyo: true, repeat: -1 });
}

export default function WelcomeZoom() {
  useGSAP(() => {
    if (BG_VIDEO) {
      const layer = document.querySelector<HTMLElement>(".a02-photo-in");
      if (!layer) return;
      const film = document.createElement("video");
      film.src = BG_VIDEO;
      film.muted = true;
      film.playsInline = true;
      film.preload = "auto";
      film.className = "a02-film";
      layer.appendChild(film);
      // It sets off when the opening has glided through (data-glided, components/WelcomeScroll.tsx) and
      // plays at a speed that rises and falls on a sine over FILM_SECONDS, so it leaves from rest and
      // comes to rest on the forest. Only its speed is steered, never its place: a seek would stall it.
      const stage = document.querySelector<HTMLElement>(".a0s");
      let run: gsap.core.Tween | undefined;
      let zoom: gsap.core.Timeline | undefined;
      const go = () => {
        if (run || !stage || !("glided" in stage.dataset)) return;
        const length = film.duration || 6.9;
        film.currentTime = 0;
        film.playbackRate = 0.07;
        film.play().catch(() => {});
        run = gsap.to({ x: 0 }, {
          x: 1,
          duration: FILM_SECONDS,
          ease: "none",
          onUpdate() {
            const x = this.targets()[0].x as number;
            film.playbackRate = Math.min(4, Math.max(0.07, (length * (Math.PI / 2) * Math.sin(Math.PI * x)) / FILM_SECONDS));
            // the zoom takes over while the film is still slowing, so the picture never stands still
            if (x >= HANDOVER && !zoom) zoom = settleIn(layer);
          },
          onComplete() {
            film.pause();
          },
        });
      };
      const watch = new MutationObserver(go);
      if (stage) watch.observe(stage, { attributes: true, attributeFilter: ["data-glided"] });
      const unfollow = () => {
        watch.disconnect();
        run?.kill();
        zoom?.kill();
      };
      return () => {
        unfollow();
        film.remove();
      };
    }
    breathe(".a02-photo-in");
  });
  return null;
}
