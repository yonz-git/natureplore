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
    // the earth resting in an open hand: two filled drawings, the earth (100 grid) above the hand
    // (576 by 512 grid), set together in the 24 box; drawn 20% bigger like Map
    big: true,
    icon: (
      <g fill="currentColor" stroke="none">
        <path
          transform="translate(7.2 2.2) scale(0.136)"
          d="M50 0C22.404 0 0 22.404 0 50s22.404 50 50 50c27.546 0 49.911-22.324 49.992-49.852A2 2 0 0 0 100 50a2 2 0 0 0-.006-.133C99.922 22.332 77.552 0 50 0m8.133 3.715q1.089.188 2.16.428c.744.632 1.378 1.1 1.492.345C78.807 8.877 92.068 22.557 95.88 39.805c-.754 4.286 1.668 9.599.52 12.896c-.44-1.527-.028-2.514-1.057-1.244c-1.988-3.484-1.707-9.881-5.237-11.277c-.922-3.45-2.77-3.022-6.373-2.319c-5.698-.938 3.37 1.85.715 4.72c-.631 3.07-3.419 5.951-6.285 7.64c-2.031 1.23-7.554 5.551-2.158 3.55c2.027.143 3.62-3.158 4.318.215c-1.128 4.01-2.56 8.157-5.978 10.807c-2.23 1.875-4.533 5.706-5.188 7.05c.633 1.028-.59 3.93.56 4.653c1.952 6.136-6.766 5.61-6.507 10.436c-2.856 2.63-5.653 6.488-10.227 6.78c-5.877 2.406-8.723-3.776-11.18-7.847c-4.435-3.129 1.089-6.92-1.113-10.554c-.843-3.638-6.001-5.565-4.236-9.561c1.691-3.345-4.58-1.954-5.174-5.295c-3.216-1.028-5.814 2.032-9.244.26c-5.192.534-5.812-6.2-8.455-8.988c-.234-4.29 1.25-8.417 2.463-12.54c.886-.992 1.63-1.81 2.059-2.47c2.334-3.3 4.604-4.53 5.76-6.254c1.202-.743 2.465-1.57 4.478-2.188c3.701.24 7.655-1.373 11.498-1.34c2.982.502-1.151 5.187 3.154 4.71c1.233.085 4.212 4.066 5.082 1.822c1.952-4.757 6.561 1.514 9.785-.344c3.395 1.846 6.1-2.769 3.655-4.64c.084 2.058-2.084 2.253-2.168.331c-2.45-1.396-5.916 3.206-8.155.293c-3.22-1.607-2.64-6.182-6.185-7.298c-.785-.494-1.195-.727-1.342-.768c-.637-.177 3.67 3.217 3.916 4.272c-1.842-.965-2.768 4.574-4.275 3.427c-2.164-1.814-1.357-2.458 1.156-2.83c1.498-.033-5.34-5.916-4.082-.55c-2.925 2.394-1-3.933.443-3.688c-3.008-.142-5.04.945-7.523 2.838c-1.042 2.085-3.052 3.516-5.235 3.683a208 208 0 0 1-1.593-.154c.1-.643-.25-1.182-1.282-1.28c.911-3.697 2.917-7.554 7.27-5.519c1.236-2.689-.806-4.02 1.885-5.24c-3.943 1.735.797-2.663-2.59-.963c-3.22-.579 3.218-3.092 3.453-4.398c4.277-1.797 1.634.412 2.115 2.81c-.039 3.274 2.711.074 4.647-.595c-.113-1.88 4.091-2.5.304-1.813c-2.66-2.556 4.421-4.252 5.54-5.828c3.731-2.17 9.334 1.973 10.75-.047c3.673.245.208-.055-.43-1.451m-19.395.65c-1.698.601-3.434 1.092-5.168 1.588a47 47 0 0 1 5.168-1.588m-3.57 1.854c1.476-.028 2.687.612-.215 1.42c-.617.152-1.272.323-1.902.091c-.34-1.064.969-1.49 2.117-1.511m14.113 3.758c-.352.051-.862.35-1.556 1.021c-.141 1.78-4.603 2.426-.725 2.025c2.366 1.137 3.809-3.271 2.281-3.046m21.49 8.728c-.87-.103-3.546 2.665-.209 3.77c3.04.926.122 5.477 4.79 4.252c.325-2.224-4.93-5.715-4.604-6.793c.401-.841.313-1.194.023-1.229m-13.539.873c-1.394 1.267-3.422 5.047.71 3.776c1.383-1.799 9.35 1.731 6.257-1.39c-2.528-1.885-5.233-.063-6.967-2.386M16.836 33.754c.302.045.662.35 1.105.51l-.232.718c-.38-.12-.91-.2-1.621-.238c.213-.83.454-1.034.748-.99m58.379.508c-1.243 1.102 3.05 3.946 4.082 4.62l.603-.425c1.28-2.21-4.006-1.836-4.685-4.195M62.678 37.29c-.102 1.847 1.911 3.514 2.736 5.342c1.312 2.636 2.846 5.938 4.703 7.236c.227.468 1.337 1.781 1.904 1.06c-1.389-1.925-1.457-4.374-3.6-5.898c-1.558-2.67-3.305-6.077-5.743-7.74m14.586 38.904c.96.065-.26 5.288-1.729 5.998c-1.282 1.526-3.303 5.895-5.687 4.81c.203-4.353 2.936-7.372 6.379-9.91c.477-.653.815-.913 1.037-.898"
        />
        <path
          transform="translate(0 2.7) scale(0.041667)"
          d="M565.3 328.1c-11.8-10.7-30.2-10-42.6 0L430.3 402c-11.3 9.1-25.4 14-40 14H272c-8.8 0-16-7.2-16-16s7.2-16 16-16h78.3c15.9 0 30.7-10.9 33.3-26.6c3.3-20-12.1-37.4-31.6-37.4H192c-27 0-53.1 9.3-74.1 26.3L71.4 384H16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h356.8c14.5 0 28.6-4.9 40-14L564 377c15.2-12.1 16.4-35.3 1.3-48.9"
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
