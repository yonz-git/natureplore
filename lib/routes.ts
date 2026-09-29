// The routes, spots and regions the A screens show. One list, so a route reads the same on A4
// (near you), A5 (the region), A7 (saved) and in search, and the counts agree everywhere.
// Content comes from the version 6 boards, A1 to A7, on the redesign canvas.

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
    image: "/img/place-tempelhof.jpg",
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
  },
  {
    id: "linum",
    name: "Linum wet meadows loop",
    where: "Loop in Linum, Brandenburg",
    line: "6.0 km loop, 1 h 45 at a looking pace",
    km: "6.0",
    time: "1:45",
    spots: 6,
    counts: { plants: 10, herbs: 28, birds: 64 },
    season: ["meadow"],
    lat: 52.755,
    lon: 12.87,
    image: "/img/place-linum.jpg",
  },
  {
    id: "grumsin",
    name: "Grumsin beech forest loop",
    where: "Loop in Grumsin, Brandenburg",
    line: "7.1 km loop, 2 h 10",
    km: "7.1",
    time: "2:10",
    spots: 5,
    counts: { plants: 31, herbs: 18, mushrooms: 26, birds: 38, mammals: 7 },
    season: ["fungi"],
    lat: 52.985,
    lon: 13.9,
    image: "/img/place-grumsin.jpg",
  },
];

/** How many routes the region holds in all, for "Show all". */
export const ROUTE_TOTAL = 48;

/** Where the person is when they share their location: Tempelhof, as on the boards. */
export const HERE = { lat: 52.512, lon: 13.355 };

/** A saved thing is a spot on a route or a whole route. */
export type Saved = {
  id: string;
  kind: "spot" | "route";
  name: string;
  line: string;
  counts: Counts;
  lat: number;
  lon: number;
  image?: string;
};

export const SAVED: Saved[] = [
  {
    id: "ditch",
    kind: "spot",
    name: "The flooded ditch",
    line: "Spot 1, Linum wet meadows loop, in season now",
    counts: { plants: 24, herbs: 72, birds: 41 },
    lat: 52.749,
    lon: 12.89,
    image: "/img/place-linum.jpg",
  },
  {
    id: "linum",
    kind: "route",
    name: "Linum wet meadows loop",
    line: "6.0 km loop, 6 spots, 5 in season",
    counts: { plants: 10, herbs: 28, birds: 64 },
    lat: 52.755,
    lon: 12.87,
    image: "/img/place-linum.jpg",
  },
  {
    id: "tempelhof",
    kind: "route",
    name: "Tempelhofer Feld loop",
    line: "6.2 km loop, 5 spots, 3 in season",
    counts: { plants: 24, herbs: 72, birds: 41, mammals: 6 },
    lat: 52.4735,
    lon: 13.403,
    image: "/img/place-tempelhof.jpg",
  },
];

export type Region = {
  name: string;
  /** what kind of place and where, as the result row's second line */
  kind: string;
  /** routes mapped there, or none when the region is not mapped yet */
  routes?: number;
};

export const REGIONS: Region[] = [
  { name: "Brandenburg", kind: "Region, Germany", routes: 212 },
  { name: "Brandenburg an der Havel", kind: "Town, Germany", routes: 18 },
  { name: "Brandenburg Gate area", kind: "Berlin, Germany", routes: 3 },
  { name: "Berlin", kind: "City, Germany", routes: 164 },
  { name: "Potsdam", kind: "City, Germany", routes: 27 },
  { name: "Spreewald", kind: "Region, Germany", routes: 36 },
  { name: "Uckermark", kind: "Region, Germany", routes: 30 },
  { name: "New Brandenburg", kind: "Kentucky, USA" },
];

/** The second line of a result: where it is, and how many routes are mapped there. */
export function regionLine(r: Region) {
  return r.routes === undefined ? r.kind : `${r.kind}, ${r.routes} routes mapped`;
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

/** Regions whose name contains the query, the ones that start with it first. */
export function searchRegions(query: string): Region[] {
  const q = fold(query);
  if (!q) return [];
  return REGIONS.filter((r) => fold(r.name).includes(q)).sort(
    (a, b) => Number(fold(b.name).startsWith(q)) - Number(fold(a.name).startsWith(q)),
  );
}

// the number of single letter edits between two words
function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = next;
    }
  }
  return row[b.length];
}

/**
 * What a misspelt search probably meant, for A3: mapped regions whose name, or the start of it,
 * is a few letters away from the query. Only mapped regions are suggested, so every suggestion
 * leads somewhere.
 */
export function suggestRegions(query: string): Region[] {
  const q = fold(query);
  if (q.length < 3) return [];
  const limit = Math.max(2, Math.round(q.length / 4));
  return REGIONS.filter((r) => r.routes !== undefined)
    .map((r) => {
      const name = fold(r.name);
      return { r, d: Math.min(distance(q, name), distance(q, name.slice(0, q.length))) };
    })
    .filter(({ d }) => d <= limit)
    .sort((a, b) => a.d - b.d || (b.r.routes ?? 0) - (a.r.routes ?? 0))
    .slice(0, 2)
    .map(({ r }) => r);
}
