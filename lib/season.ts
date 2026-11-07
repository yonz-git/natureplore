import { MONTH_NAMES, NOW } from "@/lib/now";
import { organismIdOf } from "@/lib/organism-names";
import { RECORDED, RECORDED_ALL, RECORDED_COUNTS, RECORDS_MONTH, type Recorded } from "@/lib/records";
import type { Spot } from "@/lib/spots";

const LOOK = 3;

export function recordedIn(routeId: string, month = NOW): Recorded[] {
  if (month !== RECORDS_MONTH) return [];
  return [...(RECORDED[routeId] ?? [])].sort((a, b) => b.records - a.records);
}

export const countsIn = (routeId: string, month = NOW) => (month === RECORDS_MONTH ? RECORDED_COUNTS[routeId] : undefined);

export const everythingIn = (routeId: string, month = NOW) => (month === RECORDS_MONTH ? RECORDED_ALL[routeId] : undefined);

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
