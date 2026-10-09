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

import { ChevronIcon, GroupIcon, ListIcon, MapIcon, OrganismsIcon, PinIcon, RoutesIcon } from "@/components/Icons";
import { MapTools, SearchField } from "@/components/MapParts";
import { useSheet } from "@/components/SheetGrab";
import { useIsDesktop } from "@/lib/useIsDesktop";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { SuggestionCard } from "@/components/SuggestionCard";
import { GROUPS, HERE, type Group } from "@/lib/routes";
import { rememberList } from "@/lib/saved";
import { organismPhoto } from "@/lib/photos";
import { groupWord, HOME_REGION, MONTH, organismsIn, regionById, ROUTE_POINTS, ROUTE_TOTAL, routesIn } from "@/lib/suggestions";

const HERE_POINT: MapPoint = { id: "here", lat: HERE.lat, lon: HERE.lon, label: "You are here", here: true };

function pointsFor(regionId: string, near: boolean): MapPoint[] {
  const own = ROUTE_POINTS.filter((p) => regionById(regionId).routes.includes(p.id));
  return near ? [HERE_POINT, ...own] : own;
}

// The group icons that move (app/flow-a.css has their pivots). The herbs: Lordicon's "hover-pinch"
// for this drawing, rebuilt from its keyframes, the sprigs lifting and dipping back, swinging forward
// and settling over 1.78s. The mushroom hops: squashes, springs up, lands with a squash and settles.
type Motion = { part: string; frames: Keyframe[]; ms: number };
const GROUP_MOTION: Partial<Record<Group, Motion[]>> = {
  // the plant gathers on its stem, rises and opens, then sways and settles
  plants: [{
    part: ".plant-rise",
    ms: 1300,
    frames: [
      { transform: "translateY(0) rotate(0) scale(1, 1)" },
      { transform: "translateY(0) rotate(0) scale(1.05, 0.9)", offset: 0.16 },
      { transform: "translateY(-0.6px) rotate(-3deg) scale(0.97, 1.07)", offset: 0.42 },
      { transform: "translateY(0) rotate(2deg) scale(1.01, 0.98)", offset: 0.64 },
      { transform: "translateY(0) rotate(-1deg) scale(1, 1)", offset: 0.82 },
      { transform: "translateY(0) rotate(0) scale(1, 1)" },
    ],
  }],
  herbs: [{
    part: ".herbs-sway",
    ms: 1780,
    frames: [
      { transform: "translateY(0) rotate(0)" },
      { transform: "translateY(-0.56px) rotate(-9deg)", offset: 0.29 },
      { transform: "translateY(-0.42px) rotate(5deg)", offset: 0.49 },
      { transform: "translateY(-0.28px) rotate(-3deg)", offset: 0.69 },
      { transform: "translateY(-0.12px) rotate(1deg)", offset: 0.86 },
      { transform: "translateY(0) rotate(0)" },
    ],
  }],
  mushrooms: [{
    part: ".mushroom-hop",
    ms: 1100,
    frames: [
      { transform: "translateY(0) scale(1, 1)" },
      { transform: "translateY(0) scale(1.08, 0.88)", offset: 0.14 },
      { transform: "translateY(-2.2px) scale(0.96, 1.06)", offset: 0.38 },
      { transform: "translateY(0) scale(1.06, 0.92)", offset: 0.58 },
      { transform: "translateY(-0.5px) scale(0.99, 1.02)", offset: 0.76 },
      { transform: "translateY(0) scale(1, 1)" },
    ],
  }],
  // the paw steps: it presses down, lifts with a turn, lands and settles
  mammals: [{
    part: ".paw-step",
    ms: 900,
    frames: [
      { transform: "translateY(0) rotate(0) scale(1)" },
      { transform: "translateY(1px) rotate(0) scale(0.92)", offset: 0.2 },
      { transform: "translateY(-1.2px) rotate(-8deg) scale(1.04)", offset: 0.42 },
      { transform: "translateY(0) rotate(4deg) scale(0.98)", offset: 0.64 },
      { transform: "translateY(0) rotate(-2deg) scale(1)", offset: 0.82 },
      { transform: "translateY(0) rotate(0) scale(1)" },
    ],
  }],
  // the bird hops with its wing beating: the body rises and tilts while the wing flaps from its
  // shoulder, quicker than the hop
  birds: [
    {
      part: ".bird-hop",
      ms: 1000,
      frames: [
        { transform: "translateY(0) rotate(0) scale(1, 1)" },
        { transform: "translateY(0) rotate(0) scale(1.05, 0.92)", offset: 0.18 },
        { transform: "translateY(-2px) rotate(-6deg) scale(0.98, 1.04)", offset: 0.45 },
        { transform: "translateY(0) rotate(2deg) scale(1.04, 0.95)", offset: 0.7 },
        { transform: "translateY(0) rotate(0) scale(1, 1)" },
      ],
    },
    {
      part: ".bird-wing",
      ms: 1000,
      frames: [
        { transform: "rotate(0)" },
        { transform: "rotate(-28deg)", offset: 0.15 },
        { transform: "rotate(30deg)", offset: 0.3 },
        { transform: "rotate(-22deg)", offset: 0.45 },
        { transform: "rotate(20deg)", offset: 0.6 },
        { transform: "rotate(-8deg)", offset: 0.78 },
        { transform: "rotate(0)" },
      ],
    },
  ],
};
function playGroup(button: HTMLElement, group: Group, delay = 0) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (const motion of GROUP_MOTION[group] ?? []) {
    const part = button.querySelector<SVGGElement>(motion.part);
    if (!part) continue;
    part.getAnimations().forEach((a) => a.cancel());
    part.animate(motion.frames, { duration: motion.ms, delay, easing: "cubic-bezier(0.33, 0, 0.67, 1)", fill: "backwards" });
  }
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
  const organisms = organismsIn(region);
  // On Organisms, all five groups sit beside the switch as filters, the ones with nothing in season
  // here dimmed and unpickable. None picked shows all; each one picked narrows the list to those.
  const [picked, setPicked] = useState<Group[]>([]);
  const has = (g: Group) => organisms.some(({ organism }) => organism.group === g);
  const shown = picked.length ? organisms.filter(({ organism }) => picked.includes(organism.group)) : organisms;
  const pick = (g: Group) => setPicked((now) => (now.includes(g) ? now.filter((x) => x !== g) : [...now, g]));
  // the toggles line up under the Organisms option they filter: its left edge, measured, is their indent
  const switchRow = useRef<HTMLDivElement>(null);
  const groupRow = useRef<HTMLDivElement>(null);
  // as the toggles appear the moving icons play once, a beat after they grow in, dimmed or not
  useEffect(() => {
    if (show !== "organisms") return;
    groupRow.current?.querySelectorAll<HTMLElement>("[data-group]").forEach((b, i) => playGroup(b, b.dataset.group as Group, 160 + i * 60));
  }, [show]);
  const orgOpt = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const row = switchRow.current;
    const opt = orgOpt.current;
    if (!row || !opt) return;
    const place = () => row.style.setProperty("--org-x", `${opt.getBoundingClientRect().left - row.getBoundingClientRect().left}px`);
    const watch = new ResizeObserver(place);
    watch.observe(row);
    watch.observe(opt);
    place();
    return () => watch.disconnect();
  }, []);
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

  const toggle = (
    <button type="button" className="sg-toggle" aria-pressed={onMap} onClick={flip}>
      {onMap ? <ListIcon size={18} /> : <MapIcon size={18} />}
      {onMap ? "Show as a list" : "Show on map"}
    </button>
  );

  return (
    <section className={`ms sg ${near ? "a4" : "a5"}${onMap ? " is-map" : ""}`}>
      <RegionMap className="a1-map" behind={!onMap} hot={hot} ref={map} points={points} maxZoom={home ? 9.5 : 11} />

      {desk && (
        <div className="ms-search-top">
          <SearchField />
        </div>
      )}

      <div className="ms-panel glass-desk">
        {!desk && (
          <div className="ms-bar">
            <SearchField />
          </div>
        )}

        <div
          ref={sheet}
          className={`ms-sheet glass-phone glass-top${grab.open ? " is-open" : ""}`}
          aria-labelledby="sg-title"
          onScroll={grab.onScroll}
        >
          {grab.grab("list")}
          {/* Routes or Organisms, and on Organisms the group filters, at the top of the sheet */}
          <div className="sg-switch" ref={switchRow}>
          <div role="group" aria-label="Show routes or organisms" className="seg glass glass-pill" ref={seg}>
            <span className="seg-thumb" ref={thumb} aria-hidden="true" />
            <button type="button" className="seg-opt" aria-pressed={show === "routes"} onClick={() => setShow("routes")}>
              <RoutesIcon size={18} />
              <span className="seg-label" data-text="Routes">Routes</span>
            </button>
            <button type="button" ref={orgOpt} className="seg-opt" aria-pressed={show === "organisms"} onClick={() => setShow("organisms")}>
              <OrganismsIcon size={18} />
              <span className="seg-label" data-text="Organisms">Organisms</span>
            </button>
          </div>
          {/* inert, not removed, while on Routes, so the toggles can fade out as well as in */}
          <div role="group" aria-label="Filter by group" ref={groupRow} className={`sg-groups${show === "organisms" ? " is-on" : ""}`} inert={show !== "organisms"}>
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
          </div>
          <div className="sg-head">
            <div>
              <h1 id="sg-title" className="ms-title">
                In season in <em>{MONTH}</em>
              </h1>
              <p className="sg-scope">{near ? `Near you, in ${region.name}` : region.name}</p>
              {show === "organisms" && (
                <p className="ms-lead">
                  {`${shown.length} in season along ${routes.length} route${routes.length > 1 ? "s" : ""}`}
                </p>
              )}
            </div>
            {toggle}
          </div>

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
                  {shown.map(({ organism: o, routes: on, href }) => {
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
            Every route on the map has spots in season in {MONTH}.{region.routes.includes("grumsin") && " Grumsin beech forest loop opens from its label."}
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
    </section>
  );
}
