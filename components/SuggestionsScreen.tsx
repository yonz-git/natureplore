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

import { ChevronIcon, GroupIcon, ListIcon, MapIcon, OrganismsIcon, PinIcon, RoutesIcon, SearchIcon } from "@/components/Icons";
import { SearchField } from "@/components/MapParts";
import { useSheet } from "@/components/SheetGrab";
import { useIsDesktop } from "@/lib/useIsDesktop";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { SuggestionCard } from "@/components/SuggestionCard";
import { playGroup } from "@/lib/group-motion";
import { GROUPS, HERE, type Group } from "@/lib/routes";
import { rememberList } from "@/lib/saved";
import { organismPhoto } from "@/lib/photos";
import { groupWord, HOME_REGION, MONTH, organismsIn, regionById, ROUTE_POINTS, routesIn } from "@/lib/suggestions";

const HERE_POINT: MapPoint = { id: "here", lat: HERE.lat, lon: HERE.lon, label: "You are here", here: true };

function pointsFor(regionId: string, near: boolean): MapPoint[] {
  const own = ROUTE_POINTS.filter((p) => regionById(regionId).routes.includes(p.id));
  return near ? [HERE_POINT, ...own] : own;
}

export default function SuggestionsScreen({ near, regionId = HOME_REGION }: { near: boolean; regionId?: string }) {
  const map = useRef<MapHandle>(null);
  // from 64rem the search field leaves the panel for the top of the screen, centred on it
  const desk = useIsDesktop();
  const [onMap, setOnMap] = useState(false);
  // the route card under the pointer or holding focus: its label on the map lightens to match
  const [hot, setHot] = useState<string>();
  const hotFrom = (e: React.SyntheticEvent) =>
    setHot((e.target as HTMLElement).closest<HTMLElement>("[data-route]")?.dataset.route);
  // what the list shows for the region: its routes, or what is in season along them
  const [show, setShow] = useState<"routes" | "organisms">("routes");
  const region = regionById(regionId);
  const home = region.id === HOME_REGION;
  const routes = routesIn(region);
  // the routes that are built open from their labels on the map; the others are sample cards
  const opens = routes.filter((r) => r.href).map((r) => r.name);
  const organisms = organismsIn(region);
  // On Organisms, all five groups sit beside the switch as filters, the ones with nothing in season
  // here dimmed and unpickable. None picked shows all; each one picked narrows the list to those.
  const [picked, setPicked] = useState<Group[]>([]);
  // the organisms list shows four of each group until Discover more opens the rest
  const [more, setMore] = useState<Group[]>([]);
  const has = (g: Group) => organisms.some(({ organism }) => organism.group === g);
  const shown = picked.length ? organisms.filter(({ organism }) => picked.includes(organism.group)) : organisms;
  const pick = (g: Group) => setPicked((now) => (now.includes(g) ? now.filter((x) => x !== g) : [...now, g]));
  const groupRow = useRef<HTMLDivElement>(null);
  // as the toggles appear the moving icons play once, a beat after they grow in, dimmed or not
  useEffect(() => {
    if (show !== "organisms") return;
    groupRow.current?.querySelectorAll<HTMLElement>("[data-group]").forEach((b, i) => playGroup(b, b.dataset.group as Group, 160 + i * 60));
  }, [show]);
  // The lime under the picked option is one pill that slides between the two (.seg-thumb in
  // app/flow-a.css): placed on the picked option's box, measured, and moved again whenever the option
  // changes or a width changes. Its first placement is not animated; from then on it glides.
  const seg = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const box = seg.current;
    const pill = thumb.current;
    if (!box || !pill) return;
    const place = () => {
      const on = box.querySelector<HTMLElement>('.seg-opt[aria-pressed="true"]');
      if (!on) return;
      pill.style.width = `${on.offsetWidth}px`;
      pill.style.height = `${on.offsetHeight}px`;
      pill.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
    };
    place();
    if (!("thumb" in box.dataset)) requestAnimationFrame(() => (box.dataset.thumb = ""));
    const watch = new ResizeObserver(place);
    box.querySelectorAll(".seg-opt").forEach((o) => watch.observe(o));
    return () => watch.disconnect();
  }, [show]);
  // the region's routes on the map, a memo so the map is built once per region
  const points = useMemo(() => pointsFor(regionId, near), [regionId, near]);
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
  // "Show on map" flies the map in, as a map app would: with the location on, to the person and the
  // routes near them; with it off, to the route at the top of the list. "Show as a list" flies back
  // to the overview. A layout effect, so the map measures the sheet's new top before it refits.
  const flipped = useRef(false);
  useLayoutEffect(() => {
    if (!flipped.current) {
      flipped.current = true;
      return;
    }
    if (!onMap) return map.current?.reset();
    const own = points.filter((p) => !p.here);
    const close = own.filter((p) => Math.hypot((p.lat - HERE.lat) * 111, (p.lon - HERE.lon) * 68) < 15);
    const top = own.find((p) => p.id === routes[0]?.id) ?? own[0];
    if (near) map.current?.show([HERE, ...close], 12);
    else if (top) map.current?.show([top], 11);
  }, [onMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (
    <button type="button" className="sg-toggle" aria-pressed={onMap} onClick={flip}>
      {onMap ? <ListIcon size={18} /> : <MapIcon size={18} />}
      {onMap ? "Show as a list" : "Show on map"}
    </button>
  );

  const row = useRef<HTMLDivElement>(null);
  const [searching, setSearching] = useState(false);
  // Routes or Organisms, outside the sheet, after the search circle
  const segment = (
    <div role="group" aria-label="Show routes or organisms" className="seg glass glass-pill" ref={seg} inert={searching}>
      <span className="seg-thumb" ref={thumb} aria-hidden="true" />
      <button type="button" className="seg-opt" aria-pressed={show === "routes"} onClick={() => setShow("routes")}>
        <RoutesIcon size={25} className="seg-routes" />
        <span className="seg-label" data-text="Routes">Routes</span>
      </button>
      <button type="button" className="seg-opt" aria-pressed={show === "organisms"} onClick={() => setShow("organisms")}>
        <OrganismsIcon size={21} className="seg-orgs" />
        <span className="seg-label" data-text="Organisms">Organisms</span>
      </button>
    </div>
  );
  // on Organisms, the group filters fan out in the sheet above the list; inert, not removed, while
  // on Routes, so the toggles can fade out as well as in
  const groups = (
    <div role="group" aria-label="Filter by group" ref={groupRow} className={`sg-groups${show === "organisms" ? " is-on" : ""}`} inert={show !== "organisms"}>
      <button type="button" className="sg-group sg-all glass glass-pill" aria-pressed={picked.length === 0} onClick={() => setPicked([])}>
        All
      </button>
      {GROUPS.map((g) => (
        <button
          key={g.id}
          type="button"
          className={`sg-group glass glass-pill is-${g.id}`}
          aria-pressed={picked.includes(g.id)}
          aria-disabled={!has(g.id) || undefined}
          aria-label={has(g.id) ? g.label : `${g.label}, none in season here`}
          title={has(g.id) ? g.label : `${g.label}: none in season here`}
          data-group={g.id}
          onClick={() => has(g.id) && pick(g.id)}
          // again under a mouse or on keyboard focus, when the group can be picked
          onPointerEnter={(e) => e.pointerType === "mouse" && has(g.id) && playGroup(e.currentTarget, g.id)}
          onFocus={(e) => e.currentTarget.matches(":focus-visible") && has(g.id) && playGroup(e.currentTarget, g.id)}
        >
          <GroupIcon group={g.id} size={18.2} />
        </button>
      ))}
    </div>
  );
  // Search is a circle at the row's start. Opened, the switch and the filters slide out and the field
  // slides in over the row, its icon now a way back; Escape or Back slides the switch in again.
  const opened = useRef(false);
  const openSearch = () => {
    row.current?.scrollTo({ left: 0 });
    setSearching(true);
  };
  const closeSearch = () => setSearching(false);
  // focus follows: into the field as it opens, back to the circle as it closes (not on arrival)
  useEffect(() => {
    if (searching) row.current?.querySelector<HTMLInputElement>(".sg-find input")?.focus();
    else if (opened.current) row.current?.querySelector<HTMLElement>(".sg-search")?.focus();
    opened.current ||= searching;
  }, [searching]);
  const topRow = (
    <div className={`ms-bar-row${searching ? " is-searching" : ""}`} ref={row}>
      <button type="button" className="sg-search glass glass-pin" aria-label="Search a region or an organism" onClick={openSearch} inert={searching}>
        <SearchIcon size={19.8} />
      </button>
      {segment}
            <div className="sg-find" inert={!searching} onKeyDown={(e) => e.key === "Escape" && closeSearch()}>
        <SearchField onBack={closeSearch} />
      </div>
    </div>
  );

  return (
    <section className={`ms sg ${near ? "a4" : "a5"}${onMap ? " is-map" : ""}`}>
      <RegionMap className="a1-map" behind={!onMap} hot={hot} ref={map} points={points} maxZoom={home ? 9.5 : 11} />

      {desk && (
        <div className="ms-search-top">
          {topRow}
        </div>
      )}

      <div className="ms-panel glass-desk">
        {!desk && (
          <div className="ms-bar">
            {topRow}
          </div>
        )}

        <div
          ref={sheet}
          className={`ms-sheet glass-phone glass-top${grab.open ? " is-open" : ""}${grab.down ? " is-down" : ""}`}
          aria-labelledby="sg-title"
          onScroll={grab.onScroll}
        >
          {grab.grab("list")}
          {/* on Organisms, the group filters at the top of the sheet */}
          <div className="sg-head">
            <div>
              <p className="sg-scope">
                {/* keyed so the pin rolls in again for each region */}
                <span className="sg-pin" key={region.id}>
                  {/* a ring on the ground round the pin's tip */}
                  <svg className="sg-pin-ring" viewBox="0 0 12 5" aria-hidden="true">
                    <ellipse cx="6" cy="2.5" rx="5.4" ry="1.9" />
                  </svg>
                  <PinIcon size={18} className="sg-pin-icon" />
                </span>
                {near ? `Near you, in ${region.name}` : region.name}
              </p>
              <h1 id="sg-title" className="ms-title">
                In season in <em>{MONTH}</em>
              </h1>
              {show === "organisms" && (
                <p className="ms-lead">
                  <b>{shown.length}</b> in season along <b>{routes.length}</b> route{routes.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
            {toggle}
          </div>
          {groups}

          {near && (
            <p className="sg-where">
              <PinIcon size={18} />
              Location on. It stays on this device.
            </p>
          )}

          {show === "routes" ? (
            <div
              className="sg-list"
              key="routes"
              onPointerOver={hotFrom}
              onPointerLeave={() => setHot(undefined)}
              onFocus={hotFrom}
              onBlur={() => setHot(undefined)}
            >
              {routes.map((s) => (
                <SuggestionCard key={s.id} route={s} />
              ))}
              {/* the full list is not built in the prototype, the button says what it would open */}
              {home && (
                <button type="button" className="btn btn-secondary btn-chev is-closing" aria-disabled="true">
                  Show more routes
                  <span className="sr-only">, not built in the prototype yet</span>
                  <ChevronIcon size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="sg-list" key="organisms">
              {/* one card per group, in the filters' order, headed by its icon, name and species count */}
                {GROUPS.filter((g) => shown.some(({ organism }) => organism.group === g.id)).map((g, n) => {
                  const inGroup = shown.filter(({ organism }) => organism.group === g.id);
                  if (!inGroup.length) return null;
                  return (
                    <section key={`${g.id}-${picked.join()}`} className="saved-card a8-group sg-org-sec" style={{ "--n": n } as React.CSSProperties} aria-labelledby={`sg-sec-${g.id}`}>
                      <h2 id={`sg-sec-${g.id}`} className="sg-org-sec-head">
                        <GroupIcon group={g.id} size={20} className={`is-${g.id}`} />
                        <span className="sg-org-name">{g.label}</span>
                        <span className="tag sug-spots sg-org-count">{inGroup.length} Species</span>
                      </h2>
                      <ul className="a8-rows sg-bento">
                        {(more.includes(g.id) ? inGroup : inGroup.slice(0, 4)).map(({ organism: o, routes: on, href }, i) => {
                          const photo = organismPhoto(o.name);
                          const body = (
                            <>
                              {photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img className="a8-thumb" src={photo.src} alt="" loading="lazy" />
                              ) : (
                                <span className="a8-thumb fb-in-season-tile" aria-hidden="true">
                                  <GroupIcon group={o.group} size={22} className={`is-${o.group}`} />
                                </span>
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
                            <li key={o.name} className={i >= 4 ? "is-new" : undefined} style={i >= 4 ? ({ "--n": i - 4 } as React.CSSProperties) : undefined}>
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
                      {inGroup.length > 4 && !more.includes(g.id) && (
                        <button type="button" className="btn btn-secondary sg-org-more" onClick={() => setMore((m) => [...m, g.id])}>
                          Discover more
                          <span className="sr-only"> {g.label.toLowerCase()}, {inGroup.length - 4} more</span>
                        </button>
                      )}
                    </section>
                  );
                })}
            </div>
          )}
          <p className="sg-map-note">
            Every route on the map has spots in season in {MONTH}.{opens.length > 0 && ` ${opens.join(" and ")} ${opens.length === 1 ? "opens" : "open"} from ${opens.length === 1 ? "its label" : "their labels"}.`}
          </p>
        </div>
      </div>
    </section>
  );
}
