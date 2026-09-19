import Link from "next/link";

import MapSketch from "@/components/MapSketch";

// A1 · Start sheet, the first open of the map: the region with its count pins, and the sheet
// that offers location, search or browsing. Glass recipe: app/glass.css, layout: app/a1.css.

// counts sit at a share of the screen, inside the map band above the sheet, so the
// cluster keeps its shape at any width
const PINS = [
  { count: 164, x: 50, y: 24 },
  { count: 48, x: 57, y: 12 },
  { count: 36, x: 69, y: 33 },
  { count: 27, x: 39, y: 27 },
  { count: 21, x: 26, y: 21 },
  { count: 18, x: 20, y: 27 },
  { count: 30, x: 65, y: 7 },
  { count: 23, x: 30, y: 34 },
  { count: 9, x: 79, y: 20 },
];

export default function MapHome() {
  return (
    <section className="a1">
      <MapSketch className="a1-map" viewBox="0 0 390 560" places={false} />

      {PINS.map((pin) => (
        <button
          key={pin.count}
          type="button"
          className="a1-pin glass glass-pin"
          style={{ "--x": pin.x, "--y": pin.y } as React.CSSProperties}
          aria-label={`${pin.count} places, zoom in`}
        >
          {pin.count}
        </button>
      ))}
      <span className="a1-label" style={{ "--x": 50, "--y": 28 } as React.CSSProperties}>
        Berlin
      </span>

      <div className="a1-sheet glass glass-top glass-card">
        <div className="a1-handle" aria-hidden="true" />
        <Link href="/" className="a1-mark">
          natureplore
        </Link>
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
