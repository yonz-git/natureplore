"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// Map, Learn, Saved: Map is A5, Learn is D0, Saved is E1. The redesign's boards call the first tab
// Routes; it was renamed Map in the prototype on 1 Oct 2026.
// the Map icon's pin, the teardrop without its hole: the pin itself, and the gap it leaves in the map
const PIN_OUTLINE =
  "M57.5 0C47.88 0 40 7.86 40 17.451c0 1.4.17 2.76.486 4.067l1.881 4.64c.26.446.531.883.828 1.303l12.17 21.035c1.704 2.227 2.837 1.804 4.254-.117l4.475-7.615l2.97-5.057l5.977-10.17c.271-.49.484-1.011.67-1.545a17.3 17.3 0 0 0 1.162-4.537C75 18.15 75 17.8 75 17.451c0-1.244-.135-2.459-.391-3.631C72.92 5.954 65.871 0 57.5 0z";

// the pin moved onto the map's right panel and drawn 4% bigger than in the source drawing, placed by its tip
const PIN_GROW = "translate(81 46) scale(1.04) translate(-57.4 -49.9)";

// the pin falls onto the map from above and settles with one small bounce, when the Map tab is tapped
function dropPin(link: HTMLElement) {
  const pin = link.querySelector<SVGGElement>(".tab-pin");
  if (!pin || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  pin.getAnimations().forEach((a) => a.cancel());
  pin.animate(
    [
      { transform: "translateY(-38px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1, offset: 0.55, easing: "cubic-bezier(0.33, 0, 0.67, 1)" },
      { transform: "translateY(-7px)", offset: 0.78, easing: "cubic-bezier(0.33, 0, 0.67, 1)" },
      { transform: "translateY(0)" },
    ],
    { duration: 560, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  );
}

const TABS = [
  {
    href: "/map",
    label: "Map",
    // a folded map with a location pin, a filled drawing on a 100 grid scaled into the 24 box, drawn
    // 20% bigger than Saved (app/tabbar.css). The pin is its own shape so it can drop onto the map
    // when the tab is tapped; the map is masked by the pin's outline, so the fold lines never show
    // through the pin's hole and the pin lands in its own gap.
    big: true,
    icon: (
      <g transform="scale(0.24)" fill="currentColor" stroke="none">
        <mask id="tab-map-pin" maskUnits="userSpaceOnUse" x="-5" y="-5" width="110" height="110">
          <rect x="-5" y="-5" width="110" height="110" fill="#fff" />
          <path d={PIN_OUTLINE} transform={PIN_GROW} fill="#000" />
        </mask>
        <path
          mask="url(#tab-map-pin)"
          fillRule="evenodd"
          d="M34.166 24.453l-30.613-14.22A2.5 2.5 0 0 0 2.523 10A2.5 2.5 0 0 0 0 12.5v70.29a2.5 2.5 0 0 0 1.447 2.267l31.666 14.71a2.5 2.5 0 0 0 1.076.233a2.5 2.5 0 0 0 1.032-.232l30.613-14.221l30.613 14.22A2.5 2.5 0 0 0 100 97.5V27.21a2.5 2.5 0 0 0-1.447-2.267L65.83 9.74zM5 16.418l27.275 12.67l.371 64.95L5 81.192zM35.277 29.451L64.09 16.07l.232 64.664l-28.676 13.323zM67.02 15.8L95 28.805v64.777L67.322 80.725z"
        />
        <g className="tab-pin">
          <path transform={PIN_GROW} fillRule="evenodd" d={`${PIN_OUTLINE}m0 8.178c5.18 0 9.299 4.108 9.299 9.273s-4.12 9.272-9.299 9.272c-5.18 0-9.299-4.107-9.299-9.272s4.12-9.273 9.299-9.273z`} />
        </g>
      </g>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    // the earth held between two cupped hands: the earth (512 grid) above the hands (640 grid), set
    // together in the 24 box; drawn 20% bigger like Map
    big: true,
    icon: (
      <g fill="currentColor" stroke="none">
        <path
          transform="translate(4.57 1.07) scale(0.02902)"
          d="M414.39 97.74A224 224 0 1 0 97.61 414.52A224 224 0 1 0 414.39 97.74M64 256.13a191.6 191.6 0 0 1 6.7-50.31c7.34 15.8 18 29.45 25.25 45.66c9.37 20.84 34.53 15.06 45.64 33.32c9.86 16.21-.67 36.71 6.71 53.67c5.36 12.31 18 15 26.72 24c8.91 9.08 8.72 21.52 10.08 33.36a305 305 0 0 0 7.45 41.27c0 .1 0 .21.08.31C117.8 411.13 64 339.8 64 256.13m192 192a193 193 0 0 1-32-2.68c.11-2.71.16-5.24.43-7c2.43-15.9 10.39-31.45 21.13-43.35c10.61-11.74 25.15-19.68 34.11-33c8.78-13 11.41-30.5 7.79-45.69c-5.33-22.44-35.82-29.93-52.26-42.1c-9.45-7-17.86-17.82-30.27-18.7c-5.72-.4-10.51.83-16.18-.63c-5.2-1.35-9.28-4.15-14.82-3.42c-10.35 1.36-16.88 12.42-28 10.92c-10.55-1.41-21.42-13.76-23.82-23.81c-3.08-12.92 7.14-17.11 18.09-18.26c4.57-.48 9.7-1 14.09.68c5.78 2.14 8.51 7.8 13.7 10.66c9.73 5.34 11.7-3.19 10.21-11.83c-2.23-12.94-4.83-18.21 6.71-27.12c8-6.14 14.84-10.58 13.56-21.61c-.76-6.48-4.31-9.41-1-15.86c2.51-4.91 9.4-9.34 13.89-12.27c11.59-7.56 49.65-7 34.1-28.16c-4.57-6.21-13-17.31-21-18.83c-10-1.89-14.44 9.27-21.41 14.19c-7.2 5.09-21.22 10.87-28.43 3c-9.7-10.59 6.43-14.06 10-21.46c1.65-3.45 0-8.24-2.78-12.75q5.41-2.28 11-4.23a15.6 15.6 0 0 0 8 3c6.69.44 13-3.18 18.84 1.38c6.48 5 11.15 11.32 19.75 12.88c8.32 1.51 17.13-3.34 19.19-11.86c1.25-5.18 0-10.65-1.2-16a190.83 190.83 0 0 1 105 32.21c-2-.76-4.39-.67-7.34.7c-6.07 2.82-14.67 10-15.38 17.12c-.81 8.08 11.11 9.22 16.77 9.22c8.5 0 17.11-3.8 14.37-13.62c-1.19-4.26-2.81-8.69-5.42-11.37a193 193 0 0 1 18 14.14c-.09.09-.18.17-.27.27c-5.76 6-12.45 10.75-16.39 18.05c-2.78 5.14-5.91 7.58-11.54 8.91c-3.1.73-6.64 1-9.24 3.08c-7.24 5.7-3.12 19.4 3.74 23.51c8.67 5.19 21.53 2.75 28.07-4.66c5.11-5.8 8.12-15.87 17.31-15.86a15.4 15.4 0 0 1 10.82 4.41c3.8 3.94 3.05 7.62 3.86 12.54c1.43 8.74 9.14 4 13.83-.41a192 192 0 0 1 9.24 18.77c-5.16 7.43-9.26 15.53-21.67 6.87c-7.43-5.19-12-12.72-21.33-15.06c-8.15-2-16.5.08-24.55 1.47c-9.15 1.59-20 2.29-26.94 9.22c-6.71 6.68-10.26 15.62-17.4 22.33c-13.81 13-19.64 27.19-10.7 45.57c8.6 17.67 26.59 27.26 46 26c19.07-1.27 38.88-12.33 38.33 15.38c-.2 9.81 1.85 16.6 4.86 25.71c2.79 8.4 2.6 16.54 3.24 25.21a158 158 0 0 0 4.74 30.07A191.75 191.75 0 0 1 256 448.13"
        />
        <path
          transform="translate(1.5 5.1) scale(0.0328)"
          d="M80 168c0-22.1-17.9-40-40-40S0 145.9 0 168v221.5c0 25.5 10.1 49.9 28.1 67.9l99.9 99.9c12 12 28.3 18.7 45.3 18.7H240c26.5 0 48-21.5 48-48v-78.9c0-29.7-11.8-58.2-32.8-79.2l-25.3-25.3l-47.2-47.2c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l47.2 47.2c11 11 9.2 29.2-3.7 37.8c-9.7 6.5-22.7 5.2-31-3.1l-51.2-51.1c-12-12-18.7-28.3-18.7-45.3zm480 0v160.2c0 17-6.7 33.3-18.7 45.3l-51.1 51.1c-8.3 8.3-21.3 9.6-31 3.1c-12.9-8.6-14.7-26.9-3.7-37.8l47.2-47.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-47.2 47.2l-25.3 25.3c-21 21-32.8 49.5-32.8 79.2V528c0 26.5 21.5 48 48 48h66.7c17 0 33.3-6.7 45.3-18.7l99.9-99.9c18-18 28.1-42.4 28.1-67.9L640 168c0-22.1-17.9-40-40-40s-40 17.9-40 40"
        />
      </g>
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
                onClick={tab.href === "/map" ? (e) => dropPin(e.currentTarget) : undefined}
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
