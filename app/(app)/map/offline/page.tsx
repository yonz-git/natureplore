import Link from "next/link";

import { OfflineIcon } from "@/components/Icons";

// A1 · First open, no connection: the map has never loaded, so nothing is drawn rather than a
// guess. Try again goes back to A1. Reached by its address only in the prototype.
// Boards: "A1 · First open, no connection", phone and desktop, version 6.

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
            Routes in Berlin and Brandenburg are loaded once you are connected. Nothing is shown until then, so
            you never see a guess.
          </p>
          <Link href="/map" className="btn btn-primary">
            Try again
          </Link>
          <p className="ms-note">No account needed to look around</p>
        </div>
      </div>
    </section>
  );
}
