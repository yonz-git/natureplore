"use client";

// A1 · Start sheet: the one line saying what this is, and the three equally weighted ways in.
// Search goes to A2, using your location asks first and then goes to A4, browsing goes to A5.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LocationDialog from "@/components/LocationDialog";
import { LocationIcon, MapSearchField } from "@/components/MapParts";

export default function StartSheet() {
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  return (
    <>
      <div className="a1-sheet glass glass-top glass-card">
        <div className="a1-handle" aria-hidden="true" />
        <h1 className="a1-title">
          See what lives <em>around you</em>
        </h1>

        <div className="a1-actions">
          <MapSearchField label="Search for a region" />

          <button type="button" className="a1-btn a1-btn-primary" onClick={() => setAsking(true)}>
            <LocationIcon />
            Use my location
          </button>

          <Link href="/map/region" className="a1-btn a1-btn-outline">
            Browse Berlin and Brandenburg
          </Link>
        </div>

        <p className="a1-note">Location stays on this device. No account needed.</p>
      </div>

      {asking && (
        <LocationDialog
          onAllow={() => router.push("/map/near-you")}
          onDecline={() => setAsking(false)}
        />
      )}
    </>
  );
}
