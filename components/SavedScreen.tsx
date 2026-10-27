"use client";

// You, the third tab: the profile on top (picture, name, notifications and settings, none of them
// working yet), then E1 · Saved under it, what is kept on this device. Routes, each downloaded;
// the organisms saved on B4; the clean-up registered for (C4), the practices saved (C7) and the
// documentaries saved to watch later (D3). It reads the same store as every Save control, so a
// route saved on A5 is here. Each section shows its first five and
// its heading opens the whole list (E4, E6, E5); "On this device" opens recent searches (E7),
// downloaded routes (E8) and notifications (E3). Boards: E1 · Saved, and E1 · Saved, all sections.

import Link from "next/link";
import { useEffect } from "react";

import { BagIcon, BellIcon, CalendarIcon, CheckCircleIcon, ChevronIcon, OfflineIcon, LoopIcon, OneWayIcon, SearchIcon, SettingsIcon } from "@/components/Icons";
import { ACTION_ROWS } from "@/lib/actions";
import { leaveFor } from "@/lib/back";
import { docById, docLine } from "@/lib/docs";
import { ORGANISMS } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { useRecent } from "@/lib/recent";
import { rememberList, useSaved } from "@/lib/saved";
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
  useEffect(() => rememberList("/you"), []);

  return (
    <section className="saved" aria-labelledby="you-name">
      <div className="saved-sheet glass">
        <div className="you-head">
          {/* the profile picture's place, a person until a picture is added */}
          <span className="you-photo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              {/* head and shoulders, their ink 4 to 20, centred in the 24 box */}
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7Z" />
            </svg>
          </span>
          <h1 id="you-name">Yeon Ji</h1>
          <div className="you-tools">
            <button type="button" className="round glass glass-pin" aria-label="Notifications">
              <BellIcon size={20} />
            </button>
            <button type="button" className="round glass glass-pin" aria-label="Settings">
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>

        <h2 className="you-saved">
          <em>Saved</em>
        </h2>
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
                    {/* the distance and the route's shape as its icon, as on the map's cards, the words kept for screen readers */}
                    <small>
                      {r.meta.replace(/ (loop|one way) · .*$/, "")}
                      <span aria-hidden="true"> · </span>
                      {r.meta.includes(" one way") ? <OneWayIcon className="sug-loop" /> : <LoopIcon className="sug-loop" />}
                      <span className="sr-only">, {r.meta.includes(" one way") ? "one way" : "loop"}</span>
                    </small>
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
