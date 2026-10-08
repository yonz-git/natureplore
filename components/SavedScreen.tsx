"use client";

// E1 · Saved, the Saved tab: what is kept on this device. Routes, each downloaded, with Walk the route;
// the organisms saved on B4; the clean-up registered for (C4), the practices saved (C7) and the
// documentaries saved to watch later (D3). It reads the same store as every Save control, so a
// route saved on A5 is here. Walk the route opens the walk (L4). Each section shows its first five and
// its heading opens the whole list (E4, E6, E5); "On this device" opens recent searches (E7),
// downloaded routes (E8) and notifications (E3). Boards: E1 · Saved, and E1 · Saved, all sections.

import Link from "next/link";
import { useEffect } from "react";

import { BagIcon, CalendarIcon, CheckCircleIcon, ChevronIcon, OfflineIcon, SearchIcon, WalkIcon } from "@/components/Icons";
import { ACTION_ROWS } from "@/lib/actions";
import { leaveFor } from "@/lib/back";
import { docById, docLine } from "@/lib/docs";
import { ORGANISMS } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { useRecent } from "@/lib/recent";
import { rememberList, useSaved } from "@/lib/saved";
import { routeDetail } from "@/lib/spots";
import { SUGGESTIONS } from "@/lib/suggestions";

export default function SavedScreen() {
  const { ids } = useSaved();
  const routes = SUGGESTIONS.filter((s) => ids.includes(s.id));
  const organisms = ORGANISMS.filter((o) => ids.includes(`org:${o.id}`));
  // the clean-up you registered for, the practices and the documentaries you saved, in the order
  // they were kept
  const actions = ids.filter((id) => id.startsWith("action:") && ACTION_ROWS[id.slice(7)]);
  const docs = ids.filter((id) => id.startsWith("doc:") && docById(id.slice(4)));
  const recent = useRecent();
  const notes = ids.includes("action:clean-up") ? 1 : 0;
  // a route opened from here goes back here
  useEffect(() => rememberList("/saved"), []);

  return (
    <section className="saved" aria-labelledby="e1-title">
      <div className="saved-sheet glass">
        <h1 id="e1-title">
          <em>Saved</em>
        </h1>
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
                  {/* L4, the walk, is built for Grumsin beech forest loop only */}
                  {routeDetail(r.id) ? (
                    <Link href={`/walk/${r.id}`} className="btn btn-primary">
                      <WalkIcon size={18} />
                      Walk the route
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-primary" aria-disabled="true">
                      <WalkIcon size={18} />
                      Walk the route
                      <span className="sr-only">, the walk of this route is not built in the prototype yet</span>
                    </button>
                  )}
                  {!routeDetail(r.id) && <p className="org-small">The walk is built for Grumsin beech forest loop only.</p>}
                </article>
              );
            })}
          </div>
        )}

        <Head title="Organisms" href="/saved/organisms" n={organisms.length} />
        {organisms.length === 0 ? (
          <p className="saved-empty">Organisms you save appear here.</p>
        ) : (
          <ul className="fb-card fb-rows">
            {organisms.slice(0, 5).map((o) => {
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

        <Head title="Your actions" href="/saved/actions" n={actions.length} />
        {actions.length === 0 ? (
          <p className="saved-empty">Clean-ups you register for and everyday practices you save appear here.</p>
        ) : (
          <ul className="fb-card fb-rows cp-rows">{actions.slice(0, 5).map(actionRow)}</ul>
        )}

        <Head title="Documentaries" href="/saved/documentaries" n={docs.length} />
        {docs.length === 0 ? (
          <p className="saved-empty">Documentaries you save to watch later appear here.</p>
        ) : (
          <ul className="fb-card fb-rows cp-rows">{docs.slice(0, 5).map(docRow)}</ul>
        )}

        <h2>On this device</h2>
        <ul className="fb-card fb-rows saved-device">
          <Device href="/saved/searches" icon={<SearchIcon size={18} />} title="Recent searches" line={recent.length ? recent.slice(0, 3).map((r) => r.label).join(", ") : "Nothing yet"} n={recent.length} />
          <Device href="/saved/offline" icon={<OfflineIcon size={18} />} title="Downloaded routes" line={routes.length ? routes.map((r) => r.name).join(", ") : "Saving a route downloads it"} n={routes.length} />
          <Device href="/saved/notifications" icon={<CalendarIcon size={18} />} title="Notifications" line={notes ? "1 about the September clean-up" : "Only changes to something you started"} n={notes} />
        </ul>
      </div>
    </section>
  );
}

function Head({ title, href, n }: { title: string; href: string; n: number }) {
  return (
    <div className="saved-head">
      <h2>{title}</h2>
      {n > 0 && <Link href={href} aria-label={`See all ${title.toLowerCase()}`}>{n > 5 ? `See all ${n}` : "See all"}</Link>}
    </div>
  );
}

function Device({ href, icon, title, line, n }: { href: string; icon: React.ReactNode; title: string; line: string; n: number }) {
  return (
    <li>
      <Link href={href} className="fb-row">
        <span className="row-disc" aria-hidden="true">
          {icon}
        </span>
        <span className="fb-row-text">
          <b>{title}</b>
          <span>{line}</span>
        </span>
        {n > 0 && <span className="fb-pill">{n}</span>}
        <ChevronIcon size={18} />
      </Link>
    </li>
  );
}

function docRow(key: string) {
  const d = docById(key.slice(4))!;
  const href = `/learn/documentaries/${d.id}`;
  return (
    <li key={key}>
      <Link href={href} className="fb-row" onClick={() => leaveFor(href)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cp-icon" src={d.photo.src} alt="" />
        <span className="fb-row-text">
          <b>{d.title}</b>
          <span>To watch later. {docLine(d)}</span>
        </span>
        <ChevronIcon size={18} />
      </Link>
    </li>
  );
}

function actionRow(key: string) {
  const id = key.slice(7);
  const row = ACTION_ROWS[id];
  return (
    <li key={key}>
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
          <span>
            {row.date ? "Registered. " : ""}
            {row.line}
          </span>
        </span>
        <ChevronIcon size={18} />
      </Link>
    </li>
  );
}
