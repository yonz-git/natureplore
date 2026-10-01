"use client";

// B1 · Route, and B1-saved: what is on this route, and when. The map shows the route's real line,
// its start and its spots in walking order; under it (phone) or beside it (desktop) the page, in
// the order of the flow and IA redesign: Spots along this route (each opens its spot, L3), the
// route and where its spots are, what is recorded along it (to A8), when to walk it, what is
// happening along it (claim cards), and getting there. Save is the bookmark on the photographs; once
// the route is saved a pinned bar holds Walk it, which opens the walk (L4). The store is real in the prototype, so B1
// and B1-saved are one page. Boards: B1 phone, tablet and desktop, and B1-saved phone.

import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";

import { BackIcon, BookmarkIcon, CalendarIcon, CheckCircleIcon, ChevronIcon, LocationIcon, WalkIcon } from "@/components/Icons";
import { useSheet } from "@/components/SheetGrab";
import { MapTools } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { ClaimCard, SpotMark } from "@/components/SpotParts";
import { organismPhoto } from "@/lib/photos";
import { GROUPS, recordsOf, spotsOf, type Route } from "@/lib/routes";
import { lastList, useSaved } from "@/lib/saved";
import { MONTH_LETTERS, MONTH_NAMES, NOW, routeDetail, spotLine } from "@/lib/spots";
import { suggestionById } from "@/lib/suggestions";

const noop = () => () => {};

const SECTIONS = [
  ["spots", "Spots"],
  ["drawn", "The route"],
  ["recorded", "What is recorded"],
  ["season", "When to walk it"],
  ["happening", "What is happening"],
  ["getting", "Getting there"],
] as const;

function SectionHead({ id, lead, close, note }: { id: string; lead: string; close: string; note?: string }) {
  return (
    <div className="fb-sec" id={`sec-${id}`}>
      <h2 id={`sec-${id}-title`}>
        {lead}
        <em>{close}</em>
      </h2>
      {note && <span>{note}</span>}
    </div>
  );
}

/**
 * Saving lives in one place, the bookmark on the photograph's top right (SaveToggle). The pinned bar
 * only appears once there is something to do next: Walk it when the route is saved, and Undo for
 * the rest of the visit after it is removed. Saved on this visit, the bar also says the route was
 * downloaded and where to find it.
 */
function useRouteSave(id: string) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  const [removed, setRemoved] = useState(false);
  // saved on this visit: the bar shows where the route went; a route already saved says nothing
  const [justSaved, setJustSaved] = useState(false);
  return {
    saved,
    removed,
    justSaved,
    toggle: () => {
      toggle(id);
      setRemoved(saved);
      setJustSaved(!saved);
    },
  };
}
type RouteSave = ReturnType<typeof useRouteSave>;

/** The bookmark on the photograph, as on the suggestion cards: a round frost, filled once saved. */
function SaveToggle({ route, save }: { route: Route; save: RouteSave }) {
  return (
    <button
      type="button"
      className="sug-save b1-save"
      aria-pressed={save.saved}
      aria-label={save.saved ? `Saved, ${route.name}, remove it from Saved` : `Save ${route.name}`}
      onClick={save.toggle}
    >
      <BookmarkIcon size={20} filled={save.saved} />
    </button>
  );
}

function Pin({ route, walkable, save }: { route: Route; walkable: boolean; save: RouteSave }) {
  const { saved, removed, justSaved } = save;
  // Undo puts Walk it back where Undo was, so focus follows it there
  const moved = useRef(false);
  const focusIfMoved = (el: HTMLElement | null) => {
    if (el && moved.current) {
      moved.current = false;
      el.focus();
    }
  };

  const note = saved && justSaved;
  const live = (
    <p className="sr-only" aria-live="polite">
      {saved ? "Saved and downloaded. Find it in Saved." : removed ? "Removed from Saved, and its download deleted." : ""}
    </p>
  );
  if (!saved && !removed) return live;
  return (
    <div className={`b1-pin glass-phone${note ? " has-note" : ""}`}>
      {/* on screen for sighted people; the live region below says the same to screen readers */}
      {note && (
        <p className="b1-note" aria-hidden="true">
          <CheckCircleIcon size={16} />
          Saved and downloaded. Find it in Saved.
        </p>
      )}
      {saved ? (
        walkable ? (
          <Link ref={focusIfMoved} href={`/walk/${route.id}`} className="btn btn-primary b1-walk">
            <WalkIcon size={19} />
            Walk it
          </Link>
        ) : (
          <button ref={focusIfMoved} type="button" className="btn btn-primary b1-walk" aria-disabled="true">
            <WalkIcon size={19} />
            Walk it
            <span className="sr-only">, the walk of this route is not built in the prototype yet</span>
          </button>
        )
      ) : (
        <>
          <p className="b1-removed">Removed from Saved</p>
          <button
            type="button"
            className="btn btn-secondary b1-undo"
            onClick={() => {
              moved.current = true;
              save.toggle();
            }}
          >
            Undo
          </button>
        </>
      )}
      {live}
    </div>
  );
}

export default function RouteCardScreen({ route }: { route: Route }) {
  const map = useRef<MapHandle>(null);
  const sheetEl = useRef<HTMLDivElement>(null);
  const sheet = useSheet(sheetEl);
  const detail = routeDetail(route.id);
  const spots = useMemo(() => spotsOf(route), [route]);
  const save = useRouteSave(route.id);
  const inSeasonPhotos = (suggestionById(route.id)?.inSeason ?? []).map((o) => organismPhoto(o.name)?.src).slice(0, 2);
  // back goes to the list the route was opened from, A5, A4 or Saved, read once the page is in the browser
  const back = useSyncExternalStore(noop, lastList, () => "/map");
  const backLabel = back === "/saved" ? "Back to Saved" : "Back to the suggestions";

  // the real line when the route has one, otherwise a loop through its spots
  const line = useMemo<[number, number][]>(
    () =>
      route.path ?? [[route.lat, route.lon], ...spots.map((s) => [s.lat, s.lon] as [number, number]), [route.lat, route.lon]],
    [route, spots],
  );
  // a spot's marker opens its page where the route has spot pages
  const points = useMemo<MapPoint[]>(
    () => [
      { id: "start", lat: route.lat, lon: route.lon, label: `Start and finish, ${route.from}`, start: true },
      ...spots.map((s, i) => ({
        id: `s${s.n}`,
        lat: s.lat,
        lon: s.lon,
        n: s.n,
        label: route.stops[i]?.name ?? `Spot ${s.n}`,
        left: route.stops[i]?.left,
        href: routeDetail(route.id) ? `/map/route/${route.id}/spot/${s.n}` : undefined,
      })),
    ],
    [route, spots],
  );

  const total = recordsOf(route.counts);
  const [name, ...rest] = route.name.split(" ").reverse();
  const lead = rest.reverse().join(" ");
  const locate = () =>
    map.current?.centre(route.lat, route.lon, 14, !matchMedia("(prefers-reduced-motion: reduce)").matches);
  const most = detail ? Math.max(...detail.season) : 1;

  return (
    <section className="ms b1">
      <RegionMap className="a1-map" behind ref={map} points={points} line={line} detail={route.detail} maxZoom={15} mapLabel={`Map of ${route.name}`} />

      <div className="b1-top">
        <Link href={back} className="round glass glass-pin" aria-label={backLabel}>
          <BackIcon size={20} />
        </Link>
        <button type="button" className="round glass glass-pin" aria-label="Show the start on the map" onClick={locate}>
          <LocationIcon size={20} />
        </button>
      </div>

      <div className="ms-panel glass-desk">
        <div
          ref={sheetEl}
          className={`ms-sheet glass-phone${sheet.open ? " is-open" : ""}`}
          aria-labelledby="route-title"
          onScroll={sheet.onScroll}
        >
          {sheet.grab("route")}
          <Link href={back} className="round glass glass-pin b1-back-desk" aria-label={backLabel}>
            <BackIcon size={20} />
          </Link>

          <div className="b1-photos">
            {/* the route, then two of what is in season along it; a frame stays blank where there is no photo */}
            {[route.image, ...inSeasonPhotos].slice(0, 3).map((src, i) =>
              src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={i ? "" : `${route.name}`} />
              ) : (
                <span key={i} />
              ),
            )}
            <SaveToggle route={route} save={save} />
          </div>

          <div className="b1-head">
            <h1 id="route-title" className="ms-title">
              {lead} <em>{name}</em>
            </h1>
            <p className="ms-lead">{route.from}</p>
          </div>

          <dl className="card-stats b1-stats">
            <div className="card-stat">
              <dt>Distance</dt>
              <dd>
                <b>{route.km}</b>
                <span>km</span>
              </dd>
            </div>
            <div className="card-stat">
              <dt>Time</dt>
              <dd>
                <b>{route.time.replace(":", " h ")}</b>
              </dd>
            </div>
            <div className="card-stat">
              <dt>Spots</dt>
              <dd>
                <b>{route.spots}</b>
              </dd>
            </div>
          </dl>

          {detail && (
            <nav aria-label="Jump to a section" className="fb-strip">
              {SECTIONS.map(([id, label]) => (
                <a key={id} href={`#sec-${id}`}>
                  {label}
                </a>
              ))}
            </nav>
          )}

          <section aria-labelledby="sec-spots-title">
            <SectionHead id="spots" lead="Spots along " close="this route" note="In walking order" />
            <ol className="fb-card fb-rows">
              {detail
                ? detail.spots.map((s) => (
                    <li key={s.n}>
                      <Link href={`/map/route/${route.id}/spot/${s.n}`} className="fb-row">
                        <SpotMark n={s.n} />
                        <span className="fb-row-text">
                          <b>{s.name}</b>
                          <span>{spotLine(s)}</span>
                          <span className="fb-pill">
                            <CalendarIcon size={14} />
                            {s.when}
                          </span>
                        </span>
                        <ChevronIcon size={18} />
                      </Link>
                    </li>
                  ))
                : route.stops.map((s, i) => (
                    <li key={s.name}>
                      <div className="fb-row">
                        <SpotMark n={i + 1} />
                        <span className="fb-row-text">
                          <b>{s.name}</b>
                          <span>{s.note}</span>
                        </span>
                      </div>
                    </li>
                  ))}
            </ol>
          </section>

          {detail && (
            <section aria-labelledby="sec-drawn-title">
              <SectionHead id="drawn" lead="The route, and where its " close="spots are" />
              <div className="fb-card">
                <div className="fb-axis" role="img" aria-label={`Spots along the ${route.km} km line, in walking order`}>
                  <span className="fb-axis-line" />
                  {detail.axis.map((f, i) => (
                    <span key={i} className="fb-axis-mark" style={{ left: `${f * 100}%` }}>
                      <SpotMark n={i + 1} />
                    </span>
                  ))}
                </div>
                <div className="fb-axis-ticks" aria-hidden="true">
                  {detail.ticks.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <p className="fb-small">
                  The line is drawn on the map, with the same numbers. {route.time.replace(":", " h ")} at a looking pace.
                </p>
              </div>
            </section>
          )}

          <section aria-labelledby="sec-recorded-title">
            <SectionHead id="recorded" lead="What is recorded " close="along this route" note="Within 250 m of the line" />
            <div className="fb-card fb-recorded">
              <div
                className="b1-bar"
                role="img"
                aria-label={`${total} records: ${GROUPS.map((g) => `${route.counts[g.id] ?? 0} ${g.label.toLowerCase()}`).join(", ")}`}
              >
                {GROUPS.filter((g) => route.counts[g.id]).map((g) => (
                  <span key={g.id} className={`is-${g.id}`} style={{ flexGrow: route.counts[g.id] }} />
                ))}
              </div>
              <ul className="fb-legend" aria-hidden="true">
                {GROUPS.map((g) => (
                  <li key={g.id} className={`fb-pill${route.counts[g.id] ? "" : " is-none"}`}>
                    <i className={`is-${g.id}`} />
                    {g.label} {route.counts[g.id] ?? 0}
                  </li>
                ))}
              </ul>
              {/* A8 has the records of Linum wet meadows loop only */}
              {route.id === "linum" ? (
                <Link href={`/map/route/${route.id}/recorded`} className="btn btn-secondary btn-chev">
                  See everything recorded
                  <ChevronIcon size={18} />
                </Link>
              ) : (
                <button type="button" className="btn btn-secondary btn-chev" aria-disabled="true">
                  See everything recorded
                  <span className="sr-only">, not built in the prototype yet</span>
                  <ChevronIcon size={18} />
                </button>
              )}
            </div>
          </section>

          {detail && (
            <>
              <section aria-labelledby="sec-season-title">
                <SectionHead id="season" lead="When to " close="walk it" note="Spots in season" />
                <div className="fb-card">
                  <div
                    className="fb-season"
                    role="img"
                    aria-label={`Spots in season by month. ${MONTH_NAMES[NOW]}: ${detail.season[NOW]} of ${detail.spots.length}`}
                  >
                    {detail.season.map((c, i) => (
                      <div key={i} className={i === NOW ? "is-now" : undefined}>
                        <span>{c}</span>
                        <span className="fb-season-bar" style={{ height: `${0.75 + (4.375 * c) / most}rem` }} />
                        <span>{MONTH_LETTERS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <p className="fb-small">{detail.seasonNote}</p>
                </div>
              </section>

              <section aria-labelledby="sec-happening-title">
                <SectionHead id="happening" lead="What is happening " close="along this route" />
                <div className="fb-stack">
                  {detail.claims.map((c) => (
                    <ClaimCard key={c.id} claim={c} />
                  ))}
                </div>
              </section>

              <section aria-labelledby="sec-getting-title">
                <SectionHead id="getting" lead="Getting there, and " close="getting along it" />
                <dl className="fb-card fb-facts">
                  {detail.getting.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="fb-small">{detail.gettingNote}</p>
              </section>

              <p className="fb-small b1-foot">{detail.foot}</p>
            </>
          )}
        </div>
        <Pin route={route} walkable={!!detail} save={save} />
      </div>

      <MapTools locate={locate} />
    </section>
  );
}
