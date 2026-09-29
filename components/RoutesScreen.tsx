"use client";

// The map home with its list of routes, in the two ways it opens:
// A4 · Map home, routes near you: location shared, the person on the map, nearest first, the rich
//   route card on the phone and what is notable this season as chips.
// A5 · Map home, location off: the whole region, its count pins, sorted by what is notable, and a
//   line in the bar that offers the location again.
// From 64rem both become the panel with the compact card, and the map gets its Saved control.
// Boards: A4 and A5, phone and desktop, version 6.

import { useEffect, useMemo, useRef, useState } from "react";

import { LocationOffIcon, ChevronIcon } from "@/components/Icons";
import { useLocationPrompt } from "@/components/LocationDialog";
import { MapTools, RouteCard, SearchField, Segment } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { rememberList } from "@/lib/saved";
import { HERE, ROUTES, ROUTE_TOTAL, SEASON, type SeasonId } from "@/lib/routes";

// the person and the routes near them, a constant so the map is built once
const NEAR_POINTS: MapPoint[] = [
  { id: "here", lat: HERE.lat, lon: HERE.lon, label: "You are here", here: true },
  ...ROUTES.map((r) => ({ id: r.id, lat: r.lat, lon: r.lon, label: `${r.name}, open the route card`, href: `/map/route/${r.id}` })),
];

export default function RoutesScreen({ near }: { near: boolean }) {
  const map = useRef<MapHandle>(null);
  const [season, setSeason] = useState<SeasonId | null>(null);
  const { ask, prompt } = useLocationPrompt();
  useEffect(() => rememberList(near ? "/map/near-you" : "/map/region"), [near]);

  const routes = useMemo(
    () => (season ? ROUTES.filter((r) => r.season.includes(season)) : ROUTES),
    [season],
  );

  return (
    <section className={`ms ${near ? "a4" : "a5"}`}>
      <RegionMap className="a1-map" ref={map} points={near ? NEAR_POINTS : undefined} maxZoom={near ? 11 : undefined} />

      <div className="ms-panel glass-desk">
        <div className="ms-bar">
          <SearchField />
          <Segment />
          {!near && (
            <p className="float-pill glass glass-pill">
              <LocationOffIcon size={18} />
              Location off
              <button type="button" className="float-pill-link" onClick={ask}>
                Use my location
              </button>
            </p>
          )}
        </div>

        <div className="ms-sheet glass-phone" aria-labelledby="routes-title">
          <div className="ms-handle" aria-hidden="true" />
          <div>
            <h1 id="routes-title" className="ms-title">
              {near ? (
                <>
                  Routes <em>near you</em>
                </>
              ) : (
                <>
                  Routes in <em>Berlin and Brandenburg</em>
                </>
              )}
            </h1>
            <p className="ms-lead">
              {near ? "Nearest first, with the spots along each one" : "Sorted by what is notable this season"}
            </p>
          </div>

          {near && (
            <div className="chips" role="group" aria-label="Notable this season">
              <p className="chips-label">Notable this season</p>
              {SEASON.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="chip"
                  aria-pressed={season === s.id}
                  onClick={() => setSeason(season === s.id ? null : s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="ms-list">
            {routes.map((r) => (
              <RouteCard key={r.id} route={r} rich={near} />
            ))}
          </div>

          {/* the full list is not built in the prototype, the button says what it would open */}
          <button type="button" className="btn btn-secondary btn-chev is-closing" aria-disabled="true">
            {near ? `Show all ${ROUTE_TOTAL} routes, nearest first` : `Show all ${ROUTE_TOTAL} routes as a list`}
            <span className="sr-only">, not built in the prototype yet</span>
            <ChevronIcon size={18} />
          </button>
        </div>
      </div>

      <MapTools
        locate={
          near
            ? () => map.current?.centre(HERE.lat, HERE.lon, 12, !matchMedia("(prefers-reduced-motion: reduce)").matches)
            : undefined
        }
      />
      {prompt}
    </section>
  );
}
