"use client";

// The suggestion card, one route in season this month, as on A5 and A4. On the phone: a big
// photograph that swipes through the route and what is in season along it, the name and its line on
// the photograph's bottom left, the pills in one line under it. From 54.5rem a row: a square
// photograph on the left, the name and its line on the right. Save sits at the top right. A built route shows the organism pills, how many species of each group are
// recorded there this month; a sample card lists its few organisms, each with its group icon first
// and a last-recorded date. Once saved, a download circle joins the bookmark. The whole card opens
// the route, where its page is built.
// Layout: app/suggestions.css.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  BookmarkIcon,
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
import { organismPhoto } from "@/lib/photos";

/** the photographs a card swipes through on the phone: the route first, then what is in season along it */
function slidesOf(route: Suggestion) {
  const out: { src: string; alt: string }[] = [];
  if (route.image) out.push({ src: route.image, alt: "" });
  for (const o of route.inSeason) {
    const p = organismPhoto(o.name);
    if (p && out.length < 5) out.push({ src: p.src, alt: o.name });
  }
  return out;
}

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
  const router = useRouter();
  const slides = slidesOf(route);
  const track = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => {
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <article className="sug" aria-label={route.name} data-route={route.id}>
      <div className="sug-media">
        <div
          ref={track}
          className="sug-track"
          onScroll={onScroll}
          onClick={() => route.href && router.push(route.href)}
        >
          {slides.length ? (
            slides.map((sl, i) => (
              // small local files at a fixed size: the optimiser would add a round trip for nothing
              // eslint-disable-next-line @next/next/no-img-element
              <img key={sl.src} className="sug-photo" src={sl.src} alt={i === 0 ? "" : sl.alt} draggable={false} />
            ))
          ) : (
            <span className="sug-photo" aria-hidden="true" />
          )}
        </div>
        {slides.length > 1 && (
          <div className="sug-dots">
            {slides.map((sl, i) => (
              <button
                key={sl.src}
                type="button"
                className="sug-dot"
                aria-current={i === slide}
                aria-label={`Photo ${i + 1} of ${slides.length}${sl.alt ? `, ${sl.alt}` : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
      </div>
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
        {counts && <p className="tag sug-spots sug-spots-photo">{route.spots} Spots</p>}
      </div>
      {counts ? (
        <div className="sug-season">
          <div className="sug-pills-row">
            <OrganismPills counts={counts} />
            <p className="tag sug-spots sug-spots-row">{route.spots} Spots</p>
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
        <BookmarkIcon size={20} filled={saved} />
      </button>
      <p className="sr-only" role="status">
        {saved && "Saved and downloaded. Find it in Saved."}
      </p>
    </article>
  );
}
