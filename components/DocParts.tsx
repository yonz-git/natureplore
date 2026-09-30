"use client";

// The documentary item Flow D shares: the photograph with its length on it, the title, the year,
// length and what it covers, and how it can be watched. The same item is a card on Learn (D0) and
// in the collection from 64rem (D2), and a row in the collection on the phone, on D4 and in Saved;
// the list around it decides which (app/flow-d.css). It opens the documentary (D3), or D4 when it
// cannot be watched here, and remembers the page it was opened from.

import Link from "next/link";

import { LockIcon } from "@/components/Icons";
import { leaveFor } from "@/lib/back";
import { type Doc, docLine } from "@/lib/docs";

export function AccessPill({ doc }: { doc: Doc }) {
  return doc.available ? (
    <span className="fb-pill">{doc.access}</span>
  ) : (
    <span className="fb-pill">
      <LockIcon size={14} />
      Not available here
    </span>
  );
}

export function DocItem({ doc }: { doc: Doc }) {
  const href = `/learn/documentaries/${doc.id}`;
  return (
    <Link href={href} className="dc-item" onClick={() => leaveFor(href)}>
      <span className="dc-thumb" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={doc.photo.src} alt="" />
        <span className="dc-len">{doc.minutes} min</span>
      </span>
      <span className="dc-text">
        <b>{doc.title}</b>
        <span>{docLine(doc)}</span>
        <AccessPill doc={doc} />
      </span>
    </Link>
  );
}

/** A list of documentaries: `cards` scrolls sideways on the phone, `rows` sits in one glass box. */
export function DocList({ docs, as, label }: { docs: Doc[]; as: "cards" | "rows"; label?: string }) {
  return (
    <ul className={`dc-list is-${as}`} aria-label={label}>
      {docs.map((d) => (
        <li key={d.id}>
          <DocItem doc={d} />
        </li>
      ))}
    </ul>
  );
}
