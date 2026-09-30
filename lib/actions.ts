// The actions of Flow C: C3 the September clean-up (and C4, registered for it), C5 supporting the
// group that rewets Linum meadow, and C7 buying peat-free compost. Each answers a claim. Copy from
// the redesign canvas; the figures are sample content and say so. Registering for the clean-up and
// saving the everyday practice are kept on the device in lib/saved.ts, as `action:<id>`.

export type Fact = { icon: "calendar" | "pin" | "people" | "walk" | "bag" | "check"; text: string };
export type Benefit = "Habitat condition" | "Biodiversity" | "Carbon";

type Base = {
  id: string;
  /** the tag over the title, and its icon */
  kind: string;
  kindIcon: "people" | "leaf" | "bag";
  title: string;
  /** the closing words that take the lime on the title */
  close: string;
  /** the claim it answers: its back target when nothing else is known, and "See the claim" */
  claimId: string;
  changes?: string;
  benefits: Benefit[];
  why?: string;
};

export type CleanUp = Base & {
  type: "event";
  place: string;
  image: string;
  stats: { label: string; value: string; unit?: string }[];
  going: number;
  facts: Fact[];
  quantified: { title: string; text: string };
  registered: Fact[];
  calendar: { start: string; end: string; location: string };
};

export type Support = Base & {
  type: "support";
  org: string;
  orgLine: string;
  does: string[];
  figure: Figure;
  external: string;
};

export type Practice = Base & {
  type: "practice";
  lead: string;
  facts: Fact[];
  figure: Figure;
  steps: string[];
};

export type Figure = { value: string; unit: string; line: string; note: string; source: string };

export type Action = CleanUp | Support | Practice;

const SITE = "Linum wet meadow, NSG Oberes Rhinluch";

export const ACTIONS: Record<string, Action> = {
  "clean-up": {
    id: "clean-up",
    type: "event",
    kind: "Local action",
    kindIcon: "people",
    title: "September clean-up at Linum",
    close: "meadow",
    claimId: "c1a",
    place: SITE,
    image: "/img/routes/linum.jpg",
    stats: [
      { label: "Date", value: "26", unit: "Sep" },
      { label: "Time", value: "2", unit: "h" },
    ],
    going: 14,
    facts: [
      { icon: "calendar", text: "Saturday 26 September, 10:00 to 12:00" },
      { icon: "pin", text: "Meeting point: Linum village car park" },
      { icon: "people", text: "Run by a local nature group" },
      { icon: "walk", text: "Easy, flat paths, gloves provided" },
    ],
    changes: "Removes old drainage pipes and litter from the meadow edge, so more water stays on the meadow through summer.",
    benefits: ["Habitat condition", "Biodiversity"],
    quantified: {
      title: "Not yet quantified",
      text: `Nobody has measured what one clean-up changes on ${SITE}. Said plainly rather than filled with a number.`,
    },
    why: `Answers ${SITE} losing about 40% of its wet meadow to drainage since 1990.`,
    registered: [
      { icon: "calendar", text: "Sat 26 Sep, 10:00 to 12:00" },
      { icon: "pin", text: "Linum village car park" },
      { icon: "bag", text: "Bring sturdy shoes and water" },
      { icon: "people", text: "Organiser: local nature group" },
    ],
    calendar: { start: "20260926T100000", end: "20260926T120000", location: "Linum village car park" },
  },
  rewet: {
    id: "rewet",
    type: "support",
    kind: "Support an organisation",
    kindIcon: "leaf",
    title: "Help rewet Linum",
    close: "meadow",
    claimId: "c1b",
    org: "Local nature group",
    orgLine: `Registered charity, manages ${SITE} since 2004`,
    does: [
      "Blocks old drainage ditches so water stays on the meadow",
      "Pays for yearly water-level checks",
      "Keeps a crane-watching point open",
    ],
    benefits: ["Habitat condition", "Biodiversity", "Carbon"],
    figure: {
      value: "+12",
      unit: "cm summer water level",
      line: "3 ditches blocked, summer water level up 12 cm",
      note: "A site total across the 2024 season, not a figure per supporter.",
      source: "Source: the group’s annual report, 2025. Sample figure for the prototype.",
    },
    external: "Donations and volunteering happen on the group's own site. Natureplore takes no payment or share.",
  },
  "peat-free": {
    id: "peat-free",
    type: "practice",
    kind: "Everyday practice",
    kindIcon: "bag",
    title: "Buy peat-free",
    close: "compost",
    claimId: "c1a",
    lead: "Nothing to join, nothing to sign up for. This one is a habit, not an event.",
    facts: [
      { icon: "calendar", text: "Any time you buy compost, all year" },
      { icon: "pin", text: `Anywhere, not only at ${SITE}` },
      { icon: "bag", text: "Reading one label, costs about the same" },
      { icon: "check", text: "No registration, no one to meet" },
    ],
    changes:
      "Compost peat is cut from bogs and fens that have to be drained first. Less demand for peat means less pressure to drain more of them.",
    benefits: ["Carbon", "Habitat condition"],
    figure: {
      value: "2 t",
      unit: "CO₂-eq per tonne of peat",
      line: "About 2 t CO₂-eq per tonne of peat not used",
      note: `A national average for peat extraction, not your own saving, and not a figure for ${SITE}.`,
      source: "Source: Umweltbundesamt, 2022. Sample figure for the prototype.",
    },
    steps: [
      "Look for peat-free on the bag. Organic and eco do not mean peat-free.",
      "Reduced peat still contains peat. Put it back.",
      "Mixes based on bark, wood fibre or coir do the same job. They dry out faster, so water a little more often.",
    ],
    why: `Answers drainage, the change recorded at ${SITE}. This one works across the region rather than on that meadow alone, so it is slower than the clean-up and it never stops.`,
  },
};

export const actionById = (id: string): Action | undefined => ACTIONS[id];

/** The row an action gets in a claim's "What you can do" and in Saved. */
export const ACTION_ROWS: Record<string, { title: string; line: string; date?: [string, string] }> = {
  "clean-up": { title: "Join the September clean-up", line: "Sat 26 Sep, removes old drainage pipes", date: ["26", "Sep"] },
  rewet: { title: "Help rewet Linum meadow", line: "Support the group that manages it" },
  "peat-free": { title: "Buy peat-free compost", line: "Everyday habit, less pressure to drain bogs" },
};
