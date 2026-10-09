"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// Map, Learn, Saved: Map is A5, Learn is D0, Saved is E1. The redesign's boards call the first tab
// Routes; it was renamed Map in the prototype on 1 Oct 2026.
const TABS = [
  {
    href: "/map",
    label: "Map",
    // a folded map under a location pin, drawn as filled 1-unit outlines on a 41 grid: the stroke
    // round them thickens the line to the other icons' 1.5 at this size, and the group fits the
    // 41-wide drawing, stroke included, into the 24 box the others use
    icon: (
      <g transform="scale(0.5626) translate(0.83 5.33)" fill="currentColor" strokeWidth="1.66">
        <path d="M9.239 31.927c.009.006.021.003.03.009A.5.5 0 0 0 9.5 32a.5.5 0 0 0 .132-.018L20.5 29.016l10.868 2.966A.5.5 0 0 0 31.5 32a.5.5 0 0 0 .23-.065c.01-.005.021-.003.03-.009l9-5.5a.5.5 0 0 0 .22-.563l-4.984-17.5a.5.5 0 0 0-.726-.3l-4.962 2.784a.501.501 0 0 0 .491.872l4.409-2.475l4.707 16.526l-8.015 4.899l-1.904-15.231a.5.5 0 0 0-.993.124l1.907 15.259L21 28.116v-2.73a.5.5 0 0 0-1 0v2.73l-9.911 2.705l1.907-15.259a.5.5 0 1 0-.993-.124L9.1 30.669l-8.015-4.898L5.792 9.246l4.409 2.475a.501.501 0 0 0 .491-.872L5.729 8.064a.496.496 0 0 0-.725.3L.02 25.864a.5.5 0 0 0 .22.563z" />
        <path d="M20.161 23.368a.5.5 0 0 0 .675.003C21.169 23.068 29 15.882 29 8.5C29 3.733 25.267 0 20.5 0S12 3.733 12 8.5c0 7.254 7.828 14.56 8.161 14.868M20.5 1C24.775 1 28 4.224 28 8.5c0 6.097-5.993 12.337-7.497 13.807C19.002 20.82 13 14.498 13 8.5C13 4.224 16.225 1 20.5 1" />
        <path d="M25 8.5C25 6.019 22.981 4 20.5 4S16 6.019 16 8.5s2.019 4.5 4.5 4.5S25 10.981 25 8.5M20.5 12c-1.93 0-3.5-1.57-3.5-3.5S18.57 5 20.5 5S24 6.57 24 8.5S22.43 12 20.5 12" />
      </g>
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
                  width="1.375rem"
                  height="1.375rem"
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
