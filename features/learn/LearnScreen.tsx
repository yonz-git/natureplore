"use client";

// D0 · Learn

import Link from "next/link";
import { useRef, useState } from "react";

import { ClaimCard } from "@/components/shared/ClaimCard";
import { RegionLine } from "@/components/shared/RegionLine";
import { ActionRows } from "@/components/shared/CParts";
import { DocList } from "@/features/learn/DocParts";
import { ChevronIcon } from "@/components/ui/Icons";
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

  const landing = (box: HTMLElement) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const stick = box.querySelector<HTMLElement>(".ln-stick");
    if (stick?.offsetParent) return box.getBoundingClientRect().top + parseFloat(getComputedStyle(stick).top) + stick.offsetHeight + 1.5 * rem;
    return scrollerOf(box).getBoundingClientRect().top + 1.5 * rem;
  };
  const headTop = (id: Section) => {
    const part = document.getElementById(`sec-${id}`)?.closest<HTMLElement>(".ln-part");
    const head = part?.firstElementChild;
    return part && head ? part.getBoundingClientRect().top + parseFloat(getComputedStyle(head).marginTop) : null;
  };

  const onScroll = () => {
    const box = root.current;
    if (!box) return;
    const scroller = scrollerOf(box);
    const stick = box.querySelector<HTMLElement>(".ln-stick");
    if (stick?.offsetParent) {
      const bottom = stick.getBoundingClientRect().bottom;
      for (let el = stick.nextElementSibling as HTMLElement | null; el; el = el.nextElementSibling as HTMLElement | null)
        el.style.setProperty("--cut", `${bottom - el.getBoundingClientRect().top}px`);
    }
    if (jumping.current) return;
    const line = landing(box) + 1;
    let id: Section = SECTIONS[0][0];
    for (const [s] of SECTIONS) {
      const top = headTop(s);
      if (top !== null && top <= line) id = s;
    }
    if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 1) id = SECTIONS[SECTIONS.length - 1][0];
    setCurrent(id);
  };

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
