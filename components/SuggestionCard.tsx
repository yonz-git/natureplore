"use client";

// The suggestion card, one route in season this month, as on A5 and A4, laid out as a row: a square
// photograph on the left; the name, its line and what is in season along it on the right, with Save
// at the top right. A built route shows the organism pills, how many species of each group are
// recorded there this month; a sample card lists its few organisms, each with its group icon first
// and a last-recorded date. Once saved, a download circle joins the bookmark. The whole card opens
// the route, where its page is built.
// Layout: app/suggestions.css.

import Link from "next/link";

import {
  BookmarkIcon,
  DownloadIcon,
  GroupIcon,
} from "@/components/Icons";
import { OrganismPills } from "@/components/MapParts";
import {
  countsOf,
  groupWord,
  MONTH,
  type Suggestion,
} from "@/lib/suggestions";
import { useSaved } from "@/lib/saved";

/** A group icon in its own colour in a round tile, the same icon as the count pills, the group named for screen readers. */
export function GroupTile({
  group,
}: {
  group: Suggestion["inSeason"][number]["group"];
}) {
  return (
    <span className="group-tile">
      <GroupIcon group={group} size={17} className={`is-${group}`} />
      <span className="sr-only">{groupWord(group)}: </span>
    </span>
  );
}

export function SuggestionCard({ route }: { route: Suggestion }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(route.id);
  const counts = countsOf(route);

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
      {counts ? (
        <div className="sug-season">
          <div className="sug-pills-row">
            <OrganismPills counts={counts} />
            <p className="tag sug-spots">{route.spots} Spots</p>
          </div>
        </div>
      ) : (
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
      )}
      <button
        type="button"
        className="sug-save glass glass-pin"
        aria-pressed={saved}
        aria-label={
          saved ? `Saved, ${route.name}, tap to remove` : `Save ${route.name}`
        }
        onClick={() => toggle(route.id)}
      >
        <BookmarkIcon size={16} filled={saved} />
      </button>
      {saved && (
        <span className="sug-save sug-dl glass glass-pin" aria-hidden="true">
          <DownloadIcon size={16} />
        </span>
      )}
      <p className="sr-only" role="status">
        {saved && "Saved and downloaded. Find it in Saved."}
      </p>
    </article>
  );
}
