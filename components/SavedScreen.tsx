"use client";

// E1 · Saved, the Saved tab: what is kept on this device. Routes, each downloaded, with Walk it;
// the organisms saved on B4; the clean-up registered for (C4) and the practices saved (C7). It
// reads the same store as every Save control, so a route saved on A5 is here. Walk it opens the
// walk (L4). Board: E1 · Saved, phone.

import Link from "next/link";
import { useEffect } from "react";

import { BagIcon, CheckCircleIcon, ChevronIcon, WalkIcon } from "@/components/Icons";
import { ACTION_ROWS } from "@/lib/actions";
import { leaveFor } from "@/lib/back";
import { ORGANISMS } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { rememberList, useSaved } from "@/lib/saved";
import { routeDetail } from "@/lib/spots";
import { SUGGESTIONS } from "@/lib/suggestions";

export default function SavedScreen() {
  const { ids } = useSaved();
  const routes = SUGGESTIONS.filter((s) => ids.includes(s.id));
  const organisms = ORGANISMS.filter((o) => ids.includes(`org:${o.id}`));
  // the clean-up you registered for and the practices you saved, in the order they were kept
  const actions = ids.filter((id) => id.startsWith("action:")).map((id) => id.slice(7)).filter((id) => ACTION_ROWS[id]);
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
        {organisms.length === 0 ? (
          <p className="saved-empty">Organisms you save appear here.</p>
        ) : (
          <ul className="fb-card fb-rows">
            {organisms.map((o) => {
              const photo = organismPhoto(`${o.name} ${o.close}`);
              return (
                <li key={o.id}>
                  <Link href={`/map/organism/${o.id}`} className="fb-row">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="a8-thumb" src={photo.src} alt="" />
                    ) : (
                      <span className="a8-thumb" aria-hidden="true" />
                    )}
                    <span className="fb-row-text">
                      <b>
                        {o.name} {o.close}
                      </b>
                      <span>
                        {o.kind}, <i>{o.latin}</i>
                      </span>
                    </span>
                    <ChevronIcon size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <h2>Actions and documentaries</h2>
        {actions.length === 0 ? (
          <p className="saved-empty">Clean-ups you register for, everyday practices and documentaries you save appear here.</p>
        ) : (
          <ul className="fb-card fb-rows cp-rows">
            {actions.map((id) => {
              const row = ACTION_ROWS[id];
              return (
                <li key={id}>
                  <Link href={`/learn/action/${id}`} className="fb-row" onClick={() => leaveFor(`/learn/action/${id}`)}>
                    {row.date ? (
                      <span className="cp-date" aria-hidden="true">
                        <b>{row.date[0]}</b>
                        <small>{row.date[1]}</small>
                      </span>
                    ) : (
                      <span className="cp-icon" aria-hidden="true">
                        <BagIcon size={22} />
                      </span>
                    )}
                    <span className="fb-row-text">
                      <b>{row.title}</b>
                      <span>{row.date ? "Registered. " : ""}{row.line}</span>
                    </span>
                    <ChevronIcon size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
