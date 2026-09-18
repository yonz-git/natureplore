"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// The liquid layer over A0's green field: the pointer stirs flows of light and dark green, the field's own
// colour stays underneath because the canvas is transparent. Colours come from the design tokens.
// Not mounted for a person who asked for reduced motion. three is loaded after the page, not with it.

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

const TOKENS = ["--color-accent-tint", "--color-field-glow", "--color-field-deep"]; // slow to fast flow
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
      mouseForce={7}
      cursorSize={60}
      isViscous={false}
      viscous={8}
      iterationsViscous={32}
      iterationsPoisson={19}
      resolution={0.45}
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
