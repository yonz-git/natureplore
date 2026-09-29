"use client";

// B1 · Route detail, on the map: what opens when a route is picked from a list or its pin. The
// map shows the route's real line, its start and its spots in walking order; beside it (desktop)
// or under it (phone) is everything about the route: photographs, the numbers, what is recorded
// along it, what is notable now, the spots, and saving, sharing and navigating. Modelled on how
// Komoot shows a route, without editing and without elevation.
// Pages that are not built yet (A8, navigation) are controls with nowhere to go.
// Boards: "B1 · Route detail, on the map", phone, tablet and desktop.

import Link from "next/link";
import { useMemo, useRef, useSyncExternalStore } from "react";

import {
  BookmarkIcon,
  CalendarIcon,
  ChevronIcon,
  CloseIcon,
  GroupIcon,
  LocationIcon,
  ShareIcon,
} from "@/components/Icons";
import { MapTools } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { GROUPS, recordsOf, spotsOf, type Route } from "@/lib/routes";
import { lastList, useSaved } from "@/lib/saved";

const noop = () => () => {};

function Actions({ route, className }: { route: Route; className: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(route.id);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: route.name, url: location.href });
      else await navigator.clipboard.writeText(location.href);
    } catch {
      // the person closed the share sheet
    }
  };
  return (
    <div className={className}>
      <button type="button" className="b1-act" aria-pressed={saved} onClick={() => toggle(route.id)}>
        <BookmarkIcon size={19} filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
      <button type="button" className="b1-act" onClick={share}>
        <ShareIcon size={19} />
        Share
      </button>
      {/* navigation is not built in the prototype, so the one action leads nowhere yet */}
      <button type="button" className="btn btn-primary b1-go" aria-disabled="true">
        <LocationIcon />
        Navigate
        <span className="sr-only">, not built in the prototype yet</span>
      </button>
    </div>
  );
}

export default function RouteCardScreen({ route }: { route: Route }) {
  const map = useRef<MapHandle>(null);
  const spots = useMemo(() => spotsOf(route), [route]);
  // closing goes back to the list the route was opened from, read once the page is in the browser
  const back = useSyncExternalStore(noop, lastList, () => "/map/near-you");

  // the real line when the route has one, otherwise a loop through its spots
  const line = useMemo<[number, number][]>(
    () =>
      route.path ?? [[route.lat, route.lon], ...spots.map((s) => [s.lat, s.lon] as [number, number]), [route.lat, route.lon]],
    [route, spots],
  );
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
      })),
    ],
    [route, spots],
  );

  const total = recordsOf(route.counts);
  const [name, ...rest] = route.name.split(" ").reverse();
  const lead = rest.reverse().join(" ");
  const locate = () =>
    map.current?.centre(route.lat, route.lon, 14, !matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <section className="ms b1">
      <RegionMap className="a1-map" ref={map} points={points} line={line} detail={route.detail} maxZoom={15} />

      <div className="b1-top">
        <Link href={back} className="round glass glass-pin" aria-label="Close the route">
          <CloseIcon size={20} />
        </Link>
        <button type="button" className="round glass glass-pin" aria-label="Show the start on the map" onClick={locate}>
          <LocationIcon size={20} />
        </button>
      </div>

      <div className="ms-panel glass-desk">
        <div className="ms-sheet glass-phone" aria-labelledby="route-title">
          <div className="ms-handle" aria-hidden="true" />

          <div className="b1-photos" role="img" aria-label="Photographs of the route, to come">
            <span />
            <span />
            <span />
            <span className="b1-photos-tag" aria-hidden="true">
              Photos to come
            </span>
            <Link href={back} className="b1-close" aria-label="Close the route">
              <CloseIcon size={20} />
            </Link>
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
                <b>{route.time}</b>
                <span>h</span>
              </dd>
            </div>
            <div className="card-stat">
              <dt>Spots</dt>
              <dd>
                <b>{route.spots}</b>
              </dd>
            </div>
          </dl>

          <p className="b1-body">{route.description}</p>

          <section className="b1-box" aria-labelledby="recorded-title">
            <div className="b1-box-head">
              <h2 id="recorded-title">What is recorded along this route</h2>
              <span>Within 250 m of the line</span>
            </div>
            <div
              className="b1-bar"
              role="img"
              aria-label={`${total} records: ${GROUPS.map((g) => `${route.counts[g.id] ?? 0} ${g.label.toLowerCase()}`).join(", ")}`}
            >
              {GROUPS.filter((g) => route.counts[g.id]).map((g) => (
                <span key={g.id} className={`is-${g.id}`} style={{ flexGrow: route.counts[g.id] }} />
              ))}
            </div>
            <ul className="b1-groups">
              {GROUPS.map((g) => (
                <li key={g.id} className={`is-${g.id}${route.counts[g.id] ? "" : " is-none"}`}>
                  <GroupIcon group={g.id} size={20} />
                  <span>{g.label}</span>
                  <b>{route.counts[g.id] ?? 0}</b>
                </li>
              ))}
            </ul>
            {/* A8, everything recorded here, is not built in the prototype yet */}
            <button type="button" className="btn btn-secondary btn-chev b1-all" aria-disabled="true">
              See all organisms
              <span className="sr-only">, not built in the prototype yet</span>
              <ChevronIcon size={18} />
            </button>
          </section>

          <p className="b1-notable">
            <CalendarIcon size={20} />
            {route.notable.organism ? (
              <Link href={`/map/organism/${route.notable.organism}`}>{route.notable.text}</Link>
            ) : (
              <span>{route.notable.text}</span>
            )}
          </p>

          <section aria-labelledby="spots-title">
            <h2 id="spots-title" className="b1-h2">
              Spots along the route
            </h2>
            <ol className="b1-spots">
              {route.stops.map((s, i) => (
                <li key={s.name} id={`spot-${i + 1}`}>
                  <span className="spot-mark" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <b>{s.name}</b>
                    <span>{s.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <p className="ms-note b1-foot">{route.summary.replace(/^[^,]+, \d+ spots, /, "").replace(/^./, (c) => c.toUpperCase())}.</p>

          <Actions route={route} className="b1-actions b1-actions-phone" />
        </div>
        <Actions route={route} className="b1-actions b1-actions-desk" />
      </div>

      <MapTools locate={locate} />
    </section>
  );
}
