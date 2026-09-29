// The icons the map screens share, drawn as on the version 6 boards: a 24 box, round caps and
// joins, stroke 1.5 for controls and 1.4 for the organism groups. Size is set where they are used.

import type { Group } from "@/lib/routes";

type P = { size?: number; className?: string };

function Svg({ size = 19, className, stroke = 1.5, fill = "none", children }: P & { stroke?: number; fill?: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 20.5 20.5" />
  </Svg>
);

export const LocationIcon = (p: P) => (
  <Svg {...p}>
    <path d="M20.5 3.5 3.5 10.6l7.2 2.2 2.2 7.2z" />
  </Svg>
);

export const LocationOffIcon = (p: P) => (
  <Svg {...p}>
    <path d="M20.5 3.5 3.5 10.6l7.2 2.2 2.2 7.2z" />
    <path d="M3.5 3.5l17 17" />
  </Svg>
);

export const PinIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </Svg>
);

export const ClearIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </Svg>
);

export const BackIcon = (p: P) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
);

export const ChevronIcon = (p: P) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const BookmarkIcon = ({ filled = false, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M7 3.8h10V20l-5-3.6L7 20z" />
  </Svg>
);

export const RoutesIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
  </Svg>
);

export const LeafIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
    <path d="M5 19 13 11" />
  </Svg>
);

export const OfflineIcon = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 8.5a14 14 0 0 1 19 0" />
    <path d="M6 12.2a9 9 0 0 1 12 0" />
    <path d="M9.5 15.8a4 4 0 0 1 5 0" />
    <circle cx="12" cy="19" r=".8" />
    <path d="M4 4l16 16" />
  </Svg>
);

const GROUP_PATHS: Record<Group, React.ReactNode> = {
  plants: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c-4 0-6.5-2.5-6.5-7 4.2 0 6.5 2.6 6.5 7z" />
      <path d="M12 11c0-3.8 2.2-6 6-6 0 3.8-2.2 6-6 6z" />
    </>
  ),
  herbs: (
    <>
      <path d="M12 21V8" />
      <path d="M12 12.5c-2.8 0-4.6-1.8-4.6-4.6 2.8 0 4.6 1.8 4.6 4.6z" />
      <path d="M12 9.5c0-2.8 1.8-4.6 4.6-4.6 0 2.8-1.8 4.6-4.6 4.6z" />
      <path d="M12 17c2.6 0 4.2-1.6 4.2-4.2-2.6 0-4.2 1.6-4.2 4.2z" />
    </>
  ),
  mushrooms: (
    <>
      <path d="M4 12.5a8 8 0 0 1 16 0z" />
      <path d="M10 12.5V18a2 2 0 0 0 4 0v-5.5" />
    </>
  ),
  birds: (
    <>
      <path d="M3.5 13.5c3.5.5 6-1 7.5-4.2C12.2 6.8 14 5.5 16.2 5.5c1.7 0 2.8 1 3.3 2.2l1.5.6-1.6.9c-.3 5-4 8.3-9 8.3H6" />
      <path d="M9.5 16.8 8.6 20M12.5 16.8V20" />
    </>
  ),
  mammals: (
    <>
      <circle cx="6.5" cy="10.5" r="1.7" />
      <circle cx="10" cy="6.5" r="1.7" />
      <circle cx="14" cy="6.5" r="1.7" />
      <circle cx="17.5" cy="10.5" r="1.7" />
      <path d="M12 11.5c-3 0-5.3 3.4-5.3 5.8 0 1.4 1 2.3 2.3 2.3 1.2 0 1.9-.6 3-.6s1.8.6 3 .6c1.3 0 2.3-.9 2.3-2.3 0-2.4-2.3-5.8-5.3-5.8z" />
    </>
  ),
};

export const GroupIcon = ({ group, ...p }: P & { group: Group }) => (
  <Svg size={16} stroke={1.4} {...p}>
    {GROUP_PATHS[group]}
  </Svg>
);
