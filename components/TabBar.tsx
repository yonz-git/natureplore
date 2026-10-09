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
    // drawn 20% bigger than the others (app/tabbar.css), its stroke thinner to keep the same line
    big: true,
    icon: (
      <g transform="scale(0.5626) translate(0.83 5.33)" fill="currentColor" strokeWidth="1.22">
        <path d="M9.239 31.927c.009.006.021.003.03.009A.5.5 0 0 0 9.5 32a.5.5 0 0 0 .132-.018L20.5 29.016l10.868 2.966A.5.5 0 0 0 31.5 32a.5.5 0 0 0 .23-.065c.01-.005.021-.003.03-.009l9-5.5a.5.5 0 0 0 .22-.563l-4.984-17.5a.5.5 0 0 0-.726-.3l-4.962 2.784a.501.501 0 0 0 .491.872l4.409-2.475l4.707 16.526l-8.015 4.899l-1.904-15.231a.5.5 0 0 0-.993.124l1.907 15.259L21 28.116v-2.73a.5.5 0 0 0-1 0v2.73l-9.911 2.705l1.907-15.259a.5.5 0 1 0-.993-.124L9.1 30.669l-8.015-4.898L5.792 9.246l4.409 2.475a.501.501 0 0 0 .491-.872L5.729 8.064a.496.496 0 0 0-.725.3L.02 25.864a.5.5 0 0 0 .22.563z" />
        <path d="M20.161 23.368a.5.5 0 0 0 .675.003C21.169 23.068 29 15.882 29 8.5C29 3.733 25.267 0 20.5 0S12 3.733 12 8.5c0 7.254 7.828 14.56 8.161 14.868M20.5 1C24.775 1 28 4.224 28 8.5c0 6.097-5.993 12.337-7.497 13.807C19.002 20.82 13 14.498 13 8.5C13 4.224 16.225 1 20.5 1" />
        <path d="M25 8.5C25 6.019 22.981 4 20.5 4S16 6.019 16 8.5s2.019 4.5 4.5 4.5S25 10.981 25 8.5M20.5 12c-1.93 0-3.5-1.57-3.5-3.5S18.57 5 20.5 5S24 6.57 24 8.5S22.43 12 20.5 12" />
      </g>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    // two hands holding up the earth, a filled drawing on a 512 grid scaled into the 24 box
    icon: (
      <path
        transform="scale(0.046875)"
        fill="currentColor"
        stroke="none"
        d="M256 23c-71.69 0-130 58.31-130 130s58.31 130 130 130s130-58.31 130-130S327.69 23 256 23m-8.33 31.127l-11.774 35.246l52.145-5.463l-5.186-17.457l14.624 4.049v19.367l22.843 1.49l-4.468-17.38l12.007-6.954C352.41 87.553 368 118.417 368 153c0 16.668-3.625 32.471-10.125 46.672l-26.13 4.422v31.478a112 112 0 0 1-16.099 12.29l-11.216-17.448l-21.852 5.96l6.14 23.786A112.4 112.4 0 0 1 256 265c-31.013 0-59.037-12.535-79.297-32.826l19.96-2.752l13.41-26.322l-42.712-21.354l30.295-25.826l-26.32-21.85l-26.893 8.963c3.112-35.448 22.653-66.103 50.994-84.318l5.696 45.556zm38.88 64.217l-36.17 23.176l31.606 28.093l22.827-6.672l-2.108 27.391l41.79-10.535l-15.804-35.818l-25.283.351l22.475-19.314l-39.332-6.672zm-37.573 40.383l-19.315 8.427l13.695 10.184zm-45.362 3.154l-13.408 15.89l37.147 26.108zm59.76 8.785l-13.695 25.637l33.01 22.474l-11.59-16.506l14.398-17.207zM60.17 198.061c-8.818-.137-17.843 11.093-17.895 39.882c-.078 44.153-4.356 56.616 16.077 106.551C73.335 381.112 80.054 409.257 128 432c5.68 20.022 3.413 24.73-.44 41.84c-3.596 15.974 33.423 18.91 60.534 5.453c29.091-15.868 26.65-59.557 21.453-89.184c-6.044-34.454-25.06-41.615-41.543-56.332c-17.115-24.475-21.098-68.813-48.856-86.699c-5.797-3.735-35.37-7.527 5.262 93.942c-53.571-13.268-43.813-74.773-47.687-120.31c-1.154-13.561-8.773-22.53-16.553-22.65zm391.66 0c-7.78.12-15.399 9.088-16.553 22.65c-3.874 45.536 5.884 107.041-47.687 120.309c40.633-101.47 11.059-97.677 5.262-93.942c-27.758 17.886-31.74 62.224-48.856 86.7c-16.482 14.716-35.5 21.877-41.543 56.331c-5.197 29.627-7.638 73.316 21.453 89.184c27.111 13.456 64.13 10.521 60.533-5.453c-3.852-17.11-6.119-21.818-.439-41.84c47.946-22.743 54.665-50.888 69.648-87.506c20.433-49.935 16.155-62.398 16.077-106.55c-.052-28.79-9.077-40.02-17.895-39.883"
      />
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
                  className={"big" in tab ? "tabbar-icon-big" : undefined}
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
