"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// The photograph behind the welcome breathes: it zooms in over a minute, then back out over the next,
// and round again, so the picture is never quite still and never runs away either. It runs on the
// photograph's own layer (.a02-photo-in), never on the box the scroll moves, so the two never write
// one transform. Someone who asked for less motion gets none of it.

const ZOOM = 1.35;
const OVER = 60; // seconds, in; the same again out

export default function WelcomeZoom() {
  useGSAP(() => {
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
