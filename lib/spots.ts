// The spots of a route and what B1 says about it beyond its card, for the four routes on the map:
// Grumsin beech forest loop, Linum wet meadows loop, Tegeler Fließ valley path and Tempelhofer Feld
// loop. The spots in season per month, getting there, and which claims are along it. Content is the
// sample content of the flow and IA redesign (§3), as on the boards B1, L3-1 to L3-6, L4 and B4.

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
    look: [{ name: "Bearded reedling", what: "calling in the reed tops", last: "9 Sep" }],
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

// Tegeler Fließ: the order the line walks them (.design/tegel-route/line.py), from Hermsdorf down the valley to
// the beaver's stretch and past the lake, over the Fließ and through the alder carr, then across the meadows to Lübars
const TEGEL_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The beaver lodge",
    months: [9, 10, 11, 0, 1, 2],
    when: "Oct to Mar",
    look: [],
    outText: "Fresh beaver gnawing recorded here October to March.",
    captureLook: {
      9: [{ name: "Eurasian beaver", what: "fresh gnawing on the willows by the bank", last: "11 Oct" }],
      10: [{ name: "Eurasian beaver", what: "a felled willow across the Fließ", last: "8 Nov" }],
    },
    kind: "dont",
    line: "Don’t climb onto the lodge or the dam.",
    why: "Beavers sleep in the lodge by day, and a dam that is trodden lets the water out of the pools they keep.",
  },
  {
    n: 2,
    name: "Hermsdorf lake shore",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Grey heron", what: "fishing at the reed edge", last: "18 Sep" }],
    kind: "dont",
    line: "Don’t feed the birds on the lake.",
    why: "Bread swells in a bird's stomach and rots in the shallow water, and the lake has little flow to clear it.",
  },
  {
    n: 3,
    name: "The Fließ bridge",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Common kingfisher", what: "on the dead branch over the water", last: "14 Sep" }],
    kind: "do",
    line: "Stand still on the bridge and wait.",
    why: "A kingfisher hunts from the same perch again and again, and leaves it for the day when people stop below it.",
  },
  {
    n: 4,
    name: "Alder carr boardwalk",
    months: [8, 9, 10],
    when: "Sep to Nov",
    look: [{ name: "Black alder", what: "with autumn fungi on the fallen trunks", last: "12 Sep" }],
    outText: "Fungi on the fallen alder recorded here September to November.",
    kind: "dont",
    line: "Don’t step off the boardwalk.",
    why: "The carr floor is wet peat, and a footprint in it stays open long after the walker has gone.",
  },
  {
    n: 5,
    name: "Wet meadow bend",
    months: [3, 4],
    when: "Apr to May",
    look: [],
    outText: "Marsh marigold recorded here April and May.",
    captureLook: {
      3: [{ name: "Marsh marigold", what: "in flower along the Fließ", last: "19 Apr" }],
      4: [{ name: "Marsh marigold", what: "in flower in the wet meadow", last: "5 May" }],
    },
    kind: "dont",
    line: "Don’t walk out onto the meadow.",
    why: "The meadow is wet all spring, and the plants that flower in it grow only where the ground is not trodden.",
  },
  {
    n: 6,
    name: "Old sheep pasture",
    months: [5, 6, 7],
    when: "Jun to Aug",
    look: [],
    outText: "Meadowsweet recorded here June to August.",
    captureLook: {
      5: [{ name: "Meadowsweet", what: "in flower along the pasture ditch", last: "21 Jun" }],
      6: [{ name: "Meadowsweet", what: "in flower along the pasture ditch", last: "12 Jul" }],
    },
    kind: "do",
    line: "Close the gate behind you.",
    why: "The pasture is grazed to keep it open, and the flowers that grow here need the grazing as much as the meadow needs the gate.",
  },
  {
    n: 7,
    name: "Lübars village pond",
    months: [6, 7, 8],
    when: "Jul to Sep",
    look: [{ name: "Purple loosestrife", what: "in flower at the pond edge", last: "10 Sep" }],
    outText: "Purple loosestrife recorded here July to September.",
    kind: "dont",
    line: "Don’t pick the flowers at the edge.",
    why: "The pond edge is the only wet ground in the village, and the bees and hoverflies of the gardens around it feed there.",
  },
];

// Tempelhofer Feld: the order the loop walks them (.design/tempelhof-route/line.py), from Tor 5 east to the
// gardens and meadows, along the south runway and back by the north meadows
const TEMPELHOF_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The community gardens",
    months: [4, 8, 9],
    when: "May, Sep to Oct",
    look: [{ name: "Hawthorn", what: "red berries on the garden hedge", last: "16 Sep" }],
    outText: "Hawthorn recorded in flower in May and in berry September and October.",
    captureLook: {
      4: [{ name: "Hawthorn", what: "in flower on the garden hedge", last: "14 May" }],
    },
    kind: "do",
    line: "Walk round the beds, not through them.",
    why: "The gardens are tended by neighbours, and the hedges round them are where the field's small birds feed and shelter.",
  },
  {
    n: 2,
    name: "The skylark meadow",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    when: "Mar to Oct",
    look: [{ name: "Eurasian skylark", what: "in small flocks on the short grass", last: "20 Sep" }],
    outText: "Skylarks recorded here March to October.",
    captureLook: {
      3: [{ name: "Eurasian skylark", what: "singing high over the meadow", last: "9 Apr" }],
      4: [{ name: "Eurasian skylark", what: "singing high over the meadow", last: "12 May" }],
      5: [{ name: "Eurasian skylark", what: "feeding young in the long grass", last: "8 Jun" }],
    },
    kind: "dont",
    line: "Don’t cross the fence into the meadow.",
    why: "Skylarks nest on the ground in the long grass, and the fenced meadows are where they are left alone.",
  },
  {
    n: 3,
    name: "Old runway edge",
    months: [3, 4, 7, 8],
    when: "Apr to May, Aug to Sep",
    look: [{ name: "Northern wheatear", what: "passing through on the runway edge", last: "15 Sep" }],
    outText: "Northern wheatears recorded here on passage, April and May, August and September.",
    captureLook: {
      3: [{ name: "Northern wheatear", what: "resting on the runway edge", last: "22 Apr" }],
      4: [{ name: "Northern wheatear", what: "resting on the runway edge", last: "3 May" }],
    },
    kind: "do",
    line: "Give a resting bird a wide berth on the tarmac.",
    why: "Wheatears stop here to feed on their way north or south, and every time they are flushed they lose the time they came to feed.",
  },
  {
    n: 4,
    name: "The windsock hill",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Red fox", what: "crossing the field at dusk", last: "19 Sep" }],
    kind: "do",
    line: "Keep dogs on the lead here.",
    why: "Foxes and hares cross the open field at dusk, and a dog off the lead chases them into the fenced meadows.",
  },
  {
    n: 5,
    name: "North meadow fence",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    when: "All year",
    look: [{ name: "Common kestrel", what: "hovering over the long grass", last: "20 Sep" }],
    kind: "dont",
    line: "Don’t fly a drone over the meadow.",
    why: "Kestrels and skylarks read anything hovering above them as a hunting bird, and leave the meadow.",
  },
];

/** A spot as it reads in the prototype's month: what to look for when it is in season, or that it is not. */
const asOfNow = (s: Spot): Spot =>
  s.months.includes(NOW)
    ? { ...s, look: (CAPTURE && s.captureLook?.[NOW]) || s.look, out: undefined }
    : { ...s, look: [], out: `Not in season in ${MONTH}. ${s.outText}` };

const GRUMSIN_SEASON = [1, 1, 1, 2, 2, 3, 3, 3, 4, 3, 3, 1];
// how many of a route's spots are in season in each month, January first
const seasonOf = (spots: Spot[]) => Array.from({ length: 12 }, (_, m) => spots.filter((s) => s.months.includes(m)).length);
const LINUM_SEASON = seasonOf(LINUM_SPOTS);
const TEGEL_SEASON = seasonOf(TEGEL_SPOTS);
const TEMPELHOF_SEASON = seasonOf(TEMPELHOF_SPOTS);
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
  tegel: {
    spots: TEGEL_SPOTS.map(asOfNow),
    season: TEGEL_SEASON,
    seasonNote: `${COUNT_WORDS[TEGEL_SEASON[NOW]]} of the seven spots ${TEGEL_SEASON[NOW] === 1 ? "is" : "are"} in season in ${MONTH}. Nothing here promises a sighting.`,
    axis: [0.3, 0.454, 0.629, 0.721, 0.831, 0.886, 1.0],
    ticks: ["0 km", "1.2", "2.5", "3.7", "4.9 km"],
    getting: [
      ["Length", "4.9 km, point to point"],
      ["Time", "1 h 25 at a looking pace"],
      ["Surface", "Village street, forest path, a boardwalk and field track"],
      ["Getting round", "Not for wheelchairs: the boardwalk and the meadow tracks are narrow and soft after rain"],
      ["Ascent", "Flat"],
      ["Start", "S-Bahn Hermsdorf, ends in Alt-Lübars"],
    ],
    gettingNote: "No difficulty grade and no estimated speed. The figures say whether the route is reachable, not how fit the walker is.",
    claims: [CLAIMS.c6],
    foot: CAPTURE
      ? "Route last checked 23 September 2026. 164 records within 250 m of the line."
      : "Route last checked 23 September 2026. 164 records within 250 m of the line, last recorded 18 Sep.",
  },
  tempelhof: {
    spots: TEMPELHOF_SPOTS.map(asOfNow),
    season: TEMPELHOF_SEASON,
    seasonNote: `${COUNT_WORDS[TEMPELHOF_SEASON[NOW]]} of the five spots ${TEMPELHOF_SEASON[NOW] === 1 ? "is" : "are"} in season in ${MONTH}. Nothing here promises a sighting.`,
    axis: [0.239, 0.279, 0.544, 0.758, 0.842],
    ticks: ["0 km", "1.4", "2.8", "4.3", "5.7 km"],
    getting: [
      ["Length", "5.7 km, loop"],
      ["Time", "1 h 40 at a looking pace"],
      ["Surface", "Old runway tarmac and asphalt paths"],
      ["Getting round", "Step-free all the way, for wheelchairs and pushchairs"],
      ["Opening", "The field closes at night and opens again at sunrise"],
      ["Ascent", "Flat"],
      ["Start", "Tor 5, Columbiadamm"],
    ],
    gettingNote: "No difficulty grade and no estimated speed. The figures say whether the route is reachable, not how fit the walker is.",
    claims: [],
    foot: CAPTURE
      ? "Route last checked 23 September 2026. 96 records within 250 m of the line."
      : "Route last checked 23 September 2026. 96 records within 250 m of the line, last recorded 20 Sep.",
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
