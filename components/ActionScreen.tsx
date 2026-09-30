"use client";

// C3, C5 and C7 · an action: what does this action change, here? Three kinds, one page:
// C3 the September clean-up, a local event you register for (C4 is the registration);
// C5 supporting the group that rewets Linum meadow, which happens on the group's own site;
// C7 buying peat-free compost, an everyday practice you can save.
// Each says what it changes, the benefit, the figure or that there is none, and why here, with
// "See the claim". On the phone the action closes the page; from 64rem it sits in a card in the
// right column, as on the C3 and C7 desktop boards. Registering and saving are kept on the device.
// Boards: C3, C5 and C7, phone, tablet and desktop.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BackLink, BackTop, Benefits, Facts, KindTag, ShareButton, Stat } from "@/components/CParts";
import { BookmarkIcon, CalendarIcon, CheckCircleIcon, CheckIcon, ExternalIcon } from "@/components/Icons";
import type { Action, CleanUp, Figure, Practice, Support } from "@/lib/actions";
import { backLabel, useBack } from "@/lib/back";
import { creditLine, PHOTOS } from "@/lib/photos";
import { useSaved } from "@/lib/saved";

function FigureBox({ f }: { f: Figure }) {
  return (
    <div className="org-box cp-figure">
      <p className="cp-figure-value">
        <b>{f.value}</b> <small>{f.unit}</small>
      </p>
      <p className="cp-figure-line">{f.line}</p>
      <p className="org-small">{f.note}</p>
      <p className="org-small cp-figure-source">{f.source}</p>
    </div>
  );
}

function SeeClaim({ id }: { id: string }) {
  return (
    <Link href={`/learn/claim/${id}`} className="cp-link">
      See the claim
    </Link>
  );
}

// ── C3 ────────────────────────────────────────────────────────────────────────────────────────

function CleanUpMain({ a, going }: { a: CleanUp; going: number }) {
  const photo = PHOTOS["routes/linum"];
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="org-photo cp-photo" src={a.image} alt="Cranes on an open meadow" />
      <p className="org-credit">{creditLine(photo)}</p>
      <KindTag kind={a.kind} icon={a.kindIcon} />
      <h1 id="action-title" className="org-title cp-title">
        {a.title} <em>{a.close}</em>
      </h1>
      <p className="org-small cp-reviewed">{a.place}</p>
      <div className="cp-stats">
        {a.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
        <Stat label="Going" value={String(going)} />
      </div>
      <div className="org-box">
        <Facts items={a.facts} />
      </div>
      <h2 className="org-h2">
        What it <em>changes</em>
      </h2>
      <p className="org-body">{a.changes}</p>
      <Benefits items={a.benefits} />
      <div className="org-box cp-quantified">
        <h3>{a.quantified.title}</h3>
        <p>{a.quantified.text}</p>
      </div>
      <h2 className="org-h2">
        Why <em>here</em>
      </h2>
      <p className="org-body">{a.why}</p>
      <SeeClaim id={a.claimId} />
    </>
  );
}

function CleanUpSide({ a, registered, register }: { a: CleanUp; registered: boolean; register: () => void }) {
  return (
    <div className="org-box cp-act">
      {registered ? (
        <>
          <p className="cp-act-status">
            <CheckCircleIcon size={20} />
            You are registered
          </p>
          <Link href={`/learn/action/${a.id}/registered`} className="btn btn-secondary">
            See your registration
          </Link>
        </>
      ) : (
        <>
          <button id="register" type="button" className="btn btn-primary" onClick={register}>
            <CalendarIcon size={19} />
            Register for the clean-up
          </button>
          <p className="org-small">Registering asks for nothing</p>
        </>
      )}
      <ShareButton title={`${a.title} ${a.close}`} className="btn btn-secondary" label />
    </div>
  );
}

// ── C5 ────────────────────────────────────────────────────────────────────────────────────────

function SupportMain({ a }: { a: Support }) {
  return (
    <>
      <KindTag kind={a.kind} icon={a.kindIcon} />
      <h1 id="action-title" className="org-title cp-title">
        {a.title} <em>{a.close}</em>
      </h1>
      <div className="org-box cp-org">
        <b>{a.org}</b>
        <span className="org-small">{a.orgLine}</span>
      </div>
      <h2 className="org-h2">
        What your support <em>does here</em>
      </h2>
      <ul className="org-box cp-facts cp-done">
        {a.does.map((d) => (
          <li key={d}>
            <CheckIcon size={20} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <Benefits items={a.benefits} />
      <FigureBox f={a.figure} />
      <SeeClaim id={a.claimId} />
    </>
  );
}

function SupportSide({ a }: { a: Support }) {
  return (
    <div className="org-box cp-act">
      <p className="org-small cp-act-note">{a.external}</p>
      <button type="button" className="btn btn-primary" aria-disabled="true">
        <ExternalIcon size={19} />
        Open the group&apos;s page
        <span className="sr-only">, not linked in the prototype, the group is sample content</span>
      </button>
      <p className="org-small">Opens outside Natureplore</p>
    </div>
  );
}

// ── C7 ────────────────────────────────────────────────────────────────────────────────────────

function PracticeMain({ a }: { a: Practice }) {
  return (
    <>
      <KindTag kind={a.kind} icon={a.kindIcon} />
      <h1 id="action-title" className="org-title cp-title">
        {a.title} <em>{a.close}</em>
      </h1>
      <p className="org-body cp-lead">{a.lead}</p>
      <div className="org-box">
        <Facts items={a.facts} />
      </div>
      <h2 className="org-h2">
        What it <em>changes</em>
      </h2>
      <p className="org-body">{a.changes}</p>
      <Benefits items={a.benefits} />
      <FigureBox f={a.figure} />
      <h2 className="org-h2">
        How to <em>do it</em>
      </h2>
      <ol className="org-box cp-steps">
        {a.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h2 className="org-h2">
        Why <em>here</em>
      </h2>
      <p className="org-body">{a.why}</p>
      {/* the second source was removed from C7 in the redesign; the claim holds the source */}
      <SeeClaim id={a.claimId} />
    </>
  );
}

function PracticeSide({ saved, toggle }: { saved: boolean; toggle: () => void }) {
  return (
    <div className="org-box cp-act">
      {/* one button that stays mounted, so focus stays on it when it changes */}
      <button type="button" className={`btn ${saved ? "btn-secondary" : "btn-primary"}`} aria-pressed={saved} onClick={toggle}>
        <BookmarkIcon size={19} filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
      <p className="org-small" aria-live="polite">
        {saved ? "Saved. Kept on this device, in Saved under Actions" : "Kept on this device, in Saved under Actions"}
      </p>
    </div>
  );
}

// ── the page ──────────────────────────────────────────────────────────────────────────────────

export default function ActionScreen({ action: a }: { action: Action }) {
  const router = useRouter();
  const { isSaved, toggle } = useSaved();
  const key = `action:${a.id}`;
  const on = isSaved(key);
  const back = useBack(`/learn/claim/${a.claimId}`);
  const label = backLabel(back, "Back to the claim");

  // after cancelling a registration, focus lands on Register, where the cancelled step began
  useEffect(() => {
    if (location.hash === "#register") document.getElementById("register")?.focus();
  }, []);

  let main: React.ReactNode;
  let side: React.ReactNode;
  if (a.type === "event") {
    main = <CleanUpMain a={a} going={a.going + (on ? 1 : 0)} />;
    side = (
      <CleanUpSide
        a={a}
        registered={on}
        register={() => {
          toggle(key);
          router.push(`/learn/action/${a.id}/registered`);
        }}
      />
    );
  } else if (a.type === "support") {
    main = <SupportMain a={a} />;
    side = <SupportSide a={a} />;
  } else {
    main = <PracticeMain a={a} />;
    side = <PracticeSide saved={on} toggle={() => toggle(key)} />;
  }

  return (
    // opened from the walk, the tab bar stays hidden as it is on the walk (see app/organism.css)
    <section className={`org cp${back.startsWith("/walk") ? " is-walk" : ""}`} aria-labelledby="action-title">
      <BackTop href={back} label={label} share={a.type === "support" ? undefined : `${a.title} ${a.close}`} />
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <BackLink href={back} label={label} />
          {main}
        </div>
        <aside className="org-side cp-side" aria-label="Take part">
          {side}
        </aside>
      </div>
    </section>
  );
}
