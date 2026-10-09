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
    // the earth held above two cupped hands, set in Figma on a 15 by 20 grid and scaled into the 24
    // box (.design/icons/learn-earth-hands.svg); drawn 20% bigger like Map
    big: true,
    icon: (
      <g transform="translate(3 0.03) scale(1.2)" fill="currentColor" stroke="none">
        <path d="M12.7689 2.20833C12.0782 1.51086 11.2566 0.956716 10.3512 0.577744C9.4457 0.198772 8.47429 0.00243843 7.49273 2.257e-05C6.51118 -0.00239329 5.53882 0.189156 4.63151 0.563667C3.72421 0.938177 2.89984 1.48827 2.20577 2.18234C1.51171 2.8764 0.961615 3.70077 0.587104 4.60807C0.212594 5.51538 0.0210442 6.48774 0.0234601 7.4693C0.0258759 8.45085 0.22221 9.42226 0.601182 10.3277C0.980154 11.2332 1.5343 12.0548 2.23177 12.7455C2.92241 13.4429 3.74406 13.9971 4.64951 14.376C5.55496 14.755 6.52637 14.9513 7.50793 14.9538C8.48948 14.9562 9.46185 14.7646 10.3692 14.3901C11.2765 14.0156 12.1008 13.4655 12.7949 12.7715C13.489 12.0774 14.039 11.253 14.4136 10.3457C14.7881 9.43841 14.9796 8.46605 14.9772 7.48449C14.9748 6.50293 14.7785 5.53153 14.3995 4.62608C14.0205 3.72062 13.4664 2.89898 12.7689 2.20833ZM1.11379 7.47689C1.11354 6.91165 1.18849 6.34889 1.33666 5.80342C1.58081 6.32898 1.9354 6.78302 2.17655 7.32222C2.48823 8.01542 3.32513 7.82316 3.69469 8.43055C4.02266 8.96975 3.6724 9.65164 3.91788 10.2158C4.09617 10.6253 4.51662 10.7147 4.80668 11.0141C5.10305 11.3161 5.09673 11.7299 5.14197 12.1238C5.19298 12.5865 5.27578 13.0452 5.38978 13.4965C5.38978 13.4999 5.38978 13.5035 5.39244 13.5068C2.90336 12.6327 1.11379 10.26 1.11379 7.47689ZM7.50033 13.8634C7.14366 13.8633 6.78762 13.8335 6.43591 13.7743C6.43957 13.6841 6.44123 13.6 6.45021 13.5414C6.53104 13.0126 6.79582 12.4953 7.15306 12.0995C7.50599 11.709 7.98963 11.4449 8.28767 11.0018C8.57972 10.5694 8.6672 9.98727 8.54679 9.482C8.3695 8.73557 7.3553 8.48643 6.80846 8.08162C6.49412 7.84878 6.21438 7.48887 5.80158 7.4596C5.61131 7.44629 5.45198 7.48721 5.26338 7.43864C5.09041 7.39374 4.9547 7.3006 4.77042 7.32488C4.42615 7.37012 4.20894 7.73801 3.83905 7.68812C3.48812 7.64121 3.12655 7.23041 3.04672 6.89612C2.94427 6.46636 3.28422 6.32698 3.64845 6.28873C3.80046 6.27277 3.9711 6.25547 4.11713 6.31135C4.30939 6.38253 4.4002 6.5708 4.57284 6.66594C4.89649 6.84356 4.96202 6.55983 4.91245 6.27243C4.83828 5.84201 4.75179 5.66671 5.13565 5.37033C5.40176 5.1661 5.62928 5.01841 5.5867 4.65152C5.56142 4.43597 5.44333 4.33851 5.55344 4.12396C5.63693 3.96064 5.86611 3.81328 6.01546 3.71582C6.40098 3.46435 7.66698 3.48298 7.14974 2.77913C6.99772 2.57257 6.71732 2.20334 6.45121 2.15278C6.11858 2.08992 5.97089 2.46113 5.73904 2.62479C5.49955 2.7941 5.0332 2.98636 4.79337 2.72458C4.47072 2.37232 5.00725 2.2569 5.126 2.01075C5.18089 1.89599 5.126 1.73666 5.03353 1.58664C5.1535 1.53608 5.27547 1.48918 5.39943 1.44594C5.47711 1.50332 5.56927 1.53788 5.66553 1.54573C5.88806 1.56037 6.09795 1.43995 6.29221 1.59163C6.50776 1.75795 6.6631 1.96817 6.94916 2.02006C7.22591 2.07029 7.51896 1.90896 7.58748 1.62556C7.62906 1.45326 7.58748 1.27131 7.54757 1.09335C8.79162 1.10051 10.0061 1.47308 11.0402 2.16476C10.9737 2.13948 10.8942 2.14247 10.7961 2.18804C10.5941 2.28185 10.3081 2.52068 10.2845 2.75751C10.2575 3.02628 10.654 3.0642 10.8423 3.0642C11.125 3.0642 11.4114 2.9378 11.3203 2.61115C11.2807 2.46945 11.2268 2.32209 11.14 2.23295C11.3487 2.37775 11.5486 2.5348 11.7387 2.70329C11.7357 2.70628 11.7327 2.70895 11.7297 2.71227C11.5382 2.91185 11.3156 3.06985 11.1846 3.31267C11.0921 3.48365 10.988 3.56481 10.8007 3.60905C10.6976 3.63333 10.5798 3.64231 10.4934 3.7115C10.2525 3.9011 10.3896 4.3568 10.6178 4.49352C10.9062 4.66615 11.3339 4.58499 11.5515 4.33851C11.7214 4.14558 11.8216 3.81062 12.1272 3.81096C12.2618 3.81068 12.3911 3.86337 12.4872 3.95765C12.6136 4.0887 12.5886 4.21111 12.6155 4.37477C12.6631 4.66549 12.9196 4.50782 13.0756 4.36113C13.1893 4.56351 13.2919 4.77193 13.3829 4.98548C13.2113 5.23262 13.0749 5.50206 12.6621 5.214C12.415 5.04136 12.263 4.79089 11.9526 4.71305C11.6815 4.64653 11.4038 4.71571 11.136 4.76195C10.8316 4.81484 10.4707 4.83812 10.2399 5.06864C10.0167 5.29084 9.89861 5.58821 9.66111 5.8114C9.20175 6.24383 9.00782 6.71583 9.30519 7.32721C9.59126 7.91497 10.1897 8.23396 10.8353 8.19205C11.4696 8.14981 12.1286 7.78192 12.1103 8.70364C12.1036 9.02995 12.1718 9.25581 12.2719 9.55884C12.3647 9.83825 12.3584 10.109 12.3797 10.3974C12.4 10.7351 12.4528 11.0701 12.5374 11.3976C11.9412 12.1653 11.1774 12.7865 10.3044 13.2138C9.43142 13.6412 8.47231 13.8634 7.50033 13.8634Z" />
        <path d="M2.40814 14.4895C2.40814 14.1935 2.09307 13.9538 1.70407 13.9538C1.31507 13.9538 1 14.1935 1 14.4895V17.456C1 17.7975 1.17778 18.1243 1.49461 18.3654L3.25303 19.7034C3.46425 19.8641 3.75116 19.9538 4.05039 19.9538H5.22443C5.69088 19.9538 6.06932 19.6659 6.06932 19.3109V18.2542C6.06932 17.8565 5.86162 17.4748 5.49198 17.1935L5.04666 16.8547L4.21585 16.2225C3.99583 16.0551 3.63851 16.0551 3.41849 16.2225C3.19847 16.39 3.19847 16.6618 3.41849 16.8292L4.24929 17.4614C4.44291 17.6087 4.41123 17.8525 4.18417 17.9676C4.01343 18.0547 3.78461 18.0373 3.63851 17.9261L2.7373 17.2417C2.52608 17.081 2.40814 16.8627 2.40814 16.635V14.4895ZM12.5901 14.4895V16.635C12.5901 16.8627 12.4722 17.081 12.2609 17.2417L11.3615 17.9261C11.2154 18.0373 10.9866 18.0547 10.8158 17.9676C10.5888 17.8525 10.5571 17.6074 10.7507 17.4614L11.5815 16.8292C11.8015 16.6618 11.8015 16.39 11.5815 16.2225C11.3615 16.0551 11.0042 16.0551 10.7841 16.2225L9.95334 16.8547L9.50802 17.1935C9.13838 17.4748 8.93068 17.8565 8.93068 18.2542V19.3109C8.93068 19.6659 9.30912 19.9538 9.77556 19.9538H10.9496C11.2488 19.9538 11.5357 19.8641 11.747 19.7034L13.5054 18.3654C13.8222 18.1243 14 17.7975 14 17.456L13.9982 14.4895C13.9982 14.1935 13.6832 13.9538 13.2942 13.9538C12.9052 13.9538 12.5901 14.1935 12.5901 14.4895Z" />
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
