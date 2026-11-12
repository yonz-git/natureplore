// B1 · Through the year

import { GroupIcon } from "@/components/ui/Icons";
import { MONTH_LETTERS, MONTH_NAMES, NOW } from "@/lib/spots";
import { MONTH_GROUPS, MONTHS } from "@/lib/months";
import { GROUPS } from "@/lib/routes";

const name = (g: string) => GROUPS.find((x) => x.id === g)!.label;
const step = (v: number, peak: number) => (v === 0 ? 0 : Math.max(1, Math.ceil((4 * v) / peak)));

export function YearChart({ routeId }: { routeId: string }) {
  const months = MONTHS[routeId];
  if (!months) return null;

  return (
    <figure className="fb-card fb-heat">
      <table>
        <caption className="sr-only">Species recorded each month along this route, by group, 2016 to 2025</caption>
        <thead>
          <tr>
            <td />
            {MONTH_LETTERS.map((l, i) => (
              <th key={i} scope="col" className={i === NOW ? "is-now" : undefined}>
                <span aria-hidden="true">{l}</span>
                <span className="sr-only">{MONTH_NAMES[i]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTH_GROUPS.map((g, k) => {
            const row = months.map((m) => m[k]);
            const peak = Math.max(...row, 1);
            return (
              <tr key={g} className={`is-${g}`}>
                <th scope="row" title={name(g)}>
                  <GroupIcon group={g} size={20} className={`is-${g}`} />
                  <span className="sr-only">{name(g)}</span>
                </th>
                {row.map((v, i) => (
                  <td key={i} className={i === NOW ? "is-now" : undefined} title={`${MONTH_NAMES[i]}: ${v} ${name(g).toLowerCase()}`}>
                    <span className="fb-heat-cell" data-step={step(v, peak)}>
                      <span className="fb-heat-n">{v}</span>
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <figcaption>
        <span>Fewer</span>
        <span className="fb-heat-key" aria-hidden="true">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className="fb-heat-cell" data-step={s} />
          ))}
        </span>
        <span>More species recorded</span>
      </figcaption>
    </figure>
  );
}
