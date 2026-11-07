// The season: what is in season on a route in a month, decided here and nowhere else. Screens ask this module
// and never read lib/records.ts themselves, so a card's count, a muted spot and the tiles cannot disagree.
//
// The rules (CONTEXT.md, Season):
// - a spot is in season when its own species is, or when anything is recorded at it this month;
// - what to look for is its own species first, then what is recorded there, most records first;
// - the records hold one month. Asked about any other, there is nothing recorded: a screen says less rather
//   than show another month's species as this month's.

import { MONTH_NAMES, NOW } from "@/lib/now";
import { organismIdOf } from "@/lib/organism-names";
import { RECORDED, RECORDED_ALL, RECORDED_COUNTS, RECORDS_MONTH, type Recorded } from "@/lib/records";
import type { Spot } from "@/lib/spots";

/** At most this many organisms to look for at one spot. */
const LOOK = 3;

/** The most-recorded species along a route in a month, most records first. */
export function recordedIn(routeId: string, month = NOW): Recorded[] {
  if (month !== RECORDS_MONTH) return [];
  return [...(RECORDED[routeId] ?? [])].sort((a, b) => b.records - a.records);
}

/** How many species of each group are recorded along a route in a month. */
export const countsIn = (routeId: string, month = NOW) => (month === RECORDS_MONTH ? RECORDED_COUNTS[routeId] : undefined);

/** Every species recorded along a route in a month, by group, for the Recorded page. */
export const everythingIn = (routeId: string, month = NOW) => (month === RECORDS_MONTH ? RECORDED_ALL[routeId] : undefined);

/** A spot as it reads in a month: what to look for, and the month among its months when it is in season, or that it is not. */
export function spotIn(routeId: string, s: Spot, month = NOW): Spot {
  const own = s.months.includes(month) ? s.look : [];
  const near = recordedIn(routeId, month)
    .filter((o) => o.spots.includes(s.n) && !own.some((l) => l.name === o.name))
    .map((o) => ({ name: o.name, last: o.last, organism: organismIdOf(o.name) }));
  const look = [...own, ...near].slice(0, Math.max(LOOK, own.length));
  if (!look.length) return { ...s, look, out: `Not in season in ${MONTH_NAMES[month]}. ${s.outText}` };
  const months = s.months.includes(month) ? s.months : [...s.months, month].sort((a, b) => a - b);
  return { ...s, look, months, out: undefined };
}
