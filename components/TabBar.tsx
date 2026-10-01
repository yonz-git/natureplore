"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// Map, Learn, Saved: Map is A5, Learn is D0, Saved is E1. The redesign's boards call the first tab
// Routes; it was renamed Map in the prototype on 1 Oct 2026.
// The icons are the same set the welcome's nav uses.
const TABS = [
  {
    href: "/map",
    label: "Map",
    icon: (
      <>
        <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
        <path d="M9 4v13.5M15 6.5V20" />
      </>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: (
      <>
        <path d="M12 6.5C10.4 5.2 8 4.6 4 4.8v13.6c4-.2 6.4.4 8 1.6 1.6-1.2 4-1.8 8-1.6V4.8c-4-.2-6.4.4-8 1.7z" />
        <path d="M12 6.5V20" />
      </>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: <path d="M7 3.8h10V20l-5-3.6L7 20z" />,
  },
];

type Thumb = { x: number; y: number; w: number; h: number };

export default function TabBar() {
  const pathname = usePathname();
  const pill = useRef<HTMLUListElement>(null);
  // The lime pill under the current tab is one element that slides and resizes to the tab, so a
  // change of tab is a movement rather than a swap. It only animates once it has a place: on the
  // first paint it appears under its tab without sliding in from the corner.
  const [thumb, setThumb] = useState<Thumb | null>(null);
  const [placed, setPlaced] = useState(false);

  useLayoutEffect(() => {
    const ul = pill.current;
    if (!ul) return;
    const measure = () => {
      const tab = ul.querySelector<HTMLElement>(".tabbar-tab.is-current");
      if (!tab) return setThumb(null);
      // from the rects, not offsetLeft and offsetTop, which round: the pill's 0.5px edge would
      // otherwise leave the thumb a pixel off its tab
      const u = ul.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      const cs = getComputedStyle(ul);
      setThumb({
        x: t.left - u.left - parseFloat(cs.borderLeftWidth),
        y: t.top - u.top - parseFloat(cs.borderTopWidth),
        w: t.width,
        h: t.height,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    ul.querySelectorAll(".tabbar-tab").forEach((t) => ro.observe(t));
    return () => ro.disconnect();
  }, [pathname]);

  useLayoutEffect(() => {
    if (!thumb || placed) return;
    const id = requestAnimationFrame(() => setPlaced(true));
    return () => cancelAnimationFrame(id);
  }, [thumb, placed]);

  return (
    <nav aria-label="Tabs" className="tabbar">
      <ul ref={pill} className="tabbar-pill glass glass-nav">
        <li
          className={`tabbar-thumb${placed ? " is-placed" : ""}`}
          aria-hidden="true"
          style={
            thumb
              ? { width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }
              : { opacity: 0 }
          }
        />
        {TABS.map((tab) => {
          const current = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={`tabbar-tab${current ? " is-current" : ""}`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
