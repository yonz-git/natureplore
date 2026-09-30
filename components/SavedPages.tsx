"use client";

// Flow E, the pages under Saved (E1 is SavedScreen): E4 organisms, E5 documentaries, E6 your
// actions, E7 recent searches, E8 downloaded routes with E2 the sheet of one, and E3
// notifications. Everything is kept on this device; there are no accounts, so the sign-in parts
// of the boards are left out. Each page is the D2 page shape: back over the photograph, a glass
// sheet, one column capped at the measure. Boards: E2 to E8, phone, tablet and desktop.

import Link from "next/link";
import { useState } from "react";

import { BackLink, BackTop } from "@/components/CParts";
import { BagIcon, CalendarIcon, CheckCircleIcon, CheckIcon, ChevronIcon, InfoIcon, PinIcon, SearchIcon } from "@/components/Icons";
import { ACTION_ROWS } from "@/lib/actions";
import { leaveFor } from "@/lib/back";
import { docById, docLine } from "@/lib/docs";
import { ORGANISMS } from "@/lib/organisms";
import { organismPhoto } from "@/lib/photos";
import { useRecent } from "@/lib/recent";
import { useSaved } from "@/lib/saved";
import { SUGGESTIONS } from "@/lib/suggestions";

/* ── the page shape ─────────────────────────────────────────────────────────────────────────── */

function Page({
  id,
  pre,
  close,
  intro,
  back = "/saved",
  action,
  children,
}: {
  id: string;
  pre?: string;
  close: string;
  intro: React.ReactNode;
  back?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const label = back === "/saved" ? "Back to Saved" : "Back to downloaded routes";
  return (
    <section className="org ln se" aria-labelledby={id}>
      <BackTop href={back} label={label} />
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <div className="se-head">
            <BackLink href={back} label={label} />
            {action}
          </div>
          <h1 id={id} className="org-title ln-title">
            {pre && `${pre} `}
            <em>{close}</em>
          </h1>
          <p className="org-body ln-intro">{intro}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="saved-empty se-empty">{children}</p>;
}

/* ── E4, E5: a kept list with Edit, remove several, and Undo ──────────────────────────────────── */

type Item = {
  key: string;
  lead: React.ReactNode;
  title: string;
  line: React.ReactNode;
  href: string;
  /** when given, the row opens in place (E4) instead of going to href */
  detail?: React.ReactNode;
};

function KeptList({ groups, editing, noun, empty }: { groups: { title?: string; items: Item[] }[]; editing: boolean; noun: string; empty: string }) {
  const { remove, restore } = useSaved();
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [undo, setUndo] = useState<string[]>([]);
  const all = groups.flatMap((g) => g.items);
  const chosen = picked.filter((k) => all.some((i) => i.key === k));

  const drop = (keys: string[]) => {
    remove(keys);
    setUndo(keys);
    setPicked([]);
    setOpen(null);
  };

  return (
    <>
      {all.length === 0 && <Empty>{empty}</Empty>}
      {groups.map((g, gi) =>
        g.items.length === 0 ? null : (
          <section key={gi} className="se-group" aria-label={g.title}>
            {g.title && <h2 className="se-h2">{g.title}</h2>}
            <ul className="fb-card fb-rows se-rows">
              {g.items.map((it) => {
                const body = (
                  <>
                    {it.lead}
                    <span className="fb-row-text">
                      <b>{it.title}</b>
                      <span>{it.line}</span>
                    </span>
                  </>
                );
                if (editing) {
                  const on = chosen.includes(it.key);
                  return (
                    <li key={it.key}>
                      <button
                        type="button"
                        className="fb-row se-pick"
                        aria-pressed={on}
                        onClick={() => setPicked(on ? chosen.filter((k) => k !== it.key) : [...chosen, it.key])}
                      >
                        <span className={`se-check${on ? " is-on" : ""}`} aria-hidden="true">
                          {on && <CheckIcon size={16} />}
                        </span>
                        {body}
                      </button>
                    </li>
                  );
                }
                if (it.detail) {
                  const isOpen = open === it.key;
                  return (
                    <li key={it.key}>
                      <button
                        type="button"
                        className="fb-row se-pick"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : it.key)}
                      >
                        {body}
                        <ChevronIcon size={18} className={isOpen ? "se-turn" : undefined} />
                      </button>
                      {isOpen && (
                        <div className="se-detail">
                          {it.detail}
                          <Link href={it.href} className="btn btn-primary">
                            Open the organism page
                          </Link>
                          <button type="button" className="cp-link" onClick={() => drop([it.key])}>
                            Remove
                          </button>
                        </div>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={it.key}>
                    <Link href={it.href} className="fb-row" onClick={() => leaveFor(it.href)}>
                      {body}
                      <ChevronIcon size={18} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ),
      )}

      {editing && all.length > 0 && (
        <div className="fb-card se-bar">
          <span aria-live="polite">
            {chosen.length} of {all.length} selected
          </span>
          <button type="button" className="btn btn-secondary" disabled={chosen.length === 0} onClick={() => drop(chosen)}>
            Remove {chosen.length || ""}
          </button>
        </div>
      )}

      {undo.length > 0 && (
        <div className="fb-card se-bar" role="status">
          <span>
            Removed {undo.length === 1 ? `1 ${noun}` : `${undo.length} ${noun === "documentary" ? "documentaries" : `${noun}s`}`}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              restore(undo);
              setUndo([]);
            }}
          >
            Undo
          </button>
        </div>
      )}
    </>
  );
}

function EditButton({ editing, set, show }: { editing: boolean; set: (v: boolean) => void; show: boolean }) {
  if (!show) return null;
  return (
    <button type="button" className="chip se-edit" aria-pressed={editing} onClick={() => set(!editing)}>
      {editing ? "Done" : "Edit"}
    </button>
  );
}

/* ── E4 · Saved organisms ───────────────────────────────────────────────────────────────────── */

export function SavedOrganisms() {
  const { ids } = useSaved();
  const [editing, setEditing] = useState(false);
  const kept = ORGANISMS.filter((o) => ids.includes(`org:${o.id}`));
  const items: Item[] = kept.map((o) => {
    const photo = organismPhoto(`${o.name} ${o.close}`);
    return {
      key: `org:${o.id}`,
      lead: photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="a8-thumb" src={photo.src} alt="" />
      ) : (
        <span className="a8-thumb" aria-hidden="true" />
      ),
      title: `${o.name} ${o.close}`,
      line: (
        <>
          {o.kind}, <i>{o.latin}</i>
        </>
      ),
      href: `/map/organism/${o.id}`,
      detail: (
        <dl className="se-dl">
          <div>
            <dt>Group</dt>
            <dd>{o.kind}</dd>
          </div>
          <div>
            <dt>Scientific name</dt>
            <dd>
              <i>{o.latin}</i>
            </dd>
          </div>
        </dl>
      ),
    };
  });
  const n = kept.length;
  return (
    <Page
      id="e4-title"
      pre="Saved"
      close="organisms"
      intro={n === 0 ? "Kept on this device." : `${n} on this device. Each row names its group, so a photograph is never the only clue.`}
      action={<EditButton editing={editing} set={setEditing} show={n > 0} />}
    >
      <KeptList groups={[{ items }]} editing={editing && n > 0} noun="organism" empty="Nothing saved yet. The bookmark on any organism page keeps it here." />
      {n > 0 && (
        <p className="fb-small">
          {editing ? "Removing keeps an Undo until you leave this page." : "A row opens its details here. Edit removes several at once."}
        </p>
      )}
    </Page>
  );
}

/* ── E5 · Saved documentaries ───────────────────────────────────────────────────────────────── */

export function SavedDocs() {
  const { ids } = useSaved();
  const [editing, setEditing] = useState(false);
  const docs = ids.filter((k) => k.startsWith("doc:")).map((k) => docById(k.slice(4))!).filter(Boolean);
  const item = (d: NonNullable<ReturnType<typeof docById>>): Item => ({
    key: `doc:${d.id}`,
    // eslint-disable-next-line @next/next/no-img-element
    lead: <img className={`cp-icon se-doc${d.available ? "" : " is-gone"}`} src={d.photo.src} alt="" />,
    title: d.title,
    line: d.available ? docLine(d) : `${docLine(d)}. Not available here; alternatives on the next page.`,
    href: `/learn/documentaries/${d.id}`,
  });
  const here = docs.filter((d) => d.available).map(item);
  const gone = docs.filter((d) => !d.available).map(item);
  return (
    <Page
      id="e5-title"
      pre="Saved"
      close="documentaries"
      intro={
        docs.length === 0
          ? "Kept on this device."
          : `${here.length} to watch later. Documentaries are links to the maker, so saving keeps the link, not the film.`
      }
      action={<EditButton editing={editing} set={setEditing} show={docs.length > 0} />}
    >
      <KeptList
        groups={[{ items: here }, { title: "Not available here", items: gone }]}
        editing={editing && docs.length > 0}
        noun="documentary"
        empty="Nothing saved yet. Save to watch later on any documentary keeps it here."
      />
      {docs.length > 0 && (
        <p className="fb-small">A documentary you can no longer watch stays listed until you remove it. Nothing is removed without you.</p>
      )}
    </Page>
  );
}

/* ── E6 · Your actions ──────────────────────────────────────────────────────────────────────── */

export function YourActions() {
  const { ids } = useSaved();
  const kept = ids.filter((k) => k.startsWith("action:") && ACTION_ROWS[k.slice(7)]).map((k) => k.slice(7));
  const dated = kept.filter((id) => ACTION_ROWS[id].date);
  const todo = kept.filter((id) => !ACTION_ROWS[id].date);
  const row = (id: string) => {
    const r = ACTION_ROWS[id];
    const href = `/learn/action/${id}`;
    return (
      <li key={id}>
        <Link href={href} className="fb-row" onClick={() => leaveFor(href)}>
          {r.date ? (
            <span className="cp-date" aria-hidden="true">
              <b>{r.date[0]}</b>
              <small>{r.date[1]}</small>
            </span>
          ) : (
            <span className="cp-icon" aria-hidden="true">
              <BagIcon size={22} />
            </span>
          )}
          <span className="fb-row-text">
            <b>{r.title}</b>
            <span>{r.date ? `Registered. ${r.where}` : r.line}</span>
          </span>
          <ChevronIcon size={18} />
        </Link>
      </li>
    );
  };
  return (
    <Page id="e6-title" pre="Your" close="actions" intro="What you registered for, and what you saved to do.">
      <h2 className="se-h2">Coming up</h2>
      {dated.length ? <ul className="fb-card fb-rows cp-rows">{dated.map(row)}</ul> : <Empty>Clean-ups you register for appear here.</Empty>}
      <h2 className="se-h2">Saved to do</h2>
      {todo.length ? <ul className="fb-card fb-rows cp-rows">{todo.map(row)}</ul> : <Empty>Everyday practices you save appear here.</Empty>}
      <h2 className="se-h2">Past</h2>
      <Empty>Nothing yet. Actions you took part in stay here, with the organiser and the date.</Empty>
    </Page>
  );
}

/* ── E7 · Recent searches ───────────────────────────────────────────────────────────────────── */

export function RecentSearches() {
  const recent = useRecent();
  const [all, setAll] = useState(false);
  const shown = all ? recent : recent.slice(0, 5);
  return (
    <Page id="e7-title" pre="Recent" close="searches" intro="The last 8 results you opened from search, kept on this device only. Never sent anywhere.">
      {recent.length === 0 ? (
        <Empty>Nothing yet. Regions and organisms you open from search appear here.</Empty>
      ) : (
        <>
          <ul className="fb-card fb-rows se-rows">
            {shown.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="fb-row">
                  <span className="row-disc" aria-hidden="true">
                    {r.kind === "Region" ? <PinIcon size={18} /> : <SearchIcon size={18} />}
                  </span>
                  <span className="fb-row-text">
                    <b>{r.label}</b>
                    <span>{r.kind}</span>
                  </span>
                  <ChevronIcon size={18} />
                </Link>
              </li>
            ))}
          </ul>
          {!all && recent.length > 5 && (
            <button type="button" className="btn btn-secondary se-more" onClick={() => setAll(true)}>
              See all {recent.length}
            </button>
          )}
          <p className="fb-small">A row opens the same result as searching for it again.</p>
        </>
      )}
    </Page>
  );
}

/* ── E8 · Downloaded routes, and E2, one of them ───────────────────────────────────────────── */

const SIZE = "38 MB";

export function OfflineRoutes() {
  const { ids } = useSaved();
  const routes = SUGGESTIONS.filter((s) => ids.includes(s.id));
  return (
    <Page
      id="e8-title"
      pre="Downloaded"
      close="routes"
      intro={
        routes.length === 0
          ? "Kept on this device, to walk without a connection."
          : `${routes.length === 1 ? "1 route" : `${routes.length} routes`} on this device. Sizes are sample figures for the prototype.`
      }
    >
      {routes.length === 0 ? (
        <Empty>No routes yet. Saving a route downloads it, so it works offline.</Empty>
      ) : (
        <>
          <ul className="fb-card fb-rows se-rows">
            {routes.map((r) => (
              <li key={r.id}>
                <Link href={`/saved/offline/${r.id}`} className="fb-row">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="a8-thumb" src={r.image} alt="" />
                  ) : (
                    <span className="a8-thumb" aria-hidden="true" />
                  )}
                  <span className="fb-row-text">
                    <b>{r.name}</b>
                    <span>{SIZE}, available offline</span>
                  </span>
                  <ChevronIcon size={18} />
                </Link>
              </li>
            ))}
          </ul>
          <p className="fb-small">A row shows what the download includes, with Refresh and Remove from this device. Remove asks first.</p>
        </>
      )}
    </Page>
  );
}

export function OfflineRoute({ id }: { id: string }) {
  const { isSaved, toggle } = useSaved();
  const [asked, setAsked] = useState(false);
  const [fresh, setFresh] = useState(false);
  // focus moves to the control that replaced the pressed one
  const [gone, setGone] = useState(false);
  const route = SUGGESTIONS.find((s) => s.id === id);
  if (!route) return null;
  const kept = isSaved(id);
  return (
    <Page
      id="e2-title"
      pre={kept ? "Available" : "Removed from"}
      close={kept ? "offline" : "this device"}
      intro={`${route.name}, ${SIZE}. Sample figure for the prototype.`}
      back="/saved/offline"
    >
      <h2 className="se-h2">What the download includes</h2>
      <ul className="fb-card se-checks">
        {[
          "Every spot along the route, with what to look for",
          "The organism records along it, with photographs",
          "The claims about this area and their sources",
          "The map of the route, not the whole region",
        ].map((t) => (
          <li key={t}>
            <CheckIcon size={20} />
            {t}
          </li>
        ))}
      </ul>

      {kept ? (
        <div className="se-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setFresh(true)}>
            Refresh
          </button>
          <p className="fb-small" role="status">
            {fresh && (
              <>
                <CheckCircleIcon size={16} /> Up to date.
              </>
            )}
          </p>
          {asked ? (
            <div className="fb-card se-confirm" role="group" aria-labelledby="e2-ask">
              <p id="e2-ask">Remove {route.name} from this device? It leaves Saved too.</p>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setGone(true);
                    toggle(id);
                  }}
                >
                  Remove
                </button>
                <button type="button" className="cp-link" onClick={() => setAsked(false)}>
                  Keep it
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="cp-link" onClick={() => setAsked(true)}>
              Remove from this device
            </button>
          )}
        </div>
      ) : (
        <div className="se-actions">
          <button type="button" className="btn btn-secondary" autoFocus={gone} onClick={() => toggle(id)}>
            Save and download again
          </button>
        </div>
      )}
    </Page>
  );
}

/* ── E3 · Notifications ─────────────────────────────────────────────────────────────────────── */

export function Notifications() {
  const { isSaved } = useSaved();
  const registered = isSaved("action:clean-up");
  const href = "/learn/action/clean-up";
  return (
    <Page id="e3-title" close="Notifications" intro="Only changes to something you started.">
      {registered ? (
        <>
          <ul className="fb-card fb-rows se-rows">
            <li>
              <Link href={href} className="fb-row" onClick={() => leaveFor(href)}>
                <span className="row-disc" aria-hidden="true">
                  <CalendarIcon size={18} />
                </span>
                <span className="fb-row-text">
                  <b>September clean-up: meeting point confirmed</b>
                  <span>The organiser confirmed Linum village car park. Your registration still stands.</span>
                  <span className="fb-pill">Sample notification for the prototype</span>
                </span>
                <ChevronIcon size={18} />
              </Link>
            </li>
          </ul>
        </>
      ) : (
        <Empty>Nothing has changed. When something you registered for changes, it appears here.</Empty>
      )}
      <p className="fb-small se-note">
        <InfoIcon size={16} /> No streaks, no reminders, no come back and explore. When nothing you started has changed, this page stays empty.
      </p>
    </Page>
  );
}
