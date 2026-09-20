"use client";

// A4, A5 and A7 are one screen in three states: the map with what is on it, and a sheet listing
// the places it is showing. What changes between them is the heading, whether a place is a
// distance or a region away, and what the map is asked to draw.
//
//   near    A4 · Map home, near you, after the person allows their location
//   region  A5 · Map home, location off, the launch region or a searched one
//   saved   A7 · Map home, saved places only
//
// Layout is app/map.css, the sheet reuses .a1-sheet so the map still measures the space it leaves.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import LocationDialog from "@/components/LocationDialog";
import { GroupFilter, LocationIcon, MapSearchField, PlaceRow } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { HERE, NEARBY, PLACES, TOTAL_PLACES, type Place } from "@/lib/places";

type Variant = "near" | "region" | "saved";

const NEAR_PLACES = PLACES.filter((p) => p.km <= 15);
const SAVED_PLACES = PLACES.filter((p) => p.saved);

const here: MapPoint = { id: "here", lat: HERE[0], lon: HERE[1], label: "You are here", here: true };

const placePoints = (places: Place[]): MapPoint[] =>
  places.map((p) => ({ id: p.id, lat: p.lat, lon: p.lon, label: `${p.name}, centre the map on it` }));

// Module constants, not values built while rendering: a new array would tear the map down and
// build it again on every render.
const NEAR_POINTS: MapPoint[] = [
  here,
  ...placePoints(NEAR_PLACES),
  ...NEARBY.map(([lat, lon], i) => ({
    id: `n${i}`,
    lat,
    lon,
    label: "A recorded place, centre the map on it",
  })),
];
const SAVED_POINTS: MapPoint[] = [here, ...placePoints(SAVED_PLACES)];

export default function MapScreen({ variant, region }: { variant: Variant; region?: string }) {
  const router = useRouter();
  const [group, setGroup] = useState("all");
  const [saved, setSaved] = useState(() => new Set(PLACES.filter((p) => p.saved).map((p) => p.id)));
  const [asking, setAsking] = useState(false);
  const map = useRef<MapHandle>(null);

  const places = useMemo(() => {
    const list =
      variant === "near" ? NEAR_PLACES : variant === "saved" ? SAVED_PLACES : PLACES.filter((p) => p.notable);
    return group === "all" ? list : list.filter((p) => p.counts[group as keyof Place["counts"]]);
  }, [variant, group]);

  const distance = variant !== "region";
  const locating = variant !== "region";

  const heading =
    variant === "near"
      ? ["Recorded places", "near you"]
      : variant === "saved"
        ? ["Saved", "places"]
        : ["Worth seeing in", region ?? "Berlin and Brandenburg"];

  const sub =
    variant === "near"
      ? "Sorted by distance"
      : variant === "saved"
        ? `${SAVED_PLACES.length} saved on this device, sorted by distance`
        : "Sorted by what is notable this season";

  return (
    <section className="a1 map-screen">
      <RegionMap
        className="a1-map"
        ref={map}
        points={variant === "near" ? NEAR_POINTS : variant === "saved" ? SAVED_POINTS : undefined}
        maxZoom={locating ? 11.5 : undefined}
      />

      <div className="map-top">
        <MapSearchField tone="float" />
        <GroupFilter value={group} onChange={setGroup} />

        {/* A5 says plainly that it is showing a region rather than the person, and offers the way out */}
        {!locating && (
          <p className="map-state glass glass-pill">
            <LocationIcon />
            <span>Location off</span>
            <button type="button" className="map-state-action" onClick={() => setAsking(true)}>
              Use my location
            </button>
          </p>
        )}
      </div>

      <div className="map-tools">
        {variant === "saved" ? (
          <Link href="/map/near-you" className="map-tool is-on glass glass-pill" aria-current="page">
            <BookmarkIcon />
            <span className="map-tool-label">Saved</span>
          </Link>
        ) : (
          <Link href="/map/saved" className="map-tool glass glass-pill" aria-label="Saved places">
            <BookmarkIcon />
            <span className="map-tool-label">Saved</span>
          </Link>
        )}
        {locating && (
          <button
            type="button"
            className="map-tool is-round glass glass-pill"
            aria-label="Centre the map on me"
            onClick={() => map.current?.centre(HERE[0], HERE[1], 11.5, !matchMedia("(prefers-reduced-motion: reduce)").matches)}
          >
            <TargetIcon />
          </button>
        )}
      </div>

      <div className="a1-sheet map-sheet glass glass-top glass-card">
        <div className="a1-handle" aria-hidden="true" />
        <h1 className="a1-title map-title">
          {heading[0]} <em>{heading[1]}</em>
        </h1>
        <p className="map-sub">{sub}</p>

        {variant === "near" && (
          <div className="map-season">
            <span className="map-season-label">Notable this season</span>
            <button type="button" className="map-chip is-quiet">
              Autumn fungi
            </button>
            <button type="button" className="map-chip is-quiet">
              Late meadow flowers
            </button>
          </div>
        )}

        <ul className="map-list">
          {places.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              distance={distance}
              saved={saved.has(place.id)}
              onToggleSave={() =>
                setSaved((was) => {
                  const next = new Set(was);
                  if (!next.delete(place.id)) next.add(place.id);
                  return next;
                })
              }
            />
          ))}
        </ul>

        {variant === "saved" ? (
          <Link href="/map/near-you" className="a1-btn a1-btn-outline map-all">
            Show all {TOTAL_PLACES} places
          </Link>
        ) : (
          // The full list is its own screen and is not drawn yet, so this leads nowhere for now.
          <button type="button" className="a1-btn a1-btn-outline map-all">
            Show all {TOTAL_PLACES} places{variant === "near" ? ", nearest first" : " as a list"}
          </button>
        )}
      </div>

      {asking && (
        <LocationDialog onAllow={() => router.push("/map/near-you")} onDecline={() => setAsking(false)} />
      )}
    </section>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    </svg>
  );
}
