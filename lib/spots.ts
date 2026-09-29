// The spots of a route and what B1 says about it beyond its card: the six spots of Linum wet meadows
// loop, the spots in season per month, getting there, and the claim cards along it. Content is the
// sample content of the flow and IA redesign (§3), as on the boards B1, L3-1 to L3-6, L4 and B4.
// Only Linum has it; the other routes are sample cards and open nothing.

import { MONTH } from "@/lib/suggestions";

/** The prototype's month, September, as an index from 0 for January. */
export const NOW = 8;
export const MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export type Spot = {
  n: number;
  name: string;
  /** the months it is in season, 0 for January, and the same months written out */
  months: number[];
  when: string;
  /** what to look for this month, or `out` when the spot is not in season */
  look: { name: string; what?: string; last: string; organism?: string }[];
  out?: string;
  /** a restraint starts with "Don’t"; a spot without one says what to do instead */
  kind: "dont" | "do";
  line: string;
  /** the mechanism: why the line matters, never an unsourced figure */
  why: string;
};

export type Claim = {
  id: string;
  claim: string;
  /** the site is a scope label, not a link: there is no site page */
  scope: string;
  action: string;
};

export type RouteDetail = {
  spots: Spot[];
  /** how many spots are in season in each month, January first */
  season: number[];
  seasonNote: string;
  /** where the spots sit along the line, from 0 at the start to 1 at the finish */
  axis: number[];
  ticks: string[];
  getting: [string, string][];
  gettingNote: string;
  claims: Claim[];
  foot: string;
};

export const CLAIMS: Record<string, Claim> = {
  c1a: {
    id: "c1a",
    claim: "Lost about 40% of its wet meadow to drainage since 1990.",
    scope: "NSG and FFH-Gebiet Oberes Rhinluch. Landesamt für Umwelt Brandenburg, 2023",
    action: "Join the September clean-up, Sat 26 Sep",
  },
  c1b: {
    id: "c1b",
    claim: "Summer water levels have dropped by around 30 cm since 2005.",
    scope: "NSG and FFH-Gebiet Oberes Rhinluch. Landesamt für Umwelt Brandenburg, 2022",
    action: "Help rewet Linum meadow",
  },
};

const LINUM_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The flooded ditch",
    months: [8, 9],
    when: "Sep to Oct",
    look: [{ name: "Common crane", what: "feeding at dusk", last: "11 Sep", organism: "common-crane" }],
    kind: "dont",
    line: "Don’t leave the track at dusk.",
    why: "Cranes feeding in the ditch take off when people come close.",
  },
  {
    n: 2,
    name: "The dam between the ponds",
    months: [8, 9, 10],
    when: "Sep to Nov",
    look: [{ name: "Common crane", what: "roosting on the ponds at dusk", last: "11 Sep", organism: "common-crane" }],
    kind: "dont",
    line: "Don’t walk into view of roosting flocks at dusk.",
    why: "Disturbance makes cranes leave the roost.",
  },
  {
    n: 3,
    name: "Far corner of the ponds",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    when: "Mar to Oct",
    look: [
      { name: "Greylag goose", last: "10 Sep" },
      { name: "Northern lapwing", last: "5 Sep" },
    ],
    kind: "dont",
    line: "Don’t let dogs off the lead here.",
    why: "Geese and lapwings feeding on open ground take flight from dogs.",
  },
  {
    n: 4,
    name: "Reed edge of the fish ponds",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Bearded reedling", last: "27 Aug" }],
    kind: "dont",
    line: "Don’t go into the reeds.",
    why: "Bearded reedlings feed and roost in the reed bed.",
  },
  {
    n: 5,
    name: "Wet meadow track",
    months: [3, 4],
    when: "Apr to May",
    look: [],
    out: `Not in season in ${MONTH}. Marsh marigold recorded here April to May.`,
    kind: "dont",
    line: "Don’t leave the track.",
    why: "Wet meadow ground is soft and tramples easily.",
  },
  {
    n: 6,
    name: "Stork nests at the village edge",
    months: [3, 4, 5, 6, 7],
    when: "Apr to Aug",
    look: [],
    out: `Not in season in ${MONTH}. White storks recorded here April to August, last 16 Aug.`,
    kind: "do",
    line: "Look at the nests from the road.",
    why: "They sit on private houses.",
  },
];

const DETAILS: Record<string, RouteDetail> = {
  linum: {
    spots: LINUM_SPOTS,
    season: [1, 1, 2, 4, 4, 3, 3, 3, 4, 4, 2, 1],
    seasonNote: "Four of the six spots are in season in September. Nothing here promises a sighting.",
    axis: [0.1, 0.25, 0.4, 0.55, 0.72, 0.88],
    ticks: ["0 km", "1.5", "3.0", "4.5", "6.0 km"],
    getting: [
      ["Length", "6.0 km, loop"],
      ["Time", "1 h 45 at a looking pace"],
      ["Surface", "Unpaved track and grass path"],
      ["Getting round", "Pushchair yes, wheelchair in dry weather"],
      ["Ascent", "Flat, 12 m total"],
      ["Start", "Linum village, bus 819 from Kremmen"],
    ],
    gettingNote: "No difficulty grade and no estimated speed. The figures say whether the route is reachable, not how fit the walker is.",
    claims: [CLAIMS.c1a, CLAIMS.c1b],
    foot: "Route last checked 23 September 2026. 138 records within 250 m of the line, last recorded 11 Sep.",
  },
};

export const routeDetail = (id: string): RouteDetail | undefined => DETAILS[id];

export const spotOf = (routeId: string, n: number) => DETAILS[routeId]?.spots.find((s) => s.n === n);

/** The line under a spot's name in B1's list: what to look for, or that it is out of season. */
export function spotLine(s: Spot) {
  if (s.out) return `Not in season in ${MONTH}`;
  if (s.look.length > 1) return s.look.map((l) => l.name).join(" and ");
  const [l] = s.look;
  return l.what ? `${l.name}, ${l.what}` : l.name;
}

export const monthsLabel = (months: number[]) => months.map((m) => MONTH_NAMES[m]).join(", ");
