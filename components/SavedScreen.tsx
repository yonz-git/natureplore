"use client";

// E1 · Saved, the Saved tab: what is kept on this device. Routes, each downloaded, with Walk it;
// then organisms, and actions and documentaries, which say what will appear there. It reads the
// same store as every Save control, so a route saved on A5 is here. Walk it opens the walk (L4).
// Board: E1 · Saved, phone.

import Link from "next/link";
import { useEffect } from "react";

import { CheckCircleIcon, ChevronIcon, WalkIcon } from "@/components/Icons";
import { rememberList, useSaved } from "@/lib/saved";
import { routeDetail } from "@/lib/spots";
import { SUGGESTIONS } from "@/lib/suggestions";

export default function SavedScreen() {
  const { ids } = useSaved();
  const routes = SUGGESTIONS.filter((s) => ids.includes(s.id));
  // a route opened from here goes back here
  useEffect(() => rememberList("/saved"), []);

  return (
    <section className="saved">
      <div className="saved-sheet glass" aria-labelledby="e1-title">
        <h1 id="e1-title">Saved</h1>
        <p>Kept on this device</p>

        <h2>Routes</h2>
        {routes.length === 0 ? (
          <p className="saved-empty">Routes you save appear here, downloaded so you can walk them offline.</p>
        ) : (
          <div className="saved-list">
            {routes.map((r) => {
              const row = (
                <>
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image} alt="" />
                  ) : (
                    <span className="saved-thumb" aria-hidden="true" />
                  )}
                  <span>
                    <b>{r.name}</b>
                    <small>{r.meta.replace(/, [^,]* at a looking pace/, "")}</small>
                    <em>
                      <CheckCircleIcon size={16} />
                      Downloaded
                    </em>
                  </span>
                  {r.href && <ChevronIcon size={18} />}
                </>
              );
              return (
                <article key={r.id} className="saved-card" aria-label={r.name}>
                  {r.href ? (
                    <Link href={r.href} className="saved-row">
                      {row}
                    </Link>
                  ) : (
                    <div className="saved-row">{row}</div>
                  )}
                  {/* L4, the walk, is built for Linum wet meadows loop only */}
                  {routeDetail(r.id) ? (
                    <Link href={`/walk/${r.id}`} className="btn btn-primary">
                      <WalkIcon size={18} />
                      Walk it
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-primary" aria-disabled="true">
                      <WalkIcon size={18} />
                      Walk it
                      <span className="sr-only">, the walk of this route is not built in the prototype yet</span>
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <h2>Organisms</h2>
        <p className="saved-empty">Organisms you save appear here.</p>

        <h2>Actions and documentaries</h2>
        <p className="saved-empty">Clean-ups you register for, everyday practices and documentaries you save appear here.</p>
      </div>
    </section>
  );
}
