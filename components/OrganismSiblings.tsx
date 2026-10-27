"use client";

// The foot of an organism page: the other organisms of its group as the records page (A8) lists them, the
// first five and "See all" for the rest, then previous and next in the group, as the walk steps between
// spots. At either end the button stays, dashed, and does nothing.

import Link from "next/link";
import { useState } from "react";

import { BackIcon, ChevronIcon } from "@/components/Icons";
import { ORGANISMS, type Organism } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { GROUPS } from "@/lib/routes";

const FIRST = 5;
const fullName = (o: Organism) => `${o.name} ${o.close}`.trim();

/** One half of previous and next: the step's name under what it is; at the end of the group it stays, dashed. */
function Step({ to, kicker, end, back = false }: { to?: Organism; kicker: string; end: string; back?: boolean }) {
  const body = (
    <>
      {back && <BackIcon size={20} />}
      <span className="fb-nav-text">
        <span className="fb-nav-kicker">{to ? kicker : end}</span>
        <span className="fb-nav-name">{to ? fullName(to) : "None further"}</span>
      </span>
      {!back && <ChevronIcon size={20} />}
    </>
  );
  return to ? (
    <Link href={`/map/organism/${to.id}`} className={`fb-nav-next${back ? " is-back" : ""}`}>
      {body}
    </Link>
  ) : (
    <span className={`fb-nav-next${back ? " is-back" : ""}`} aria-disabled="true">
      {body}
    </span>
  );
}

export function OrganismSiblings({ o }: { o: Organism }) {
  const [all, setAll] = useState(false);
  const group = ORGANISMS.filter((x) => x.group === o.group);
  const i = group.findIndex((x) => x.id === o.id);
  const prev = group[i - 1];
  const next = group[i + 1];
  const others = group.filter((x) => x.id !== o.id);
  if (!others.length) return null;
  const label = GROUPS.find((g) => g.id === o.group)!.label.toLowerCase();
  const one = label.slice(0, -1);
  const shown = all ? others : others.slice(0, FIRST);

  return (
    <>
      <h2 className="org-h2">
        More <em>{label}</em>
      </h2>
      <div className="saved-card a8-group org-more">
        <ul className="a8-rows" id="org-more-list">
          {shown.map((x, n) => {
            const photo = organismPhoto(fullName(x));
            return (
              <li key={x.id} className={n >= FIRST ? "is-new" : undefined}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="a8-thumb" src={photo.src} alt="" loading="lazy" />
                ) : (
                  <span className="a8-thumb" aria-hidden="true" style={{ "--a8-tint": `var(--color-group-${x.group})` } as React.CSSProperties} />
                )}
                <span className="a8-text">
                  <b>{fullName(x)}</b>
                  <small>
                    <i>{x.latin}</i>
                  </small>
                </span>
                <Link href={`/map/organism/${x.id}`} className="org-link" aria-label={fullName(x)} />
              </li>
            );
          })}
        </ul>
        {others.length > FIRST && (
          <div className="a8-more">
            <button
              type="button"
              className="btn btn-secondary btn-chev"
              aria-expanded={all}
              aria-controls="org-more-list"
              onClick={() => setAll(!all)}
            >
              {all ? "Show fewer" : `See all ${others.length} ${label}`}
              <ChevronIcon size={18} className={all ? "a8-chev is-up" : "a8-chev"} />
            </button>
          </div>
        )}
      </div>

      <nav aria-label={`Other ${label}`} className="fb-nav org-nav">
        <Step to={prev} kicker={`Previous ${one}`} end={`First ${one}`} back />
        <Step to={next} kicker={`Next ${one}`} end={`Last ${one}`} />
      </nav>
    </>
  );
}
