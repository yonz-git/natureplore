"use client";

// C1a, C1b and C6 · the claim: what is the claim, and what answers it? The tags, the claim with
// its site and review date, the two aerial dates where the figure comes from a survey, the figure
// with who published it and "Read the source" (C2), then what you can do (C3, C5, C7) or, for a
// recovering site, what was done and how to keep it that way, and the route it is on. On the
// phone a sheet over the photograph; from 64rem a wide sheet in two columns, as on the C1 and C6
// desktop boards. Back returns to the page the claim was opened from, Learn when nothing is known.
// Boards: C1a, C1b and C6, phone, tablet and desktop.

import Link from "next/link";
import { useEffect } from "react";

import { ActionRows, BackLink, BackTop, Stat, Tags } from "@/components/CParts";
import { CheckIcon, ChevronIcon, MapIcon } from "@/components/Icons";
import { backLabel, useBack } from "@/lib/back";
import type { Claim } from "@/lib/claims";

export default function ClaimScreen({ claim }: { claim: Claim }) {
  const back = useBack("/learn");
  const label = backLabel(back, "Back to Learn");

  // coming back from the source, focus returns to the link that opened it
  useEffect(() => {
    if (location.hash === "#read-source") document.getElementById("read-source")?.focus();
  }, []);

  const main = (
    <>
      <Tags tags={claim.tags} />
      <h1 id="claim-title" className="cp-claim">
        {claim.claim}
      </h1>
      <p className="org-small cp-reviewed">
        {claim.site}. {claim.reviewed}
      </p>

      {claim.aerial && (
        <figure className="cp-aerial">
          <div role="img" aria-label={`Aerial photographs of the designated site, ${claim.aerial[0]} and ${claim.aerial[1]}, not in the prototype yet`}>
            <span>
              <em>Aerial, {claim.aerial[0]}</em>
            </span>
            <span>
              <em>Aerial, {claim.aerial[1]}</em>
            </span>
          </div>
          <figcaption className="org-small">The designated site, two dates. Aerial photographs to come.</figcaption>
        </figure>
      )}

      <div className="cp-stats cp-stats-one">
        <Stat {...claim.stat} />
      </div>

      <div className="org-box cp-source">
        <p>{claim.sourceLine}</p>
        <p className="org-small">Sample figure for the prototype</p>
        <Link id="read-source" href={`/learn/claim/${claim.id}/source`} className="cp-link">
          Read the source
        </Link>
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
          <div className="org-box fb-rule">
            <span className="fb-rule-line">{claim.keep.line}</span>
            <span className="fb-rule-why">{claim.keep.why}</span>
          </div>
        </>
      )}

      <h2 className="org-h2">
        On this <em>route</em>
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
          <BackLink href={back} label={label} />
          {main}
        </div>
        <aside className="org-side">{side}</aside>
      </div>
    </section>
  );
}
