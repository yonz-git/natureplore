import RegionMap from "@/components/RegionMap";

// A1 · Start sheet, the first open of the map: Berlin and Brandenburg with their count pins, and
// the sheet that offers location, search or browsing. The map is real OSM geometry drawn by
// Leaflet (components/RegionMap.tsx), the glass recipe is app/glass.css, the layout app/a1.css.

export default function MapHome() {
  return (
    <section className="a1">
      <RegionMap className="a1-map" />

      <div className="a1-sheet glass glass-top glass-card">
        <div className="a1-handle" aria-hidden="true" />
        <h1 className="a1-title">
          See what lives <em>around you</em>
        </h1>

        <div className="a1-actions">
          <label htmlFor="q" className="sr-only">
            Search for a region
          </label>
          <div className="a1-field">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5 20.5 20.5" />
            </svg>
            <input id="q" type="search" placeholder="Search for a region" />
          </div>

          <button type="button" className="a1-btn a1-btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.5 3.5 3.5 10.6l7.2 2.2 2.2 7.2z" />
            </svg>
            Use my location
          </button>

          <button type="button" className="a1-btn a1-btn-outline">
            Browse Berlin and Brandenburg
          </button>
        </div>

        <p className="a1-note">Location stays on this device. No account needed.</p>
      </div>
    </section>
  );
}
