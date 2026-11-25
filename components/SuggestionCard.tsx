"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  BookmarkIcon,
  GroupIcon,
  LoopIcon,
  OneWayIcon,
} from "@/components/Icons";
import { OrganismPills } from "@/components/MapParts";
import {
  groupWord,
  MONTH,
  type Suggestion,
} from "@/lib/suggestions";
import { useSaved } from "@/lib/saved";
import { countsIn } from "@/lib/season";
import { organismPhoto } from "@/lib/photos";
import { easeScroll } from "@/lib/ease-scroll";

function slidesOf(route: Suggestion) {
  const out: { src: string; alt: string }[] = [];
  if (route.image) out.push({ src: route.image, alt: "" });
  for (const o of route.inSeason) {
    const p = organismPhoto(o.name);
    if (p && out.length < 5) out.push({ src: p.src, alt: o.name });
  }
  return out;
}

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
  const counts = countsIn(route.id);
  const router = useRouter();
  const slides = slidesOf(route);
  const track = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    dragged.current = false;
    track.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 5) return;
    if (!d.moved) {
      d.moved = true;
      el.style.scrollSnapType = "none";
    }
    el.scrollLeft = d.left - dx;
  };
  const onPointerUp = () => {
    const d = drag.current, el = track.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    dragged.current = true;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    el.style.scrollSnapType = "";
    go(i);
  };
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.style.scrollSnapType = "none";
    easeScroll(el, { left: i * el.clientWidth }).then(() => (el.style.scrollSnapType = ""));
  };

  return (
    <article className="sug" aria-label={route.name} data-route={route.id}>
      <div className="sug-media">
        <div
          ref={track}
          className="sug-track"
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={() => {
            if (dragged.current) return void (dragged.current = false);
            if (route.href) router.push(route.href);
          }}
        >
          {slides.length ? (
            slides.map((sl, i) => (
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
              {route.name.replace(/ loop$/, "")}
            </Link>
          ) : (
            route.name.replace(/ loop$/, "")
          )}
        </h2>
        <p className="sug-meta">
          {}
          {(() => {
            const shape = route.meta.includes(" loop") ? "loop" : route.meta.includes(" one way") ? "one way" : null;
            if (!shape) return route.meta;
            const [before, after] = route.meta.split(` ${shape}`);
            const Icon = shape === "loop" ? LoopIcon : OneWayIcon;
            return (
              <>
                {before}
                {after}
                <span aria-hidden="true"> · </span>
                <Icon className="sug-loop" />
                <span className="sr-only">, {shape}</span>
              </>
            );
          })()}
        </p>
        {counts && <p className="tag sug-spots sug-spots-photo">{route.spots} Spots</p>}
      </div>
      {counts ? (
        <div className="sug-season">
          <div className="sug-pills-row">
            <p className="tag sug-spots sug-spots-row">{route.spots} Spots</p>
            <OrganismPills counts={counts} />
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
        {saved && "Saved and downloaded. Find it under You, in Routes."}
      </p>
    </article>
  );
}
