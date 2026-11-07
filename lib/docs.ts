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
  covers: string;
  access: Access;
  available: boolean;
  region: Region;
  topics: Topic[];
  routeId?: string;
  photo: Photo;
  maker: string;
  description?: string;
  watch?: Fact[];
  why?: string;
  species?: { name: string; kind: string; latin: string; line: string; photo: Photo }[];
  routes?: { name: string; line: string; href: string }[];
  unavailable?: string;
  related?: string[];
};

export const DOCS: Doc[] = [
  {
    id: "drainage",
    title: "When the meadow dries",
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
    title: "A year on the Fließ",
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
    title: "Ten thousand cranes",
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
    title: "The carbon under the moor",
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
    title: "Beneath the pines",
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
    title: "The long way south",
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
    title: "Orchids of the wet meadow",
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

export const docLine = (d: Doc) => `${d.year}, ${d.minutes} min, ${d.covers}`;

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

export const LEARN_DOCS = ["drainage", "migration", "tegel", "peatland", "fungi", "orchids"];

export const REGIONS: Region[] = ["Brandenburg", "Northern Germany", "Europe"];
export const TOPICS: Topic[] = ["Wetlands", "Birds", "Fungi", "Forests"];
