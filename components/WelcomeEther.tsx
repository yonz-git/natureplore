"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// The liquid layer over A0's green field: the pointer stirs slow, broad flows that lift the field to a
// slightly brighter green of the same tone. app/welcome.css screens the layer over the field, so it
// never goes darker than the field, and the canvas is transparent, so the field's own colour stays
// underneath. The colour comes from the design tokens.
// Tuned for calm: a wide brush on a coarse grid gives few large shapes, viscosity and plain advection
// (no BFECC) take the smoke-like wisps out, a gentle force and a small time step keep it slow.
// Not mounted for a person who asked for reduced motion. three is loaded after the page, not with it.

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });

// One dark green: the flow speed alone sets how much of it shows. Screened over the field it lifts the
// field to about field-glow at most, the same tone a bit brighter. A light ink goes white and grey, a
// saturated one goes neon.
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
