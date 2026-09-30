"use client";

// The claim card (flow and IA redesign §2): the claim with its site and publisher, then its first
// action printed on it. The claim opens its page (C1a, C1b, C6); the action line opens the action
// (C3, C5). An action with no page of its own, C6's "Stay on the boardwalk", is plain text.
// Used on B1, the spots (L3), the walk (L4) and the crane (B4). Both links remember the page they
// were opened from, so the claim and the action go back to it.

import Link from "next/link";

import { ChevronIcon } from "@/components/Icons";
import { leaveFor } from "@/lib/back";
import type { Claim } from "@/lib/claims";

export function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <div className="fb-claim">
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
