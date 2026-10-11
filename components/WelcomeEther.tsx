"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// The liquid layer over A0's mist photograph: the pointer, and the layer itself when the pointer rests,
// stir slow, broad flows of green haze through the light. app/welcome.css lays it straight over the
// photograph, and the canvas is transparent, so the photograph shows wherever nothing is flowing.
// The colour comes from the design tokens.
// Tuned for calm: a wide brush on a coarse grid gives few large shapes, viscosity and plain advection
// (no BFECC) take the smoke-like wisps out, a gentle force and a small time step keep it slow.
// Not mounted for a person who asked for reduced motion. three is loaded after the page, not with it.

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

// One dark green: the flow speed alone sets how much of it shows, a soft haze where the pointer passed.
// A saturated ink goes neon.
const TOKENS = ["--color-field-flow", "--color-field-flow"];
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

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
      colors={TOKENS.map((name) => root.getPropertyValue(name).trim())}
      mouseForce={6} // the push of the pointer: higher is stronger, faster and more opaque
      cursorSize={80} // in grid cells: about a fifth of the width at this resolution
      isViscous
      viscous={30}
      iterationsViscous={32}
      iterationsPoisson={19}
      resolution={0.25}
      BFECC={false}
      dt={0.006}
      isBounce={false}
      autoDemo // the layer also stirs itself, so the field moves when the mouse rests
      autoSpeed={0.7}
      autoIntensity={3.1}
      takeoverDuration={0.25}
      autoResumeDelay={1500}
      autoRampDuration={0.6}
    />
  );
}
