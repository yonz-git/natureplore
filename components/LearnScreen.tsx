"use client";

// D0 · Learn, the Learn tab: three sections with chips that jump to them. Impact holds the claim
// cards, grouped by protected site, each with its first action (C1a, C1b, C6); What you can do
// lists the actions, soonest first, then everyday habits (C3, C5, C7); Documentaries shows three
// and opens the collection (D2). On the phone one glass sheet under the top; from 64rem a wide
// sheet under the nav, the claims two to a row and the documentaries three.
// Boards: D0, phone, tablet and desktop.

import Link from "next/link";
import { useRef, useState } from "react";

import { ClaimCard } from "@/components/ClaimCard";
import { RegionLine } from "@/components/RegionLine";
import { ActionRows } from "@/components/CParts";
import { DocList } from "@/components/DocParts";
import { ChevronIcon } from "@/components/Icons";
import { LEARN_ACTIONS } from "@/lib/actions";
import { CLAIMS } from "@/lib/claims";
import { docById, LEARN_DOCS } from "@/lib/docs";
import { easeScroll } from "@/lib/ease-scroll";

const SECTIONS = [
  ["impact", "Impact"],
  ["act", "What you can do"],
  ["docs", "Documentaries"],
] as const;
type Section = (typeof SECTIONS)[number][0];

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

// The jump chips, as on the route page: the chip for the section under them is the current one.
function JumpChips({ className, current, onJump }: { className?: string; current: Section; onJump: (e: React.MouseEvent, id: Section) => void }) {
  return (
    <nav className={`chips ln-jump${className ? ` ${className}` : ""}`} aria-label="Jump to a section">
      {SECTIONS.map(([id, label]) => (
        <a key={id} href={`#sec-${id}`} className="chip" data-text={label} aria-current={current === id ? "location" : undefined} onClick={(e) => onJump(e, id)}>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

// The title and the place, and under 64rem the jump chips. Under 64rem they sit above the sheet on
// the photograph, always in view while the sheet scrolls under them; from 64rem the title and place
// are the top of the wide sheet and the chips stay at the top of the window as the page scrolls.
// Drawn in both places, one hidden at each size, because inside the glass a fixed header would be
// held by the sheet's backdrop filter rather than the screen.
function LearnHead({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <div className={className}>
      <h1 className="org-title ln-title">
        <em>Learn</em>
      </h1>
      <RegionLine className="ln-sub">Berlin and Brandenburg</RegionLine>
      {children}
    </div>
  );
}

/** the scroller at this size: the sheet under 64rem, the whole page from 64rem */
const scrollerOf = (root: HTMLElement) => {
  const sheet = root.querySelector<HTMLElement>(".org-sheet")!;
  return getComputedStyle(sheet).overflowY === "auto" ? sheet : root;
};

export default function LearnScreen() {
  const docs = LEARN_DOCS.map((id) => docById(id)!);
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<Section>(SECTIONS[0][0]);
  const jumping = useRef(false);
  const jumps = useRef(0);

  // where a section's heading lands after a jump: 1.5rem under the stuck chips from 64rem, 1.5rem under
  // the sheet's top edge below that
  const landing = (box: HTMLElement) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const stick = box.querySelector<HTMLElement>(".ln-stick");
    if (stick?.offsetParent) return box.getBoundingClientRect().top + parseFloat(getComputedStyle(stick).top) + stick.offsetHeight + 1.5 * rem;
    return scrollerOf(box).getBoundingClientRect().top + 1.5 * rem;
  };
  // a section's heading where it rests: measured from the section, which never moves, since what it
  // holds is still rising into place (.ln-part > * in app/flow-d.css) as it comes into view
  const headTop = (id: Section) => {
    const part = document.getElementById(`sec-${id}`)?.closest<HTMLElement>(".ln-part");
    const head = part?.firstElementChild;
    return part && head ? part.getBoundingClientRect().top + parseFloat(getComputedStyle(head).marginTop) : null;
  };

  const onScroll = () => {
    const box = root.current;
    if (!box) return;
    const scroller = scrollerOf(box);
    // from 64rem what scrolls under the stuck chips is cut away and fades in below them, as on the
    // route page; each block after the chips is masked on its own, since a mask on the sheet would cut
    // the chips too
    const stick = box.querySelector<HTMLElement>(".ln-stick");
    if (stick?.offsetParent) {
      const bottom = stick.getBoundingClientRect().bottom;
      for (let el = stick.nextElementSibling as HTMLElement | null; el; el = el.nextElementSibling as HTMLElement | null)
        el.style.setProperty("--cut", `${bottom - el.getBoundingClientRect().top}px`);
    }
    // while a chip's jump is scrolling, the chip that was tapped stays current
    if (jumping.current) return;
    const line = landing(box) + 1;
    let id: Section = SECTIONS[0][0];
    for (const [s] of SECTIONS) {
      const top = headTop(s);
      if (top !== null && top <= line) id = s;
    }
    // at the foot of the page the last section is current, even when it is too short to reach the line
    if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 1) id = SECTIONS[SECTIONS.length - 1][0];
    setCurrent(id);
  };

  // a chip glides the page to its section, eased, and the section lands just under the chips
  const jumpTo = (e: React.MouseEvent, id: Section) => {
    const box = root.current;
    const head = headTop(id);
    if (!box || head === null) return;
    e.preventDefault();
    const scroller = scrollerOf(box);
    const top = scroller.scrollTop + head - landing(box);
    const jump = ++jumps.current;
    jumping.current = true;
    easeScroll(scroller, { top }).then(() => {
      if (jumps.current === jump) jumping.current = false;
    });
    history.replaceState(null, "", `#sec-${id}`);
    setCurrent(id);
  };

  return (
    <section ref={root} className="org ln ln-home" aria-label="Learn" onScrollCapture={onScroll}>
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <LearnHead className="ln-head" />
          <JumpChips className="ln-stick" current={current} onJump={jumpTo} />

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

          <p className="ln-credits">
            <Link href="/learn/credits">Credits</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
