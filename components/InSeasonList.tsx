"use client";

// B1's Recorded organisms card, under the September bar and pills: what GBIF has recorded along the route this month
// (lib/records.ts), most records first, the first ten in two columns. Each tile is the photograph with the name
// on its foot (the group icon on a tinted tile when there is no photograph), then the group and Latin name, the
// records, and behind a pin the spots it was recorded within 300 m of, as their numbered marks, or the one spot
// nearest its records when it was recorded near none (.design/gbif/build.py).

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { GroupIcon, PinIcon } from "@/components/Icons";
import { SpotMark } from "@/components/SpotParts";
import { organismHref } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { RECORDED } from "@/lib/records";
import type { Group } from "@/lib/routes";
import { groupWord } from "@/lib/suggestions";

const FIRST = 10;

/** `groups`, picked on the legend's pills above, keeps only those groups; none picked keeps every group */
export function InSeasonList({ routeId, groups = [] }: { routeId: string; groups?: Group[] }) {
  const rows = [...(RECORDED[routeId] ?? [])].sort((a, b) => b.records - a.records);
  if (!rows.length) return null;
  const shown = rows.filter((o) => !groups.length || groups.includes(o.group)).slice(0, FIRST);

  return (
    <div className="fb-in-season">
      {/* headed by "In season in <month>" at the top of the card (components/RouteCardScreen.tsx) */}
      {/* a new pick redraws the tiles, so each rises in (app/flow-b.css) */}
      <ul key={groups.join()} className="fb-org-tiles" aria-labelledby="in-season-label" aria-live="polite">
        {shown.map((o) => {
          const photo = organismPhoto(o.name);
          const href = organismHref(o.name);
          return (
            <li key={o.latin}>
              <span className="fb-org-photo">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt="" loading="lazy" />
                ) : (
                  <span className="fb-in-season-tile" aria-hidden="true">
                    <GroupIcon group={o.group} size={28} className={`is-${o.group}`} />
                  </span>
                )}
                <b>{o.name}</b>
              </span>
              <small>
                {groupWord(o.group)}, <i>{o.latin}</i>
              </small>
              <small>
                {o.records} record{o.records > 1 ? "s" : ""}
              </small>
              {o.spots.length > 0 && <Where spots={o.spots} />}
              {href && <Link href={href} className="org-link" aria-label={o.name} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The region line's pin on its ground ring (SuggestionsScreen), then the spots as their numbered marks. The pin
 *  rolls in and the ring opens only once the line is on screen, and plays once. Also on the claim card. */
export function Where({ spots }: { spots: number[] }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <small ref={ref} className={`fb-in-season-where${seen ? " is-seen" : ""}`}>
      <span className="sg-pin">
        <svg className="sg-pin-ring" viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="12" cy="20.9" rx="7.2" ry="2.5" />
        </svg>
        <PinIcon size={18} className="sg-pin-icon" />
      </span>
      <span className="sr-only">Recorded near spot{spots.length > 1 ? "s" : ""} {spots.join(", ")}</span>
      <span className="fb-org-spots" aria-hidden="true">
        {spots.map((n) => (
          <SpotMark key={n} n={n} />
        ))}
      </span>
    </small>
  );
}
