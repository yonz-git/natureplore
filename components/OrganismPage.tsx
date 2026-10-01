"use client";

// B4 · Organism, and B5 · the same with its location generalised. The photograph, the name, the
// spot and route it was recorded at, the record, why it is here, when to look, the spots where it
// is recorded, the impact here (the claim card and the same action row as its spot) and the
// documentaries. A species at risk from collection shows only an area, never a point, and nothing
// that would narrow it down again. On the phone it is a sheet under three round controls; from
// 64rem a wide sheet in two columns. Back returns where the page was opened: the spot page, or the
// walk on its spot (B4-walk). Boards: B4, B4-walk and B5, version 6.

import Link from "next/link";

import { ArrowIcon, BackIcon, BookmarkIcon, ChevronIcon, EyeOffIcon, ShareIcon } from "@/components/Icons";
import { ActionRow, ClaimCard, MonthGrid, SpotMark } from "@/components/SpotParts";
import type { Organism } from "@/lib/organisms";
import { leaveFor } from "@/lib/back";
import { docById, docLine } from "@/lib/docs";
import { useSaved } from "@/lib/saved";
import { creditLine, organismPhoto } from "@/lib/photos";

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

/** `walk` is set when the page was opened from the walk: the tab bar stays hidden, as on the walk. */
export default function OrganismPage({ o, back, walk = false }: { o: Organism; back: { href: string; label: string }; walk?: boolean }) {
  const photo = organismPhoto(`${o.name} ${o.close}`);
  const name = `${o.name} ${o.close}`;

  return (
    <section className={`org${walk ? " is-walk" : ""}`} aria-labelledby="org-title">
      <div className="org-top">
        <Link href={back.href} className="round glass glass-pin" aria-label={back.label}>
          <BackIcon size={20} />
        </Link>
        <Actions o={o} />
      </div>

      <div className="org-sheet glass glass-top">
        <div className="org-main">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="org-photo" src={photo.src} alt={name.trim()} />
          ) : (
            <div className="org-photo" role="img" aria-label={`Photograph of the ${name.toLowerCase()} to come`} />
          )}
          <p className="org-credit">{photo ? creditLine(photo) : o.credit}</p>
          <h1 id="org-title" className="org-title">
            {o.name} <em>{o.close}</em>
          </h1>
          <p className="org-kind">
            {o.kind}, <i>{o.latin}</i>
          </p>
          {o.scope && <p className="org-scope">{o.scope}</p>}

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
            <div className="org-box org-record">
              <p className="org-record-title">{o.record.title}</p>
              {o.record.lines.map((l) => (
                <p key={l} className="org-small">
                  {l}
                </p>
              ))}
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
              <MonthGrid months={o.season} label="Most recorded" />
              <p className="org-small">{o.when}</p>
            </>
          ) : (
            <p className="org-body org-when">{o.when}</p>
          )}

          {o.where && (
            <>
              <h2 className="org-h2">
                Where it’s <em>recorded</em>
              </h2>
              <ol className="fb-card fb-rows">
                {o.where.map((w) => (
                  <li key={w.n}>
                    <Link href={`/map/route/linum?spot=${w.n}`} className="fb-row">
                      <SpotMark n={w.n} />
                      <span className="fb-row-text">
                        <b>
                          Spot {w.n}, {w.name}
                        </b>
                        <span>{w.line}</span>
                      </span>
                      <ChevronIcon size={18} />
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}

          {o.generalised && <p className="org-small org-note">{o.generalised.note}</p>}
        </div>

        <aside className="org-side">

          <h2 className="org-h2 org-h2-first">
            Impact <em>here</em>
          </h2>
          {o.claim && (
            <div className="fb-stack">
              <ClaimCard claim={o.claim} />
              {o.rule && <ActionRow spot={o.rule} className="fb-card" />}
            </div>
          )}
          {o.impact && (
            <div className="org-box org-impact">
              <p className="org-body">{o.impact.text}</p>
              <p className="org-small">{o.impact.source}</p>
              <hr />
              <h3 className="org-h3">What you can do</h3>
              <ul className="org-rows">
                {o.actions?.map((a) => (
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
          )}

          {o.docs && (
            <>
              <h2 className="org-h2">Documentaries</h2>
              {o.docs.map((id) => {
                const d = docById(id)!;
                const href = `/learn/documentaries/${id}`;
                return (
                  <Link key={id} href={href} className="org-box org-doc" onClick={() => leaveFor(href)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="org-doc-thumb" src={d.photo.src} alt="" />
                    <span>
                      <b>{d.title}</b>
                      <span>{docLine(d)}</span>
                    </span>
                    <ChevronIcon size={18} />
                  </Link>
                );
              })}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
