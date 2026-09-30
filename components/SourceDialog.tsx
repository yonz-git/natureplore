"use client";

// C2a, C2b and C2c · the source: where does this figure come from? A sheet over the claim, as on
// the boards: the report's title, who published it, when, how and what it covers, the claim it
// supports, that the figure is sample content, and the way to the publisher. The figures are not
// checked against any publication yet, so the publisher's page is not linked: it would send people
// to a real agency for a figure it never published. Close returns to "Read the source".
// Boards: C2a, C2b and C2c, phone, and C2 desktop.

import Link from "next/link";

import { Dialog } from "@/components/CParts";
import { CloseIcon, ExternalIcon, InfoIcon, LockIcon } from "@/components/Icons";
import type { Claim } from "@/lib/claims";

export default function SourceDialog({ claim }: { claim: Claim }) {
  const close = `/learn/claim/${claim.id}#read-source`;
  const s = claim.source;
  return (
    <Dialog labelledBy="c2-title" close={close}>
      <div className="cp-dialog-head">
        <p className="cp-tag">
          <InfoIcon size={16} />
          Source
        </p>
        <Link href={close} replace className="round cp-close" aria-label="Close the source">
          <CloseIcon size={20} />
        </Link>
      </div>
      <h1 id="c2-title" tabIndex={-1} className="cp-dialog-title">
        {s.title && `${s.title} `}
        {s.close && <em>{s.close}</em>}
      </h1>

      <dl className="org-box cp-dl">
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

      <blockquote className="cp-quote">
        <p>“{claim.claim}”</p>
      </blockquote>

      <p className="org-box cp-note">
        <InfoIcon size={20} />
        <span>Sample figure for the prototype. Not yet checked against the publication.</span>
      </p>
      {s.paywall && (
        <p className="org-box cp-note">
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
    </Dialog>
  );
}
