"use client";

// C1a, C1b and C6 · the claim: what is the claim, and what answers it? The tags, the claim with
// its site and review date, the photograph its card carries (lib/photos.ts, credited on the credits
// page), the figure with who published it and "Read the source" (C2), which opens the source in
// place, then what you can do (C3, C5, C7) or, for a recovering site, what was done and how to keep
// it that way, and the related route. On the
// phone a sheet over the photograph; from 64rem a wide sheet in two columns, as on the C1 and C6
// desktop boards. Back returns to the page the claim was opened from, Learn when nothing is known.
// Boards: C1a, C1b and C6, phone, tablet and desktop.

import Link from "next/link";
import { useState } from "react";

import { ActionRows, BackTop, Stat, Tags } from "@/components/CParts";
import { CheckIcon, ChevronIcon, ExternalIcon, LockIcon, MapIcon } from "@/components/Icons";
import { backLabel, useBack } from "@/lib/back";
import type { Claim } from "@/lib/claims";
import { PHOTOS } from "@/lib/photos";

export default function ClaimScreen({ claim }: { claim: Claim }) {
  const back = useBack("/learn");
  const label = backLabel(back, "Back to Learn");

  const [source, setSource] = useState(false);
  const s = claim.source;

  // the same photograph as the claim's card on the route, decorative
  const photo = PHOTOS[`claims/${claim.id}`];

  const main = (
    <>
      <Tags tags={claim.tags} />
      <h1 id="claim-title" className="cp-claim">
        {claim.claim}
      </h1>
      <p className="org-small cp-reviewed">
        {claim.site}. {claim.reviewed}
      </p>

      {photo && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="org-photo cp-photo cp-claim-photo" src={photo.src} alt="" />
        </>
      )}

      <div className="cp-stats cp-stats-one">
        <Stat {...claim.stat} />
      </div>

      {/* C2 · the source opens in place under its line: the report, who published it, when, how and
          what it covers, and the way to the publisher. The figures are not checked against any
          publication yet, so the publisher's page is not linked: it would send people to a real
          agency for a figure it never published. */}
      <div className={`org-box cp-source${source ? " is-open" : ""}`}>
        <p>{claim.sourceLine}</p>
        <p className="org-small">Sample figure for the prototype</p>
        <button type="button" className="cp-link cp-source-toggle" aria-expanded={source} aria-controls="claim-source" onClick={() => setSource(!source)}>
          Read the source
          <ChevronIcon size={18} />
        </button>
        <div id="claim-source" className="cp-source-detail" inert={!source}>
          <div>
            <h3 className="cp-source-title">
              {s.title && `${s.title} `}
              {s.close && <em>{s.close}</em>}
            </h3>
            <dl className="cp-dl">
              <div>
                <dt>Publisher</dt>
                <dd>{s.publisher}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{s.published}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{s.method}</dd>
              </div>
              <div>
                <dt>Covers</dt>
                <dd>{s.covers}</dd>
              </div>
            </dl>
            {s.paywall && (
              <p className="cp-note">
                <LockIcon size={20} />
                <span>The full report needs a subscription on the publisher&apos;s site.</span>
              </p>
            )}
            <div className="cp-out">
              <button type="button" className="btn btn-primary" aria-disabled="true">
                <ExternalIcon size={19} />
                Open the publisher&apos;s page
                <span className="sr-only">, not linked while the figure is sample content</span>
              </button>
              <p className="org-small">Opens outside Natureplore. Not linked in the prototype.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const side = (
    <>
      {claim.actions && (
        <>
          <h2 className="org-h2 org-h2-first">
            What you <em>can do</em>
          </h2>
          <ActionRows ids={claim.actions} />
        </>
      )}
      {claim.done && (
        <>
          <h2 className="org-h2 org-h2-first">
            What <em>was done</em>
          </h2>
          <ul className="org-box cp-facts cp-done">
            {claim.done.map((d) => (
              <li key={d}>
                <CheckIcon size={20} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {claim.keep && (
        <>
          <h2 className="org-h2">
            Keep it <em>that way</em>
          </h2>
          <div className="org-box fb-rule cp-keep">
            <span className="fb-rule-line">{claim.keep.line}</span>
            <span className="fb-rule-why">{claim.keep.why}</span>
          </div>
        </>
      )}

      <h2 className="org-h2">
        Related <em>route</em>
      </h2>
      {claim.route.href ? (
        <ul className="fb-card fb-rows cp-rows">
          <li>
            <Link href={claim.route.href} className="fb-row">
              <span className="cp-icon" aria-hidden="true">
                <MapIcon size={22} />
              </span>
              <span className="fb-row-text">
                <b>{claim.route.name}</b>
                <span>{claim.route.line}</span>
              </span>
              <ChevronIcon size={18} />
            </Link>
          </li>
        </ul>
      ) : (
        <div className="org-box cp-plain">
          <b>{claim.route.name}</b>
          <span className="org-small">{claim.route.line}. Not in the prototype yet.</span>
        </div>
      )}
    </>
  );

  return (
    // opened from the walk, the tab bar stays hidden as it is on the walk (see app/organism.css)
    <section className={`org cp${back.startsWith("/walk") ? " is-walk" : ""}`} aria-labelledby="claim-title">
      <BackTop href={back} label={label} share={claim.claim} />
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          {main}
        </div>
        <aside className="org-side">{side}</aside>
      </div>
    </section>
  );
}
