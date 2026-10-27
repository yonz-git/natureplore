// The group filter under a proportion bar, on the route page (B1) and its records (A8): All first, then
// each group by its icon and count. Several groups can be picked; All, or none picked, shows every group.

import { GroupIcon } from "@/components/Icons";
import { GROUPS, type Group } from "@/lib/routes";

export function GroupFilter({
  counts,
  picked,
  onPick,
  onAll,
}: {
  counts: Partial<Record<Group, number>>;
  picked: Group[];
  onPick: (g: Group) => void;
  onAll: () => void;
}) {
  return (
    <ul className="fb-legend" aria-label="Show only these groups">
      <li>
        <button type="button" className="fb-pill fb-all" aria-pressed={picked.length === 0} onClick={onAll}>
          <span className="fb-legend-num">All</span>
        </button>
      </li>
      {GROUPS.map((g) => (
        <li key={g.id}>
          <button
            type="button"
            className={`fb-pill${counts[g.id] ? "" : " is-none"}`}
            title={g.label}
            aria-label={`${g.label}, ${counts[g.id] ?? 0}`}
            aria-pressed={picked.includes(g.id)}
            disabled={!counts[g.id]}
            onClick={() => onPick(g.id)}
          >
            <GroupIcon group={g.id} size={17} className={`is-${g.id}`} />
            <span className="fb-legend-num" data-last={String(counts[g.id] ?? 0).slice(-1)}>
              {counts[g.id] ?? 0}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
