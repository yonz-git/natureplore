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
  // the plant of the natureplore symbol (components/Logo.tsx), its three pairs of leaves alone, without
  // the bird, the mushroom and the sprout: filled in the icon's colour, centred by its drawing, 23 tall
  plants: (
    <g className="plant-rise">
      <g transform="translate(12 12) scale(0.0931) translate(-141.9 -207.3)" fill="currentColor" stroke="none">
        {/* the top pair folded in: narrowed toward the stem so its tips lean together */}
        <path transform="translate(141.9 0) scale(0.8 1) translate(-141.9 0)" d="M33.36 84.34C44.57 108.89 68.52 119.19 82.78 140.11C97.03 161.03 100.37 182.25 109.15 200.14C118.12 213.91 125.53 217.15 141.9 217.15C158.27 217.15 167.64 214.16 174 201.13C182.78 183.24 186.78 161.03 201.02 140.11C215.29 119.19 239.23 108.89 250.46 84.34C250.46 109.8 251.67 125.26 243.78 138.9C235.91 152.55 213.46 174.06 193.46 194.08C170.41 217.13 157.97 228.04 141.9 228.04C125.83 228.04 113.4 217.13 90.36 194.08C70.34 174.06 47.91 152.55 40.02 138.9C32.13 125.26 33.36 109.8 33.36 84.34Z" />
        <path d="M0 148.61C18.49 160.13 36.68 159.82 53.37 173.77C70.04 187.72 88.54 200.75 101.27 217.73C114.01 234.7 119.17 255.04 141.9 255.04C164.65 255.04 169.79 234.7 182.53 217.73C195.27 200.75 213.77 187.72 230.44 173.77C247.12 159.82 265.31 160.13 283.81 148.61C283.81 173.46 281.68 190.15 269.86 201.67C258.05 213.18 239.85 215.31 218.01 224.4C196.17 233.49 183.75 243.49 170.09 253.5C156.46 263.51 153.12 268.05 141.9 268.05C130.68 268.05 127.34 263.51 113.7 253.5C100.06 243.49 87.63 233.49 65.79 224.4C43.96 215.31 25.77 213.18 13.94 201.67C2.12 190.15 0 173.46 0 148.61Z" />
        <path d="M0 220.45C17.59 236.52 45.78 234.39 74.59 245.61C103.4 256.84 117.64 262.6 126.74 276.84C135.84 291.1 134.33 309.29 141.9 330.21C128.56 310.19 111.27 296.85 85.51 289.28C59.73 281.69 40.63 280.19 25.16 268.05C9.7 255.93 2.12 241.06 0 220.45Z" />
        <path d="M283.81 220.45C266.22 236.52 238.03 234.39 209.22 245.61C180.41 256.84 166.16 262.6 157.07 276.84C147.97 291.1 149.48 309.29 141.9 330.21C155.25 310.19 172.54 296.85 198.31 289.28C224.08 281.69 243.18 280.19 258.64 268.05C274.11 255.93 281.68 241.06 283.81 220.45Z" />
      </g>
    </g>
  ),
  // three sprigs on one stem, from Lordicon's "herbs" (wired 585): drawn as a filled outline on a 430
  // grid, so filled in the icon's colour rather than stroked; its leaves' inner outlines are left out
  // so each leaf is filled solid, centred on the 24 grid by its drawing
  // and scaled to 16 tall, the height of the other groups
  herbs: (
    <>
      <g className="herbs-sway">
        <path transform="translate(12 12) scale(0.0619) translate(-225.4 -215)" fill="currentColor" stroke="none" d="M407.9 193.8c-3.7-8.2-10.9-19.7-24.1-27.4-7.2-4.2-15.9-7.3-23.7-8.4-11.4-1.6-20.9.8-27.5 7-1.7 1.6-3.1 3.2-4.3 4.9-7.3-1.8-14.8-2.4-22.1-1.7-6.3.6-12 2.2-17 4.2 2.6-8.9 4.6-18.4 6.1-28.4 4.3-1.9 9.3-6.1 13.7-14.3 4.7-8.6 7.8-20.2 8.9-32.6s0-24.3-3-33.6c-5.2-16-14.4-19.1-19.3-19.5-5-.4-14.5 1-22.5 15.8-4.7 8.6-7.8 20.2-8.9 32.6s0 24.3 3 33.6c2.7 8.3 6.5 13.2 10.2 16-5.1 33.8-17.1 60.8-35.7 80.4-.5.5-1 1-1.4 1.5.5-7.8.3-15.6-.8-23.4-.9-6.3-2.3-12.2-3.9-17.7 2.3-2 4.4-4.3 6.1-7 7.9-12.5 7.3-32-1.4-47.2-10-17.6-22.7-27.5-29.4-31.9-9-5.9-19-10.2-29.6-12.8-4.3-1-8.7 1.2-10.4 5.3-4.7 11.3-9.3 29.1-4.8 49.2 3.9 17 18.2 49.7 44.9 51.5 1 .1 2.1.1 3.1.1q2.55 0 4.8-.3c1.2 4.1 2.1 8.5 2.8 13.2 1.7 12.4 1 25.3-2.2 37.5-15.3 9.5-32 15-49.3 20.8-14.4 4.8-29.1 9.8-43.6 17q.3-21.75-4.2-43.2c3.1-2 5.8-4.4 8.3-7.4 11.9-14.4 14.3-38.8 5.9-59.5-9.9-24.3-24.6-39.2-32.5-46-10.6-9.1-22.7-16.3-36-21.4-4.1-1.6-8.8.1-11 3.9-7.9 13.8-16.8 35.8-14.4 62.3 2.1 22.3 14.8 66.4 47.9 73 3.6.7 7.1 1.1 10.4 1.1 1.4 0 2.8-.1 4.2-.2 3.1 15.8 4.1 31.9 2.9 48.1-9.2 6.2-18.2 13.8-27 23.3-15.9 17.3-28.6 38-37.9 61.6-1.8 4.6.5 9.9 5.1 11.7q1.65.6 3.3.6c3.6 0 7-2.2 8.4-5.7 8.5-21.5 20-40.4 34.4-56 8.4-9.1 17-16.2 25.8-21.9.9-.4 1.8-.9 2.5-1.6 11.3-7 23-12 35-16.4 9-.8 17.9-.1 26.5 1.8 7.6 1.8 14.5 4.5 20.6 7.8-1.5 2.7-2.7 5.7-3.4 8.9-3.8 16.5 4.1 37.3 19.3 50.7 17.7 15.5 35.5 21.6 44.6 23.9q13.05 3.3 26.7 3.3c3.6 0 7.2-.2 10.8-.5 4.4-.4 7.9-4 8.1-8.4.8-14.3-.8-35.6-13.5-55.9-10.7-17.2-38.7-47.6-68.3-39.5-4 1.1-7.7 2.6-11 4.5-6.4-3.9-13.7-7.3-21.7-9.9 20.4-7.6 40.6-17.6 58.4-36.4 9.2-9.7 16.9-20.8 23.2-33.4.2-.2.4-.4.7-.6 4.6-4.8 14.6-13.1 29.4-14.6 5.2-.5 10.6-.1 15.8 1.2.1 1 .3 1.9.6 2.9 2.9 11 13.9 20.8 26.9 24 6.1 1.5 11.8 2 16.7 2 6.6 0 11.9-.9 15.2-1.7 7.7-1.9 15-5 21.7-9.4 3.3-2.6 4.7-7.4 2.9-11.4" />
      </g>
    </>
  ),
  // the mushroom of the natureplore symbol (components/Logo.tsx): filled in the icon's colour,
  // centred on the 24 grid by its drawing. Wrapped so it can hop (components/SuggestionsScreen.tsx)
  mushrooms: (
    <g className="mushroom-hop">
      <path transform="translate(12 12) scale(0.359) translate(-141.9 -176.45)" fill="currentColor" stroke="none" d="M119.53 180.75C114.68 178.02 112.85 171.65 114.68 165.29C118 155.27 128.93 149.22 140.14 148.61C152.58 148 163.48 154.97 168.03 164.68C171.97 173.16 169.25 180.45 161.68 181.36C155.31 182.25 151.62 180.36 150.06 176.98C154.75 178.29 158.63 175.59 159.25 171.96C160.26 166.02 153.24 159.55 148.03 158.69C140.74 157.49 136.52 160.41 135.59 167.08C134.39 175.27 143.38 178.5 149.45 183.35C155.52 188.2 155.6 194.09 154.09 199.24C152.88 203.48 146.81 205.3 141.96 203.79C137.11 202.26 136.19 200.14 136.19 195.59C136.19 192.27 135.59 188.92 135.59 186.2C135.59 182.87 134.39 181.05 131.34 181.36C127.4 182.57 122.55 182.57 119.53 180.75Z" />
    </g>
  ),
  // the bird of the natureplore symbol (components/Logo.tsx): its body, the eye cut out, and its wing,
  // the small leaf over its back. Filled in the icon's colour, centred on the 24 grid by its drawing.
  // Wrapped so it can hop, and the wing beat, on their own (components/SuggestionsScreen.tsx).
  birds: (
    <g className="bird-hop">
      <g transform="translate(12 12) scale(0.2492) translate(-149.95 -100.5)" fill="currentColor" stroke="none">
        <g className="bird-wing">
          <path d="M100.3 64.87C126.65 65.32 142.78 78.24 142.78 104.78C142.78 105.39 142.48 105.69 141.87 105.69C115.07 105.24 99.61 91.85 99.39 65.77C99.39 65.17 99.69 64.87 100.3 64.87Z" />
        </g>
        <path fillRule="evenodd" d="M113.92 130.49C134.6 127.32 142.33 117.99 152.55 97.3C162.76 76.61 172.31 67.75 185.26 68.89C190.94 69.38 196.16 70.47 200.49 71.84C192.3 76.39 190.48 85.03 186.86 95.25C183.21 105.48 178.9 123.21 166.41 131.17C153.91 139.13 131.63 136.41 113.92 130.49ZM186.6 72.00C187.70 72.00 188.60 72.90 188.60 74.0C188.60 75.10 187.70 76.00 186.6 76.00C185.50 76.00 184.60 75.10 184.60 74.0C184.60 72.90 185.50 72.00 186.6 72.00Z" />
      </g>
    </g>
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

// overflow visible: the plant's leaves reach past the 24 box, and the moving icons overshoot it
export const GroupIcon = ({ group, className, ...p }: P & { group: Group }) => (
  <Svg size={16} stroke={1.4} {...p} className={className ? `group-icon ${className}` : "group-icon"}>
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
