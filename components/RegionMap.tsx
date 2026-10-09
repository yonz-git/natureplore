"use client";

// The real Berlin and Brandenburg map behind A1, drawn by Leaflet from the vector geometry in
// public/base-geo.js. There is no tile server: every road, wood, lake and state edge is an OSM
// shape rendered to one canvas in the basemap tokens, so the map follows the design system and
// works offline. Colours: docs/design.md, the basemap set.
//
// The count pins are React siblings of the Leaflet container, not Leaflet markers. A marker lives
// inside .leaflet-map-pane, which always carries a transform, and a transformed ancestor is a
// backdrop root: the frost on a glass pin would switch off. So the pins sit outside the map and
// are placed from map.latLngToContainerPoint on every move. The place names are plain text, so
// they stay ordinary markers.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";

import "leaflet/dist/leaflet.css";

type Geo = Record<string, GeoJSON.GeoJsonObject>;

declare global {
  interface Window {
    NP_GEO?: Geo;
  }
}

// [routes, lat, lon, where]
const CLUSTERS: [number, number, number, string][] = [
  [164, 52.59, 13.22, "around Berlin"],
  [48, 52.95, 13.6, "in Schorfheide-Chorin"],
  [36, 51.88, 13.97, "in the Spreewald"],
  [27, 52.465, 12.94, "around Potsdam"],
  [21, 52.63, 12.7, "in Havelland"],
  [18, 52.475, 12.41, "around Brandenburg an der Havel"],
  [30, 53.18, 13.85, "in the Uckermark"],
  [23, 52.0, 12.8, "in the Fläming"],
  [9, 52.66, 14.25, "in the Oderbruch"],
];

// Names the OSM place data does not carry: reserves, landscapes and water. [text, lat, lon, kind]
const LABELS: [string, number, number, "nature" | "water"][] = [
  ["Schorfheide", 52.885, 13.6, "nature"],
  ["Havelland", 52.565, 12.7, "nature"],
  ["Spreewald", 51.815, 13.97, "nature"],
  ["Uckermark", 53.115, 13.85, "nature"],
  ["Fläming", 51.935, 12.8, "nature"],
  ["Oderbruch", 52.595, 14.25, "nature"],
  ["Müggelsee", 52.405, 13.66, "water"],
  ["Scharmützelsee", 52.235, 14.14, "water"],
  ["Oder", 52.47, 14.66, "water"],
  ["Havel", 52.44, 12.88, "water"],
];

const DESKTOP = "(min-width: 64rem)";
// the tablet step where the suggestions dock their sheet beside the map (app/tablet.css)
const TABLET = "(min-width: 48rem) and (max-width: 63.99rem) and (min-height: 36rem)";
// The region is fitted to whatever space the sheet leaves free rather than shown at one fixed
// zoom, so a wide window frames Berlin and Brandenburg instead of half of northern Europe.
// REGION_ZOOM_MIN is the zoom the phone has always used: the band above a sheet that tall cannot
// hold the whole region, so the view sits on Berlin and the nearer clusters and the outer ones
// are a pan away, which is what the map is for.
const REGION_ZOOM_MIN = 8.25;
const REGION_ZOOM_MAX = 10;
// room for the outermost count pin inside the free box
const REGION_PAD = 56;
// where the view sits when the box is too small to hold the region, which is the phone
const REGION: [number, number] = [52.55, 13.15];

/** What the map draws over itself: a cluster with a count, a recorded place, or the person. */
export type MapPoint = {
  id: string;
  lat: number;
  lon: number;
  /** a cluster carries the number of places in it, a single place carries none */
  count?: number;
  label: string;
  /** the person's own position, drawn as a dot with its name beside it */
  here?: boolean;
  /** a pin that opens something, such as a route's card, instead of zooming to itself */
  href?: string;
  /** the pin whose card is open, drawn with a ring */
  current?: boolean;
  /** a spot on a route, numbered in walking order */
  n?: number;
  /** a spot with nothing in season this month, drawn muted */
  out?: boolean;
  /** where a route starts and finishes */
  start?: boolean;
  /** a spot's name goes on the left of its marker */
  left?: boolean;
  /** a route drawn with its name, the second line under it ("4 of 6 in season"), as on A5's map */
  tag?: string;
  /** the visible name of a tagged route, when `label` says more for screen readers */
  name?: string;
};

const REGION_POINTS: MapPoint[] = CLUSTERS.map(([count, lat, lon, where]) => ({
  id: `c${count}`,
  lat,
  lon,
  count,
  label: `${count} routes ${where}, zoom in`,
}));

// two route discs closer than this, centre to centre, overlap: a 32 disc and its double ring
const SPOT_GAP = 40;
type Pin = MapPoint & { x: number; y: number; free: boolean };

type Centre = ((lat: number, lon: number, zoom: number, animate: boolean) => void) | null;

/** What a screen can ask the map to do: put a point in the middle of the space it has. */
export type MapHandle = { centre: (lat: number, lon: number, zoom: number, animate: boolean) => void };

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// one request per page, whatever React does with the effect
let geoPromise: Promise<Geo> | null = null;

function loadGeo(): Promise<Geo> {
  if (window.NP_GEO) return Promise.resolve(window.NP_GEO);
  return (geoPromise ??= new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "/base-geo.js";
    el.onload = () =>
      window.NP_GEO ? resolve(window.NP_GEO) : reject(new Error("base-geo.js carried no NP_GEO"));
    el.onerror = () => reject(new Error("base-geo.js failed to load"));
    document.head.append(el);
  }));
}

// The part of the map the sheet leaves free: above it on the phone, beside it on the desktop,
// where the sheet is a panel down the left. The region is centred in that box and a pin outside it
// is hidden, so nothing the sheet covers is left clickable or in the tab order.
// offsetTop and offsetHeight are used rather than a client rect, because they ignore the sheet's
// enter animation, which is still sliding the sheet when the map first measures it.
function freeBox(host: HTMLElement, sheet: HTMLElement | null, band: HTMLElement | null, desktop: boolean) {
  const w = host.offsetWidth;
  const h = host.offsetHeight;
  if (!sheet) return { x: 0, y: 0, w, h };
  // whatever floats across the top of the map is not free space either: the nav pill on the
  // desktop, the search and filter bar on the phone. Without this a pin lands behind one of them,
  // where it cannot be seen or clicked.
  const top = band ? band.offsetTop + band.offsetHeight : 0;
  // the box is reported as it really is, however little is left: a floor here would let a pin
  // sit under the sheet and still count as free
  if (!desktop) return { x: 0, y: top, w, h: Math.max(1, sheet.offsetTop - top) };
  const right = sheet.offsetLeft + sheet.offsetWidth;
  // the map's own controls down the right edge are not free either
  const tools = host.parentElement?.querySelector<HTMLElement>(".ms-tools");
  const end = tools && tools.offsetWidth ? tools.offsetLeft - 8 : w;
  return { x: right, y: top, w: Math.max(1, end - right), h: Math.max(1, h - top) };
}

// half a pin, so one is hidden before it slides under the edge of the glass
const PIN_EDGE = 24;

// `still` is the welcome card: the same map, no dragging, no zooming, no pins, nothing to focus.
// `points` replaces the region's count pins with whatever a screen puts on the map: the recorded
// places near the person on A4, the saved ones on A7. Pass a value that does not change between
// renders, a module constant or a memo: a new array tears the map down and builds it again.
// `maxZoom` is how far the fit may go in, so a handful of places in one city fills the space
// instead of stopping at the whole region's zoom.
export default function RegionMap({
  className,
  still = false,
  points,
  maxZoom = REGION_ZOOM_MAX,
  line,
  detail,
  mapLabel = "Map of Berlin and Brandenburg",
  behind = false,
  hot,
  ref,
}: {
  className?: string;
  still?: boolean;
  points?: MapPoint[];
  maxZoom?: number;
  /** a route's line, [lat, lon] in walking order, drawn in lime over the map. Pass a constant. */
  line?: [number, number][];
  /** a GeoJSON file of the paths, water and land around a route, for the zoom a route is seen at */
  detail?: string;
  /** what the map shows, for screen readers: the region, or the route on a route's own map */
  mapLabel?: string;
  /**
   * the map sits under a sheet on the phone, so it is not a tab stop there: its focus ring and its
   * arrow keys would be out of sight. The list above it holds the same places. From 64rem it is
   * beside the panel and takes focus again.
   */
  behind?: boolean;
  /** the route whose card is under the pointer or focus in the list: its label on the map lightens */
  hot?: string;
  /** a screen holds this to move the map from a control of its own */
  ref?: React.Ref<MapHandle>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const router = useRouter();
  const [zooming, setZooming] = useState(false);
  // set once the map exists: puts a point in the middle of the free space, not the screen
  const centreRef = useRef<Centre>(null);
  // set by the tab stop effect below, called again once Leaflet has made the map focusable
  const tabStopRef = useRef<() => void>(() => {});
  // read at the moment it is called, so the handle survives the map being rebuilt
  useImperativeHandle(ref, () => ({ centre: (...args) => centreRef.current?.(...args) }), []);

  useEffect(() => {
    let live = true;
    const pts = points ?? REGION_POINTS;

    (async () => {
      const [{ default: L }, geo] = await Promise.all([import("leaflet"), loadGeo()]);
      const host = hostRef.current;
      if (!live || !host || mapRef.current) return;

      const calm = still || matchMedia("(prefers-reduced-motion: reduce)").matches;
      const map = L.map(host, {
        ...(still && {
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }),
        zoomControl: false,
        attributionControl: false,
        renderer: L.canvas({ padding: 0.5 }),
        minZoom: 7.75,
        maxZoom: Math.max(12, maxZoom),
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        // the bounds have to be larger than the viewport at minZoom on both axes, or Leaflet
        // re-centres and throws away the offset that keeps the region clear of the sheet
        maxBounds: [
          [50.2, 9.6],
          [54.7, 16.7],
        ],
        maxBoundsViscosity: 0.85,
        zoomAnimation: !calm,
        inertia: !calm,
        fadeAnimation: false,
      });
      mapRef.current = map;
      // a layer added before the map has a view throws, so put it somewhere first and fit below
      map.setView(REGION, REGION_ZOOM_MIN, { animate: false });
      // a named region, so the label belongs to something (a bare div cannot carry one)
      if (!still) {
        host.setAttribute("role", "region");
        host.setAttribute("aria-roledescription", "map");
        host.setAttribute("aria-label", `${mapLabel}. Arrow keys move it.`);
        tabStopRef.current();
      }

      const fill = (name: string) => () => ({
        stroke: false,
        fillColor: token(name),
        fillOpacity: 1,
      });
      const stroke = (name: string, weight: number, extra: object = {}) => () => ({
        color: token(name),
        weight,
        fill: false,
        lineCap: "round" as const,
        lineJoin: "round" as const,
        ...extra,
      });
      const styles = {
        wood: fill("--color-basemap-wood"),
        urban: fill("--color-basemap-urban"),
        water: fill("--color-basemap-water"),
        waterway: stroke("--color-basemap-water", 2),
        states: stroke("--color-basemap-border", 1.2, { dashArray: "6 4" }),
      };
      const roadStyle = (f?: GeoJSON.Feature) =>
        ({
          motorway: { color: token("--color-basemap-motorway"), weight: 3 },
          trunk: { color: token("--color-basemap-trunk"), weight: 2.5 },
          primary: { color: token("--color-basemap-road"), weight: 2 },
          rail: { color: token("--color-basemap-rail"), weight: 1, dashArray: "5 4" },
        })[f?.properties?.class as string] ?? {};

      for (const k of ["wood", "urban", "water", "waterway", "states"] as const) {
        L.geoJSON(geo[k], { style: styles[k], interactive: false }).addTo(map);
      }
      L.geoJSON(geo.roads, { style: roadStyle, interactive: false }).addTo(map);

      // The region data holds main roads only. A route is seen close up, so the tracks, ditches and
      // ponds it follows come from its own detail file, drawn in the same basemap colours.
      if (detail) {
        const kinds: Record<string, object> = {
          meadow: { stroke: false, fillColor: token("--color-basemap-wood"), fillOpacity: 0.45 },
          urban: { stroke: false, fillColor: token("--color-basemap-urban"), fillOpacity: 1 },
          wood: { stroke: false, fillColor: token("--color-basemap-wood"), fillOpacity: 1 },
          wetland: { stroke: false, fillColor: token("--color-basemap-water"), fillOpacity: 0.55 },
          water: { stroke: false, fillColor: token("--color-basemap-water"), fillOpacity: 1 },
          ditch: { color: token("--color-basemap-label-water"), weight: 0.8, opacity: 0.6, fill: false },
          river: { color: token("--color-basemap-label-water"), weight: 2, opacity: 0.7, fill: false },
          service: { color: token("--color-basemap-rail"), weight: 1, fill: false },
          track: { color: token("--color-basemap-label"), weight: 1, opacity: 0.55, dashArray: "4 3", fill: false },
          path: { color: token("--color-basemap-label"), weight: 1, opacity: 0.55, dashArray: "2 3", fill: false },
          street: { color: token("--color-basemap-road"), weight: 2, fill: false },
          road: { color: token("--color-basemap-trunk"), weight: 3, fill: false },
        };
        fetch(detail)
          .then((r) => r.json())
          .then((fc: GeoJSON.FeatureCollection) => {
            if (!live || mapRef.current !== map) return;
            const layer = L.geoJSON(fc, {
              style: (f) => ({ lineCap: "round", lineJoin: "round", ...kinds[f?.properties?.k as string] }),
              interactive: false,
            }).addTo(map);
            layer.bringToBack();
            // the region fills stay underneath, so the detail sits between them and the route
            routeLayers.forEach((l) => l.bringToFront());
          })
          .catch(() => {});
      }

      // the route itself: a lime line on a dark casing, so it reads over water and land alike
      const routeLayers: ReturnType<typeof L.polyline>[] = [];
      if (line) {
        routeLayers.push(
          L.polyline(line, { color: token("--color-ground"), weight: 9, opacity: 0.85, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map),
          L.polyline(line, { color: token("--color-primary"), weight: 4.5, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map),
        );
      }

      // Names, thinned as the map zooms out so they never pile up
      const labels: { marker: LeafletGeoJSON | ReturnType<typeof L.marker>; from: number }[] = [];
      const label = (lat: number, lon: number, kind: string, text: string, from: number) => {
        const marker = L.marker([lat, lon], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({
            className: "a1-lbl-anchor",
            iconSize: [0, 0],
            html: `<span class="a1-lbl a1-lbl-${kind}" aria-hidden="true">${esc(text)}</span>`,
          }),
        }).addTo(map);
        labels.push({ marker, from });
      };
      const places = geo.place as GeoJSON.FeatureCollection<GeoJSON.Point, { name: string; rank: number }>;
      for (const f of still ? [] : places.features) {
        const [lon, lat] = f.geometry.coordinates;
        const r = f.properties.rank;
        label(lat, lon, r <= 7 ? "city" : "town", f.properties.name, r <= 7 ? 0 : r <= 11 ? 8 : r <= 12 ? 9 : r <= 13 ? 10 : 11);
      }
      for (const [text, lat, lon, kind] of still ? [] : LABELS) label(lat, lon, kind, text, kind === "water" ? 9 : 0);

      // the card's clusters: dots on the same canvas, the biggest one larger, no counts to read
      if (still) {
        for (const { lat, lon, count = 0 } of pts) {
          L.circleMarker([lat, lon], {
            radius: count >= 100 ? 6 : 3.5,
            stroke: false,
            fillColor: token("--color-on-ground"),
            fillOpacity: 1,
            interactive: false,
          }).addTo(map);
        }
      }

      const showLabels = () => {
        const z = map.getZoom();
        for (const { marker, from } of labels) {
          const el = (marker as { getElement(): HTMLElement | undefined }).getElement()?.firstChild as
            | HTMLElement
            | undefined;
          el?.classList.toggle("is-hidden", z < from);
        }
      };

      const wide = matchMedia(DESKTOP);
      // on a tablet the suggestions dock their sheet to the left (app/tablet.css), so the free
      // space is beside it, as on the desktop; every other screen keeps the phone's
      const tablet = matchMedia(TABLET);
      const docked = !!host.closest(".sg");
      const side = () => wide.matches || (tablet.matches && docked);
      // what covers the map: the sheet on the phone and the tablet, the panel it moves into on the desktop
      const sheetEl = () =>
        (host.parentElement?.querySelector(wide.matches ? ".ms-panel" : ".ms-sheet") as HTMLElement | null) ?? null;
      const navEl = () => (document.querySelector(".tabbar-pill") as HTMLElement | null) ?? null;
      const barEl = () => (host.parentElement?.querySelector(".ms-bar") as HTMLElement | null) ?? null;
      // the phone keeps its bar over the map, the desktop moves it into the panel and the nav
      // pill takes that band instead; a docked tablet sheet has its bar above it, not over the map
      const bandEl = () => (wide.matches ? navEl() : side() ? null : barEl());

      const placePins = () => {
        if (still) return;
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const placed = pts.map((pt) => {
          const p = map.latLngToContainerPoint([pt.lat, pt.lon]);
          // inside the free box on both axes, with half a pin of margin on the side the
          // sheet is on, so a pin is never clipped by the screen edge or covered by the glass
          const free =
            p.x >= box.x + (side() ? PIN_EDGE : 0) &&
            p.x <= box.x + box.w &&
            p.y >= box.y &&
            p.y <= box.y + box.h - (side() ? 0 : PIN_EDGE);
          return { ...pt, x: p.x, y: p.y, free };
        });
        // When the map is too small for the route, its numbered discs pile up on each other and
        // on the start flag. Then none of them shows: the line alone reads better than a heap of
        // numbers, and the spots are listed in the sheet anyway.
        const discs = placed.filter((q) => q.n !== undefined || q.start);
        const cramped = discs.some((q, i) => discs.some((r, j) => j > i && Math.hypot(q.x - r.x, q.y - r.y) < SPOT_GAP));
        setPins(cramped ? placed.map((q) => (q.n !== undefined ? { ...q, free: false } : q)) : placed);
      };

      // Put a point in the middle of the space the sheet leaves free, not the middle of the
      // screen, so neither the region nor a cluster you tapped ends up under the glass.
      const centreOn = (lat: number, lon: number, zoom: number, animate: boolean) => {
        const r = { width: host.offsetWidth, height: host.offsetHeight };
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const off = L.point(r.width / 2 - (box.x + box.w / 2), r.height / 2 - (box.y + box.h / 2));
        map.setView(map.unproject(map.project([lat, lon], zoom).add(off), zoom), zoom, { animate });
      };
      // moving the map from a pin hands it over, the same as dragging it
      let taken = false;
      const centre: Centre = still
        ? null
        : (lat, lon, zoom, animate) => {
            taken = true;
            centreOn(lat, lon, zoom, animate);
          };
      centreRef.current = centre;
      map.on("dragstart", () => {
        taken = true;
      });
      // the welcome card has no sheet over it, so the whole region fits inside it
      const cluster = L.latLngBounds([...pts.map((pt) => [pt.lat, pt.lon] as [number, number]), ...(line ?? [])]);
      // the zoom at which every point fits the box, on whichever axis runs out first
      const zoomForBox = (box: { w: number; h: number }) => {
        const nw = map.project(cluster.getNorthWest(), 0);
        const se = map.project(cluster.getSouthEast(), 0);
        const w = Math.max(80, box.w - REGION_PAD * 2);
        const h = Math.max(80, box.h - REGION_PAD * 2);
        // down to the zoomSnap step, so the view is the same on every reload
        // at zoom 0 a region is a fraction of a pixel across, so the guard against two points on
        // the same line has to be smaller than any real span, not a whole pixel
        const span = (a: number, b: number) => Math.max(1e-9, b - a);
        const z = Math.log2(Math.min(w / span(nw.x, se.x), h / span(nw.y, se.y)));
        return Math.min(maxZoom, Math.floor(z * 4) / 4);
      };
      const fit = still
        ? () => map.fitBounds(cluster, { animate: false, padding: L.point(28, 28) })
        : () => {
            const box = freeBox(host, sheetEl(), bandEl(), side());
            const z = zoomForBox(box);
            // a box that cannot hold the whole region keeps the anchor the phone was drawn around,
            // rather than centring on clusters half of which would be off the band anyway. A
            // screen that brought its own points has no such anchor: they are all there is to show.
            const anchor = points || z >= REGION_ZOOM_MIN ? cluster.getCenter() : L.latLng(REGION[0], REGION[1]);
            centreOn(anchor.lat, anchor.lng, points ? z : Math.max(REGION_ZOOM_MIN, z), false);
          };

      map.on("move zoomend", placePins);
      map.on("zoomstart", () => setZooming(true));
      map.on("zoomend", () => setZooming(false));
      map.on("zoomend", showLabels);

      // The box the sheet leaves free is what the region is centred in, so the fit is only right
      // for the box it was measured against. The sheet can still be settling when the map first
      // measures it, and invalidateSize keeps the centre rather than the offset, so refit whenever
      // that box changes rather than only when the 64rem breakpoint flips. Once the person has
      // moved the map themselves it is theirs, and a resize must not pull it back.
      const boxKey = () => {
        const b = freeBox(host, sheetEl(), bandEl(), side());
        return `${b.x}:${b.y}:${b.w}:${b.h}`;
      };
      let fitted = "";
      const refit = () => {
        fit();
        fitted = boxKey();
      };

      refit();
      showLabels();
      placePins();

      const onResize = () => {
        map.invalidateSize({ animate: false });
        if (!taken && boxKey() !== fitted) refit();
        placePins();
      };
      // the sheet and the bar are watched too: either can change size while the map's own box does not
      const ro = new ResizeObserver(onResize);
      ro.observe(host);
      for (const el of [sheetEl(), barEl()]) if (el) ro.observe(el);
      map.once("unload", () => ro.disconnect());
    })().catch((err) => {
      console.error("[RegionMap]", err);
    });

    return () => {
      live = false;
      mapRef.current?.remove();
      mapRef.current = null;
      centreRef.current = null;
    };
  }, [still, points, maxZoom, line, detail, mapLabel]);

  // A spot's name goes on the side its route data prefers, unless that side runs into another
  // marker, a name already placed, the panel or the edge of the map; then it takes the other side.
  // Names are placed in walking order, so the earlier spot keeps its side when two compete.
  useLayoutEffect(() => {
    const host = hostRef.current;
    const scope = host?.parentElement;
    if (!host || !scope) return;
    const spots = [...scope.querySelectorAll<HTMLElement>(".map-spot")];
    if (!spots.length) return;
    const hit = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const bounds = host.getBoundingClientRect();
    const marks = [...scope.querySelectorAll<HTMLElement>(".spot-mark, .map-start, .map-start-label, .a1-here-dot")];
    const cover = [...scope.querySelectorAll<HTMLElement>(".ms-panel, .ms-sheet")].map((el) => el.getBoundingClientRect());
    const placed: DOMRect[] = [];
    for (const spot of spots) {
      const label = spot.querySelector<HTMLElement>(".map-spot-label");
      const mark = spot.querySelector<HTMLElement>(".spot-mark");
      if (!label || !mark || !label.offsetWidth || spot.style.visibility === "hidden") continue;
      const m = mark.getBoundingClientRect();
      const now = label.getBoundingClientRect();
      const cx = m.left + m.width / 2;
      // the room between the disc's centre and its name, read from wherever the name sits now
      const off = now.left >= cx ? now.left - cx : cx - now.right;
      const rect = (left: boolean) => new DOMRect(left ? cx - off - now.width : cx + off, now.top, now.width, now.height);
      const cost = (r: DOMRect) =>
        (r.left < bounds.left || r.right > bounds.right ? 2 : 0) +
        cover.filter((c) => hit(r, c)).length * 2 +
        marks.filter((el) => !mark.contains(el) && hit(r, el.getBoundingClientRect())).length +
        placed.filter((p) => hit(r, p)).length;
      const prefersLeft = spot.classList.contains("is-left");
      const [a, b] = [rect(prefersLeft), rect(!prefersLeft)];
      const left = cost(b) < cost(a) ? !prefersLeft : prefersLeft;
      spot.dataset.side = left ? "left" : "right";
      placed.push(left ? (prefersLeft ? a : b) : prefersLeft ? b : a);
    }
  }, [pins, zooming]);

  // the tab stop follows `behind` and the width without rebuilding the map
  useEffect(() => {
    const wide = matchMedia(DESKTOP);
    const set = () => {
      const host = hostRef.current;
      if (host && !still && host.getAttribute("role") === "region") host.tabIndex = behind && !wide.matches ? -1 : 0;
    };
    tabStopRef.current = set;
    set();
    wide.addEventListener("change", set);
    return () => wide.removeEventListener("change", set);
  }, [behind, still]);

  return (
    <>
      <div ref={hostRef} className={className} />
      {!still &&
        pins.map((pin) => {
          const style = {
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            // the enter animation keeps opacity applied, and an animation beats an inline style,
            // so a pin that is off the free space or mid-zoom hides with visibility instead
            visibility: zooming || !pin.free ? ("hidden" as const) : undefined,
          };

          // a spot on the route: a lime disc numbered in walking order, its name beside it. It opens
          // the spot's page where there is one, and otherwise its row further down the same page.
          if (pin.n !== undefined) {
            const body = (
              <>
                <span className="spot-mark">{pin.n}</span>
                <span className="map-spot-label" aria-hidden="true">
                  {pin.label}
                </span>
              </>
            );
            const cls = `map-spot${pin.left ? " is-left" : ""}${pin.current ? " is-current" : ""}${pin.out ? " is-out" : ""}`;
            return pin.href ? (
              <Link key={pin.id} href={pin.href} className={cls} style={style} aria-label={`Spot ${pin.n}, ${pin.label}`}>
                {body}
              </Link>
            ) : (
              <a key={pin.id} href={`#spot-${pin.n}`} className={cls} style={style} aria-label={`Spot ${pin.n}, ${pin.label}`}>
                {body}
              </a>
            );
          }
          if (pin.start) {
            return (
              <div key={pin.id} className="map-start" style={style} role="img" aria-label={pin.label}>
                <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 21V4" />
                  <path d="M6 4h11l-2 4 2 4H6" />
                </svg>
                <span className="map-start-label" aria-hidden="true">
                  Start and finish
                </span>
              </div>
            );
          }

          // a route on A5's map: its name and how many spots are in season, in a glass label
          if (pin.tag !== undefined) {
            const body = (
              <>
                <b>{pin.name}</b>
                <span>{pin.tag}</span>
              </>
            );
            return pin.href ? (
              <Link key={pin.id} href={pin.href} className={`map-route glass glass-pin${pin.id === hot ? " is-hot" : ""}`} style={style} aria-label={pin.label}>
                {body}
              </Link>
            ) : (
              <div key={pin.id} className={`map-route glass glass-pin${pin.id === hot ? " is-hot" : ""}`} style={style} role="img" aria-label={pin.label}>
                {body}
              </div>
            );
          }

          // the person's own position is a mark, not a control: a dot with its name beside it
          if (pin.here) {
            return (
              <div key={pin.id} className="a1-here" style={style}>
                <span className="a1-here-dot" />
                <span className="a1-here-label">{pin.label}</span>
              </div>
            );
          }

          return (
            <button
              key={pin.id}
              type="button"
              className={`a1-pin glass glass-pin${pin.count === undefined ? " a1-pin-place" : ""}${pin.current ? " is-current" : ""}`}
              aria-current={pin.current ? "true" : undefined}
              style={style}
              aria-label={pin.label}
              onClick={() =>
                pin.href ? router.push(pin.href) : centreRef.current?.(
                  pin.lat,
                  pin.lon,
                  pin.count === undefined ? 12 : 10.5,
                  !matchMedia("(prefers-reduced-motion: reduce)").matches,
                )
              }
            >
              {pin.count ?? (
                <svg width="1rem" height="1rem" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
                  <path d="M5 19 13 11" />
                </svg>
              )}
            </button>
          );
        })}
      <p className={still ? "a02-credit" : "a1-credit"}>Map data © OpenStreetMap contributors</p>
    </>
  );
}
