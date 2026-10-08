// The icons the map screens share, drawn as on the version 6 boards: a 24 box, round caps and
// joins, stroke 1.5 for controls and 1.4 for the organism groups. Size is set where they are used, in
// px at the default text size, and drawn in rem so the icons grow with the reader's own font size.

import type { Group } from "@/lib/routes";

type P = { size?: number; className?: string };

function Svg({ size = 19, className, stroke = 1.5, fill = "none", children }: P & { stroke?: number; fill?: string; children: React.ReactNode }) {
  return (
    <svg
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
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
  // three sprigs on one stem, from Lordicon's "herbs" (wired 585): drawn as a filled outline on a 430
  // grid, so filled in the icon's colour rather than stroked, centred on the 24 grid by its drawing
  // and scaled to 16 tall, the height of the other groups
  herbs: (
    <>
      <g className="herbs-sway">
        <path transform="translate(12 12) scale(0.0619) translate(-225.4 -215)" fill="currentColor" stroke="none" d="M407.9 193.8c-3.7-8.2-10.9-19.7-24.1-27.4-7.2-4.2-15.9-7.3-23.7-8.4-11.4-1.6-20.9.8-27.5 7-1.7 1.6-3.1 3.2-4.3 4.9-7.3-1.8-14.8-2.4-22.1-1.7-6.3.6-12 2.2-17 4.2 2.6-8.9 4.6-18.4 6.1-28.4 4.3-1.9 9.3-6.1 13.7-14.3 4.7-8.6 7.8-20.2 8.9-32.6s0-24.3-3-33.6c-5.2-16-14.4-19.1-19.3-19.5-5-.4-14.5 1-22.5 15.8-4.7 8.6-7.8 20.2-8.9 32.6s0 24.3 3 33.6c2.7 8.3 6.5 13.2 10.2 16-5.1 33.8-17.1 60.8-35.7 80.4-.5.5-1 1-1.4 1.5.5-7.8.3-15.6-.8-23.4-.9-6.3-2.3-12.2-3.9-17.7 2.3-2 4.4-4.3 6.1-7 7.9-12.5 7.3-32-1.4-47.2-10-17.6-22.7-27.5-29.4-31.9-9-5.9-19-10.2-29.6-12.8-4.3-1-8.7 1.2-10.4 5.3-4.7 11.3-9.3 29.1-4.8 49.2 3.9 17 18.2 49.7 44.9 51.5 1 .1 2.1.1 3.1.1q2.55 0 4.8-.3c1.2 4.1 2.1 8.5 2.8 13.2 1.7 12.4 1 25.3-2.2 37.5-15.3 9.5-32 15-49.3 20.8-14.4 4.8-29.1 9.8-43.6 17q.3-21.75-4.2-43.2c3.1-2 5.8-4.4 8.3-7.4 11.9-14.4 14.3-38.8 5.9-59.5-9.9-24.3-24.6-39.2-32.5-46-10.6-9.1-22.7-16.3-36-21.4-4.1-1.6-8.8.1-11 3.9-7.9 13.8-16.8 35.8-14.4 62.3 2.1 22.3 14.8 66.4 47.9 73 3.6.7 7.1 1.1 10.4 1.1 1.4 0 2.8-.1 4.2-.2 3.1 15.8 4.1 31.9 2.9 48.1-9.2 6.2-18.2 13.8-27 23.3-15.9 17.3-28.6 38-37.9 61.6-1.8 4.6.5 9.9 5.1 11.7q1.65.6 3.3.6c3.6 0 7-2.2 8.4-5.7 8.5-21.5 20-40.4 34.4-56 8.4-9.1 17-16.2 25.8-21.9.9-.4 1.8-.9 2.5-1.6 11.3-7 23-12 35-16.4 9-.8 17.9-.1 26.5 1.8 7.6 1.8 14.5 4.5 20.6 7.8-1.5 2.7-2.7 5.7-3.4 8.9-3.8 16.5 4.1 37.3 19.3 50.7 17.7 15.5 35.5 21.6 44.6 23.9q13.05 3.3 26.7 3.3c3.6 0 7.2-.2 10.8-.5 4.4-.4 7.9-4 8.1-8.4.8-14.3-.8-35.6-13.5-55.9-10.7-17.2-38.7-47.6-68.3-39.5-4 1.1-7.7 2.6-11 4.5-6.4-3.9-13.7-7.3-21.7-9.9 20.4-7.6 40.6-17.6 58.4-36.4 9.2-9.7 16.9-20.8 23.2-33.4.2-.2.4-.4.7-.6 4.6-4.8 14.6-13.1 29.4-14.6 5.2-.5 10.6-.1 15.8 1.2.1 1 .3 1.9.6 2.9 2.9 11 13.9 20.8 26.9 24 6.1 1.5 11.8 2 16.7 2 6.6 0 11.9-.9 15.2-1.7 7.7-1.9 15-5 21.7-9.4 3.3-2.6 4.7-7.4 2.9-11.4m-224.6-59.4c-2.6-11.6-1.2-22.3 1.2-30.7 5.7 2 11.2 4.7 16.2 8 5.3 3.5 15.5 11.5 23.6 25.7 4.7 8.2 5.8 18.9 3.1 26.1-2.8-5.5-5.8-10.2-8.5-14-2.9-4-8.5-5-12.6-2.1s-5 8.5-2.1 12.6c2.3 3.2 4.8 7.2 7.3 12-13.8-1.4-24.8-22.7-28.2-37.6m-123 31c-1.7-17.8 3-33.2 8.4-44.6 8.5 4 16.3 9.1 23.4 15.1 6.6 5.7 19.1 18.4 27.5 39.1 5.7 14 4.6 31.1-2.5 40.5-3.8-12.2-8.9-24.1-15-35.6-2.3-4.4-7.8-6-12.2-3.7s-6 7.8-3.7 12.2c6 11.2 10.8 22.8 14.3 34.7-2.1 0-4.3-.3-6.7-.7-20.9-4.2-31.6-37.2-33.5-57m221.5 160.2c8 12.9 10.5 26.5 10.9 37.3-7.9.1-15.7-.8-23.3-2.7-7.5-1.9-22.2-7-37.1-20-10.1-8.9-16-23.1-13.6-33.1.2-1 .5-1.9.9-2.8 8.7 7.1 15 14.8 18.9 20.3 1.8 2.5 4.5 3.8 7.4 3.8 1.8 0 3.6-.5 5.2-1.7 4.1-2.9 5-8.5 2.1-12.5-4-5.7-10.1-13.2-18.4-20.6 17.6-3.4 38 17.6 47 32m.1-231.6c1.8-20 8.9-30.6 11.9-32 2.6 1.9 7.8 13.6 6 33.6s-8.9 30.6-11.9 32c-2.6-1.9-7.8-13.6-6-33.6m96.8 102.9c-4.1 1-12.7 2.3-23.4-.3-6.3-1.5-12.5-6.5-13.7-11-.3-1-1-3.6 3.2-7.5 5.6-5.2 19.9-2.1 29.9 3.8 5.7 3.3 9.8 7.8 12.7 12q-4.2 1.95-8.7 3" />
      </g>
    </>
  ),
  // a cap with a highlight on a flared stem, a filled outline on a 32 grid: filled in the icon's
  // colour, centred on the 24 grid by its drawing and scaled to 16 tall. Wrapped so it can hop
  // (app/flow-a.css)
  mushrooms: (
    <g className="mushroom-hop">
      <path transform="translate(12 12) scale(0.64) translate(-16 -16.5)" fill="currentColor" stroke="none" d="M5.727 9.795a11.9 11.9 0 0 0-1.682 5.161C4.015 15.3 4 16.148 4 16.5c0 2.118.938 3.5 2.5 3.5h5.382l-1.829 4.963C9.332 26.92 10.781 29 12.868 29h6.12c2.146 0 3.597-2.187 2.765-4.164L19.717 20h5.748C27.483 20 28 18.023 28 16.5c0-.352-.015-1.2-.045-1.544c-.392-4.548-3.32-8.37-7.364-10.046A12 12 0 0 0 16 4c-1.123 0-2.21.154-3.242.443a12.03 12.03 0 0 0-7.031 5.352m8.159 10.55l.126-.345h3.551l.14.37l2.207 5.242A1 1 0 0 1 18.988 27h-6.12a1 1 0 0 1-.938-1.346zM19.55 8.7c-1.239-.715-1.916-1.86-1.513-2.559c.403-.698 1.734-.684 2.973.031s1.916 1.86 1.513 2.559c-.403.698-1.734.684-2.973-.03" />
    </g>
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

export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const CalendarIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </Svg>
);

export const ShareIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3v12" />
    <path d="m8 7 4-4 4 4" />
    <path d="M5 12v8h14v-8" />
  </Svg>
);

export const ArrowIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </Svg>
);

export const MapIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
    <path d="M9 4v13.5M15 6.5V20" />
  </Svg>
);

export const EyeOffIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.3A9 9 0 0 1 12 5.2c3.7 0 7 2.2 9.5 6.8-.8 1.5-1.7 2.8-2.7 3.8M6.2 6.2C4.7 7.4 3.4 9 2.5 12c2.5 4.6 5.8 6.8 9.5 6.8 1.6 0 3.1-.4 4.5-1.2" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
);

/** a circle struck through: what not to do at a spot */
export const BanIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m5.3 5.3 13.4 13.4" />
  </Svg>
);

export const CheckCircleIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m7.5 12.5 3 3 6-6.5" />
  </Svg>
);

export const WalkIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 4h6v7l7 3v5H4V4h2z" />
    <path d="M4 15h15" />
  </Svg>
);

export const ListIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 3.5v17" />
    <path d="M12.5 9h3.5M12.5 13h3.5" />
  </Svg>
);

export const InfoIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 8v.01" />
  </Svg>
);

// Flow C: the claim tags, the action facts and the source notes, as on the C boards.

export const DownIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </Svg>
);

export const UpIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </Svg>
);

export const WaterIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 17c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
    <path d="M3 11c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
  </Svg>
);

export const PeopleIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <path d="M16 6.2a3.2 3.2 0 0 1 0 6M17 14.9c2 .6 3.5 2.4 3.5 4.6" />
  </Svg>
);

export const BagIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const LockIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
);

export const ExternalIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 13v6H5V6h6" />
  </Svg>
);

export const GlobeIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5s1.1-5.9 3.6-8.5z" />
  </Svg>
);

export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const CarbonIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5c3 3.4 5.5 6.6 5.5 10a5.5 5.5 0 0 1-11 0c0-3.4 2.5-6.6 5.5-10z" />
  </Svg>
);
