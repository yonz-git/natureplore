// The organisms with a page of their own, B4 and B5. Content comes from the version 6 boards:
// the common crane at Linum (B4), and the early marsh orchid, whose location is generalised
// because it is at risk from collection and trampling (B5).

import type { Group } from "@/lib/routes";
import { GENERATED } from "@/lib/organism-pages";
import { CLAIMS, spotOf, type Claim, type Spot } from "@/lib/spots";

export type Organism = {
  id: string;
  /** the name, and its closing words that take the lime on the title */
  name: string;
  close: string;
  group: Group;
  kind: string;
  latin: string;
  /** the other names the route lists give it, which open the same page */
  alias?: string[];
  /** where the page was opened from when nothing else is known: spot 4 for the crane */
  back: { href: string; label: string };
  /** the spot and route it was recorded at, under the name */
  scope?: string;
  /** the record: an exact place, or only an area when the location is generalised */
  record: { title: string; lines: string[] };
  generalised?: { text: string; record: string; note: string };
  why?: string;
  /** months it is most seen, 0 for January */
  season?: number[];
  when: string;
  /** the spots it is recorded at, in the order the spot page lists them */
  where?: { n: number; name: string; line: string; route?: string }[];
  /** Impact here: the claim card and the action row of its spot, the same row the spot shows */
  claim?: Claim;
  rule?: Spot;
  /** Impact here for a species without a spot, where the place stays generalised */
  impact?: { text: string; source: string };
  actions?: { title: string; sub: string }[];
  /** documentaries about it, by id in lib/docs.ts */
  docs?: string[];
};

const HAND: Organism[] = [
  {
    id: "common-crane",
    name: "Common",
    close: "crane",
    group: "birds",
    kind: "Bird",
    latin: "Grus grus",
    back: {
      href: "/map/route/linum?spot=4",
      label: "Back to Linum wet meadows",
    },
    scope: "Recorded at The dam between the ponds, Linum wet meadows",
    record: {
      title: "Recorded here, last 11 Sep 2026",
      lines: ["214 records along Linum wet meadows since 2015. Regional bird survey, M. Keller, CC BY"],
    },
    why: "Shallow water and open meadow give cranes a safe place to roost on migration. Recorded roosting here every autumn in the survey.",
    season: [8, 9, 10],
    when: "Most records at dawn and dusk, late September to early November",
    where: [
      {
        n: 4,
        name: "The dam between the ponds",
        line: "Linum wet meadows. Sep to Nov, last recorded 11 Sep",
      },
      {
        n: 1,
        name: "The flooded ditch",
        line: "Linum wet meadows. Sep to Oct, last recorded 11 Sep",
      },
    ],
    claim: CLAIMS.c1a,
    rule: spotOf("linum", 4),
    docs: ["migration"],
  },
  {
    id: "early-marsh-orchid",
    name: "Early marsh",
    close: "orchid",
    group: "herbs",
    kind: "Herb",
    latin: "Dactylorhiza incarnata",
    back: { href: "/map/search?q=orchid", label: "Back to search" },
    record: { title: "", lines: [] },
    generalised: {
      text: "Recorded within NSG Oberes Rhinluch, exact place not shown. A species at risk from collection and trampling is never shown at a spot.",
      record: "Recorded in this area, last Jun 2026, regional plant survey",
      note: "No nearby spots and no Show on map for a generalised species: a list of areas would narrow the location down again.",
    },
    when: "Flowers late May to early July, in wet, nutrient-poor meadow",
    impact: {
      text: "Drainage and fertiliser run-off shrink the wet, poor ground it needs.",
      source: "Source: publisher name, 2023",
    },
    actions: [
      {
        title: "Stay on paths in June and July",
        sub: "Trampling damages the plants and the ground",
      },
    ],
  },
];

/** The hand-written pages first, then one for every species the routes list, from GBIF. */
export const ORGANISMS: Organism[] = [...HAND, ...GENERATED.filter((g) => !HAND.some((h) => h.id === g.id))];

const fold = (name: string) => name.trim().toLowerCase();
// every name a list may write for a page, once, so a lookup is not a scan of all of them
const BY_NAME = new Map<string, string>();
for (const o of ORGANISMS) for (const n of [`${o.name} ${o.close}`, ...(o.alias ?? [])]) BY_NAME.set(fold(n), o.id);

/** The page of an organism by its common name as the lists write it ("Common crane"), when it has one. */
export const organismHref = (name: string) => {
  const id = BY_NAME.get(fold(name));
  return id && `/map/organism/${id}`;
};

export const organismById = (id: string) => ORGANISMS.find((o) => o.id === id);
