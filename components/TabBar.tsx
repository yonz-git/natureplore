"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// Map, Learn, Saved: Map is A5, Learn is D0, Saved is E1. The redesign's boards call the first tab
// Routes; it was renamed Map in the prototype on 1 Oct 2026.
// the Map icon's pin, the teardrop without its hole: the pin itself, and the gap it leaves in the map
const PIN_OUTLINE =
  "M57.5 0C47.88 0 40 7.86 40 17.451c0 1.4.17 2.76.486 4.067l1.881 4.64c.26.446.531.883.828 1.303l12.17 21.035c1.704 2.227 2.837 1.804 4.254-.117l4.475-7.615l2.97-5.057l5.977-10.17c.271-.49.484-1.011.67-1.545a17.3 17.3 0 0 0 1.162-4.537C75 18.15 75 17.8 75 17.451c0-1.244-.135-2.459-.391-3.631C72.92 5.954 65.871 0 57.5 0z";

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
          <path d={PIN_OUTLINE} fill="#000" />
        </mask>
        <path
          mask="url(#tab-map-pin)"
          fillRule="evenodd"
          d="M34.166 24.453l-30.613-14.22A2.5 2.5 0 0 0 2.523 10A2.5 2.5 0 0 0 0 12.5v70.29a2.5 2.5 0 0 0 1.447 2.267l31.666 14.71a2.5 2.5 0 0 0 1.076.233a2.5 2.5 0 0 0 1.032-.232l30.613-14.221l30.613 14.22A2.5 2.5 0 0 0 100 97.5V27.21a2.5 2.5 0 0 0-1.447-2.267L65.83 9.74zM5 16.418l27.275 12.67l.371 64.95L5 81.192zM35.277 29.451L64.09 16.07l.232 64.664l-28.676 13.323zM67.02 15.8L95 28.805v64.777L67.322 80.725z"
        />
        <g className="tab-pin">
          <path fillRule="evenodd" d={`${PIN_OUTLINE}m0 8.178c5.18 0 9.299 4.108 9.299 9.273s-4.12 9.272-9.299 9.272c-5.18 0-9.299-4.107-9.299-9.272s4.12-9.273 9.299-9.273z`} />
        </g>
      </g>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    // two hands holding up the earth, a filled drawing on a 512 grid scaled into the 24 box, drawn
    // 20% bigger like Map
    big: true,
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
