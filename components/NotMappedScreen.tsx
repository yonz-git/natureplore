"use client";

// A6 · Map home, not mapped yet. There is no map behind this one on purpose: nothing is recorded
// here, so an empty map would only look broken and a full one would be a lie. The gap is named,
// what is mapped is named, and the way back to it is one control.

import Link from "next/link";

import { MapSearchField } from "@/components/MapParts";

export default function NotMappedScreen({ place }: { place: string }) {
  return (
    <section className="a1 notmapped-screen">
      <div className="map-top">
        <MapSearchField tone="float" defaultValue={place} />
      </div>

      <div className="a1-sheet map-sheet glass glass-top glass-card">
        <div className="a1-handle" aria-hidden="true" />
        <h1 className="a1-title map-title">
          {place} <em>isn’t mapped yet</em>
        </h1>
        <p className="notmapped-note">
          No places are recorded here, so the map stays empty rather than guessing.
        </p>
        <p className="map-sub">Mapped so far: Berlin and Brandenburg</p>

        <Link href="/map/region" className="a1-btn a1-btn-outline map-all">
          Browse mapped places
        </Link>
      </div>
    </section>
  );
}
