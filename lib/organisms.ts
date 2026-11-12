import type { Group } from "@/lib/routes";
import { namesOf } from "@/lib/organism-names";
import { GENERATED } from "@/lib/organism-pages";
import { CLAIMS, spotOf, type Claim, type Spot } from "@/lib/spots";

export type Organism = {
  id: string;
  name: string;
  close: string;
  group: Group;
  kind: string;
  latin: string;
  alias?: string[];
  back: { href: string; label: string };
  scope?: string;
  record: { title: string; lines: string[] };
  generalised?: { text: string; record: string; note: string };
  why?: string;
  season?: number[];
  when: string;
  where?: { n: number; name: string; line: string; route?: string }[];
  claim?: Claim;
  rule?: Spot;
  impact?: { text: string; source: string };
  actions?: { title: string; sub: string }[];
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

export const ORGANISMS: Organism[] = [...HAND, ...GENERATED.filter((g) => !HAND.some((h) => h.id === g.id))];

const fold = (name: string) => name.trim().toLowerCase();
const BY_NAME = new Map<string, string>();
for (const o of ORGANISMS) for (const n of namesOf(o)) BY_NAME.set(fold(n), o.id);

export const organismHref = (name: string) => {
  const id = BY_NAME.get(fold(name));
  return id && `/map/organism/${id}`;
};

export const organismById = (id: string) => ORGANISMS.find((o) => o.id === id);
