"use client";

import Link from "next/link";

import { LockIcon } from "@/components/ui/Icons";
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
