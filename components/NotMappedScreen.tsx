// A6 · Map home, not mapped yet: the honest empty state for a place with no routes. The map shows
// the streets and an empty outline rather than a guess, and the one way on is back to the regions
// that are mapped. Boards: A6, phone and desktop, version 6.

import Link from "next/link";

import { SearchField } from "@/components/MapParts";
import { REGIONS } from "@/lib/routes";

export default function NotMappedScreen({ place }: { place: string }) {
  const region = REGIONS.find((r) => r.name === place);
  // the field keeps what was searched for, with the state or country that told it apart
  const searched = region ? `${place}, ${region.kind.split(",")[0]}` : place;

  return (
    <section className="ms a6">
      {/* a street grid with nothing on it, and the outline of where routes would be */}
      <svg className="unmapped-map" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 390 844">
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0 200 L390 176 M0 300 L390 290 M0 400 L390 380 M-10 560 L400 548 M0 700 L390 690" />
          <path d="M120 0 L130 844 M245 0 L250 844 M350 0 L340 844 M40 0 L30 844" />
        </g>
        <path d="M0 458 C 120 440, 260 452, 390 436" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.5" />
        <rect className="unmapped-outline" x="86" y="152" width="218" height="198" rx="28" fill="rgb(255 255 255 / 0.04)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
      </svg>

      <div className="ms-panel glass-desk">
        <div className="ms-bar">
          <SearchField defaultValue={searched} />
        </div>
        <div className="ms-sheet is-short glass-phone">
          <div className="ms-handle" aria-hidden="true" />
          <h1 className="ms-title">
            {place} isn’t <em>mapped yet</em>
          </h1>
          <p className="ms-lead">No routes are mapped here yet, so the map stays empty rather than guessing.</p>
          <p className="ms-lead">Mapped so far: Berlin and Brandenburg</p>
          <Link href="/map/region" className="btn btn-primary">
            Browse mapped regions
          </Link>
        </div>
      </div>
    </section>
  );
}
