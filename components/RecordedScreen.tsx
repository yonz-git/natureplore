"use client";

// A8 · Recorded along this route: everything recorded within 250 m of the line, in the fixed group
// order. The proportion bar and its legend first, each legend pill a filter that shows only its
// group (several can be picked, none picked shows all), then each group's first five with a photograph
// photograph, and "See all" opening the rest in place. A group with nothing recorded keeps its place.
// Rows are plain text in the prototype. Boards: A8, phone and tablet.

import Link from "next/link";
import { useState } from "react";

import { BackIcon, ChevronIcon } from "@/components/Icons";
import { organismPhoto } from "@/lib/photos";
import { LINUM_RECORDED } from "@/lib/recorded";
import { GROUPS, type Group } from "@/lib/routes";

const FIRST = 5;
const TINT: Record<Group, string> = {
  plants: "var(--color-group-plants)",
  herbs: "var(--color-group-herbs)",
  mushrooms: "var(--color-group-mushrooms)",
  birds: "var(--color-group-birds)",
  mammals: "var(--color-group-mammals)",
};
const label = (g: Group) => GROUPS.find((x) => x.id === g)!.label;

export default function RecordedScreen({ routeName, routeHref }: { routeName: string; routeHref: string }) {
  const [open, setOpen] = useState<Group | null>(null);
  // the groups picked in the legend; none picked shows every group
  const [picked, setPicked] = useState<Group[]>([]);
  const pick = (g: Group) => setPicked((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const shownGroups = picked.length ? LINUM_RECORDED.filter((g) => picked.includes(g.group)) : LINUM_RECORDED;
  const total = LINUM_RECORDED.reduce((a, g) => a + g.total, 0);

  return (
    <section className="saved a8">
      <Link href={routeHref} className="round glass glass-pin a8-top" aria-label={`Back to ${routeName}`}>
        <BackIcon size={20} />
      </Link>
      <div className="saved-sheet glass" aria-labelledby="a8-title">
        <h1 id="a8-title">
          Recorded along <em>{routeName}</em>
        </h1>
        <p>Within 250 m of the line. One fixed order, and a group with nothing recorded keeps its place.</p>

        <div className="b1-box a8-box">
          <div
            className="b1-bar"
            role="img"
            aria-label={`${total} records: ${LINUM_RECORDED.map((g) => `${g.total} ${label(g.group).toLowerCase()}`).join(", ")}`}
          >
            {LINUM_RECORDED.filter((g) => g.total).map((g) => (
              <span
                key={g.group}
                className={`is-${g.group}${picked.length && !picked.includes(g.group) ? " is-dim" : ""}`}
                style={{ flexGrow: g.total }}
              />
            ))}
          </div>
          <div className="a8-legend" role="group" aria-label="Show only these groups">
            {LINUM_RECORDED.map((g) => (
              <button
                key={g.group}
                type="button"
                className={`a8-filter${g.total ? "" : " is-none"}`}
                aria-pressed={picked.includes(g.group)}
                onClick={() => pick(g.group)}
              >
                <i style={{ background: TINT[g.group] }} />
                {label(g.group)} {g.total}
              </button>
            ))}
          </div>
          {picked.length > 0 && (
            <button type="button" className="a8-clear" onClick={() => setPicked([])}>
              Show all groups
            </button>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {picked.length ? `Showing ${shownGroups.map((g) => label(g.group).toLowerCase()).join(" and ")}` : "Showing every group"}
        </p>

        {shownGroups.map((g) => {
          const all = open === g.group;
          const shown = all ? g.rows : g.rows.slice(0, FIRST);
          const name = label(g.group);
          return (
            <section key={g.group} className="a8-section" aria-labelledby={`a8-${g.group}`}>
              <div className="a8-group-head">
                <h2 id={`a8-${g.group}`}>{name}</h2>
                <span>{g.total} recorded</span>
              </div>
              <div className="saved-card a8-group">
                {g.rows.length === 0 ? (
                  <p className="saved-empty">Nothing recorded along this route yet. The group keeps its place in the order.</p>
                ) : (
                  <ul className="a8-rows" id={`a8-list-${g.group}`}>
                    {shown.map((r, i) => (
                      <li key={r.name} className={i >= FIRST ? "is-new" : undefined}>
                        {organismPhoto(r.name) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="a8-thumb" src={organismPhoto(r.name)!.src} alt="" loading="lazy" />
                        ) : (
                          <span className="a8-thumb" aria-hidden="true" style={{ "--a8-tint": TINT[g.group] } as React.CSSProperties} />
                        )}
                        <span>
                          <b>{r.name}</b>
                          <small>
                            {name.slice(0, -1)}, <i>{r.latin}</i>
                          </small>
                          <small>
                            Recorded, last {r.last}. {r.where ?? "Along the route, at no spot"}
                          </small>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {g.total > FIRST && (
                  <div className="a8-more">
                    <button
                      type="button"
                      className="btn btn-secondary btn-chev"
                      aria-expanded={all}
                      aria-controls={`a8-list-${g.group}`}
                      onClick={() => setOpen(all ? null : g.group)}
                    >
                      {all ? "Show fewer" : `See all ${g.total} ${name.toLowerCase()}`}
                      <ChevronIcon size={18} className={all ? "a8-chev is-up" : "a8-chev"} />
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
