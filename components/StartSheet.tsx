"use client";

// A1 · Start sheet: the one line saying what this is, and the ways in. On the phone it is a card
// floating over the map with search and location; declining the location prompt goes to A5, the
// suggestions. On the desktop it is the panel, and Browse joins the stack.
// Boards: "A1 · Start sheet" and "A1 · Start panel, desktop".

import Link from "next/link";

import { LocationIcon } from "@/components/Icons";
import { useLocationPrompt } from "@/components/LocationDialog";
import { SearchField } from "@/components/MapParts";

export default function StartSheet() {
  const { ask, prompt } = useLocationPrompt("/map");

  return (
    <div className="ms-panel">
      <div className="ms-sheet is-card glass-phone">
        <h1 className="ms-title">
          See what lives <em>around you</em>
        </h1>
        <p className="ms-lead ms-lead-phone">Location stays on this device.</p>
        <p className="ms-lead ms-lead-desk">
          Routes near you, the plants, mushrooms and birds recorded along them, and what is happening to them.
        </p>

        <div className="ms-stack">
          <SearchField />
          <button type="button" className="btn btn-primary" onClick={ask}>
            <LocationIcon />
            Use my location
          </button>
          <Link href="/map" className="btn btn-secondary btn-browse">
            Browse Berlin and Brandenburg
          </Link>
        </div>

        <p className="ms-note ms-note-desk">
          Your browser asks before sharing your location, and it stays on this device.
        </p>
      </div>
      {prompt}
    </div>
  );
}
