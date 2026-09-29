"use client";

// A7 · Map home, saved spots and routes: what the person saved on this device, nearest first, on
// the map as route pins around them. The first two show, "Show all" opens the rest in place.
// From 64rem the panel adds the group filter. Boards: A7, phone and desktop, version 6.

import { useMemo, useRef, useState } from "react";

import { ChevronIcon } from "@/components/Icons";
import { MapTools, PanelLogo, SavedCard, SearchField, Segment } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { GROUPS, HERE, SAVED, type Group } from "@/lib/routes";
import { savedItems, useSaved } from "@/lib/saved";

// every thing that can be saved has a pin, so the map is built once and does not follow the list
const POINTS: MapPoint[] = [
  { id: "here", lat: HERE.lat, lon: HERE.lon, label: "You are here", here: true },
  ...SAVED.map((s) => ({ id: s.id, lat: s.lat, lon: s.lon, label: `${s.name}, show on the map` })),
];

const FIRST = 2;

export default function SavedScreen() {
  const map = useRef<MapHandle>(null);
  const { ids } = useSaved();
  const [group, setGroup] = useState<Group | null>(null);
  const [all, setAll] = useState(false);

  const items = useMemo(() => {
    const list = savedItems(ids);
    return group ? list.filter((s) => s.counts[group]) : list;
  }, [ids, group]);
  const shown = all ? items : items.slice(0, FIRST);
  const count = savedItems(ids).length;

  return (
    <section className="ms a7">
      <RegionMap className="a1-map" ref={map} points={POINTS} maxZoom={11} />

      <div className="ms-panel glass-desk">
        <PanelLogo />
        <div className="ms-bar">
          <SearchField />
          <Segment />
        </div>

        <div className="ms-sheet glass-phone" aria-labelledby="saved-title">
          <div className="ms-handle" aria-hidden="true" />
          <div className="chips chips-desk" role="group" aria-label="Filter by group">
            <button type="button" className="chip" aria-pressed={group === null} onClick={() => setGroup(null)}>
              All
            </button>
            {GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                className="chip"
                aria-pressed={group === g.id}
                onClick={() => setGroup(group === g.id ? null : g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div>
            <h1 id="saved-title" className="ms-title">
              Saved <em>spots and routes</em>
            </h1>
            <p className="ms-lead">
              {count === 0
                ? "Nothing saved on this device yet. The bookmark on a route or a spot keeps it here."
                : `${count} saved on this device, sorted by distance`}
            </p>
          </div>

          <div className="ms-list">
            {shown.map((s) => (
              <SavedCard key={s.id} item={s} />
            ))}
          </div>

          {!all && items.length > FIRST && (
            <button type="button" className="btn btn-secondary btn-chev is-closing" onClick={() => setAll(true)}>
              Show all {items.length} saved spots and routes
              <ChevronIcon size={18} />
            </button>
          )}
        </div>
      </div>

      <MapTools
        locate={() => map.current?.centre(HERE.lat, HERE.lon, 12, !matchMedia("(prefers-reduced-motion: reduce)").matches)}
      />
    </section>
  );
}
