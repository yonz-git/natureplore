"use client";

// The home of the Routes tab, in the two ways it opens:
// A5 · Suggestions, location off: the routes in season this month in Berlin and Brandenburg,
//   sorted by how many of their spots are in season, and "Use my location", which asks first.
// A4 · Suggestions, near you: the same, after the location is allowed, with the person on the map.
// On the phone the map sits above a sheet with the list, and "Show on map" swaps the list for the
// map in place. From 64rem the list is the panel down the left and the map is always beside it.
// Boards: A5 and A4, phone, tablet and desktop, on the redesign canvas.

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { ChevronIcon, LeafIcon, ListIcon, MapIcon, PinIcon, RoutesIcon } from "@/components/Icons";
import { useLocationPrompt } from "@/components/LocationDialog";
import { MapTools, SearchField } from "@/components/MapParts";
import { useSheet } from "@/components/SheetGrab";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { SuggestionCard } from "@/components/SuggestionCard";
import { HERE } from "@/lib/routes";
import { rememberList } from "@/lib/saved";
import { organismPhoto } from "@/lib/photos";
import { groupWord, HOME_REGION, MONTH, organismsIn, regionById, ROUTE_POINTS, ROUTE_TOTAL, routesIn } from "@/lib/suggestions";

const HERE_POINT: MapPoint = { id: "here", lat: HERE.lat, lon: HERE.lon, label: "You are here", here: true };

function pointsFor(regionId: string, near: boolean): MapPoint[] {
  const own = ROUTE_POINTS.filter((p) => regionById(regionId).routes.includes(p.id));
  return near ? [HERE_POINT, ...own] : own;
}

export default function SuggestionsScreen({ near, regionId = HOME_REGION }: { near: boolean; regionId?: string }) {
  const map = useRef<MapHandle>(null);
  const [onMap, setOnMap] = useState(false);
  // what the list shows for the region: its routes, or what is in season along them
  const [show, setShow] = useState<"routes" | "organisms">("routes");
  const region = regionById(regionId);
  const home = region.id === HOME_REGION;
  const routes = routesIn(region);
  const organisms = organismsIn(region);
  // the region's routes on the map, a memo so the map is built once per region
  const points = useMemo(() => pointsFor(regionId, near), [regionId, near]);
  const { ask, prompt } = useLocationPrompt();
  useEffect(() => rememberList(near ? "/map/near-you" : home ? "/map" : `/map?region=${region.id}`), [near, home, region.id]);

  // The sheet moves between its two heights by its own transform, never an ancestor's (that would
  // switch off the frost): its top jumps, then it slides from where it was. The map measures the
  // new top at once, so the labels land in the space the sheet leaves free.
  // on the map view the sheet keeps only its head, so it has nothing to open
  const sheet = useRef<HTMLDivElement>(null);
  const grab = useSheet(sheet, !onMap);
  const from = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = sheet.current;
    if (!el || from.current === null) return;
    const dy = from.current - el.offsetTop;
    from.current = null;
    if (!dy || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
      duration: 360,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    });
  }, [onMap]);
  const flip = () => {
    from.current = sheet.current?.offsetTop ?? null;
    setOnMap(!onMap);
  };

  const toggle = (
    <button type="button" className="sg-toggle" aria-pressed={onMap} onClick={flip}>
      {onMap ? <ListIcon size={18} /> : <MapIcon size={18} />}
      {onMap ? "Show as a list" : "Show on map"}
    </button>
  );

  return (
    <section className={`ms sg ${near ? "a4" : "a5"}${onMap ? " is-map" : ""}`}>
      <RegionMap className="a1-map" ref={map} points={points} maxZoom={home ? 9.5 : 11} />

      <div className="ms-panel glass-desk">
        <div className="ms-bar">
          <SearchField />
          <div role="group" aria-label="Show routes or organisms" className="seg glass glass-pill">
            <button type="button" className="seg-opt" aria-pressed={show === "routes"} onClick={() => setShow("routes")}>
              <RoutesIcon size={18} />
              Routes
            </button>
            <button type="button" className="seg-opt" aria-pressed={show === "organisms"} onClick={() => setShow("organisms")}>
              <LeafIcon size={18} />
              Organisms
            </button>
          </div>
        </div>

        <div
          ref={sheet}
          className={`ms-sheet glass-phone glass-top${grab.open ? " is-open" : ""}`}
          aria-labelledby="sg-title"
          onScroll={grab.onScroll}
        >
          {grab.grab("list")}
          <div className="sg-head">
            <div>
              <h1 id="sg-title" className="ms-title">
                In season in <em>{MONTH}</em>
              </h1>
              <p className="sg-scope">{near ? `Near you, in ${region.name}` : region.name}</p>
              <p className="ms-lead">
                {show === "organisms"
                  ? `${organisms.length} in season along ${routes.length} route${routes.length > 1 ? "s" : ""}`
                  : near
                    ? "Sorted by how many spots are in season, then by distance"
                    : "Sorted by how many spots are in season"}
              </p>
            </div>
            {toggle}
          </div>

          {near ? (
            <p className="sg-where">
              <PinIcon size={18} />
              Location on. It stays on this device.
            </p>
          ) : (
            <div className="sg-where">
              <button type="button" className="sg-locate" onClick={ask}>
                <PinIcon size={18} />
                <span>Use my location</span>
              </button>
              <span className="ms-note">Location stays on this device</span>
            </div>
          )}

          {show === "routes" ? (
            <div className="sg-list" key="routes">
              {routes.map((s) => (
                <SuggestionCard key={s.id} route={s} />
              ))}
              {/* the full list is not built in the prototype, the button says what it would open */}
              {home && (
                <button type="button" className="btn btn-secondary btn-chev is-closing" aria-disabled="true">
                  Show all {ROUTE_TOTAL} routes
                  <span className="sr-only">, not built in the prototype yet</span>
                  <ChevronIcon size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="sg-list" key="organisms">
              <div className="saved-card a8-group">
                <ul className="a8-rows">
                  {organisms.map(({ organism: o, routes: on, href }) => {
                    const photo = organismPhoto(o.name);
                    const body = (
                      <>
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="a8-thumb" src={photo.src} alt="" loading="lazy" />
                        ) : (
                          <span className="a8-thumb" aria-hidden="true" />
                        )}
                        <span>
                          <b>
                            {o.name}
                            {o.note && <span className="sug-org-note">, {o.note}</span>}
                          </b>
                          <small>
                            {groupWord(o.group)}, <i>{o.latin}</i>
                          </small>
                          <small>
                            Along {on} route{on > 1 ? "s" : ""}, last recorded {o.last}
                          </small>
                        </span>
                      </>
                    );
                    return (
                      <li key={o.name}>
                        {href ? (
                          <Link href={href} className="sg-org-link">
                            {body}
                            <ChevronIcon size={18} />
                          </Link>
                        ) : (
                          body
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
          <p className="sg-map-note">
            Every route on the map has spots in season in {MONTH}.{region.routes.includes("linum") && " Linum wet meadows loop opens from its label."}
          </p>
        </div>
      </div>

      <MapTools
        locate={
          near
            ? () => map.current?.centre(HERE.lat, HERE.lon, 10, !matchMedia("(prefers-reduced-motion: reduce)").matches)
            : undefined
        }
      />
      {prompt}
    </section>
  );
}
