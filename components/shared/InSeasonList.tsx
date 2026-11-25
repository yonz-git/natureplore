"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { GroupIcon, PinIcon } from "@/components/ui/Icons";
import { SpotMark } from "@/components/shared/SpotParts";
import { organismHref } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { recordedIn } from "@/lib/season";
import type { Group } from "@/lib/routes";
import { groupWord } from "@/lib/suggestions";

const FIRST = 10;

export function InSeasonList({ routeId, groups = [] }: { routeId: string; groups?: Group[] }) {
  const rows = recordedIn(routeId);
  if (!rows.length) return null;
  const shown = rows.filter((o) => !groups.length || groups.includes(o.group)).slice(0, FIRST);

  return (
    <div className="fb-in-season">
      {}
      {}
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
              {href && <Link href={`${href}?route=${routeId}`} className="org-link" aria-label={o.name} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

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
