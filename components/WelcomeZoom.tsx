"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DESCENT_FILM, DESCENT_SECONDS, followDescent } from "@/lib/welcome-progress";

// The photograph behind the welcome breathes: it zooms in over 40 seconds, then back out over the next 40,
// and round again, so the picture is never quite still and never runs away either. It runs on the
// photograph's own layer (.a02-photo-in), never on the box the scroll moves, so the two never write
// one transform. Someone who asked for less motion gets none of it.
//
// With BG_VIDEO set, a film takes the photograph's place: the drone shot over the lake, run
// backwards, sinking from the lake's edge into the forest (video/background.mp4, 4.6 to 11.5 s,
// reversed). It holds on its first frame through the opening and the logo, then plays with the
// descent (lib/welcome-progress.ts), at the speed that fits it into its share, DESCENT_FILM.
// null: the photograph and its zoom.
const BG_VIDEO: string | null = "/video/welcome-forest-down.mp4";

const ZOOM = 1.6;
const OVER = 40; // seconds, in; the same again out

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
      let target = 0;
      let raf = 0;
      const seek = () => {
        raf = 0;
        if (film.readyState < 1) return;
        if (film.seeking) raf = requestAnimationFrame(seek);
        else if (Math.abs(film.currentTime - target) > 0.02) film.currentTime = target;
      };
      film.addEventListener("seeked", () => {
        if (!raf && Math.abs(film.currentTime - target) > 0.02) raf = requestAnimationFrame(seek);
      });
      film.addEventListener("loadedmetadata", seek);
      const unfollow = followDescent((p) => {
        if (p > 0 && film.paused && !film.ended && film.readyState >= 1) {
          const length = film.duration || 6.9;
          film.playbackRate = length / (DESCENT_FILM * DESCENT_SECONDS);
          film.currentTime = Math.min(1, p / DESCENT_FILM) * length;
          film.play().catch(() => {});
        } else if (p <= 0 && film.currentTime > 0) {
          film.pause();
          target = 0;
          if (!raf) raf = requestAnimationFrame(seek);
        }
      });
      return () => {
        unfollow();
        cancelAnimationFrame(raf);
        film.remove();
      };
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ".a02-photo-in",
      { scale: 1 },
      {
        scale: ZOOM,
        duration: OVER,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
        yoyo: true,
        repeat: -1,
      },
    );
  });
  return null;
}
