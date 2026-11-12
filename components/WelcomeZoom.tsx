"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ZOOM = 1.6;
const OVER = 40;

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
