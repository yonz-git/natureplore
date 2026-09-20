"use client";

// The pieces every map screen is built from, so the same control reads the same on A1 to A7:
// the search field at the top, the group filter, a place in a list, and the small icons the
// screens share. Layout lives in app/map.css, the glass recipe in app/glass.css.

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GROUPS, countLine, type Place } from "@/lib/places";

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20.5 20.5" />
    </svg>
  );
}

export function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 3.5 3.5 10.6l7.2 2.2 2.2 7.2z" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

/**
 * The field at the top of every map screen. Submitting it goes to the search screen, which is
 * what A2 and A3 are, so the same field opens the results from wherever it is typed in.
 */
export function MapSearchField({
  label = "Search places or species",
  defaultValue = "",
  autoFocus = false,
  /** a field resting on a glass sheet is a tint, one floating over the map is a pane of its own */
  tone = "sheet",
  onClear,
}: {
  label?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  tone?: "sheet" | "float";
  onClear?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      className="map-search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/map/search?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <label htmlFor="map-q" className="sr-only">
        {label}
      </label>
      <div className={`a1-field${tone === "float" ? " is-float glass glass-pill" : ""}`}>
        <SearchIcon />
        <input
          id="map-q"
          type="search"
          placeholder={label}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="map-clear"
            aria-label="Clear"
            onClick={() => {
              setValue("");
              onClear?.();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 9l6 6M15 9l-6 6" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

/** All, Plants, Herbs, Mushrooms, Birds: narrows the list to one group. */
export function GroupFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="map-chips" role="group" aria-label="Filter by group">
      {GROUPS.map((g) => (
        <button
          key={g.id}
          type="button"
          className={`map-chip${g.id === value ? " is-on" : " glass glass-pin"}`}
          aria-pressed={g.id === value}
          onClick={() => onChange(g.id)}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}

/**
 * One place in a list. The second line is the distance when the person's location is known and
 * the region when it is not, which is the difference between the A4 list and the A5 one.
 */
export function PlaceRow({
  place,
  distance,
  saved,
  onToggleSave,
}: {
  place: Place;
  distance: boolean;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <li className="map-row">
      {/* B2, the place page, is not built yet, so the row is a control with nowhere to go rather
          than a link that would drop the person back at the start. */}
      <button type="button" className="map-row-open" aria-label={`${place.name}, open place page`}>
        <span className="map-row-tile">
          {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 56 tile of a 12KB file:
              the optimiser would add a round trip and lazy loading for nothing */}
          {place.image && <img src={place.image} alt="" width={120} height={120} />}
        </span>
        <span className="map-row-text">
          <span className="map-row-name">{place.name}</span>
          <span className="map-row-meta">
            {place.habitat}, {distance ? `${place.km} km` : place.region}
          </span>
          {place.notable && <span className="map-row-notable">{place.notable}</span>}
          <span className="map-row-meta">{countLine(place.counts)}</span>
        </span>
      </button>
      <button
        type="button"
        className="map-row-save"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
        onClick={onToggleSave}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
    </li>
  );
}
