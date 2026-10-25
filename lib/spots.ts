// The spots of a route and what B1 says about it beyond its card, for the four routes on the map:
// Grumsin beech forest loop, Linum wet meadows loop, Tegeler Fließ valley path and Tempelhofer Feld
// loop. Getting there, and which claims are along it. Content is the
// sample content of the flow and IA redesign (§3), as on the boards B1, L3-1 to L3-6, L4 and B4.
// Each spot is about a species GBIF has recorded at that spot, with its months and last record from GBIF
// (.design/gbif/spots_gbif.py and season.py; spots_ts.py writes the spot arrays): the months it is recorded
// within 15 km of the route and at the spot itself. The words around it are written for the prototype.

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
  /** where the spots sit along the line, from 0 at the start to 1 at the finish */
  getting: [string, string][];
  claims: Claim[];
  foot: string;
};

const GRUMSIN_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The forest gate",
    // GBIF: 1 record of Garrulus glandarius within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Eurasian jay", what: "in the old beeches", last: "24 Aug 2016" }],
    outText: "Eurasian jay recorded here all year.",
    kind: "do",
    line: "Listen before you look.",
    why: "A jay screeches a warning to the whole wood when someone comes, so a quiet walker hears more than a quick one sees.",
  },
  {
    n: 2,
    name: "Buckow-See",
    // GBIF: 4 records of Sitta europaea within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Eurasian nuthatch", what: "on the old beech trunks by the lake", last: "26 Aug 2024" }],
    outText: "Eurasian nuthatch recorded here all year.",
    kind: "do",
    line: "Look along the trunks, head height and up.",
    why: "Nuthatches climb down the trunks head first and find the insects in the bark that a bird climbing up passes over.",
  },
  {
    n: 3,
    name: "Schwarzer See",
    // GBIF: 9 records of Calla palustris within 300 m of the spot, 2010 to 2025
    months: [3,  4,  5,  6,  7,  8],
    when: "Apr to Sep",
    look: [{ name: "Bog arum", what: "in the wet edge of the bog", last: "5 Sep 2024" }],
    outText: "Bog arum recorded here April to September.",
    kind: "dont",
    line: "Don’t step onto the bog.",
    why: "Bog arum grows in the floating mat at the edge, which gives way underfoot and takes years to close again.",
  },
  {
    n: 4,
    name: "Fungi on the fallen beech",
    // GBIF: 1 record of Mycena rosea within 300 m of the spot, 2010 to 2025
    months: [9],
    when: "Oct",
    look: [{ name: "Rosy bonnet", what: "in the beech leaf litter", last: "16 Oct 2022" }],
    outText: "Rosy bonnet recorded here in October.",
    kind: "dont",
    line: "Don’t pick or kick the fungi.",
    why: "They break down the fallen leaves and wood, and everyone after you comes to see them.",
  },
  {
    n: 5,
    name: "Wolletzsee",
    // GBIF: 1 record of Bucephala clangula within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Common goldeneye", what: "on the open water", last: "17 Nov 2018" }],
    outText: "Common goldeneye recorded here all year.",
    kind: "dont",
    line: "Don’t walk down to the shore.",
    why: "Goldeneyes nest in tree holes by the lake and lead their young straight onto the water, where a walker on the shore scatters them.",
  },
];

// Linum: the order the line walks them (.design/linum-route/line.py), out along the canal, round the
// fish ponds and back across the meadows to the storks
const LINUM_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The flooded ditch",
    // GBIF: 13 records of Grus grus within 300 m of the spot, 2010 to 2025
    months: [2,  3,  4,  5,  9,  10],
    when: "Mar to Jun, Oct to Nov",
    look: [{ name: "Common crane", what: "feeding in the wet field", last: "4 Oct 2025", organism: "common-crane" }],
    outText: "Common crane recorded here March to June, October to November.",
    kind: "dont",
    line: "Don’t leave the track at dusk.",
    why: "Cranes feeding in the wet field fly off when people walk out towards them, and they need the food before the night on the ponds.",
  },
  {
    n: 2,
    name: "Reed edge of the fish ponds",
    // GBIF: 12 records of Panurus biarmicus within 300 m of the spot, 2010 to 2025
    months: [2,  3,  4,  5,  6,  7,  8,  9,  10],
    when: "Mar to Nov",
    look: [{ name: "Bearded reedling", what: "calling in the reed tops", last: "22 Nov 2025" }],
    outText: "Bearded reedling recorded here March to November.",
    kind: "dont",
    line: "Don’t push into the reeds.",
    why: "Bearded reedlings nest low in the reed stems, and trodden reed takes a season to stand again.",
  },
  {
    n: 3,
    name: "Far corner of the ponds",
    // GBIF: 89 records of Anser anser within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Greylag goose", what: "grazing on the pond banks", last: "3 Oct 2025" }],
    outText: "Greylag goose recorded here all year.",
    kind: "do",
    line: "Watch from the bird hide, not from the bank.",
    why: "Geese rest on the open banks, and one person on the skyline puts the whole flock up.",
  },
  {
    n: 4,
    name: "The dam between the ponds",
    // GBIF: 68 records of Grus grus within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Common crane", what: "flying in to roost at dusk", last: "17 Oct 2025", organism: "common-crane" }],
    outText: "Common crane recorded here all year.",
    kind: "dont",
    line: "Don’t walk the dam after sunset.",
    why: "Cranes roost standing in the shallow ponds, and a roost that lifts in the dark loses the rest it needs for migration.",
  },
  {
    n: 5,
    name: "Wet meadow track",
    // GBIF: 1 record of Caltha palustris within 300 m of the spot, 2010 to 2025
    months: [3,  4],
    when: "Apr to May",
    look: [{ name: "Marsh marigold", what: "in flower in the wet meadow", last: "5 May 2019" }],
    outText: "Marsh marigold recorded here April to May.",
    kind: "dont",
    line: "Don’t walk out onto the meadow.",
    why: "The wet soil holds a footprint for months, and the meadow is mown late so ground-nesting birds can raise their young.",
  },
  {
    n: 6,
    name: "Stork nests at the village edge",
    // GBIF: 13 records of Ciconia ciconia within 300 m of the spot, 2010 to 2025
    months: [2,  3,  4,  5,  6,  7],
    when: "Mar to Aug",
    look: [{ name: "White stork", what: "on the nest", last: "3 Jun 2025" }],
    outText: "White stork recorded here March to August.",
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
    // GBIF: 1 record of Castor fiber within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Eurasian beaver", what: "gnawed trunks along the bank", last: "5 Jun 2025" }],
    outText: "Eurasian beaver recorded here all year.",
    kind: "dont",
    line: "Don’t climb onto the lodge or the dam.",
    why: "Beavers sleep in the lodge by day, and a dam that is trodden lets the water out of the pools they keep.",
  },
  {
    n: 2,
    name: "Hermsdorf lake shore",
    // GBIF: 14 records of Ardea cinerea within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Grey heron", what: "fishing at the reed edge", last: "11 Dec 2025" }],
    outText: "Grey heron recorded here all year.",
    kind: "dont",
    line: "Don’t feed the birds on the lake.",
    why: "Bread swells in a bird’s stomach and rots in the shallow water, and the lake has little flow to clear it.",
  },
  {
    n: 3,
    name: "The Fließ bridge",
    // GBIF: 6 records of Alcedo atthis within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Common kingfisher", what: "on a branch over the water", last: "28 Jul 2025" }],
    outText: "Common kingfisher recorded here all year.",
    kind: "do",
    line: "Stand still on the bridge and wait.",
    why: "A kingfisher hunts from the same perch again and again, and leaves it for the day when people stop below it.",
  },
  {
    n: 4,
    name: "Alder carr boardwalk",
    // GBIF: 6 records of Caltha palustris within 300 m of the spot, 2010 to 2025
    months: [3,  4,  5],
    when: "Apr to Jun",
    look: [{ name: "Marsh marigold", what: "in flower under the alders", last: "27 Apr 2025" }],
    outText: "Marsh marigold recorded here April to June.",
    kind: "dont",
    line: "Don’t step off the boardwalk.",
    why: "The carr floor is wet peat, and the marsh marigold grows only where it is not trodden.",
  },
  {
    n: 5,
    name: "Wet meadow bend",
    // GBIF: 2 records of Symphytum officinale within 300 m of the spot, 2010 to 2025
    months: [3,  4,  5,  6,  7,  8],
    when: "Apr to Sep",
    look: [{ name: "Common comfrey", what: "in flower along the track", last: "20 Jul 2020" }],
    outText: "Common comfrey recorded here April to September.",
    kind: "dont",
    line: "Don’t walk out onto the meadow.",
    why: "The meadow stays wet into summer, and the flowers along it grow only where the ground is not trodden.",
  },
  {
    n: 6,
    name: "Old sheep pasture",
    // GBIF: 4 records of Saponaria officinalis within 300 m of the spot, 2010 to 2025
    months: [3,  4,  5,  6,  7,  8],
    when: "Apr to Sep",
    look: [{ name: "Soapwort", what: "in flower by the pasture fence", last: "31 May 2024" }],
    outText: "Soapwort recorded here April to September.",
    kind: "do",
    line: "Close the gate behind you.",
    why: "The pasture is grazed to keep it open, and the flowers along it need the grazing as much as the meadow needs the gate.",
  },
  {
    n: 7,
    name: "Lübars village pond",
    // GBIF: 3 records of Corydalis solida within 300 m of the spot, 2010 to 2025
    months: [2,  3],
    when: "Mar to Apr",
    look: [{ name: "Fumewort", what: "in flower under the trees by the pond", last: "22 Mar 2025" }],
    outText: "Fumewort recorded here March to April.",
    kind: "dont",
    line: "Don’t pick the spring flowers.",
    why: "Fumewort flowers for a few weeks before the trees come into leaf, and the first bees of the year feed on it.",
  },
];

// Tempelhofer Feld: the order the loop walks them (.design/tempelhof-route/line.py), from Tor 5 east to the
// gardens and meadows, along the south runway and back by the north meadows
const TEMPELHOF_SPOTS: Spot[] = [
  {
    n: 1,
    name: "The community gardens",
    // GBIF: 3 records of Buddleja davidii within 300 m of the spot, 2010 to 2025
    months: [1,  2,  3,  4,  5,  6,  7,  8,  9,  10],
    when: "Feb to Nov",
    look: [{ name: "Butterfly bush", what: "in flower by the garden beds", last: "10 Oct 2023" }],
    outText: "Butterfly bush recorded here February to November.",
    kind: "do",
    line: "Walk round the beds, not through them.",
    why: "The gardens are tended by neighbours, and the flowers along them feed butterflies and bees late into the autumn.",
  },
  {
    n: 2,
    name: "The skylark meadow",
    // GBIF: 8 records of Alauda arvensis within 300 m of the spot, 2010 to 2025
    months: [1,  2,  3,  4,  5,  6,  7,  8,  9],
    when: "Feb to Oct",
    look: [{ name: "Eurasian skylark", what: "singing high over the meadow", last: "20 Apr 2025" }],
    outText: "Eurasian skylark recorded here February to October.",
    kind: "dont",
    line: "Don’t cross the fence into the meadow.",
    why: "Skylarks nest on the ground in the long grass, and the fenced meadows are where they are left alone.",
  },
  {
    n: 3,
    name: "Old runway edge",
    // GBIF: 14 records of Corvus frugilegus within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Rook", what: "feeding in a flock on the grass", last: "13 Aug 2025" }],
    outText: "Rook recorded here all year.",
    kind: "do",
    line: "Give a feeding flock a wide berth.",
    why: "Rooks feed together on the open grass, and each time they are put up they lose the time they came to feed.",
  },
  {
    n: 4,
    name: "The windsock hill",
    // GBIF: 7 records of Vulpes vulpes within 600 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Red fox", what: "crossing the field at dusk", last: "11 Oct 2018" }],
    outText: "Red fox recorded here all year.",
    kind: "do",
    line: "Keep dogs on the lead here.",
    why: "Foxes and hares cross the open field at dusk, and a dog off the lead chases them into the fenced meadows.",
  },
  {
    n: 5,
    name: "North meadow fence",
    // GBIF: 40 records of Falco tinnunculus within 300 m of the spot, 2010 to 2025
    months: [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11],
    when: "All year",
    look: [{ name: "Common kestrel", what: "hovering over the long grass", last: "10 Dec 2025" }],
    outText: "Common kestrel recorded here all year.",
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


const DETAILS: Record<string, RouteDetail> = {
  grumsin: {
    spots: GRUMSIN_SPOTS.map(asOfNow),
    getting: [
      ["Start", "Altkünkendorf car park"],
      ["Ascent", "Rolling, about 150 m total"],
      ["Surface", "Forest path, gravel track and a short stretch of village road"],
    ],
    claims: [],
    foot: "Route last checked 23 September 2026. 1,060 records within 250 m of the line.",
  },
  linum: {
    spots: LINUM_SPOTS.map(asOfNow),
    getting: [
      ["Start", "Dorfkirche Linum"],
      ["Ascent", "Flat"],
      ["Surface", "Village street, farm track and grass path on the pond dams"],
    ],
    claims: [CLAIMS.c1a, CLAIMS.c1b],
    foot: "Route last checked 23 September 2026. 14,769 records within 250 m of the line.",
  },
  tegel: {
    spots: TEGEL_SPOTS.map(asOfNow),
    getting: [
      ["Start", "S-Bahn Hermsdorf, ends in Alt-Lübars"],
      ["Ascent", "Flat"],
      ["Surface", "Village street, forest path, a boardwalk and field track"],
    ],
    claims: [CLAIMS.c6],
    foot: "Route last checked 23 September 2026. 6,865 records within 250 m of the line.",
  },
  tempelhof: {
    spots: TEMPELHOF_SPOTS.map(asOfNow),
    getting: [
      ["Start", "Tor 5, Columbiadamm"],
      ["Ascent", "Flat"],
      ["Surface", "Old runway tarmac and asphalt paths"],
      ["Opening", "The field closes at night and opens again at sunrise"],
    ],
    claims: [],
    foot: "Route last checked 23 September 2026. 31,671 records within 250 m of the line.",
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
