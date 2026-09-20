// The places, regions and counts the A screens show. One list, so a place reads the same on
// A4 (near you), A5 (a region) and A7 (saved), and the search results agree with the counts on
// the map. Content comes from the version 6 boards, A2 to A7.

export type Group = "plants" | "herbs" | "mushrooms" | "birds";

export type Place = {
  id: string;
  name: string;
  habitat: string;
  /** kilometres from the person, used wherever a list is sorted by distance */
  km: number;
  /** the region a place sits in, shown instead of the distance when location is off */
  region: string;
  /** what is worth seeing there now, only where a place has something */
  notable?: string;
  counts: Partial<Record<Group, number>>;
  lat: number;
  lon: number;
  /** the soft field the boards use in place of a photograph, in public/img */
  image?: string;
  saved?: boolean;
};

export const PLACES: Place[] = [
  {
    id: "tempelhof",
    name: "Tempelhofer Feld",
    habitat: "Grassland",
    km: 7,
    region: "Berlin",
    counts: { plants: 24, herbs: 72, birds: 41 },
    lat: 52.4735,
    lon: 13.403,
    image: "/img/place-tempelhof.jpg",
    saved: true,
  },
  {
    id: "tegel",
    name: "Tegeler Fließ valley",
    habitat: "River meadow",
    km: 10,
    region: "Berlin",
    counts: { plants: 22, herbs: 66, mushrooms: 12, birds: 57 },
    lat: 52.5965,
    lon: 13.2965,
  },
  {
    id: "teufelsfenn",
    name: "Teufelsfenn bog, Grunewald",
    habitat: "Bog and forest",
    km: 13,
    region: "Berlin",
    counts: { plants: 16, herbs: 48, mushrooms: 38, birds: 33 },
    lat: 52.476,
    lon: 13.23,
  },
  {
    id: "linum",
    name: "Wet meadow at Linum",
    habitat: "Wetland",
    km: 45,
    region: "Brandenburg",
    notable: "Cranes gathering, September to November",
    counts: { plants: 10, herbs: 28, birds: 64 },
    lat: 52.75,
    lon: 12.89,
    image: "/img/place-linum.jpg",
    saved: true,
  },
  {
    id: "grumsin",
    name: "Grumsin beech forest",
    habitat: "Old forest",
    km: 70,
    region: "Brandenburg",
    notable: "Autumn fungi now",
    counts: { plants: 13, herbs: 39, mushrooms: 40, birds: 31 },
    lat: 53.018,
    lon: 13.89,
    image: "/img/place-grumsin.jpg",
    saved: true,
  },
];

/** everything recorded in the launch region, the number every "show all" offers */
export const TOTAL_PLACES = 376;

/** where the person is on A4 and A7, until a real browser location replaces it */
export const HERE: [number, number] = [52.51, 13.38];

/** the places drawn on the near you map: the three in the list, and three more around Berlin */
export const NEARBY: [number, number][] = [
  [52.5395, 13.4585],
  [52.4405, 13.2585],
  [52.5605, 13.5695],
];

export const GROUPS: { id: "all" | Group; label: string }[] = [
  { id: "all", label: "All" },
  { id: "plants", label: "Plants" },
  { id: "herbs", label: "Herbs" },
  { id: "mushrooms", label: "Mushrooms" },
  { id: "birds", label: "Birds" },
];

/** "24 plants, 72 herbs, 41 birds", leaving out a group with nothing recorded */
export const countLine = (counts: Place["counts"]) =>
  (["plants", "herbs", "mushrooms", "birds"] as Group[])
    .filter((g) => counts[g])
    .map((g) => `${counts[g]} ${g}`)
    .join(", ");

export type Region = {
  name: string;
  /** "Region, Germany" */
  where: string;
  /** how many places are mapped there, 0 where nothing is */
  places: number;
};

// Searchable regions. The counts are the map's own clusters, so a result and a pin never
// disagree, plus the three the boards show for the Brandenburg search. The launch region itself
// is not in the list: it is what the map already shows, so searching for it leads nowhere new.
export const REGIONS: Region[] = [
  { name: "Berlin", where: "City, Germany", places: 164 },
  { name: "Brandenburg", where: "Region, Germany", places: 212 },
  { name: "Brandenburg an der Havel", where: "Town, Germany", places: 18 },
  { name: "Brandenburg Gate area", where: "Berlin, Germany", places: 3 },
  { name: "Schorfheide-Chorin", where: "Biosphere reserve, Germany", places: 48 },
  { name: "Spreewald", where: "Biosphere reserve, Germany", places: 36 },
  { name: "Potsdam", where: "Town, Germany", places: 27 },
  { name: "Havelland", where: "District, Germany", places: 21 },
  { name: "Uckermark", where: "District, Germany", places: 30 },
  { name: "Fläming", where: "Nature park, Germany", places: 23 },
  { name: "Oderbruch", where: "Landscape, Germany", places: 9 },
  { name: "New Brandenburg", where: "Kentucky, USA", places: 0 },
];

/** "212 places mapped", or the plain statement that nothing is */
export const placeLine = (r: Region) =>
  r.places === 0 ? `${r.where}, not mapped yet` : `${r.where}, ${r.places} places mapped`;

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const bigrams = (s: string) => {
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
};

/** Dice coefficient on letter pairs: catches a transposition like "Brandenbrug". */
const similarity = (a: string, b: string) => {
  const x = bigrams(a);
  const y = bigrams(b);
  if (!x.size || !y.size) return 0;
  let shared = 0;
  for (const g of x) if (y.has(g)) shared++;
  return (2 * shared) / (x.size + y.size);
};

/**
 * A2 and A3 in one answer: the regions whose name contains what was typed, and, when nothing
 * does, the nearest spellings to offer as "did you mean".
 */
export function searchRegions(query: string): { results: Region[]; suggestions: Region[] } {
  const q = fold(query);
  if (q.length < 2) return { results: [], suggestions: [] };

  const results = REGIONS.filter((r) => fold(r.name).includes(q));
  if (results.length) return { results, suggestions: [] };

  const suggestions = REGIONS.map((r) => ({ r, score: similarity(q, fold(r.name)) }))
    .filter(({ score }) => score >= 0.35)
    // A region with places comes first however close the spelling: "did you mean" is there to
    // recover the search, and an empty region recovers nothing. Letter similarity cannot separate
    // two names that differ only in their tail, so scores are compared in steps of 0.05 and the
    // region with more places mapped wins inside a step.
    .sort(
      (a, b) =>
        Number(b.r.places > 0) - Number(a.r.places > 0) ||
        Math.floor(b.score / 0.05) - Math.floor(a.score / 0.05) ||
        b.r.places - a.r.places,
    )
    .slice(0, 2)
    .map(({ r }) => r);

  return { results: [], suggestions };
}

/** where picking a search result goes: a mapped region, or the honest empty state */
export const regionHref = (r: Region) =>
  r.places === 0
    ? `/map/not-mapped?place=${encodeURIComponent(r.name)}`
    : `/map/region?place=${encodeURIComponent(r.name)}`;
