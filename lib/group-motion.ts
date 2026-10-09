// The motion each organism group's icon plays: on the Organisms filters when they appear or are
// pointed at, and in the search field's hint as each group takes its turn.

import type { Group } from "@/lib/routes";

// The group icons that move (app/flow-a.css has their pivots). The herbs: Lordicon's "hover-pinch"
// for this drawing, rebuilt from its keyframes, the sprigs lifting and dipping back, swinging forward
// and settling over 1.78s. The mushroom hops: squashes, springs up, lands with a squash and settles.
type Motion = { part: string; frames: Keyframe[]; ms: number };
const GROUP_MOTION: Partial<Record<Group, Motion[]>> = {
  // the plant gathers on its stem, rises and opens, then sways and settles
  plants: [{
    part: ".plant-rise",
    ms: 1300,
    frames: [
      { transform: "translateY(0) rotate(0) scale(1, 1)" },
      { transform: "translateY(0) rotate(0) scale(1.05, 0.9)", offset: 0.16 },
      { transform: "translateY(-0.6px) rotate(-3deg) scale(0.97, 1.07)", offset: 0.42 },
      { transform: "translateY(0) rotate(2deg) scale(1.01, 0.98)", offset: 0.64 },
      { transform: "translateY(0) rotate(-1deg) scale(1, 1)", offset: 0.82 },
      { transform: "translateY(0) rotate(0) scale(1, 1)" },
    ],
  }],
  herbs: [{
    part: ".herbs-sway",
    ms: 1780,
    frames: [
      { transform: "translateY(0) rotate(0)" },
      { transform: "translateY(-0.56px) rotate(-9deg)", offset: 0.29 },
      { transform: "translateY(-0.42px) rotate(5deg)", offset: 0.49 },
      { transform: "translateY(-0.28px) rotate(-3deg)", offset: 0.69 },
      { transform: "translateY(-0.12px) rotate(1deg)", offset: 0.86 },
      { transform: "translateY(0) rotate(0)" },
    ],
  }],
  mushrooms: [{
    part: ".mushroom-hop",
    ms: 1100,
    frames: [
      { transform: "translateY(0) scale(1, 1)" },
      { transform: "translateY(0) scale(1.08, 0.88)", offset: 0.14 },
      { transform: "translateY(-2.2px) scale(0.96, 1.06)", offset: 0.38 },
      { transform: "translateY(0) scale(1.06, 0.92)", offset: 0.58 },
      { transform: "translateY(-0.5px) scale(0.99, 1.02)", offset: 0.76 },
      { transform: "translateY(0) scale(1, 1)" },
    ],
  }],
  // the paw steps: it presses down, lifts with a turn, lands and settles
  mammals: [{
    part: ".paw-step",
    ms: 900,
    frames: [
      { transform: "translateY(0) rotate(0) scale(1)" },
      { transform: "translateY(1px) rotate(0) scale(0.92)", offset: 0.2 },
      { transform: "translateY(-1.2px) rotate(-8deg) scale(1.04)", offset: 0.42 },
      { transform: "translateY(0) rotate(4deg) scale(0.98)", offset: 0.64 },
      { transform: "translateY(0) rotate(-2deg) scale(1)", offset: 0.82 },
      { transform: "translateY(0) rotate(0) scale(1)" },
    ],
  }],
  // the bird hops with its wing beating: the body rises and tilts while the wing flaps from its
  // shoulder, quicker than the hop
  birds: [
    {
      part: ".bird-hop",
      ms: 1000,
      frames: [
        { transform: "translateY(0) rotate(0) scale(1, 1)" },
        { transform: "translateY(0) rotate(0) scale(1.05, 0.92)", offset: 0.18 },
        { transform: "translateY(-2px) rotate(-6deg) scale(0.98, 1.04)", offset: 0.45 },
        { transform: "translateY(0) rotate(2deg) scale(1.04, 0.95)", offset: 0.7 },
        { transform: "translateY(0) rotate(0) scale(1, 1)" },
      ],
    },
    {
      part: ".bird-wing",
      ms: 1000,
      frames: [
        { transform: "rotate(0)" },
        { transform: "rotate(-28deg)", offset: 0.15 },
        { transform: "rotate(30deg)", offset: 0.3 },
        { transform: "rotate(-22deg)", offset: 0.45 },
        { transform: "rotate(20deg)", offset: 0.6 },
        { transform: "rotate(-8deg)", offset: 0.78 },
        { transform: "rotate(0)" },
      ],
    },
  ],
};
export function playGroup(icon: Element, group: Group, delay = 0) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (const motion of GROUP_MOTION[group] ?? []) {
    const part = icon.querySelector<SVGGElement>(motion.part);
    if (!part) continue;
    part.getAnimations().forEach((a) => a.cancel());
    part.animate(motion.frames, { duration: motion.ms, delay, easing: "cubic-bezier(0.33, 0, 0.67, 1)", fill: "backwards" });
  }
}
