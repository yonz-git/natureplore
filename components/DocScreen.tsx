"use client";

// D3 · Documentary detail, and D4 · Not available here. D3: what the film covers, where and until
// when it can be watched, why it is in Natureplore, the species it covers and the routes where
// they are in season. Watching opens the maker's site, which the prototype does not link; saving
// to watch later keeps it on the device, in Saved. D4: a documentary that cannot be watched where
// the person is says so and why, links to no copy, and offers what on the same subject can be.
// On the phone a sheet over the photograph; from 64rem a wide sheet in two columns, where to watch
// (D3) or the alternatives (D4) in the right one. Back returns to the page it was opened from,
// the collection when nothing is known.
// Boards: D3 and D4, phone, tablet and desktop.

import Link from "next/link";

import { BackLink, BackTop, Facts, Stat } from "@/components/CParts";
import { DocList } from "@/components/DocParts";
import { BookmarkIcon, ChevronIcon, ExternalIcon, LockIcon, MapIcon } from "@/components/Icons";
import { backLabel, useBack } from "@/lib/back";
import { type Doc, docById, watchFacts } from "@/lib/docs";
import { creditLine } from "@/lib/photos";
import { useSaved } from "@/lib/saved";

/** "Documentary title" with its last word in the lime of the titles */
function Title({ id, text }: { id: string; text: string }) {
  const cut = text.lastIndexOf(" ");
  return (
    <h1 id={id} className="org-title cp-title">
      {cut > 0 ? (
        <>
          {text.slice(0, cut)} <em>{text.slice(cut + 1)}</em>
        </>
      ) : (
        <em>{text}</em>
      )}
    </h1>
  );
}

function Hero({ doc, off = false }: { doc: Doc; off?: boolean }) {
  return (
    <>
      <div className={`dc-hero${off ? " is-off" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="org-photo" src={doc.photo.src} alt="" />
        {off && (
          <span className="dc-off-tag">
            <LockIcon size={16} />
            Not available here
          </span>
        )}
      </div>
      <p className="org-credit">{creditLine(doc.photo)}</p>
    </>
  );
}

function WatchBox({ doc }: { doc: Doc }) {
  const { isSaved, toggle } = useSaved();
  const key = `doc:${doc.id}`;
  const saved = isSaved(key);
  const site = doc.access === "Free" ? "the broadcaster's site" : "the service's site";
  return (
    <div className="org-box cp-act dc-watch">
      <h2 className="dc-watch-title">Where to watch</h2>
      <Facts items={watchFacts(doc)} />
      <div className="dc-watch-do">
        <button type="button" className="btn btn-primary" aria-disabled="true">
          <ExternalIcon size={19} />
          {doc.access === "Rental" ? "Rent" : "Watch"} on {site}
          <span className="sr-only">, not linked in the prototype, the documentary is sample content</span>
        </button>
        <p className="org-small">Opens outside Natureplore. Not linked in the prototype.</p>
        {/* one button that stays mounted, so focus stays on it when it changes */}
        <button type="button" className="btn btn-secondary" aria-pressed={saved} onClick={() => toggle(key)}>
          <BookmarkIcon size={19} filled={saved} />
          {saved ? "Saved to watch later" : "Save to watch later"}
        </button>
        <p className="org-small" aria-live="polite">
          {saved ? "Saved. Kept on this device, in Saved" : "Kept on this device, in Saved"}
        </p>
      </div>
    </div>
  );
}

function Available({ doc, back, label }: { doc: Doc; back: string; label: string }) {
  return (
    <>
      <div className="org-main dc-top">
        <BackLink href={back} label={label} />
        <Hero doc={doc} />
        <Title id="doc-title" text={doc.title} />
        <p className="org-small cp-reviewed">{doc.maker}</p>
        {/* a long access, "Subscription service", takes a row of its own rather than breaking */}
        <div className={`cp-stats${doc.access.length > 8 ? " dc-stats-long" : ""}`}>
          <Stat label="Year" value={doc.year} />
          <Stat label="Length" value={String(doc.minutes)} unit="min" />
          <Stat label="Access" value={doc.access} />
        </div>
        {doc.description && <p className="org-body dc-desc">{doc.description}</p>}
      </div>

      <aside className="org-side dc-side" aria-label="Where to watch">
        <WatchBox doc={doc} />
      </aside>

      <div className="org-main dc-more">
        {doc.why && (
          <>
            <h2 className="org-h2">
              Why this documentary <em>here</em>
            </h2>
            <p className="org-body">{doc.why}</p>
          </>
        )}
        {doc.species && (
          <>
            <h2 className="org-h2">
              Species this <em>covers</em>
            </h2>
            {/* the species is named, not linked: its page is not part of this flow */}
            <ul className="fb-card fb-rows cp-rows">
              {doc.species.map((s) => (
                <li key={s.name}>
                  <div className="fb-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="dc-species" src={s.photo.src} alt="" />
                    <span className="fb-row-text">
                      <b>{s.name}</b>
                      <span>
                        {s.kind}, <i>{s.latin}</i>
                      </span>
                      <span>{s.line}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {doc.routes && (
          <>
            <h2 className="org-h2">
              Routes where it&apos;s <em>in season</em>
            </h2>
            <ul className="fb-card fb-rows cp-rows">
              {doc.routes.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="fb-row">
                    <span className="cp-icon" aria-hidden="true">
                      <MapIcon size={22} />
                    </span>
                    <span className="fb-row-text">
                      <b>{r.name}</b>
                      <span>{r.line}</span>
                    </span>
                    <ChevronIcon size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

function Unavailable({ doc, back, label }: { doc: Doc; back: string; label: string }) {
  const related = (doc.related ?? []).map((id) => docById(id)).filter((d): d is Doc => !!d);
  return (
    <>
      <div className="org-main">
        <BackLink href={back} label={label} />
        <Hero doc={doc} off />
        <Title id="doc-title" text={doc.title} />
        <p className="org-small cp-reviewed">
          {doc.year}, {doc.minutes} min, {doc.maker}
        </p>
        <div className="org-box cp-note dc-note">
          <LockIcon size={20} />
          <p>
            <b>Not available in your region.</b> {doc.unavailable}
          </p>
        </div>
      </div>

      <aside className="org-side dc-side" aria-labelledby="same-subject">
        <h2 id="same-subject" className="org-h2 org-h2-first">
          On the same subject, <em>that you can watch here</em>
        </h2>
        <DocList docs={related} as="rows" />
        <Link href="/learn/documentaries" className="btn btn-secondary dc-back">
          Back to the collection
        </Link>
      </aside>
    </>
  );
}

export default function DocScreen({ id }: { id: string }) {
  const doc = docById(id)!;
  const back = useBack("/learn/documentaries");
  const label = backLabel(back, "Back to Documentaries");

  return (
    <section className={`org dc${doc.available ? "" : " dc-off"}`} aria-labelledby="doc-title">
      <BackTop href={back} label={label} share={doc.available ? `${doc.title}, ${doc.covers}` : undefined} />
      <div className="org-sheet glass glass-top">
        {doc.available ? <Available doc={doc} back={back} label={label} /> : <Unavailable doc={doc} back={back} label={label} />}
      </div>
    </section>
  );
}
