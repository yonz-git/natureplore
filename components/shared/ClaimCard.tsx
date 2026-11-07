"use client";

import Link from "next/link";

import { ChevronIcon } from "@/components/ui/Icons";
import { Where } from "@/components/shared/InSeasonList";
import { leaveFor } from "@/lib/back";
import { PHOTOS } from "@/lib/photos";
import type { Claim } from "@/lib/claims";

export function ClaimCard({ claim, spots = false }: { claim: Claim; spots?: boolean }) {
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
      {spots && claim.spots && <Where spots={claim.spots} />}
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
