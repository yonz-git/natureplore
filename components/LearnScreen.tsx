"use client";

// D0 · Learn, the Learn tab: three sections with chips that jump to them. Impact holds the claim
// cards, grouped by protected site, each with its first action (C1a, C1b, C6); What you can do
// lists the actions, soonest first, then everyday habits (C3, C5, C7); Documentaries shows three
// and opens the collection (D2). On the phone one glass sheet under the top; from 64rem a wide
// sheet under the nav, the claims two to a row and the documentaries three.
// Boards: D0, phone, tablet and desktop.

import Link from "next/link";

import { ClaimCard } from "@/components/ClaimCard";
import { ActionRows } from "@/components/CParts";
import { DocList } from "@/components/DocParts";
import { ChevronIcon } from "@/components/Icons";
import { LEARN_ACTIONS } from "@/lib/actions";
import { CLAIMS } from "@/lib/claims";
import { docById, LEARN_DOCS } from "@/lib/docs";

const SITES = [
  { name: "NSG Oberes Rhinluch", claims: ["c1a", "c1b"] },
  { name: "LSG Tegeler Fließtal", claims: ["c6"] },
];

function SectionHead({ id, title, close, line, children }: { id: string; title?: string; close: string; line: string; children?: React.ReactNode }) {
  return (
    <div className="ln-sec">
      <div>
        <h2 id={id} className="org-h2">
          {title && `${title} `}
          <em>{close}</em>
        </h2>
        <p className="org-small">{line}</p>
      </div>
      {children}
    </div>
  );
}

export default function LearnScreen() {
  const docs = LEARN_DOCS.map((id) => docById(id)!);

  return (
    <section className="org ln ln-home" aria-labelledby="d0-title">
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <h1 id="d0-title" className="org-title ln-title">
            <em>Learn</em>
          </h1>
          <p className="org-small ln-sub">Berlin and Brandenburg</p>
          <nav className="chips ln-jump" aria-label="Jump to a section">
            <a href="#sec-impact" className="chip">
              Impact
            </a>
            <a href="#sec-act" className="chip">
              What you can do
            </a>
            <a href="#sec-docs" className="chip">
              Documentaries
            </a>
          </nav>

          <section className="ln-part" aria-labelledby="sec-impact">
            <SectionHead id="sec-impact" close="Impact" line="Sourced claims about protected sites, each with what you can do" />
            {SITES.map((site) => (
              <div key={site.name}>
                <h3 className="ln-site">{site.name}</h3>
                <div className="ln-claims">
                  {site.claims.map((id) => (
                    <ClaimCard key={id} claim={CLAIMS[id]} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="ln-part" aria-labelledby="sec-act">
            <SectionHead id="sec-act" title="What you" close="can do" line="Soonest first, then everyday habits" />
            <ActionRows ids={LEARN_ACTIONS} long />
          </section>

          <section className="ln-part" aria-labelledby="sec-docs">
            <SectionHead id="sec-docs" close="Documentaries" line="Curated links, watching happens on the maker's site">
              <Link href="/learn/documentaries" className="ln-more">
                Open the collection
                <ChevronIcon size={18} />
              </Link>
            </SectionHead>
            <DocList docs={docs} as="cards" />
          </section>
        </div>
      </div>
    </section>
  );
}
