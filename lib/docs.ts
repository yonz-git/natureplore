// The documentaries of Flow D: curated links, with what each covers and where it can be watched.
// Watching happens on the maker's site, so nothing here plays a film. Titles and makers are
// placeholders on the boards too ("Documentary title", "Maker name"); the page fields past the
// list line are written for the one documentary the D3 board shows and the one D4 shows, and the
// rest open the same page with what is known. Saving one to watch later keeps it on the device
// in lib/saved.ts, as `doc:<id>`.

import type { Fact } from "@/lib/actions";
import { PHOTOS, type Photo } from "@/lib/photos";

export type Access = "Free" | "Subscription service" | "Rental";
export type Topic = "Wetlands" | "Birds" | "Fungi" | "Forests";
export type Region = "Brandenburg" | "Northern Germany" | "Europe";

export type Doc = {
  id: string;
  title: string;
  year: string;
  minutes: number;
  /** what it covers, the end of its list line: "2021, 52 min, wetland drainage in northern Germany" */
  covers: string;
  access: Access;
  /** false for a documentary that cannot be watched where the person is: D4, not D3 */
  available: boolean;
  region: Region;
  topics: Topic[];
  /** the route it belongs to, for "On your saved routes" */
  routeId?: string;
  photo: Photo;
  maker: string;
  description?: string;
  watch?: Fact[];
  why?: string;
  species?: { name: string; kind: string; latin: string; line: string; photo: Photo }[];
  routes?: { name: string; line: string; href: string }[];
  /** D4: why it cannot be watched here, and what on the same subject can */
  unavailable?: string;
  related?: string[];
};

export const DOCS: Doc[] = [
  {
    id: "drainage",
    title: "Documentary title",
    year: "2021",
    minutes: 52,
    covers: "wetland drainage in northern Germany",
    access: "Free",
    available: true,
    region: "Brandenburg",
    topics: ["Wetlands", "Birds"],
    routeId: "linum",
    photo: PHOTOS["organisms/northern-lapwing"],
    maker: "Maker name, public broadcaster archive",
    description:
      "Follows one wet meadow through a drainage season: who owns the ditches, what the water table does, and what the lapwings do when it drops.",
    watch: [
      { icon: "check", text: "Free, in a public broadcaster archive" },
      { icon: "calendar", text: "Available until 31 Dec 2026" },
      { icon: "globe", text: "Streams in Germany, Austria and Switzerland" },
    ],
    why: "It covers the drainage of wet meadows in northern Germany, the same change recorded in NSG Oberes Rhinluch, along Linum wet meadows loop.",
    species: [
      {
        name: "Northern lapwing",
        kind: "Bird",
        latin: "Vanellus vanellus",
        line: "Recorded at spot 3, Linum wet meadows loop, last 5 Sep",
        photo: PHOTOS["organisms/northern-lapwing"],
      },
    ],
    routes: [{ name: "Linum wet meadows loop", line: "Northern lapwing in season in September at spot 3", href: "/map/route/linum" }],
  },
  {
    id: "tegel",
    title: "Documentary title",
    year: "2023",
    minutes: 28,
    covers: "a year on the Tegeler Fließ",
    access: "Free",
    available: true,
    region: "Brandenburg",
    topics: ["Wetlands"],
    photo: PHOTOS["routes/tegel"],
    maker: "Maker name, public broadcaster archive",
  },
  {
    id: "roost",
    title: "Documentary title",
    year: "2018",
    minutes: 44,
    covers: "cranes at the Linum roost",
    access: "Free",
    available: false,
    region: "Brandenburg",
    topics: ["Birds", "Wetlands"],
    routeId: "linum",
    photo: PHOTOS["routes/linum"],
    maker: "maker name",
    unavailable: "The archive that holds this documentary streams only inside Austria. We do not link to copies elsewhere.",
    related: ["drainage", "migration"],
  },
  {
    id: "peatland",
    title: "Documentary title",
    year: "2020",
    minutes: 90,
    covers: "peatland and the carbon it holds",
    access: "Rental",
    available: true,
    region: "Northern Germany",
    topics: ["Wetlands"],
    photo: PHOTOS["organisms/common-reed"],
    maker: "Maker name, rental service",
  },
  {
    id: "fungi",
    title: "Documentary title",
    year: "2022",
    minutes: 50,
    covers: "fungi of the Baltic pine forests",
    access: "Subscription service",
    available: true,
    region: "Northern Germany",
    topics: ["Fungi", "Forests"],
    photo: PHOTOS["organisms/porcelain-fungus"],
    maker: "Maker name, subscription service",
  },
  {
    id: "migration",
    title: "Documentary title",
    year: "2019",
    minutes: 45,
    covers: "crane migration across Europe",
    access: "Subscription service",
    available: true,
    region: "Europe",
    topics: ["Birds"],
    routeId: "linum",
    photo: PHOTOS["organisms/common-crane"],
    maker: "Maker name, subscription service",
  },
  {
    id: "orchids",
    title: "Documentary title",
    year: "2017",
    minutes: 58,
    covers: "orchids of the wet meadows",
    access: "Free",
    available: true,
    region: "Europe",
    topics: ["Wetlands"],
    photo: PHOTOS["organisms/purple-loosestrife"],
    maker: "Maker name, public broadcaster archive",
  },
];

export const docById = (id: string): Doc | undefined => DOCS.find((d) => d.id === id);

/** "2021, 52 min, wetland drainage in northern Germany" */
export const docLine = (d: Doc) => `${d.year}, ${d.minutes} min, ${d.covers}`;

/** Where to watch, for a documentary whose page has no board of its own: what its access says. */
export function watchFacts(d: Doc): Fact[] {
  if (d.watch) return d.watch;
  const where =
    d.access === "Free"
      ? "Free, in a public broadcaster archive"
      : d.access === "Rental"
        ? "Rented from a streaming service"
        : "Included in a subscription service";
  return [{ icon: "check", text: where }];
}

/** The three shown on Learn (D0), in the board's order. */
export const LEARN_DOCS = ["drainage", "migration", "tegel"];

export const REGIONS: Region[] = ["Brandenburg", "Northern Germany", "Europe"];
export const TOPICS: Topic[] = ["Wetlands", "Birds", "Fungi", "Forests"];
