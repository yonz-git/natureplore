// The routes in season this month, the suggestion cards on A5 and A4, and what search finds.
// Content comes from the flow and IA redesign (.forge/briefs/flow-ia-redesign-final.md, section 3)
// and the Flow A boards on the redesign canvas. Prototype date: Thursday 24 September 2026, so
// "this month" is September. Only Linum wet meadows loop has its route page built.

import type { MapPoint } from "@/components/RegionMap";
import type { Group } from "@/lib/routes";

export const MONTH = "September";

export type InSeason = {
  name: string;
  latin: string;
  group: Group;
  /** what it is doing there, when the boards say so */
  note?: string;
  /** last recorded, as the boards write it */
  last: string;
};

export type Suggestion = {
  /** the same id as in lib/routes.ts, so a saved route reads the same in Saved and on B1 */
  id: string;
  name: string;
  meta: string;
  /** the short line A3 uses for "Did you mean" */
  place: string;
  spots: number;
  /** the spots in season this month, in walking order */
  lit: number[];
  /** the route's photograph, from lib/photos.ts */
  image?: string;
  /** the route page, only where it is built */
  href?: string;
  lat: number;
  lon: number;
  inSeason: InSeason[];
};

// Sorted by the share of spots in season this month, then by name: a sort, not a recommendation.
// Linum 4 of 6, Tegeler Fließ 3 of 7, Grumsin 2 of 5, Tempelhofer Feld 2 of 5.
export const SUGGESTIONS: Suggestion[] = [
  {
    id: "linum",
    name: "Linum wet meadows loop",
    meta: "6.0 km loop, 1 h 45 at a looking pace, 6 spots",
    place: "6.0 km loop in Linum, Brandenburg",
    spots: 6,
    lit: [1, 2, 3, 4],
    image: "/img/routes/linum.jpg",
    href: "/map/route/linum",
    lat: 52.75963,
    lon: 12.87651,
    inSeason: [
      { name: "Common crane", latin: "Grus grus", group: "birds", note: "gathering at dusk", last: "11 Sep" },
      { name: "Greylag goose", latin: "Anser anser", group: "birds", last: "10 Sep" },
      { name: "Northern lapwing", latin: "Vanellus vanellus", group: "birds", last: "5 Sep" },
    ],
  },
  {
    id: "tegel",
    name: "Tegeler Fließ valley path",
    meta: "8.4 km, point to point, 2 h 30 at a looking pace, 7 spots",
    place: "8.4 km in Reinickendorf, Berlin",
    spots: 7,
    lit: [1, 2, 3],
    image: "/img/routes/tegel.jpg",
    lat: 52.5965,
    lon: 13.2965,
    inSeason: [
      { name: "Common kingfisher", latin: "Alcedo atthis", group: "birds", last: "14 Sep" },
      { name: "Grey heron", latin: "Ardea cinerea", group: "birds", last: "18 Sep" },
    ],
  },
  {
    id: "grumsin",
    name: "Grumsin beech forest loop",
    meta: "7.1 km loop, 2 h 10 at a looking pace, 5 spots",
    place: "7.1 km loop in Grumsin, Brandenburg",
    spots: 5,
    lit: [1, 2],
    image: "/img/routes/grumsin.jpg",
    lat: 52.985,
    lon: 13.9,
    inSeason: [
      { name: "Porcelain fungus", latin: "Oudemansiella mucida", group: "mushrooms", note: "on beech deadwood", last: "19 Sep" },
      { name: "Black woodpecker", latin: "Dryocopus martius", group: "birds", last: "12 Sep" },
    ],
  },
  {
    id: "tempelhof",
    name: "Tempelhofer Feld loop",
    meta: "6.2 km loop, 1 h 50 at a looking pace, 5 spots",
    place: "6.2 km loop in Tempelhof, Berlin",
    spots: 5,
    lit: [1, 2],
    image: "/img/routes/tempelhof.jpg",
    lat: 52.4735,
    lon: 13.403,
    inSeason: [
      { name: "Northern wheatear", latin: "Oenanthe oenanthe", group: "birds", note: "passing through", last: "15 Sep" },
      { name: "Eurasian skylark", latin: "Alauda arvensis", group: "birds", last: "20 Sep" },
    ],
  },
];

/** The four routes on the map with their names, a constant so the map is built once. */
export const ROUTE_POINTS: MapPoint[] = SUGGESTIONS.map((s) => ({
  id: s.id,
  lat: s.lat,
  lon: s.lon,
  name: s.name,
  tag: `${s.lit.length} of ${s.spots} in season`,
  label: `${s.name}, ${s.lit.length} of ${s.spots} spots in season${s.href ? ", open the route" : ""}`,
  href: s.href,
}));

export const suggestionById = (id: string) => SUGGESTIONS.find((s) => s.id === id);

/** How many routes the region holds in all, for "Show all". */
export const ROUTE_TOTAL = 48;

/** "4 of 6 spots in season in September" */
export const inSeasonLine = (s: Suggestion) => `${s.lit.length} of ${s.spots} spots in season in ${MONTH}`;

// ── search ──────────────────────────────────────────────────────────────────────────────────

const fold = (x: string) =>
  x
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const GROUP_WORD: Record<Group, string> = {
  plants: "Plant",
  herbs: "Herb",
  mushrooms: "Mushroom",
  birds: "Bird",
  mammals: "Mammal",
};
export const groupWord = (g: Group) => GROUP_WORD[g];

// ── regions: what the map searches for, with organisms ─────────────────────────────────────

export type Region = {
  id: string;
  name: string;
  /** what kind of place and where */
  kind: string;
  /** the routes in it, by id; none when it is not mapped yet */
  routes: string[];
};

/** The whole mapped area, the one A5 opens on. */
export const HOME_REGION = "berlin-brandenburg";

export const REGIONS: Region[] = [
  { id: HOME_REGION, name: "Berlin and Brandenburg", kind: "Region, Germany", routes: SUGGESTIONS.map((s) => s.id) },
  { id: "berlin", name: "Berlin", kind: "City, Germany", routes: ["tegel", "tempelhof"] },
  { id: "brandenburg", name: "Brandenburg", kind: "State, Germany", routes: ["linum", "grumsin"] },
  { id: "linum", name: "Linum", kind: "Village in Brandenburg", routes: ["linum"] },
  { id: "uckermark", name: "Uckermark", kind: "District in Brandenburg", routes: ["grumsin"] },
  { id: "reinickendorf", name: "Reinickendorf", kind: "District in Berlin", routes: ["tegel"] },
  { id: "tempelhof", name: "Tempelhof", kind: "District in Berlin", routes: ["tempelhof"] },
  { id: "hamburg", name: "Hamburg", kind: "City, Germany", routes: [] },
];

export const regionById = (id?: string) => REGIONS.find((r) => r.id === id) ?? REGIONS[0];

/** The routes in a region, in the suggestion order. */
export const routesIn = (r: Region) => SUGGESTIONS.filter((s) => r.routes.includes(s.id));

export type RegionOrganism = { organism: InSeason; routes: number; href?: string };

/** What is in season in a region this month: each organism once, with the routes it is along. */
export function organismsIn(r: Region): RegionOrganism[] {
  const found = new Map<string, RegionOrganism>();
  for (const s of routesIn(r))
    for (const o of s.inSeason) {
      const seen = found.get(o.name);
      found.set(o.name, { organism: o, routes: (seen?.routes ?? 0) + 1, href: o.name === "Common crane" ? "/map/organism/common-crane" : undefined });
    }
  return [...found.values()];
}

const regionLine = (r: Region) =>
  r.routes.length
    ? `${r.kind}. ${r.routes.length} route${r.routes.length > 1 ? "s" : ""} in season in ${MONTH}`
    : `${r.kind}. Not mapped yet`;

// Species whose location is generalised (B5): search is the only way to their page, and the line
// names the protected area, never a route or a spot, so a result cannot narrow the place down.
const GENERALISED: { organism: InSeason; where: string; href: string }[] = [
  {
    organism: { name: "Early marsh orchid", latin: "Dactylorhiza incarnata", group: "herbs", last: "Jun 2026" },
    where: "Recorded within NSG Oberes Rhinluch, exact place not shown",
    href: "/map/organism/early-marsh-orchid",
  },
];

export type RegionHit = { region: Region; line: string; href?: string };
export type OrganismHit = { organism: InSeason; line: string; href?: string };

/**
 * A2: regions first, then organisms. A region opens its suggestions, where Routes or Organisms
 * filters what is listed. An organism is listed once, with how many routes it is recorded along.
 */
export function search(query: string): { regions: RegionHit[]; organisms: OrganismHit[] } {
  const q = fold(query);
  if (!q) return { regions: [], organisms: [] };
  const regions = REGIONS.filter((r) => r.id !== HOME_REGION && fold(r.name).includes(q))
    .sort((a, b) => Number(fold(b.name).startsWith(q)) - Number(fold(a.name).startsWith(q)))
    .map((r) => ({ region: r, line: regionLine(r), href: r.routes.length ? `/map?region=${r.id}` : undefined }));
  const organisms = organismsIn(REGIONS[0])
    .filter(({ organism: o }) => fold(o.name).includes(q) || fold(o.latin).includes(q))
    .map(({ organism: o, routes, href }) => ({
      organism: o,
      href,
      line: `${GROUP_WORD[o.group]}, ${o.latin}. Recorded along ${routes} route${routes > 1 ? "s" : ""}, last ${o.last}`,
    }));
  for (const g of GENERALISED)
    if (fold(g.organism.name).includes(q) || fold(g.organism.latin).includes(q))
      organisms.push({ organism: g.organism, href: g.href, line: `${GROUP_WORD[g.organism.group]}, ${g.organism.latin}. ${g.where}` });
  return { regions, organisms };
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

/** A3: what a misspelt search probably meant, a region or an organism a few letters away. */
export function didYouMean(query: string): { regions: RegionHit[]; organisms: InSeason[] } {
  const q = fold(query);
  if (q.length < 3) return { regions: [], organisms: [] };
  const limit = Math.max(1, Math.round(q.length / 4));
  const near = (name: string) => fold(name).split(/\s+/).some((w) => distance(q, w) <= limit);
  const regions = REGIONS.filter((r) => r.id !== HOME_REGION && r.routes.length && near(r.name)).map((r) => ({
    region: r,
    line: regionLine(r),
    href: `/map?region=${r.id}`,
  }));
  const organisms = organismsIn(REGIONS[0])
    .map((x) => x.organism)
    .filter((o) => near(o.name));
  return { regions, organisms };
}
