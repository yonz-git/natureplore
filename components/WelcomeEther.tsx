"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// The liquid layer over A0's green field: the pointer stirs slow, broad flows of olive green (never white), the field's
// own colour stays underneath because the canvas is transparent. Colours come from the design tokens.
// Tuned for calm: a wide brush on a coarse grid gives few large shapes, viscosity and plain advection
// (no BFECC) take the smoke-like wisps out, a gentle force and a small time step keep it slow.
// Not mounted for a person who asked for reduced motion. three is loaded after the page, not with it.

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

const TOKENS = ["--color-field-olive-deep", "--color-field-olive", "--color-field-olive"]; // slow to fast flow, never white
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// LiquidEther stores its palette in linear light and draws it without converting back, so a colour comes
// out darker than it was given. Giving it the sRGB encoding of the token's values cancels that: what
// shows on screen is the token.
const asShown = (hex: string) => {
  const channels = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
  });
  return `rgb(${channels.join(", ")})`;
};

const subscribe = (onChange: () => void) => {
  const query = matchMedia(MOTION_OK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function WelcomeEther() {
  const motionOk = useSyncExternalStore(subscribe, () => matchMedia(MOTION_OK).matches, () => false);
  if (!motionOk) return null;
  const root = getComputedStyle(document.documentElement);
  return (
    <LiquidEther
      colors={TOKENS.map((name) => asShown(root.getPropertyValue(name).trim()))}
      mouseForce={4} // the push of the pointer: higher is stronger, faster and more opaque
      cursorSize={80} // in grid cells: about a fifth of the width at this resolution
      isViscous
      viscous={30}
      iterationsViscous={32}
      iterationsPoisson={19}
      resolution={0.25}
      BFECC={false}
      dt={0.006}
      isBounce={false}
      autoDemo={false}
      autoSpeed={1}
      autoIntensity={3.1}
      takeoverDuration={0.25}
      autoResumeDelay={3000}
      autoRampDuration={0.6}
    />
  );
}
