"use client";

// B1's Recorded organisms card, under the group pills: what GBIF has recorded along the route this month
// (lib/records.ts), most records first. Five show, the rest open in place with Show all. A species with a
// photograph shows it; one without shows its group icon in a tile. Rows: the Organisms list's (app/flow-a.css).

import { useState } from "react";

import { GroupIcon } from "@/components/Icons";
import { organismPhoto } from "@/lib/photos";
import { RECORDED } from "@/lib/records";
import { groupWord, MONTH } from "@/lib/suggestions";

const FIRST = 5;

export function InSeasonList({ routeId }: { routeId: string }) {
  const [all, setAll] = useState(false);
  const rows = [...(RECORDED[routeId] ?? [])].sort((a, b) => b.records - a.records);
  if (!rows.length) return null;
  const shown = all ? rows : rows.slice(0, FIRST);

  return (
    <div className="fb-in-season">
      <span className="fb-label" id="in-season-label">
        In season in {MONTH}
      </span>
      <ul className="a8-rows" aria-labelledby="in-season-label">
        {shown.map((o, i) => {
          const photo = organismPhoto(o.name);
          return (
            <li key={o.latin} className={i >= FIRST ? "is-new" : undefined}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="a8-thumb" src={photo.src} alt="" loading="lazy" />
              ) : (
                <span className="a8-thumb fb-in-season-tile" aria-hidden="true">
                  <GroupIcon group={o.group} size={22} className={`is-${o.group}`} />
                </span>
              )}
              <span>
                <b>{o.name}</b>
                <small>
                  {groupWord(o.group)}, <i>{o.latin}</i>
                </small>
                <small>
                  {o.records} record{o.records > 1 ? "s" : ""} in {MONTH}, last {o.last}
                </small>
              </span>
            </li>
          );
        })}
      </ul>
      {rows.length > FIRST && (
        <button type="button" className="cp-link" aria-expanded={all} onClick={() => setAll((v) => !v)}>
          {all ? "Show fewer" : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}
