"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

// Map, Learn, Saved: Map is A5, Learn is D0, Saved is E1. The redesign's boards call the first tab
// Routes; it was renamed Map in the prototype on 1 Oct 2026.
// the pin falls onto the map from above and settles with one small bounce, when the Map tab is tapped
function dropPin(link: HTMLElement) {
  const pin = link.querySelector<SVGGElement>(".tab-pin");
  if (!pin || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  pin.getAnimations().forEach((a) => a.cancel());
  pin.animate(
    [
      { transform: "translateY(-13px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1, offset: 0.55, easing: "cubic-bezier(0.33, 0, 0.67, 1)" },
      { transform: "translateY(-2.4px)", offset: 0.78, easing: "cubic-bezier(0.33, 0, 0.67, 1)" },
      { transform: "translateY(0)" },
    ],
    { duration: 560, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  );
}

const TABS = [
  {
    href: "/map",
    label: "Map",
    // a location pin beside a folded map, set in Figma on a 35 by 21 grid, 15% wider than the 24 box
    // and centred on it, the map drawn as a 2-unit line, the pin filled (.design/icons/map-pin.svg); drawn 20%
    // bigger than Saved (app/tabbar.css). The pin is its own group so it can drop in when the tab is
    // tapped.
    big: true,
    icon: (
      <g transform="translate(-1.8 3.72) scale(0.7886)">
        <path d="M27 20V3M27 20H26.667L26.309 19.78C24.4177 18.6162 22.2407 18 20.02 18H20M27 20H27.177C29.3516 19.9999 31.4853 19.4088 33.35 18.29L34 17.9V1H33.75L33.393 1.22C31.5015 2.38399 29.324 3.00018 27.103 3H27M27 3H26.75L26.267 2.71C24.402 1.59103 22.2679 0.999965 20.093 1H20M20 18V1M20 18H19.897M20 1H19.824C17.6491 0.999965 15.515 1.59103 13.65 2.71L13 3.1V20H13.25L13.607 19.78C15.498 18.6164 17.6747 18.0002 19.895 18M19.895 18C19.8957 18 19.8963 18 19.897 18M19.895 18H19.896H19.897M19.895 18H19.75" fill="none" stroke="currentColor" strokeWidth="2" />
        <g className="tab-pin">
          <path d="M5 3C2.25143 3 0 5.20082 0 7.88632C0 8.27833 0.0485714 8.65913 0.138857 9.02509L0.676286 10.3243C0.750572 10.4492 0.828 10.5715 0.912857 10.6891L4.39 16.579C4.87686 17.2026 5.20057 17.0841 5.60543 16.5462L6.884 14.414L7.73257 12.9981L9.44029 10.1504C9.51772 10.0132 9.57857 9.86734 9.63171 9.71782C9.80063 9.31107 9.91232 8.8837 9.96371 8.44745C10 8.08205 10 7.98405 10 7.88632C10 7.538 9.96143 7.1978 9.88829 6.86963C9.40571 4.66713 7.39171 3 5 3ZM5 5.28986C6.48 5.28986 7.65686 6.44011 7.65686 7.88632C7.65686 9.33254 6.47971 10.4825 5 10.4825C3.52 10.4825 2.34314 9.33254 2.34314 7.88632C2.34314 6.44011 3.52029 5.28986 5 5.28986Z" fill="currentColor" fillRule="evenodd" stroke="none" />
        </g>
      </g>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    // the earth held above two cupped hands, set in Figma on a 17 by 23 grid and centred in the 24
    // box at the same height as before (.design/icons/learn-earth-hands.svg); drawn 20% bigger like Map
    big: true,
    icon: (
      <g transform="translate(12 12) scale(1.09) translate(-8.5 -11.5)" fill="currentColor" stroke="none">
        <path d="M13.7689 2.73147C13.0782 2.03399 12.2566 1.47985 11.3512 1.10088C10.4457 0.721904 9.47429 0.525571 8.49273 0.523155C7.51118 0.520739 6.53882 0.712289 5.63151 1.0868C4.72421 1.46131 3.89984 2.0114 3.20577 2.70547C2.51171 3.39954 1.96161 4.2239 1.5871 5.13121C1.21259 6.03851 1.02104 7.01087 1.02346 7.99243C1.02588 8.97399 1.22221 9.94539 1.60118 10.8508C1.98015 11.7563 2.5343 12.5779 3.23177 13.2686C3.92241 13.9661 4.74406 14.5202 5.64951 14.8992C6.55496 15.2781 7.52637 15.4745 8.50793 15.4769C9.48948 15.4793 10.4618 15.2878 11.3692 14.9133C12.2765 14.5387 13.1008 13.9887 13.7949 13.2946C14.489 12.6005 15.039 11.7762 15.4136 10.8688C15.7881 9.96154 15.9796 8.98918 15.9772 8.00762C15.9748 7.02606 15.7785 6.05466 15.3995 5.14921C15.0205 4.24376 14.4664 3.42211 13.7689 2.73147ZM2.11379 8.00003C2.11354 7.43479 2.18849 6.87203 2.33666 6.32655C2.58081 6.85211 2.9354 7.30616 3.17655 7.84535C3.48823 8.53856 4.32513 8.3463 4.69469 8.95368C5.02266 9.49288 4.6724 10.1748 4.91788 10.7389C5.09617 11.1484 5.51662 11.2379 5.80668 11.5372C6.10305 11.8393 6.09673 12.2531 6.14197 12.6469C6.19298 13.1096 6.27578 13.5683 6.38978 14.0197C6.38978 14.023 6.38978 14.0267 6.39244 14.03C3.90336 13.1558 2.11379 10.7832 2.11379 8.00003ZM8.50033 14.3866C8.14366 14.3865 7.78762 14.3566 7.43591 14.2974C7.43957 14.2073 7.44123 14.1231 7.45021 14.0646C7.53104 13.5357 7.79582 13.0184 8.15306 12.6226C8.50599 12.2321 8.98963 11.968 9.28767 11.5249C9.57972 11.0925 9.6672 10.5104 9.54679 10.0051C9.3695 9.25871 8.3553 9.00956 7.80846 8.60475C7.49412 8.37191 7.21438 8.012 6.80158 7.98273C6.61131 7.96942 6.45198 8.01034 6.26338 7.96177C6.09041 7.91687 5.9547 7.82373 5.77042 7.84801C5.42615 7.89325 5.20894 8.26114 4.83905 8.21125C4.48812 8.16435 4.12655 7.75355 4.04672 7.41925C3.94427 6.98949 4.28422 6.85012 4.64845 6.81186C4.80046 6.7959 4.9711 6.7786 5.11713 6.83448C5.30939 6.90567 5.4002 7.09394 5.57284 7.18907C5.89649 7.36669 5.96202 7.08296 5.91245 6.79557C5.83828 6.36514 5.75179 6.18984 6.13565 5.89347C6.40176 5.68923 6.62928 5.54154 6.5867 5.17465C6.56142 4.9591 6.44333 4.86164 6.55344 4.64709C6.63693 4.48377 6.86611 4.33642 7.01546 4.23895C7.40098 3.98748 8.66698 4.00611 8.14974 3.30226C7.99772 3.0957 7.71732 2.72648 7.45121 2.67592C7.11858 2.61305 6.97089 2.98427 6.73904 3.14792C6.49955 3.31723 6.0332 3.50949 5.79337 3.24771C5.47072 2.89545 6.00725 2.78003 6.126 2.53388C6.18089 2.41912 6.126 2.25979 6.03353 2.10978C6.1535 2.05922 6.27547 2.01232 6.39943 1.96907C6.47711 2.02645 6.56927 2.06101 6.66553 2.06886C6.88806 2.0835 7.09795 1.96309 7.29221 2.11477C7.50776 2.28108 7.6631 2.49131 7.94916 2.5432C8.22591 2.59342 8.51896 2.4321 8.58748 2.14869C8.62906 1.97639 8.58748 1.79444 8.54757 1.61648C9.79162 1.62364 11.0061 1.99621 12.0402 2.68789C11.9737 2.66261 11.8942 2.66561 11.7961 2.71118C11.5941 2.80498 11.3081 3.04381 11.2845 3.28064C11.2575 3.54941 11.654 3.58733 11.8423 3.58733C12.125 3.58733 12.4114 3.46093 12.3203 3.13428C12.2807 2.99258 12.2268 2.84523 12.14 2.75608C12.3487 2.90088 12.5486 3.05793 12.7387 3.22642C12.7357 3.22942 12.7327 3.23208 12.7297 3.2354C12.5382 3.43498 12.3156 3.59298 12.1846 3.8358C12.0921 4.00678 11.988 4.08794 11.8007 4.13218C11.6976 4.15646 11.5798 4.16544 11.4934 4.23463C11.2525 4.42423 11.3896 4.87994 11.6178 5.01665C11.9062 5.18928 12.3339 5.10812 12.5515 4.86164C12.7214 4.66872 12.8216 4.33376 13.1272 4.33409C13.2618 4.33381 13.3911 4.3865 13.4872 4.48078C13.6136 4.61184 13.5886 4.73424 13.6155 4.8979C13.6631 5.18862 13.9196 5.03095 14.0756 4.88426C14.1893 5.08664 14.2919 5.29506 14.3829 5.50861C14.2113 5.75576 14.0749 6.02519 13.6621 5.73713C13.415 5.56449 13.263 5.31402 12.9526 5.23619C12.6815 5.16966 12.4038 5.23885 12.136 5.28508C11.8316 5.33797 11.4707 5.36126 11.2399 5.59177C11.0167 5.81397 10.8986 6.11134 10.6611 6.33454C10.2017 6.76696 10.0078 7.23896 10.3052 7.85034C10.5913 8.4381 11.1897 8.7571 11.8353 8.71519C12.4696 8.67294 13.1286 8.30505 13.1103 9.22677C13.1036 9.55309 13.1718 9.77894 13.2719 10.082C13.3647 10.3614 13.3584 10.6321 13.3797 10.9205C13.4 11.2582 13.4528 11.5932 13.5374 11.9208C12.9412 12.6884 12.1774 13.3096 11.3044 13.737C10.4314 14.1643 9.47231 14.3865 8.50033 14.3866Z" />
        <path d="M3.74978 15.1912C3.74978 14.7965 3.38624 14.4769 2.93739 14.4769C2.48855 14.4769 2.125 14.7965 2.125 15.1912V19.1465C2.125 19.6019 2.33013 20.0376 2.6957 20.359L4.72465 22.1429C4.96837 22.3572 5.29942 22.4769 5.64469 22.4769H6.99935C7.53756 22.4769 7.97422 22.0929 7.97422 21.6197V20.2108C7.97422 19.6804 7.73456 19.1715 7.30806 18.7965L6.79422 18.3447L5.8356 17.5019C5.58172 17.2787 5.16944 17.2787 4.91556 17.5019C4.66169 17.7251 4.66169 18.0876 4.91556 18.3108L5.87419 19.1537C6.09759 19.3501 6.06104 19.6751 5.79904 19.8287C5.60203 19.9447 5.33801 19.9215 5.16944 19.7733L4.12958 18.8608C3.88586 18.6465 3.74978 18.3554 3.74978 18.0519V15.1912ZM13.2482 15.1912V18.0519C13.2482 18.3554 13.1121 18.6465 12.8684 18.8608L11.8306 19.7733C11.662 19.9215 11.398 19.9447 11.201 19.8287C10.939 19.6751 10.9024 19.3483 11.1258 19.1537L12.0844 18.3108C12.3383 18.0876 12.3383 17.7251 12.0844 17.5019C11.8306 17.2787 11.4183 17.2787 11.1644 17.5019L10.2058 18.3447L9.69194 18.7965C9.26544 19.1715 9.02578 19.6804 9.02578 20.2108V21.6197C9.02578 22.0929 9.46244 22.4769 10.0006 22.4769H11.3553C11.7006 22.4769 12.0316 22.3572 12.2753 22.1429L14.3043 20.359C14.6699 20.0376 14.875 19.6019 14.875 19.1465L14.873 15.1912C14.873 14.7965 14.5094 14.4769 14.0606 14.4769C13.6117 14.4769 13.2482 14.7965 13.2482 15.1912Z" />
      </g>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    // two bookmarks, one behind the other, set in Figma on a 178 by 220 grid and fitted to the 24
    // box's height less a tenth (.design/icons/saved-bookmarks.svg); drawn 20% bigger like Map and Learn
    big: true,
    icon: (
      <g transform="translate(3.26 1.2) scale(0.09819)" fill="none" stroke="currentColor" strokeLinejoin="round">
        <path
          strokeWidth="16"
          d="M36.5 34.6154V27.9615C36.5154 22.6721 38.6221 17.6038 42.3602 13.8636C46.0982 10.1234 51.1637 8.01536 56.45 8H149.55C154.836 8.01536 159.902 10.1234 163.64 13.8636C167.378 17.6038 169.485 22.6721 169.5 27.9615V181L145.5 157"
        />
        <path
          strokeWidth="19"
          d="M123.184 32H30.8158C25.1675 32.0164 19.7553 34.2721 15.7614 38.2744C11.7674 42.2766 9.5164 47.7 9.5 53.36V210L77 153.04L144.5 210V53.36C144.484 47.7 142.233 42.2766 138.239 38.2744C134.245 34.2721 128.832 32.0164 123.184 32Z"
        />
      </g>
    ),
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
