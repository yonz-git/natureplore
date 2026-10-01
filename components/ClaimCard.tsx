"use client";

// The claim card (flow and IA redesign §2): the claim with its site and publisher, then its first
// action printed on it. The claim opens its page (C1a, C1b, C6); the action line opens the action
// (C3, C5). An action with no page of its own, C6's "Stay on the boardwalk", is plain text.
// Used on B1, the spots (L3), the walk (L4) and the crane (B4). Both links remember the page they
// were opened from, so the claim and the action go back to it. Each claim carries a photograph of
// the kind of ground it is about (lib/photos.ts), decorative, so the card reads the same without it.

import Link from "next/link";

import { ChevronIcon } from "@/components/Icons";
import { leaveFor } from "@/lib/back";
import { PHOTOS } from "@/lib/photos";
import type { Claim } from "@/lib/claims";

export function ClaimCard({ claim }: { claim: Claim }) {
  const photo = PHOTOS[`claims/${claim.id}`];
  return (
    <div className="fb-claim">
      {photo && <img className="sug-photo fb-claim-photo" src={photo.src} alt="" loading="lazy" />}
      <Link href={`/learn/claim/${claim.id}`} className="fb-claim-open" onClick={() => leaveFor(`/learn/claim/${claim.id}`)}>
        <span>
          <span className="fb-claim-text">{claim.claim}</span>
          <span className="fb-claim-scope">
            {claim.scope}
            <br />
            Sample figure for the prototype
          </span>
        </span>
        <ChevronIcon size={18} />
      </Link>
      {claim.actionId ? (
        <Link href={`/learn/action/${claim.actionId}`} className="fb-claim-act" onClick={() => leaveFor(`/learn/action/${claim.actionId}`)}>
          <span>
            <span className="fb-soft">What you can do: </span>
            {claim.action}
          </span>
          <ChevronIcon size={18} />
        </Link>
      ) : (
        <p className="fb-claim-act">
          <span>
            <span className="fb-soft">What you can do: </span>
            {claim.action}
          </span>
        </p>
      )}
    </div>
  );
}
