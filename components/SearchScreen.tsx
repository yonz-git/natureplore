"use client";

// A2 · Search for a region, results, and A3 · no match. The results follow the field as it is
// typed in. A mapped region opens A5, one that is not mapped opens A6, and a miss offers the
// nearest spellings. On the phone search takes the screen, as the keyboard does; on the desktop
// it is the panel beside the map. Boards: A2 and A3, phone and desktop, version 6.

import Link from "next/link";
import { useMemo, useState } from "react";

import { BackIcon, LocationIcon } from "@/components/Icons";
import { useLocationPrompt } from "@/components/LocationDialog";
import { RegionRow, SearchField } from "@/components/MapParts";
import RegionMap from "@/components/RegionMap";
import { searchRegions, suggestRegions } from "@/lib/routes";

export default function SearchScreen({ query }: { query: string }) {
  const [q, setQ] = useState(query);
  const { ask, prompt } = useLocationPrompt("/map/region");

  const results = useMemo(() => searchRegions(q), [q]);
  const suggestions = useMemo(() => (results.length ? [] : suggestRegions(q)), [q, results]);
  const miss = q.trim() !== "" && results.length === 0;

  const useLocation = (
    <button type="button" className={`float-pill glass glass-pill${miss ? " is-after" : ""}`} onClick={ask}>
      <LocationIcon size={18} />
      Use my location instead
    </button>
  );

  return (
    <section className="ms search">
      <RegionMap className="a1-map" />

      <div className="ms-panel glass-desk">
        <Link href="/map" className="ms-back-desk">
          <BackIcon size={18} />
          Map
        </Link>
        <div className="ms-bar">
          <div className="ms-bar-row">
            <Link href="/map" className="round glass glass-pin ms-back-phone" aria-label="Back to the map">
              <BackIcon size={20} />
            </Link>
            <SearchField label="Search for a region" defaultValue={query} autoFocus onChange={setQ} />
          </div>
          {!miss && useLocation}
        </div>

        <div className="ms-sheet" aria-live="polite">
          {results.length > 0 && (
            <section className="search-results glass-phone" aria-labelledby="regions-label">
              <h2 id="regions-label" className="rows-label">
                Regions
              </h2>
              <ul className="rows">
                {results.map((r) => (
                  <RegionRow key={r.name} region={r} />
                ))}
              </ul>
            </section>
          )}

          {miss && (
            <>
              <div className="search-miss">
                <h1 className="ms-title">
                  No regions match <em>“{q.trim()}”</em>
                </h1>
                <p className="ms-lead">Check the spelling, or try another region.</p>
              </div>
              {suggestions.length > 0 && (
                <section className="search-results is-compact glass-phone" aria-labelledby="suggest-label">
                  <h2 id="suggest-label" className="rows-label">
                    Did you mean
                  </h2>
                  <ul className="rows">
                    {suggestions.map((r) => (
                      <RegionRow key={r.name} region={r} />
                    ))}
                  </ul>
                </section>
              )}
              {useLocation}
            </>
          )}
        </div>
      </div>
      {prompt}
    </section>
  );
}
