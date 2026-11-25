"use client";

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
const TABLET = "(min-width: 35.75rem) and (max-width: 63.99rem) and (min-height: 36rem)";
const REGION_ZOOM_MIN = 8.25;
const REGION_ZOOM_MAX = 10;
const REGION_PAD = 56;
const REGION: [number, number] = [52.55, 13.15];

export type MapPoint = {
  id: string;
  lat: number;
  lon: number;
  count?: number;
  label: string;
  here?: boolean;
  href?: string;
  current?: boolean;
  n?: number;
  startText?: string;
  out?: boolean;
  start?: boolean;
  left?: boolean;
  tag?: string;
  name?: string;
};

const REGION_POINTS: MapPoint[] = CLUSTERS.map(([count, lat, lon, where]) => ({
  id: `c${count}`,
  lat,
  lon,
  count,
  label: `${count} routes ${where}, zoom in`,
}));

const SPOT_GAP = 40;
type Pin = MapPoint & { x: number; y: number; free: boolean };

type Centre = ((lat: number, lon: number, zoom: number, animate: boolean) => void) | null;

export type MapHandle = {
  centre: (lat: number, lon: number, zoom: number, animate: boolean) => void;
  show: (to: { lat: number; lon: number }[], cap: number) => void;
  reset: () => void;
};
type Fly = { show: MapHandle["show"]; reset: MapHandle["reset"] } | null;

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

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

function freeBox(host: HTMLElement, sheet: HTMLElement | null, band: HTMLElement | null, desktop: boolean) {
  const w = host.offsetWidth;
  const h = host.offsetHeight;
  if (!sheet) return { x: 0, y: 0, w, h };
  const top = band ? band.offsetTop + band.offsetHeight : 0;
  if (!desktop) return { x: 0, y: top, w, h: Math.max(1, sheet.offsetTop - top) };
  const right = sheet.offsetLeft + sheet.offsetWidth;
  return { x: right, y: top, w: Math.max(1, w - right), h: Math.max(1, h - top) };
}

const PIN_EDGE = 24;

export default function RegionMap({
  className,
  still = false,
  fixedZoom = false,
  points,
  maxZoom = REGION_ZOOM_MAX,
  line,
  detail,
  mapLabel = "Map of Berlin and Brandenburg",
  behind = false,
  hot,
  current,
  focus,
  ref,
}: {
  className?: string;
  still?: boolean;
  fixedZoom?: boolean;
  points?: MapPoint[];
  maxZoom?: number;
  line?: [number, number][];
  detail?: string;
  mapLabel?: string;
  behind?: boolean;
  hot?: string;
  current?: string;
  focus?: { lat: number; lon: number; zoom: number };
  ref?: React.Ref<MapHandle>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const router = useRouter();
  const [zooming, setZooming] = useState(false);
  const centreRef = useRef<Centre>(null);
  const tabStopRef = useRef<() => void>(() => {});
  const flyRef = useRef<Fly>(null);
  const focusRef = useRef(focus);
  useLayoutEffect(() => {
    focusRef.current = focus;
  });
  useImperativeHandle(
    ref,
    () => ({
      centre: (...args) => centreRef.current?.(...args),
      show: (...args) => flyRef.current?.show(...args),
      reset: () => flyRef.current?.reset(),
    }),
    [],
  );

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
        ...(fixedZoom && {
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboardZoomOffset: 0,
        }),
        zoomControl: false,
        attributionControl: false,
        renderer: L.canvas({ padding: 0.5 }),
        minZoom: 7.75,
        maxZoom: Math.max(12, maxZoom),
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
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
      map.setView(REGION, REGION_ZOOM_MIN, { animate: false });
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
            routeLayers.forEach((l) => l.bringToFront());
          })
          .catch(() => {});
      }

      const routeLayers: ReturnType<typeof L.polyline>[] = [];
      if (line) {
        routeLayers.push(
          L.polyline(line, { color: token("--color-ground"), weight: 9, opacity: 0.85, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map),
          L.polyline(line, { color: token("--color-primary"), weight: 4.5, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map),
        );
      }

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
      const tablet = matchMedia(TABLET);
      const docked = !!host.closest(".sg, .b1");
      const side = () => wide.matches || (tablet.matches && docked);
      const centred = () => !!host.closest(".a1");
      const sheetEl = () =>
        centred()
          ? null
          : ((host.parentElement?.querySelector(wide.matches ? ".ms-panel" : ".ms-sheet") as HTMLElement | null) ?? null);
      const coverBox = () => {
        const words = centred() ? host.parentElement?.querySelector<HTMLElement>(".a1-words") : null;
        if (!words) return null;
        const r = words.getBoundingClientRect();
        const h = host.getBoundingClientRect();
        return { l: r.left - h.left - PIN_EDGE, r: r.right - h.left + PIN_EDGE, t: r.top - h.top - PIN_EDGE, b: r.bottom - h.top + PIN_EDGE };
      };
      const navEl = () => (document.querySelector(".tabbar-pill") as HTMLElement | null) ?? null;
      const barEl = () => (host.parentElement?.querySelector(".ms-bar") as HTMLElement | null) ?? null;
      const bandEl = () => (wide.matches ? navEl() : side() ? null : barEl());

      const placePins = () => {
        if (still) return;
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const cover = coverBox();
        if (cover) {
          const hr = host.getBoundingClientRect();
          const pad = PIN_EDGE / 2;
          for (const { marker } of labels) {
            const el = (marker as { getElement(): HTMLElement | undefined }).getElement()?.firstChild as
              | HTMLElement
              | undefined;
            if (!el) continue;
            const r = el.getBoundingClientRect();
            const l = r.left - hr.left;
            const t = r.top - hr.top;
            const under = l + r.width > cover.l + pad && l < cover.r - pad && t + r.height > cover.t + pad && t < cover.b - pad;
            el.classList.toggle("is-covered", under);
          }
        }
        const nav = centred() && !wide.matches ? navEl() : null;
        if (nav) box.h = Math.max(1, nav.getBoundingClientRect().top - host.getBoundingClientRect().top - box.y - PIN_EDGE);
        const placed = pts.map((pt) => {
          const p = map.latLngToContainerPoint([pt.lat, pt.lon]);
          const free =
            p.x >= box.x + (side() ? PIN_EDGE : 0) &&
            p.x <= box.x + box.w &&
            p.y >= box.y &&
            p.y <= box.y + box.h - (side() ? 0 : PIN_EDGE) &&
            !(cover && p.x > cover.l && p.x < cover.r && p.y > cover.t && p.y < cover.b);
          return { ...pt, x: p.x, y: p.y, free };
        });
        const discs = placed.filter((q) => q.n !== undefined || q.start);
        const cramped = discs.some((q, i) => discs.some((r, j) => j > i && Math.hypot(q.x - r.x, q.y - r.y) < SPOT_GAP));
        setPins(cramped ? placed.map((q) => (q.n !== undefined ? { ...q, free: false } : q)) : placed);
      };

      const centreOn = (lat: number, lon: number, zoom: number, animate: boolean) => {
        const r = { width: host.offsetWidth, height: host.offsetHeight };
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const off = L.point(r.width / 2 - (box.x + box.w / 2), r.height / 2 - (box.y + box.h / 2));
        map.setView(map.unproject(map.project([lat, lon], zoom).add(off), zoom), zoom, { animate });
      };
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
      const cluster = L.latLngBounds([...pts.map((pt) => [pt.lat, pt.lon] as [number, number]), ...(line ?? [])]);
      const zoomForBox = (box: { w: number; h: number }, bounds = cluster, cap = maxZoom) => {
        const nw = map.project(bounds.getNorthWest(), 0);
        const se = map.project(bounds.getSouthEast(), 0);
        const w = Math.max(80, box.w - REGION_PAD * 2);
        const h = Math.max(80, box.h - REGION_PAD * 2);
        const span = (a: number, b: number) => Math.max(1e-9, b - a);
        const z = Math.log2(Math.min(w / span(nw.x, se.x), h / span(nw.y, se.y)));
        return Math.min(cap, Math.floor(z * 4) / 4);
      };
      const fitView = () => {
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const z = zoomForBox(box);
        const anchor = points || z >= REGION_ZOOM_MIN ? cluster.getCenter() : L.latLng(REGION[0], REGION[1]);
        return { lat: anchor.lat, lon: anchor.lng, zoom: points ? z : Math.max(REGION_ZOOM_MIN, z) };
      };
      const fit = still
        ? () => map.fitBounds(cluster, { animate: false, padding: L.point(28, 28) })
        : () => {
            const v = fitView();
            centreOn(v.lat, v.lon, v.zoom, false);
          };
      const flyTo = (lat: number, lon: number, zoom: number) => {
        if (calm) return centreOn(lat, lon, zoom, false);
        const box = freeBox(host, sheetEl(), bandEl(), side());
        const off = L.point(host.offsetWidth / 2 - (box.x + box.w / 2), host.offsetHeight / 2 - (box.y + box.h / 2));
        map.flyTo(map.unproject(map.project([lat, lon], zoom).add(off), zoom), zoom, { duration: 0.9 });
      };

      map.on("move zoomend", placePins);
      requestAnimationFrame(() => host.classList.add("is-ready"));
      map.on("zoomstart", () => setZooming(true));
      map.on("zoomend", () => setZooming(false));
      map.on("zoomend", showLabels);

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
      const f = focusRef.current;
      if (f && !still) {
        taken = true;
        centreOn(f.lat, f.lon, f.zoom, false);
      }
      showLabels();
      placePins();

      flyRef.current = still
        ? null
        : {
            show: (to, cap) => {
              if (!to.length) return;
              taken = true;
              const bounds = L.latLngBounds(to.map((t) => [t.lat, t.lon] as [number, number]));
              const c = bounds.getCenter();
              flyTo(c.lat, c.lng, zoomForBox(freeBox(host, sheetEl(), bandEl(), side()), bounds, cap));
            },
            reset: () => {
              taken = false;
              const v = fitView();
              flyTo(v.lat, v.lon, v.zoom);
              fitted = boxKey();
            },
          };

      const onResize = () => {
        map.invalidateSize({ animate: false });
        if (!taken && boxKey() !== fitted) refit();
        placePins();
      };
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
      flyRef.current = null;
    };
  }, [still, fixedZoom, points, maxZoom, line, detail, mapLabel]);

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
        pins.map((pin, i) => {
          const style = {
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            "--i": Math.min(i, 8),
            visibility: zooming || !pin.free ? ("hidden" as const) : undefined,
          };

          if (pin.n !== undefined) {
            const body = (
              <>
                <span className="spot-mark">{pin.n}</span>
                <span className="map-spot-label" aria-hidden="true">
                  {pin.label}
                </span>
              </>
            );
            const now = pin.current || pin.id === current;
            const cls = `map-spot${pin.left ? " is-left" : ""}${now ? " is-current" : ""}${pin.out ? " is-out" : ""}`;
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
                  {}
                  <path d="M6.5 20.5V3.5" />
                  <path d="M6.5 3.5h11l-2 4 2 4H6.5" />
                </svg>
                <span className="map-start-label" aria-hidden="true">
                  {pin.startText ?? "Start and finish"}
                </span>
              </div>
            );
          }

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

          if (pin.here) {
            return (
              <div key={pin.id} className="a1-here" style={style}>
                <span className="a1-here-dot" />
                <span className="a1-here-label">{pin.label}</span>
              </div>
            );
          }

          const glow = fixedZoom && pin.count !== undefined;
          return (
            <button
              key={pin.id}
              type="button"
              className={glow ? "a1-pin a1-pin-glow" : `a1-pin glass glass-pin${pin.count === undefined ? " a1-pin-place" : ""}${pin.current ? " is-current" : ""}`}
              aria-current={pin.current ? "true" : undefined}
              style={style}
              aria-label={fixedZoom ? pin.label.replace(", zoom in", "") : pin.label}
              onClick={() =>
                pin.href ? router.push(pin.href) : centreRef.current?.(
                  pin.lat,
                  pin.lon,
                  fixedZoom ? mapRef.current?.getZoom() ?? 10 : pin.count === undefined ? 12 : 10.5,
                  !matchMedia("(prefers-reduced-motion: reduce)").matches,
                )
              }
            >
              {glow ? <span className="glow-dot" aria-hidden="true" /> : pin.count !== undefined ? <span className="a1-pin-num">{pin.count}</span> : (
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
