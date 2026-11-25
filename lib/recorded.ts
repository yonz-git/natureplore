import type { Group } from "@/lib/routes";
import { everythingIn } from "@/lib/season";

export type Recorded = {
  name: string;
  latin: string;
  last: string;
  spots: number[];
};
export type RecordedGroup = { group: Group; total: number; rows: Recorded[] };

const ORDER: Group[] = ["plants", "herbs", "mushrooms", "birds", "mammals"];

export function recordedOf(routeId: string): RecordedGroup[] | undefined {
  const all = everythingIn(routeId);
  if (!all) return undefined;
  return ORDER.map((group) => {
    const rows = all.filter((o) => o.group === group).map(({ name, latin, last, spots }) => ({ name, latin, last, spots }));
    return { group, total: rows.length, rows };
  });
}
