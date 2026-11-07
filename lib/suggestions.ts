import { organismHref } from "@/lib/organisms";
import type { MapPoint } from "@/components/shared/RegionMap";
import type { Group } from "@/lib/routes";

import { MONTH } from "@/lib/now";
import { recordedIn } from "@/lib/season";
import { routeDetail } from "@/lib/spots";

export { MONTH };

export type InSeason = {
  name: string;
  latin: string;
  group: Group;
  note?: string;
  last: string;
};

export type Suggestion = {
  id: string;
  name: string;
  meta: string;
  place: string;
  spots: number;
  lit: number[];
  image?: string;
  href?: string;
  lat: number;
  lon: number;
  inSeason: InSeason[];
};

const ROUTES: Omit<Suggestion, "lit" | "inSeason">[] = [
  {
    id: "grumsin",
    name: "Grumsin beech forest loop",
    meta: "10.2 km loop · 3 h",
    place: "10.2 km loop in Grumsin, Brandenburg",
    spots: 5,
    image: "/img/routes/grumsin.jpg",
    href: "/map/route/grumsin",
    lat: 53.01237,
    lon: 13.8751,
  },
  {
    id: "linum",
    name: "Linum wet meadows loop",
    meta: "6.3 km loop · 1 h 50",
    place: "6.3 km loop in Linum, Brandenburg",
    spots: 6,
    image: "/img/routes/linum.jpg",
    href: "/map/route/linum",
    lat: 52.75773,
    lon: 12.88274,
  },
  {
    id: "tegel",
    name: "Tegeler Fließ valley path",
    meta: "4.9 km one way · 1 h 25",
    place: "4.9 km in Reinickendorf, Berlin",
    spots: 7,
    image: "/img/routes/tegel.jpg",
    href: "/map/route/tegel",
    lat: 52.61804,
    lon: 13.3075,
  },

  {
    id: "tempelhof",
    name: "Tempelhofer Feld loop",
    meta: "5.7 km loop · 1 h 40",
    place: "5.7 km loop in Tempelhof, Berlin",
    spots: 5,
    image: "/img/routes/tempelhof.jpg",
    href: "/map/route/tempelhof",
    lat: 52.48228,
    lon: 13.40724,
  },
];

const litOf = (id: string) => routeDetail(id)?.spots.filter((s) => !s.out).map((s) => s.n) ?? [];

export const SUGGESTIONS: Suggestion[] = ROUTES.map((s) => ({ ...s, lit: litOf(s.id), inSeason: recordedIn(s.id) })).sort(
  (a, b) => b.lit.length / b.spots - a.lit.length / a.spots || a.name.localeCompare(b.name),
);

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

export const inSeasonLine = (s: Suggestion) => `${s.lit.length} of ${s.spots} spots in season in ${MONTH}`;

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

export type Region = {
  id: string;
  name: string;
  kind: string;
  routes: string[];
};

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

export const routesIn = (r: Region) => SUGGESTIONS.filter((s) => r.routes.includes(s.id));

export type RegionOrganism = { organism: InSeason; routes: number; href?: string };

export function organismsIn(r: Region): RegionOrganism[] {
  const found = new Map<string, RegionOrganism>();
  for (const s of routesIn(r))
    for (const o of s.inSeason) {
      const seen = found.get(o.name);
      const newest = seen && Date.parse(seen.organism.last) > Date.parse(o.last) ? seen.organism : o;
      found.set(o.name, { organism: newest, routes: (seen?.routes ?? 0) + 1, href: organismHref(o.name) });
    }
  return [...found.values()];
}

const regionLine = (r: Region) =>
  r.routes.length
    ? `${r.kind}. ${r.routes.length} route${r.routes.length > 1 ? "s" : ""} in season in ${MONTH}`
    : `${r.kind}. Not mapped yet`;

// B5: name the protected area only, so a result cannot narrow the place down
const GENERALISED: { organism: InSeason; where: string; href: string }[] = [
  {
    organism: { name: "Early marsh orchid", latin: "Dactylorhiza incarnata", group: "herbs", last: "Jun 2026" },
    where: "Recorded within NSG Oberes Rhinluch, exact place not shown",
    href: "/map/organism/early-marsh-orchid",
  },
];

export type RegionHit = { region: Region; line: string; href?: string };
export type OrganismHit = { organism: InSeason; line: string; href?: string };

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
