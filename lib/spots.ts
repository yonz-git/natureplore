// The spots of a route and what B1 says about it beyond its card: the five spots of Grumsin beech
// forest loop and the six of Linum wet meadows loop, the spots in season per month, getting there, and
// which claims are along it. Content is the sample content of the flow and IA redesign (§3), as on the
// boards B1, L3-1 to L3-6, L4 and B4. Only Grumsin and Linum have it; the other routes are sample cards
// and open nothing.

import { CLAIMS, type Claim } from "@/lib/claims";
import { CAPTURE, MONTH, NOW } from "@/lib/now";

// the claims live in lib/claims.ts; they are re-exported here for the screens that read spots
export { CLAIMS, type Claim };

/** The prototype's month, September, as an index from 0 for January (see lib/now.ts). */
export { NOW };
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
  /** what `out` says after "Not in season in <month>." */
  outText?: string;
  /** sample entries for months other than September, used only when capturing for the film */
  captureLook?: Record<number, { name: string; what?: string; last: string; organism?: string }[]>;
  /** a restraint starts with "Don’t"; a spot without one says what to do instead */
  kind: "dont" | "do";
  line: string;
  /** the mechanism: why the line matters, never an unsourced figure */
  why: string;
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

const GRUMSIN_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The forest gate",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Black woodpecker", what: "calling from the old beeches", last: "9 Sep" }],
    captureLook: {
      3: [{ name: "Black woodpecker", what: "drumming on the old beeches", last: "4 Apr" }],
      4: [{ name: "Black woodpecker", what: "feeding young in a nest hole", last: "12 May" }],
      5: [{ name: "Black woodpecker", what: "calling from the old beeches", last: "6 Jun" }],
    },
    kind: "do",
    line: "Look up from the path, not into the holes.",
    why: "Black woodpeckers nest high in old beech trunks, and the holes are used again by owls and bats.",
  },
  {
    n: 2,
    name: "Buckow-See",
    months: [3, 4, 5, 6, 7],
    when: "Apr to Aug",
    look: [],
    outText: "Great crested grebes recorded here April to August.",
    captureLook: {
      3: [{ name: "Great crested grebe", what: "displaying on the water", last: "11 Apr" }],
      4: [{ name: "Great crested grebe", what: "nesting at the reed edge", last: "9 May" }],
      5: [{ name: "Great crested grebe", what: "carrying chicks on its back", last: "7 Jun" }],
      6: [{ name: "Great crested grebe", what: "with well-grown young on the open water", last: "10 Jul" }],
      7: [{ name: "Great crested grebe", what: "young feeding alone on the open water", last: "8 Aug" }],
    },
    kind: "dont",
    line: "Don’t go down to the reed edge.",
    why: "Grebes nest on floating platforms in the reeds and leave them when people come close.",
  },
  {
    n: 3,
    name: "Schwarzer See",
    months: [5, 6, 7, 8],
    when: "Jun to Sep",
    look: [{ name: "Round-leaved sundew", what: "on the bog moss at the edge", last: "6 Sep" }],
    outText: "Round-leaved sundew recorded here June to September.",
    captureLook: {
      5: [{ name: "Round-leaved sundew", what: "on the bog moss at the edge", last: "10 Jun" }],
    },
    kind: "dont",
    line: "Don’t step onto the bog.",
    why: "Bog moss takes years to grow back where it is trodden.",
  },
  {
    n: 4,
    name: "Fungi on the fallen beech",
    months: [8, 9, 10],
    when: "Sep to Nov",
    look: [{ name: "Porcelain fungus", what: "on the fallen beech trunks", last: "8 Sep" }],
    outText: "Porcelain fungus recorded here September to November.",
    kind: "dont",
    line: "Don’t pick or kick the fungi.",
    why: "They break down the fallen trunk, and everyone after you comes to see them.",
  },
  {
    n: 5,
    name: "Wolletzsee",
    months: [8, 9, 10],
    when: "Sep to Nov",
    look: [{ name: "Common crane", what: "on the lake at dusk", last: "10 Sep" }],
    outText: "Common cranes recorded here September to November.",
    kind: "dont",
    line: "Don’t walk down to the shore at dusk.",
    why: "Cranes resting on the lake take off when people come close.",
  },
];

// Linum: the order the line walks them (.design/linum-route/line.py), out along the canal, round the
// fish ponds and back across the meadows to the storks
const LINUM_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The flooded ditch",
    months: [8, 9],
    when: "Sep to Oct",
    look: [{ name: "Common crane", what: "feeding in the wet field at dusk", last: "11 Sep", organism: "common-crane" }],
    outText: "Common cranes recorded here September and October.",
    kind: "dont",
    line: "Don’t leave the track at dusk.",
    why: "Cranes feeding in the wet field fly off when people walk out towards them, and they need the food before the night on the ponds.",
  },
  {
    n: 2,
    name: "Reed edge of the fish ponds",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Bearded tit", what: "calling in the reed tops", last: "9 Sep" }],
    captureLook: {
      4: [{ name: "Reed warbler", what: "singing low in the reed", last: "14 May" }],
      5: [{ name: "Reed warbler", what: "feeding young in the reed", last: "9 Jun" }],
    },
    kind: "dont",
    line: "Don’t push into the reeds.",
    why: "Reed warblers and bearded tits nest low in the reed stems, and trodden reed takes a season to stand again.",
  },
  {
    n: 3,
    name: "Far corner of the ponds",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    when: "Mar to Oct",
    look: [
      { name: "Greylag goose", what: "grazing on the pond banks", last: "10 Sep" },
      { name: "Northern lapwing", last: "5 Sep" },
    ],
    outText: "Greylag geese and lapwings recorded here March to October.",
    kind: "do",
    line: "Watch from the bird hide, not from the bank.",
    why: "Geese and lapwings rest on the open banks, and one person on the skyline puts the whole flock up.",
  },
  {
    n: 4,
    name: "The dam between the ponds",
    months: [8, 9, 10],
    when: "Sep to Nov",
    look: [{ name: "Common crane", what: "flying in to roost at dusk", last: "11 Sep", organism: "common-crane" }],
    outText: "Common cranes recorded roosting here September to November.",
    kind: "dont",
    line: "Don’t walk the dam after sunset.",
    why: "Cranes roost standing in the shallow ponds, and a roost that lifts in the dark loses the rest it needs for migration.",
  },
  {
    n: 5,
    name: "Wet meadow track",
    months: [3, 4],
    when: "Apr to May",
    look: [],
    outText: "Marsh marigold recorded here April and May.",
    captureLook: {
      3: [{ name: "Marsh marigold", what: "in flower along the wet ditch edge", last: "21 Apr" }],
      4: [{ name: "Marsh marigold", what: "in flower in the wet meadow", last: "6 May" }],
    },
    kind: "dont",
    line: "Don’t walk out onto the meadow.",
    why: "The wet soil holds a footprint for months, and the meadow is mown late so ground-nesting birds can raise their young.",
  },
  {
    n: 6,
    name: "Stork nests at the village edge",
    months: [3, 4, 5, 6, 7],
    when: "Apr to Aug",
    look: [],
    outText: "White storks recorded here April to August.",
    captureLook: {
      3: [{ name: "White stork", what: "back on the nest", last: "8 Apr" }],
      5: [{ name: "White stork", what: "feeding chicks on the nest", last: "12 Jun" }],
      6: [{ name: "White stork", what: "young standing on the nest", last: "9 Jul" }],
    },
    kind: "do",
    line: "Watch the nest from the street.",
    why: "Storks come back to the same nest each year, on the poles and roofs the village keeps for them.",
  },
];

/** A spot as it reads in the prototype's month: what to look for when it is in season, or that it is not. */
const asOfNow = (s: Spot): Spot =>
  s.months.includes(NOW)
    ? { ...s, look: (CAPTURE && s.captureLook?.[NOW]) || s.look, out: undefined }
    : { ...s, look: [], out: `Not in season in ${MONTH}. ${s.outText}` };

const GRUMSIN_SEASON = [1, 1, 1, 2, 2, 3, 3, 3, 4, 3, 3, 1];
const LINUM_SEASON = Array.from({ length: 12 }, (_, m) => LINUM_SPOTS.filter((s) => s.months.includes(m)).length);
const COUNT_WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six"];

const DETAILS: Record<string, RouteDetail> = {
  grumsin: {
    spots: GRUMSIN_SPOTS.map(asOfNow),
    season: GRUMSIN_SEASON,
    seasonNote: `${COUNT_WORDS[GRUMSIN_SEASON[NOW]]} of the five spots ${GRUMSIN_SEASON[NOW] === 1 ? "is" : "are"} in season in ${MONTH}. Nothing here promises a sighting.`,
    axis: [0.135, 0.272, 0.374, 0.637, 0.894],
    ticks: ["0 km", "2.5", "5.0", "7.5", "10.2 km"],
    getting: [
      ["Length", "10.2 km, loop"],
      ["Time", "3 h at a looking pace"],
      ["Surface", "Forest path, gravel track and a short stretch of village road"],
      ["Getting round", "Not for pushchairs or wheelchairs: about 4 km is narrow earth path"],
      ["Ascent", "Rolling, about 150 m total"],
      ["Start", "Altkünkendorf car park"],
    ],
    gettingNote: "No difficulty grade and no estimated speed. The figures say whether the route is reachable, not how fit the walker is.",
    claims: [],
    foot: CAPTURE
      ? "Route last checked 23 September 2026. 120 records within 250 m of the line."
      : "Route last checked 23 September 2026. 120 records within 250 m of the line, last recorded 10 Sep.",
  },
  linum: {
    spots: LINUM_SPOTS.map(asOfNow),
    season: LINUM_SEASON,
    seasonNote: `${COUNT_WORDS[LINUM_SEASON[NOW]]} of the six spots ${LINUM_SEASON[NOW] === 1 ? "is" : "are"} in season in ${MONTH}. Nothing here promises a sighting.`,
    axis: [0.271, 0.486, 0.603, 0.657, 0.815, 0.881],
    ticks: ["0 km", "1.6", "3.2", "4.8", "6.3 km"],
    getting: [
      ["Length", "6.3 km, loop"],
      ["Time", "1 h 50 at a looking pace"],
      ["Surface", "Village street, farm track and grass path on the pond dams"],
      ["Getting round", "Flat. The dam paths are grass and soft after rain, so not for wheelchairs"],
      ["Ascent", "Flat"],
      ["Start", "Dorfkirche Linum"],
    ],
    gettingNote: "No difficulty grade and no estimated speed. The figures say whether the route is reachable, not how fit the walker is.",
    claims: [CLAIMS.c1a, CLAIMS.c1b],
    foot: CAPTURE
      ? "Route last checked 23 September 2026. 138 records within 250 m of the line."
      : "Route last checked 23 September 2026. 138 records within 250 m of the line, last recorded 11 Sep.",
  },
};

export const routeDetail = (id: string): RouteDetail | undefined => DETAILS[id];

export const spotOf = (routeId: string, n: number) => DETAILS[routeId]?.spots.find((s) => s.n === n);

/** The line under a spot's name in B1's list: what to look for, or that it is out of season. */
export function spotLine(s: Spot) {
  if (s.out) return `Not in season in ${MONTH}`;
  if (s.look.length > 1) return s.look.map((l) => l.name).join(" and ");
  // in season with no entry for this month: say what is recorded here rather than read look[0]
  if (!s.look.length) return s.outText ?? s.name;
  const [l] = s.look;
  return l.what ? `${l.name}, ${l.what}` : l.name;
}

export const monthsLabel = (months: number[]) => months.map((m) => MONTH_NAMES[m]).join(", ");
