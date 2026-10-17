import { GRUMSIN_LINE, LINUM_LINE, TEGEL_LINE, TEMPELHOF_LINE } from "@/lib/route-lines";

// The routes and their spots, for B1, the route page. The suggestion cards on A5 and A4 and search
// read lib/suggestions.ts, which follows the flow and IA redesign.

export type Group = "plants" | "herbs" | "mushrooms" | "birds" | "mammals";

/** The fixed order of the organism pills on every card. */
export const GROUPS: { id: Group; label: string }[] = [
  { id: "plants", label: "Plants" },
  { id: "herbs", label: "Herbs" },
  { id: "mushrooms", label: "Mushrooms" },
  { id: "birds", label: "Birds" },
  { id: "mammals", label: "Mammals" },
];

export type Counts = Partial<Record<Group, number>>;

/** What is notable this season, the chips on A4. */
export const SEASON = [
  { id: "fungi", label: "Autumn fungi" },
  { id: "meadow", label: "Late meadow flowers" },
] as const;

export type SeasonId = (typeof SEASON)[number]["id"];

export type Route = {
  id: string;
  name: string;
  /** the second line on the rich card: the shape of the route and where it is */
  where: string;
  /** the one line on the compact card, with the distance and time written out */
  line: string;
  km: string;
  time: string;
  spots: number;
  counts: Counts;
  season: SeasonId[];
  /** the start of the route, where its pin sits on the map */
  lat: number;
  lon: number;
  image?: string;
  /** the card's line on B1: the habitat, the spots and how much is recorded along it */
  summary: string;
  /** what is worth seeing on it now, and the organism it is about when there is a page for it */
  notable: { text: string; organism?: string };
  /** B1: where it starts, a few plain sentences about it, and its spots in walking order */
  from: string;
  description: string;
  /** `left` puts the name on the left of its marker, where the right would cover the line */
  stops: { name: string; note: string; left?: boolean }[];
  /** where each spot sits along the line, 0 at the start and 1 at the finish, when it is not evenly spaced */
  marks?: number[];
  /** counts: how many species of each group GBIF has recorded within 250 m of the line, 2016 to 2025
      (.design/gbif/counts.py), for the built routes; the sample cards keep their sample counts */
  /** the real line, when it is mapped (lib/route-lines.ts), and the detail map drawn under it */
  path?: [number, number][];
  detail?: string;
  /** point to point: the line ends somewhere else, so the flag at its start reads Start, not Start and finish */
  oneWay?: boolean;
};

export const ROUTES: Route[] = [
  {
    id: "tempelhof",
    name: "Tempelhofer Feld loop",
    where: "Loop in Tempelhof, Berlin",
    line: "5.7 km loop, 1 h 40 at a looking pace",
    km: "5.7",
    time: "1:40",
    spots: 5,
    counts: { plants: 82, herbs: 267, mushrooms: 15, birds: 163, mammals: 6 },
    season: ["meadow"],
    lat: 52.48228,
    lon: 13.40724,
    image: "/img/routes/tempelhof.jpg",
    summary: "Grassland, 5 spots, 31,671 records within 250 m of the line",
    notable: { text: "Notable now: skylarks on the open meadow, until October" },
    from: "Loop from the Columbiadamm main entrance, Tempelhof, Berlin",
    description:
      "A flat loop around the old airfield, on the runways and the paths beside the meadows. Skylarks sing over the fenced grassland from spring into early autumn, wheatears stop on the runway edges on passage, and the gardens on the east side are busy with insects all summer.",
    stops: [
      { name: "The community gardens", note: "Butterfly bushes, in flower into October" },
      { name: "The skylark meadow", note: "Skylarks until October" },
      { name: "Old runway edge", note: "Rooks feeding on the grass" },
      { left: true, name: "The windsock hill", note: "Foxes crossing the field at dusk" },
      { left: true, name: "North meadow fence", note: "Kestrels hunting" },
    ],
    path: TEMPELHOF_LINE,
    detail: "/geo/tempelhof.json",
    marks: [0.239, 0.279, 0.544, 0.758, 0.842],
  },
  {
    id: "tegel",
    name: "Tegeler Fließ valley path",
    where: "Point to point in Reinickendorf, Berlin",
    line: "4.9 km, point to point, 1 h 25 at a looking pace",
    km: "4.9",
    time: "1:25",
    spots: 7,
    counts: { plants: 76, herbs: 120, mushrooms: 34, birds: 140, mammals: 18 },
    season: ["fungi", "meadow"],
    lat: 52.61804,
    lon: 13.3075,
    image: "/img/routes/tegel.jpg",
    summary: "River meadow, 7 spots, 6,865 records within 250 m of the line",
    notable: { text: "Notable now: kingfishers on the Fließ, all year" },
    from: "From S-Bahn Hermsdorf to Alt-Lübars, Reinickendorf, Berlin",
    description:
      "A path along the Tegeler Fließ, a small river in a wide meadow valley at the edge of the city. Down the valley past the beaver’s stretch of the Fließ and the Hermsdorfer See, over the Fließ and along a boardwalk through the alder carr, then across the wet meadows and pastures to the old village of Lübars.",
    stops: [
      { name: "The beaver lodge", note: "Gnawed trunks along the bank" },
      { name: "Hermsdorf lake shore", note: "Grey herons fishing all year" },
      { left: true, name: "The Fließ bridge", note: "Kingfisher on the dead branch" },
      { name: "Alder carr boardwalk", note: "Marsh marigold under the alders, April to June" },
      { left: true, name: "Wet meadow bend", note: "Comfrey in flower, April to September" },
      { name: "Old sheep pasture", note: "Soapwort by the fence, April to September" },
      { name: "Lübars village pond", note: "Fumewort under the trees, March and April" },
    ],
    path: TEGEL_LINE,
    detail: "/geo/tegel.json",
    marks: [0.3, 0.454, 0.629, 0.721, 0.831, 0.886, 1.0],
    oneWay: true,
  },
  {
    id: "linum",
    name: "Linum wet meadows loop",
    where: "Loop in Linum, Brandenburg",
    line: "6.3 km loop, 1 h 50 at a looking pace",
    km: "6.3",
    time: "1:50",
    spots: 6,
    counts: { plants: 19, herbs: 81, mushrooms: 3, birds: 199, mammals: 13 },
    season: ["meadow"],
    lat: 52.75773,
    lon: 12.88274,
    image: "/img/routes/linum.jpg",
    summary: "Wetland, 6 spots, 14,769 records within 250 m of the line",
    notable: { text: "Notable now: cranes gathering, September to November", organism: "common-crane" },
    from: "Loop from the village church in Linum, Brandenburg",
    description:
      "An easy loop from the village church out along the fish ponds of the Linumer Teichland and back across the wet meadows. Flat, and mostly on farm tracks, so it suits any fitness level. In autumn thousands of cranes gather on the ponds at dusk.",
    stops: [
      { name: "The flooded ditch", note: "Cranes feeding, in spring and October to November" },
      { name: "Reed edge of the fish ponds", note: "Reed warblers and bearded tits" },
      { name: "Far corner of the ponds", note: "Greylag geese all year" },
      { left: true, name: "The dam between the ponds", note: "Crane roost view at dusk" },
      { left: true, name: "Wet meadow track", note: "Marsh marigold in April and May" },
      { left: true, name: "Stork nests at the village edge", note: "White storks, March to August" },
    ],
    path: LINUM_LINE,
    detail: "/geo/linum.json",
    marks: [0.271, 0.486, 0.603, 0.657, 0.815, 0.881],
  },
  {
    id: "grumsin",
    name: "Grumsin beech forest loop",
    where: "Loop in Grumsin, Brandenburg",
    line: "10.2 km loop, 3 h at a looking pace",
    km: "10.2",
    time: "3:00",
    spots: 5,
    counts: { plants: 16, herbs: 66, mushrooms: 22, birds: 102, mammals: 9 },
    season: ["fungi"],
    lat: 53.01237,
    lon: 13.87510,
    image: "/img/routes/grumsin.jpg",
    summary: "Beech forest, 5 spots, 1,060 records within 250 m of the line",
    notable: { text: "Notable now: bog arum at Schwarzer See, until the end of September" },
    from: "Loop from the Altkünkendorf car park, Uckermark, Brandenburg",
    description:
      "The Orange Beech Leaf, a waymarked loop along the edge of the Grumsin beech forest, part of a world heritage site. Old beeches, two quiet forest lakes and the shore of Wolletzsee, with fungi on the fallen trunks after the first autumn rain. Mostly forest path and gravel track, with gentle climbs.",
    stops: [
      { name: "The forest gate", note: "Jays in the old beeches" },
      { name: "Buckow-See", note: "Nuthatches on the lakeside beeches" },
      { name: "Schwarzer See", note: "Bog arum at the wet edge, April to September" },
      { left: true, name: "Fungi on the fallen beech", note: "Rosy bonnet in the leaf litter in October" },
      { left: true, name: "Wolletzsee", note: "Goldeneyes on the open water" },
    ],
    path: GRUMSIN_LINE,
    detail: "/geo/grumsin.json",
    marks: [0.135, 0.272, 0.374, 0.637, 0.894],
  },
];

/** A route by its id, for B1. */
export const routeById = (id: string) => ROUTES.find((r) => r.id === id);

/**
 * The spots along a route, for its pins on B1: set around the start in walking order. The
 * prototype has no route geometry yet, so they sit on a loop about three kilometres across.
 */
export function spotsOf(route: Route) {
  if (route.path) return spotsOnPath(route.path, route.spots, route.marks);
  return Array.from({ length: route.spots }, (_, i) => {
    const a = (i / route.spots) * Math.PI * 2 + 0.6;
    return { n: i + 1, lat: route.lat + Math.sin(a) * 0.012, lon: route.lon + Math.cos(a) * 0.02 };
  });
}

// spots spread along the real line at even distances, clear of the start
function spotsOnPath(path: [number, number][], count: number, given?: number[]) {
  const len = (a: [number, number], b: [number, number]) =>
    Math.hypot(a[0] - b[0], (a[1] - b[1]) * Math.cos((a[0] * Math.PI) / 180));
  const cum = [0];
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + len(path[i - 1], path[i]));
  const total = cum[cum.length - 1];
  const at = (f: number) => {
    const t = f * total;
    let i = cum.findIndex((c) => c >= t);
    if (i < 1) i = 1;
    const k = (t - cum[i - 1]) / Math.max(1e-12, cum[i] - cum[i - 1]);
    return { lat: path[i - 1][0] + k * (path[i][0] - path[i - 1][0]), lon: path[i - 1][1] + k * (path[i][1] - path[i - 1][1]) };
  };
  // the same places the B1 boards put them
  const marks = given ?? (count === 6 ? [0.1, 0.25, 0.4, 0.55, 0.72, 0.88] : Array.from({ length: count }, (_, i) => (i + 1) / (count + 1)));
  return marks.map((f, i) => ({ n: i + 1, ...at(f) }));
}

/** The total of what is recorded along a route. */
export const recordsOf = (c: Counts) => Object.values(c).reduce((a, b) => a + (b ?? 0), 0);

/** Where the person is when they share their location: Tempelhof, as on the boards. */
export const HERE = { lat: 52.512, lon: 13.355 };
