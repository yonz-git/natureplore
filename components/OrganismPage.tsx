"use client";

// B4 · Organism detail, and B5 · the same with its location generalised. The photograph, the
// name, where and when it was recorded, why it is here, when to look, what it lives with, the
// impact on it and what to do, then where else it is recorded and the documentaries about it.
// A species at risk from collection shows only an area, never a point, and nothing that would
// narrow it down again. On the phone it is a sheet under three round controls; from 64rem a wide
// sheet in two columns. Pages that are not built yet (sources, actions, other places) are
// controls with nowhere to go. Boards: B4 and B5, phone and desktop, version 6.

import Link from "next/link";

import { ArrowIcon, BackIcon, BookmarkIcon, EyeOffIcon, MapIcon, ShareIcon } from "@/components/Icons";
import type { Organism } from "@/lib/organisms";
import { useSaved } from "@/lib/saved";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Actions({ o }: { o: Organism }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(`org:${o.id}`);
  const share = async () => {
    const data = { title: `${o.name} ${o.close}`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(location.href);
    } catch {
      // the person closed the share sheet
    }
  };
  return (
    <div className="org-actions">
      <button
        type="button"
        className="round glass glass-pin"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${o.name} ${o.close} from saved` : "Save species"}
        onClick={() => toggle(`org:${o.id}`)}
      >
        <BookmarkIcon size={20} filled={saved} />
      </button>
      <button type="button" className="round glass glass-pin" aria-label="Share" onClick={share}>
        <ShareIcon size={20} />
      </button>
    </div>
  );
}

export default function OrganismPage({ o }: { o: Organism }) {
  const now = new Date().getMonth();
  const name = `${o.name} ${o.close}`;

  return (
    <section className="org" aria-labelledby="org-title">

      <div className="org-top">
        <Link href={o.back.href} className="round glass glass-pin" aria-label={`Back to ${o.back.label}`}>
          <BackIcon size={20} />
        </Link>
        <Actions o={o} />
      </div>

      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <Link href={o.back.href} className="org-back">
            <BackIcon size={18} />
            {o.back.label}
          </Link>
          <div className="org-photo" role="img" aria-label={`Photograph of the ${name.toLowerCase()} to come`} />
          <p className="org-credit">{o.credit}</p>
          <h1 id="org-title" className="org-title">
            {o.name} <em>{o.close}</em>
          </h1>
          <p className="org-kind">
            {o.kind}, <i>{o.latin}</i>
          </p>

          {o.generalised ? (
            <>
              <div className="org-box">
                <h2 className="org-h3 org-h3-icon">
                  <EyeOffIcon size={20} />
                  Location generalised
                </h2>
                <p className="org-soft">{o.generalised.text}</p>
                <div className="org-area" aria-hidden="true">
                  <span className="org-area-ring" />
                  <span className="org-area-tag">recorded area, not an exact point</span>
                </div>
              </div>
              <p className="org-small">{o.generalised.record}</p>
            </>
          ) : (
            <div className="org-box org-record org-record-phone">
              <Record o={o} />
            </div>
          )}

          {o.why && (
            <>
              <h2 className="org-h2">Why it’s here</h2>
              <p className="org-body">{o.why}</p>
            </>
          )}

          <h2 className="org-h2">When to look</h2>
          {o.season ? (
            <>
              <ol className="org-months" aria-label="Months it is recorded most">
                {MONTHS.map((m, i) => (
                  <li
                    key={i}
                    className={i === now ? "is-now" : o.season!.includes(i) ? "is-on" : undefined}
                    aria-label={`${MONTH_NAMES[i]}${o.season!.includes(i) ? ", most recorded" : ""}${i === now ? ", this month" : ""}`}
                  >
                    {m}
                  </li>
                ))}
              </ol>
              <p className="org-small">{o.when}</p>
            </>
          ) : (
            <p className="org-body org-when">{o.when}</p>
          )}

          {o.with && (
            <>
              <h2 className="org-h2">Recorded here with</h2>
              <div className="chips org-with">
                {o.with.map((w) =>
                  w.id ? (
                    <Link key={w.name} href={`/map/organism/${w.id}`} className="chip">
                      {w.name}
                    </Link>
                  ) : (
                    <span key={w.name} className="chip">
                      {w.name}
                    </span>
                  ),
                )}
              </div>
            </>
          )}

          <div className="org-box org-impact">
            <h2 className="org-h3">Impact here</h2>
            <p className="org-body">{o.impact.text}</p>
            <p className="org-small">{o.impact.source}</p>
            <button type="button" className="org-link" aria-disabled="true">
              Read the source<span className="sr-only">, not built in the prototype yet</span>
            </button>
            <hr />
            <h2 className="org-h3">What you can do</h2>
            <ul className="org-rows">
              {o.actions.map((a) => (
                <li key={a.title}>
                  <button type="button" className="org-row" aria-disabled="true">
                    <span>
                      <b>{a.title}</b>
                      <span>{a.sub}</span>
                    </span>
                    <span className="sr-only">, not built in the prototype yet</span>
                    <ArrowIcon size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {o.generalised && <p className="org-small org-note">{o.generalised.note}</p>}
        </div>

        <aside className="org-side">
          <Actions o={o} />
          {!o.generalised && (
            <div className="org-box org-record org-record-desk">
              <Record o={o} />
            </div>
          )}
          {o.generalised && <p className="org-small">{o.generalised.note}</p>}

          {o.near && (
            <>
              <h2 className="org-h2">Where it’s recorded near you</h2>
              <ul className="org-box org-rows org-near">
                {o.near.map((n) => (
                  <li key={n.name}>
                    <button type="button" className="org-row" aria-disabled="true">
                      <span>
                        <b>{n.name}</b>
                        <span>{n.line}</span>
                      </span>
                      <span className="sr-only">, not built in the prototype yet</span>
                    <ArrowIcon size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <Link href="/map/near-you" className="btn btn-secondary org-routes">
                <MapIcon size={18} />
                Routes and spots to see it
              </Link>
            </>
          )}

          {o.docs && (
            <>
              <h2 className="org-h2">Documentaries</h2>
              {o.docs.map((d) => (
                <Link key={d.title} href="/learn" className="org-box org-doc">
                  <span className="org-doc-thumb" aria-hidden="true" />
                  <span>
                    <b>{d.title}</b>
                    <span>{d.line}</span>
                  </span>
                </Link>
              ))}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function Record({ o }: { o: Organism }) {
  return (
    <>
      <p className="org-record-title">{o.record.title}</p>
      {o.record.lines.map((l) => (
        <p key={l} className="org-small">
          {l}
        </p>
      ))}
    </>
  );
}
