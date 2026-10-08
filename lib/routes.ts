import { GRUMSIN_LINE } from "@/lib/route-lines";

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
  /** the real line, when it is mapped (lib/route-lines.ts), and the detail map drawn under it */
  path?: [number, number][];
  detail?: string;
};

export const ROUTES: Route[] = [
  {
    id: "tempelhof",
    name: "Tempelhofer Feld loop",
    where: "Loop in Tempelhof, Berlin",
    line: "6.2 km loop, 1 h 50 at a looking pace",
    km: "6.2",
    time: "1:50",
    spots: 5,
    counts: { plants: 24, herbs: 72, birds: 41, mammals: 6 },
    season: ["meadow"],
    lat: 52.4735,
    lon: 13.403,
    image: "/img/routes/tempelhof.jpg",
    summary: "Grassland, 5 spots, 96 records within 250 m of the line, last recorded yesterday",
    notable: { text: "Notable now: skylarks on the open meadow, until October" },
    from: "Loop from the Columbiadamm entrance, Tempelhof, Berlin",
    description:
      "A flat loop around the old airfield, on the runways and the paths beside the meadows. Skylarks sing over the fenced grassland from spring into early autumn, and the edges are full of late flowers.",
    stops: [
      { name: "The skylark meadow", note: "Skylarks until October" },
      { name: "Old runway edge", note: "Wall rocket and evening primrose" },
      { name: "The community gardens", note: "Bees and hoverflies" },
      { name: "North meadow fence", note: "Kestrels hunting" },
      { name: "The windsock hill", note: "Wide view over the field" },
    ],
  },
  {
    id: "tegel",
    name: "Tegeler Fließ valley path",
    where: "Point to point in Reinickendorf, Berlin",
    line: "8.4 km, point to point, 2 h 30",
    km: "8.4",
    time: "2:30",
    spots: 7,
    counts: { plants: 22, herbs: 66, mushrooms: 12, birds: 57, mammals: 9 },
    season: ["fungi", "meadow"],
    lat: 52.5965,
    lon: 13.2965,
    image: "/img/routes/tegel.jpg",
    summary: "River meadow, 7 spots, 164 records within 250 m of the line, last recorded 3 days ago",
    notable: { text: "Notable now: autumn fungi along the alder carr" },
    from: "From Hermsdorf station to Lübars, Reinickendorf, Berlin",
    description:
      "A path along the Tegeler Fließ, a small river in a wide meadow valley at the edge of the city. Alder carr, wet meadows and old village fields, with boardwalks over the wettest parts.",
    stops: [
      { name: "Hermsdorf lake shore", note: "Coots and great crested grebes" },
      { name: "Alder carr boardwalk", note: "Autumn fungi on fallen alder" },
      { name: "The beaver lodge", note: "Gnawed trunks along the bank" },
      { name: "Wet meadow bend", note: "Marsh marigold in spring" },
      { name: "Old sheep pasture", note: "Grasshoppers and meadow flowers" },
      { name: "Lübars village pond", note: "Swallows until September" },
      { name: "The Fließ bridge", note: "Kingfisher on the dead branch" },
    ],
  },
  {
    id: "linum",
    name: "Linum wet meadows loop",
    where: "Loop in Linum, Brandenburg",
    line: "6.0 km loop, 1 h 45 at a looking pace",
    km: "6.0",
    time: "1:45",
    spots: 6,
    counts: { plants: 19, herbs: 48, birds: 64, mammals: 7 },
    season: ["meadow"],
    lat: 52.75963,
    lon: 12.87651,
    image: "/img/routes/linum.jpg",
    summary: "Wetland, 6 spots, 138 records within 250 m of the line, last recorded 2 days ago",
    notable: { text: "Notable now: cranes gathering, September to November", organism: "common-crane" },
    from: "Loop from the village church in Linum, Brandenburg",
    description:
      "An easy loop from the village church out along the fish ponds of the Linumer Teichland and back across the wet meadows. Flat, and mostly on farm tracks, so it suits any fitness level. In autumn thousands of cranes gather on the ponds at dusk.",
    stops: [
      { name: "The flooded ditch", note: "Cranes feed here at dusk" },
      { left: true, name: "The dam between the ponds", note: "Crane roost view, September to November" },
      { name: "Far corner of the ponds", note: "Greylag geese and lapwings" },
      { name: "Reed edge of the fish ponds", note: "Reed warblers and bearded tits" },
      { left: true, name: "Wet meadow track", note: "Marsh marigold in April and May" },
      { left: true, name: "Stork nests at the village edge", note: "White storks, April to August" },
    ],
  },
  {
    id: "grumsin",
    name: "Grumsin beech forest loop",
    where: "Loop in Grumsin, Brandenburg",
    line: "10.2 km loop, 3 h at a looking pace",
    km: "10.2",
    time: "3:00",
    spots: 5,
    counts: { plants: 31, herbs: 18, mushrooms: 26, birds: 38, mammals: 7 },
    season: ["fungi"],
    lat: 53.01237,
    lon: 13.87510,
    image: "/img/routes/grumsin.jpg",
    summary: "Beech forest, 5 spots, 120 records within 250 m of the line, last recorded 4 days ago",
    notable: { text: "Notable now: beech fungi after the first rain" },
    from: "Loop from the Altkünkendorf car park, Uckermark, Brandenburg",
    description:
      "The Orange Beech Leaf, a waymarked loop along the edge of the Grumsin beech forest, part of a world heritage site. Old beeches, two quiet forest lakes and the shore of Wolletzsee, with fungi on the fallen trunks after the first autumn rain. Mostly forest path and gravel track, with gentle climbs.",
    stops: [
      { name: "The forest gate", note: "Black woodpeckers in the old beeches" },
      { name: "Buckow-See", note: "Great crested grebes, April to August" },
      { name: "Schwarzer See", note: "Sundew on the bog moss at the edge" },
      { left: true, name: "Fungi on the fallen beech", note: "Porcelain fungus on the fallen trunks" },
      { left: true, name: "Wolletzsee", note: "Cranes on the lake at dusk, September to November" },
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
