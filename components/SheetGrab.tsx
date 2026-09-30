"use client";

// The handle on a phone sheet, made real (A5 and B1). The sheet rests part way down, under the map,
// and opens to just under the top controls in three ways: dragging the handle, tapping it (or Enter
// and Space, since it is a button), or scrolling the list, which opens the sheet first so the list
// gets the whole screen. Dragging it down or tapping it again brings it back. From 64rem the list
// is a panel and there is no handle.
// The sheet moves by its own transform, never an ancestor's, so its frost stays on: its top jumps
// to the new height, then it slides from where it was, as the A5 list-and-map switch does.

import { type RefObject, useLayoutEffect, useRef, useState } from "react";

const phone = () => !matchMedia("(min-width: 64rem)").matches;
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useSheet(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [wanted, setWanted] = useState(false);
  const open = enabled && wanted;
  // where the sheet was on screen before it changed height, so it can slide from there
  const from = useRef<number | null>(null);
  const drag = useRef<{ y: number; dy: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || from.current === null) return;
    el.style.transform = "";
    const dy = from.current - el.getBoundingClientRect().top;
    from.current = null;
    if (!dy || still()) return;
    el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
      duration: 360,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    });
  }, [open, ref]);

  const set = (next: boolean) => {
    const el = ref.current;
    if (!el) return;
    if (next === open) {
      // a drag that did not go far enough: back to where the sheet rests
      const was = el.style.transform;
      el.style.transform = "";
      if (was && !still()) el.animate([{ transform: was }, { transform: "translateY(0)" }], { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
      return;
    }
    from.current = el.getBoundingClientRect().top;
    setWanted(next);
  };

  /** Scrolling the list opens the sheet first. */
  const onScroll = () => {
    const el = ref.current;
    if (enabled && !open && el && el.scrollTop > 8 && phone()) set(true);
  };

  const grab = (label: string) =>
    enabled ? (
      <button
        type="button"
        className="ms-grab"
        aria-expanded={open}
        aria-label={open ? `Show less of the ${label}` : `Show more of the ${label}`}
        onPointerDown={(e) => {
          if (!phone()) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, dy: 0, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = ref.current;
          if (!d || !el) return;
          let dy = e.clientY - d.y;
          if (Math.abs(dy) > 4) d.moved = true;
          // past where the sheet can go, it follows the finger at a third of the distance
          if ((open && dy < 0) || (!open && dy > 0)) dy /= 3;
          d.dy = dy;
          el.style.transform = `translateY(${dy}px)`;
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (!d?.moved) return;
          skipClick.current = true;
          set(open ? d.dy < 40 : d.dy < -40);
        }}
        onPointerCancel={() => {
          drag.current = null;
          set(open);
        }}
        onClick={() => {
          if (skipClick.current) {
            skipClick.current = false;
            return;
          }
          set(!open);
        }}
      >
        <span className="ms-handle" />
      </button>
    ) : (
      <div className="ms-handle" aria-hidden="true" />
    );

  return { open, onScroll, grab };
}
