// The claims of Flow C: C1a meadow loss, C1b water level, C6 recovering meadow, and the source
// behind each (C2a, C2b, C2c). A claim card on B1, a spot, the walk or the crane is the top of one
// of these, with its first action printed on it. Copy from the redesign canvas and the flow and IA
// redesign (§4). Every figure is sample content: none has been checked against a publication, so
// every place that shows one says so.

export type Tag = { label: string; icon: "down" | "up" | "leaf" | "water" };

export type Claim = {
  id: string;
  claim: string;
  /** the claim card: the site and who published the figure, then its first action */
  scope: string;
  action: string;
  /** the action page the card's action line opens; none when there is no page for it */
  actionId?: string;
  tags: Tag[];
  /** the designated site: a scope label, never a link, because there is no site page */
  site: string;
  reviewed: string;
  /** the two dates of the aerial comparison, when the figure comes from one */
  aerial?: [string, string];
  stat: { label: string; value: string; unit: string };
  sourceLine: string;
  source: {
    title: string;
    /** the closing words that take the lime on the title */
    close?: string;
    publisher: string;
    published: string;
    method: string;
    covers: string;
    paywall?: boolean;
  };
  /** C1a and C1b list actions; C6 says what was done and how to keep it that way */
  actions?: string[];
  done?: string[];
  keep?: { line: string; why: string };
  route: { name: string; line: string; href?: string };
};

export const CLAIMS: Record<string, Claim> = {
  c1a: {
    id: "c1a",
    claim: "Lost about 40% of its wet meadow to drainage since 1990.",
    scope: "NSG and FFH-Gebiet Oberes Rhinluch. Landesamt für Umwelt Brandenburg, 2023",
    action: "Join the September clean-up, Sat 26 Sep",
    actionId: "clean-up",
    tags: [
      { label: "Loss", icon: "down" },
      { label: "Habitat loss", icon: "leaf" },
    ],
    site: "NSG and FFH-Gebiet Oberes Rhinluch",
    reviewed: "Last reviewed Mar 2026",
    aerial: ["1990", "2024"],
    stat: { label: "Wet meadow since 1990", value: "−40", unit: "%" },
    sourceLine: "Landesamt für Umwelt Brandenburg, 2023, aerial survey. True of the whole designated site.",
    source: {
      title: "Wetland change in northern Brandenburg,",
      close: "1990 to 2024",
      publisher: "Landesamt für Umwelt Brandenburg",
      published: "2023",
      method: "Comparison of aerial surveys",
      covers: "NSG and FFH-Gebiet Oberes Rhinluch, the whole designated site",
      paywall: true,
    },
    actions: ["clean-up", "peat-free"],
    route: { name: "Linum wet meadows loop", line: "6.0 km loop, 6 spots", href: "/map/route/linum" },
  },
  c1b: {
    id: "c1b",
    claim: "Summer water levels have dropped by around 30 cm since 2005.",
    scope: "NSG and FFH-Gebiet Oberes Rhinluch. Landesamt für Umwelt Brandenburg, 2022",
    action: "Help rewet Linum meadow",
    actionId: "rewet",
    tags: [
      { label: "Loss", icon: "down" },
      { label: "Water", icon: "water" },
    ],
    site: "NSG and FFH-Gebiet Oberes Rhinluch",
    reviewed: "Last reviewed Mar 2026",
    stat: { label: "Summer water since 2005", value: "−30", unit: "cm" },
    sourceLine: "Landesamt für Umwelt Brandenburg, 2022, gauge records. True of the whole designated site.",
    source: {
      // a placeholder on the board too: the report's title is not known yet
      title: "",
      close: "[Title of the gauge-record report]",
      publisher: "Landesamt für Umwelt Brandenburg",
      published: "2022",
      method: "Gauge records",
      covers: "NSG and FFH-Gebiet Oberes Rhinluch, the whole designated site",
    },
    actions: ["clean-up", "rewet"],
    route: { name: "Linum wet meadows loop", line: "6.0 km loop, 6 spots", href: "/map/route/linum" },
  },
  c6: {
    id: "c6",
    claim: "Wet meadow area has grown by about 15% since 2012, after ditches were blocked.",
    scope: "LSG Tegeler Fließtal. Senatsverwaltung für Umwelt Berlin, 2025",
    action: "Stay on the boardwalk April to July",
    tags: [
      { label: "Recovering", icon: "up" },
      { label: "Wet meadow", icon: "water" },
    ],
    site: "LSG Tegeler Fließtal",
    reviewed: "Recovering since 2022, last reviewed Jun 2026",
    aerial: ["2012", "2025"],
    stat: { label: "Wet meadow since 2012", value: "+15", unit: "%" },
    sourceLine: "Senatsverwaltung für Umwelt Berlin, 2025, aerial survey. True of the whole designated site.",
    source: {
      title: "",
      close: "[Title of the aerial survey]",
      publisher: "Senatsverwaltung für Umwelt Berlin",
      published: "2025",
      method: "Comparison of aerial surveys",
      covers: "LSG Tegeler Fließtal, the whole designated site",
    },
    done: ["Ditches blocked by the state nature agency, 2013 to 2016", "Late mowing agreed with local farmers"],
    keep: { line: "Stay on the boardwalk April to July", why: "Ground-nesting birds breed in the open meadow." },
    // the route is not built in the prototype, so it is named, not linked
    route: { name: "Tegeler Fließ valley path", line: "8.4 km, point to point, 7 spots" },
  },
};

export const claimById = (id: string): Claim | undefined => CLAIMS[id];
