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
