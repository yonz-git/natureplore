// The organisms with a page of their own, B4 and B5. Content comes from the version 6 boards:
// the common crane at Linum (B4), and the early marsh orchid, whose location is generalised
// because it is at risk from collection and trampling (B5).

import type { Group } from "@/lib/routes";

export type Organism = {
  id: string;
  /** the name, and its closing words that take the lime on the title */
  name: string;
  close: string;
  group: Group;
  kind: string;
  latin: string;
  credit: string;
  /** where the person came from: the route the organism was recorded on */
  back: { href: string; label: string };
  /** the record: an exact place, or only an area when the location is generalised */
  record: { title: string; lines: string[] };
  generalised?: { text: string; record: string; note: string };
  why?: string;
  /** months it is most seen, 0 for January */
  season?: number[];
  when: string;
  with?: { name: string; id?: string }[];
  impact: { text: string; source: string };
  actions: { title: string; sub: string }[];
  near?: { name: string; line: string }[];
  docs?: { title: string; line: string }[];
};

export const ORGANISMS: Organism[] = [
  {
    id: "common-crane",
    name: "Common",
    close: "crane",
    group: "birds",
    kind: "Bird",
    latin: "Grus grus",
    credit: "M. Keller, CC BY",
    back: { href: "/map/route/linum", label: "Linum wet meadows loop" },
    record: {
      title: "Recorded here, last 11 Sep 2026",
      lines: ["214 records at this meadow since 2015", "Source: regional bird survey, M. Keller, CC BY"],
    },
    why: "Shallow water and open meadow give cranes a safe place to roost on migration. Thousands gather here each autumn.",
    season: [8, 9, 10],
    when: "Most records at dawn and dusk, late September to early November",
    with: [
      { name: "Greylag goose" },
      { name: "Northern lapwing" },
      { name: "Marsh marigold" },
      { name: "Early marsh orchid", id: "early-marsh-orchid" },
    ],
    impact: { text: "Drainage has shrunk the shallow water cranes roost in.", source: "Source: publisher name, 2023" },
    actions: [
      { title: "Keep 300 m from roosting flocks at dusk", sub: "Disturbance makes cranes leave the roost" },
      { title: "Join the September clean-up", sub: "Sat 27 Sep, 2 hours, run by a local nature group" },
    ],
    near: [
      { name: "Rhinluch fen", line: "8 km from this meadow, last recorded 5 Sep 2026" },
      { name: "Lake Stechlin shore", line: "60 km from this meadow, last recorded 28 Aug 2026" },
    ],
    docs: [{ title: "Documentary title", line: "2019, 45 min, crane migration across Europe" }],
  },
  {
    id: "early-marsh-orchid",
    name: "Early marsh",
    close: "orchid",
    group: "herbs",
    kind: "Herb",
    latin: "Dactylorhiza incarnata",
    credit: "Photo: photographer name, licence",
    back: { href: "/map/route/linum", label: "Linum wet meadows loop" },
    record: { title: "", lines: [] },
    generalised: {
      text: "Recorded within about 10 km of this meadow. Exact spots are not shown for species at risk from collection and trampling.",
      record: "Recorded in this area, last Jun 2026, regional plant survey",
      note: "No nearby spots and no Show on map for a generalised species: a list of areas would narrow the location down again.",
    },
    when: "Flowers late May to early July, in wet, nutrient-poor meadow",
    impact: { text: "Drainage and fertiliser run-off shrink the wet, poor ground it needs.", source: "Source: publisher name, 2023" },
    actions: [{ title: "Stay on paths in June and July", sub: "Trampling damages the plants and the ground" }],
  },
];

export const organismById = (id: string) => ORGANISMS.find((o) => o.id === id);
