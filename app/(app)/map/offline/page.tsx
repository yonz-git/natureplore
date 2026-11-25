import type { Metadata } from "next";
import Link from "next/link";

import { OfflineIcon } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "No connection" };

export default function Offline() {
  return (
    <section className="ms offline">
      <div className="offline-map">
        <OfflineIcon size={24} />
        Map not loaded yet
      </div>
      <div className="ms-panel glass-desk">
        <div className="ms-sheet is-short glass-phone">
          <div className="ms-handle" aria-hidden="true" />
          <h1 className="ms-title">
            The map needs a connection the <em>first time</em>
          </h1>
          <p className="ms-lead">
            Routes load once you’re connected. Nothing is shown until then, so you never see a guess.
          </p>
          <Link href="/map" className="btn btn-primary">
            Try again
          </Link>
          <p className="ms-note">Looking around asks for nothing</p>
        </div>
      </div>
    </section>
  );
}
