"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

const phone = () => !matchMedia("(min-width: 64rem), (min-width: 35.75rem) and (min-height: 36rem)").matches;
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

type Place = 0 | 1 | 2;
const clamp = (n: number) => Math.max(0, Math.min(2, n)) as Place;
const follow = (dy: number, at: Place) => ((at === 2 && dy < 0) || (at === 0 && dy > 0) ? dy / 3 : dy);

const shift = (el: HTMLElement, dy: number) => {
  el.style.transform = dy ? `translateY(${dy}px)` : "";
  el.style.marginBottom = dy < 0 ? `${dy}px` : "";
};
const sliding = new WeakMap<HTMLElement, Animation>();
const settle = (el: HTMLElement, dy: number, duration: number) => {
  sliding.get(el)?.cancel();
  shift(el, 0);
  if (!dy || still()) return;
  if (dy < 0) el.style.marginBottom = `${dy}px`;
  const a = el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
    duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  });
  sliding.set(el, a);
  a.onfinish = a.oncancel = () => {
    if (sliding.get(el) !== a) return;
    sliding.delete(el);
    el.style.marginBottom = "";
  };
};

export function useSheet(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [wanted, setWanted] = useState<Place>(1);
  const place: Place = enabled ? wanted : 1;
  const from = useRef<number | null>(null);
  const drag = useRef<{ y: number; dy: number; moved: boolean } | null>(null);
  const lifted = useRef(0);
  const skipClick = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || from.current === null) return;
    shift(el, 0);
    const dy = from.current - el.getBoundingClientRect().top;
    from.current = null;
    settle(el, dy, 360);
  }, [place, ref]);

  const set = (next: Place) => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-lifting");
    if (next === place) {
      settle(el, lifted.current, 240);
      lifted.current = 0;
      return;
    }
    lifted.current = 0;
    from.current = el.getBoundingClientRect().top;
    if (next === 0) el.scrollTop = 0;
    setWanted(next);
  };

  const placeRef = useRef(place);
  const setRef = useRef(set);
  useLayoutEffect(() => {
    placeRef.current = place;
    setRef.current = set;
  });

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
      if (!t.on && (dy <= 4 || el.scrollTop > 0)) {
        if (dy < 0) t = null;
        return;
      }
      t.on = true;
      e.preventDefault();
      t.dy = follow(dy, placeRef.current);
      lifted.current = t.dy;
      shift(el, t.dy);
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
          lifted.current = d.dy;
          shift(el, d.dy);
          el.classList.toggle("is-lifting", place === 0 && d.dy < -4);
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
