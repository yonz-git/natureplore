"use client";

// A2 · Search for a region, results, and A3 · no match, which is the same screen once nothing
// matches: the heading names what was typed, and the nearest spellings are offered instead.
// Every result says how many places are mapped there, or that none are, so picking one is never
// a guess. On the desktop the map stays behind the panel, as it does on every other A screen.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LocationDialog from "@/components/LocationDialog";
import { LocationIcon, PinIcon, SearchIcon } from "@/components/MapParts";
import RegionMap from "@/components/RegionMap";
import { placeLine, regionHref, searchRegions, type Region } from "@/lib/places";
import { useIsDesktop } from "@/lib/useIsDesktop";

export default function SearchScreen({ query }: { query: string }) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [value, setValue] = useState(query);
  const [asking, setAsking] = useState(false);

  const { results, suggestions } = searchRegions(value);
  const empty = value.trim().length >= 2 && results.length === 0;

  return (
    <section className="a1 search-screen">
      {/* The phone gives the whole screen to the results, the way the boards do, so the map is
          only drawn where there is room for it beside the panel. */}
      {desktop && <RegionMap className="a1-map" />}

      <div className="a1-sheet search-panel glass glass-top glass-card">
        <div className="search-head">
          <Link href="/map" className="search-back glass glass-pill" aria-label="Back to the start">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </Link>

          <form
            className="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results.length === 1) router.push(regionHref(results[0]));
            }}
          >
            <label htmlFor="q" className="sr-only">
              Search for a region
            </label>
            <div className="a1-field glass glass-pill">
              <SearchIcon />
              <input
                id="q"
                type="search"
                placeholder="Search for a region"
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
              />
              {value && (
                <button type="button" className="map-clear" aria-label="Clear" onClick={() => setValue("")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 9l6 6M15 9l-6 6" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>

        <button type="button" className="search-instead" onClick={() => setAsking(true)}>
          <LocationIcon />
          <span>Use my location instead</span>
        </button>

        {empty ? (
          <>
            <h1 className="a1-title search-title">
              No places match <em>“{value.trim()}”</em>
            </h1>
            <p className="search-note">Check the spelling, or try another region.</p>
            {suggestions.length > 0 && <ResultList label="Did you mean" regions={suggestions} />}
          </>
        ) : (
          results.length > 0 && <ResultList label="Places" regions={results} />
        )}
      </div>

      {asking && (
        <LocationDialog onAllow={() => router.push("/map/near-you")} onDecline={() => setAsking(false)} />
      )}
    </section>
  );
}

function ResultList({ label, regions }: { label: string; regions: Region[] }) {
  return (
    <div className="search-results glass glass-card">
      <p className="search-results-label">{label}</p>
      <ul>
        {regions.map((r) => (
          <li key={r.name}>
            <Link href={regionHref(r)} className={`search-result${r.places === 0 ? " is-empty" : ""}`}>
              <span className="search-result-mark">
                <PinIcon />
              </span>
              <span className="search-result-text">
                <span className="search-result-name">{r.name}</span>
                <span className="search-result-meta">{placeLine(r)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
