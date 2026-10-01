"use client";

// The suggestion card, one route in season this month, as on A5 and A4 (the redesign's section 2):
// the photograph with Save over its top right, the name, its line, the spots in season as numbered
// dots, and what is in season along it, each with its group icon first and a last-recorded date.
// Save works in place and says where the route went, on the photograph beside the bookmark, where
// the eye already is. Only a route whose page is built opens.
// Layout: app/suggestions.css.

import Link from "next/link";

import { BookmarkIcon, CheckCircleIcon, GroupIcon } from "@/components/Icons";
import { groupWord, inSeasonLine, MONTH, type Suggestion } from "@/lib/suggestions";
import { useSaved } from "@/lib/saved";

export function SpotDots({ route }: { route: Suggestion }) {
  const line = inSeasonLine(route);
  return (
    <div className="dots" role="img" aria-label={line}>
      <span className="dots-row" aria-hidden="true">
        {Array.from({ length: route.spots }, (_, i) => (
          <span key={i} className={`dot${route.lit.includes(i + 1) ? " is-lit" : ""}`}>
            {i + 1}
          </span>
        ))}
      </span>
      <span className="dots-line" aria-hidden="true">
        {line}
      </span>
    </div>
  );
}

/** A group icon in a round mist tile, the same icon as the count pills, the group named for screen readers. */
export function GroupTile({ group }: { group: Suggestion["inSeason"][number]["group"] }) {
  return (
    <span className="group-tile">
      <GroupIcon group={group} />
      <span className="sr-only">{groupWord(group)}: </span>
    </span>
  );
}

export function SuggestionCard({ route }: { route: Suggestion }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(route.id);

  return (
    <article className="sug" aria-label={route.name} data-route={route.id}>
      {route.image ? (
        // small local files at a fixed size: the optimiser would add a round trip for nothing
        // eslint-disable-next-line @next/next/no-img-element
        <img className="sug-photo" src={route.image} alt="" />
      ) : (
        <span className="sug-photo" aria-hidden="true" />
      )}
      <div className="sug-head">
        <h2 className="sug-name">
          {route.href ? (
            <Link href={route.href} className="sug-open">
              {route.name}
            </Link>
          ) : (
            route.name
          )}
        </h2>
        <p className="sug-meta">{route.meta}</p>
      </div>
      <SpotDots route={route} />
      <div className="sug-season">
        <p className="sug-season-label">In season in {MONTH}</p>
        <ul className="sug-orgs">
          {route.inSeason.map((o) => (
            <li key={o.name}>
              <GroupTile group={o.group} />
              <span className="sug-org">
                <span className="sug-org-name">
                  {o.name}
                  {o.note && <span className="sug-org-note">, {o.note}</span>}
                </span>
                <span className="sug-org-last">Last recorded {o.last}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="sug-save"
        aria-pressed={saved}
        aria-label={saved ? `Saved, ${route.name}, tap to remove` : `Save ${route.name}`}
        onClick={() => toggle(route.id)}
      >
        <BookmarkIcon size={20} filled={saved} />
      </button>
      <p className="sug-saved" role="status">
        {saved && (
          <>
            <CheckCircleIcon size={16} />
            Saved and downloaded<span className="sr-only">. Find it in Saved.</span>
          </>
        )}
      </p>
    </article>
  );
}
