"use client";

// The handle on a phone sheet, made real (A5 and B1). The sheet has three places: down, only its
// head showing above the tab bar so the map has the screen; resting part way down, under the map,
// where it starts; and open, just under the top controls. Dragging the handle moves it a place up or
// down, tapping it (or Enter and Space, since it is a button) opens it from resting and brings it
// back from open or down, and scrolling the list opens it first so the list gets the whole screen. A
// pull down on the list, once it is at its top, moves the sheet a place down too. From 64rem the
// list is a panel and there is no handle.
// The sheet moves by its own transform, never an ancestor's, so its frost stays on: its top jumps
// to the new height, then it slides from where it was, as the A5 list-and-map switch does.

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

const phone = () => !matchMedia("(min-width: 64rem)").matches;
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 0 down, 1 resting, 2 open */
type Place = 0 | 1 | 2;
const clamp = (n: number) => Math.max(0, Math.min(2, n)) as Place;
/** past where the sheet can go, it follows the finger at a third of the distance */
const follow = (dy: number, at: Place) => ((at === 2 && dy < 0) || (at === 0 && dy > 0) ? dy / 3 : dy);

export function useSheet(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [wanted, setWanted] = useState<Place>(1);
  const place: Place = enabled ? wanted : 1;
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
  }, [place, ref]);

  const set = (next: Place) => {
    const el = ref.current;
    if (!el) return;
    if (next === place) {
      // a drag that did not go far enough: back to where the sheet is
      const was = el.style.transform;
      el.style.transform = "";
      if (was && !still()) el.animate([{ transform: was }, { transform: "translateY(0)" }], { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
      return;
    }
    from.current = el.getBoundingClientRect().top;
    if (next === 0) el.scrollTop = 0;
    setWanted(next);
  };

  // the touch code below runs outside React's render, so it reads the latest place and setter here
  const placeRef = useRef(place);
  const setRef = useRef(set);
  useLayoutEffect(() => {
    placeRef.current = place;
    setRef.current = set;
  });

  // a pull down on the list itself, once it is scrolled to its top, drags the whole sheet down, as the
  // handle does: past a short pull it goes a place down, short of that it springs back
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let t: { y: number; dy: number; on: boolean } | null = null;
    const down = (e: TouchEvent) => {
      t = phone() && el.scrollTop <= 0 && !(e.target as Element).closest(".ms-grab") ? { y: e.touches[0].clientY, dy: 0, on: false } : null;
    };
    const move = (e: TouchEvent) => {
      if (!t) return;
      const dy = e.touches[0].clientY - t.y;
      // only a pull down from the top moves the sheet; anything else is the list scrolling
      if (!t.on && (dy <= 4 || el.scrollTop > 0)) {
        if (dy < 0) t = null;
        return;
      }
      t.on = true;
      e.preventDefault();
      t.dy = follow(dy, placeRef.current);
      el.style.transform = `translateY(${t.dy}px)`;
    };
    const up = () => {
      if (t?.on) setRef.current(t.dy > 60 ? clamp(placeRef.current - 1) : placeRef.current);
      t = null;
    };
    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", up);
    el.addEventListener("touchcancel", up);
    return () => {
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", up);
      el.removeEventListener("touchcancel", up);
    };
  }, [ref, enabled]);

  /** Scrolling the list opens the sheet first. */
  const onScroll = () => {
    const el = ref.current;
    if (enabled && place !== 2 && el && el.scrollTop > 8 && phone()) set(2);
  };

  const open = place === 2;
  const grab = (label: string) =>
    enabled ? (
      <button
        type="button"
        className="ms-grab"
        aria-expanded={open}
        aria-label={place === 1 ? `Show more of the ${label}` : open ? `Show less of the ${label}` : `Show the ${label} again`}
        onPointerDown={(e) => {
          if (!phone()) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, dy: 0, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = ref.current;
          if (!d || !el) return;
          const dy = e.clientY - d.y;
          if (Math.abs(dy) > 4) d.moved = true;
          d.dy = follow(dy, place);
          el.style.transform = `translateY(${d.dy}px)`;
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (!d?.moved) return;
          skipClick.current = true;
          set(d.dy > 40 ? clamp(place - 1) : d.dy < -40 ? clamp(place + 1) : place);
        }}
        onPointerCancel={() => {
          drag.current = null;
          set(place);
        }}
        onClick={() => {
          if (skipClick.current) {
            skipClick.current = false;
            return;
          }
          set(place === 1 ? 2 : 1);
        }}
      >
        <span className="ms-handle" />
      </button>
    ) : (
      <div className="ms-handle" aria-hidden="true" />
    );

  return { open, down: place === 0, onScroll, grab };
}
