// A8 · Recorded along this route: everything GBIF records within 250 m of a route in the prototype's month,
// by group, in one fixed order, most records first in each group (RECORDED_ALL in lib/records.ts, written by
// .design/gbif/build.py). Each species carries the spots it was recorded at, by the same rule as the route
// page's tiles: the spots within 300 m of its records, or the closest one.

import { RECORDED_ALL } from "@/lib/records";
import type { Group } from "@/lib/routes";

export type Recorded = {
  name: string;
  latin: string;
  last: string;
  /** the spots it was recorded at */
  spots: number[];
};
export type RecordedGroup = { group: Group; total: number; rows: Recorded[] };

const ORDER: Group[] = ["plants", "herbs", "mushrooms", "birds", "mammals"];

/** A route's records by group, every group in its place even with nothing recorded; undefined for a route GBIF was not fetched for. */
export function recordedOf(routeId: string): RecordedGroup[] | undefined {
  const all = RECORDED_ALL[routeId];
  if (!all) return undefined;
  return ORDER.map((group) => {
    const rows = all.filter((o) => o.group === group).map(({ name, latin, last, spots }) => ({ name, latin, last, spots }));
    return { group, total: rows.length, rows };
  });
}
