// L3 · Spot: what should I know at this spot this month? The spot block (what to look for, what
// not to do here, the previous and next spot), then when it is in season, what is happening here
// and what else is recorded. The crane at spots 1 and 2 opens its page (B4). A sheet over the
// photograph on the phone; from 64rem the same sheet, centred. Boards: L3-1 to L3-6, phone.

import Link from "next/link";

import { BackIcon, ChevronIcon } from "@/components/Icons";
import { ClaimCard, MonthGrid, RecordedToo, SpotBlock } from "@/components/SpotParts";
import type { Route } from "@/lib/routes";
import type { Claim, Spot } from "@/lib/spots";

export default function SpotScreen({ route, spot, total, claim }: { route: Route; spot: Spot; total: number; claim: Claim }) {
  const href = (n: number) => `/map/route/${route.id}/spot/${n}`;
  const nav = (
    <nav aria-label="Spots" className="fb-nav">
      {spot.n > 1 ? (
        <Link href={href(spot.n - 1)} className="fb-nav-btn" replace>
          <BackIcon size={18} />
          Spot {spot.n - 1}
        </Link>
      ) : (
        <span />
      )}
      {spot.n < total ? (
        <Link href={href(spot.n + 1)} className="fb-nav-btn" replace>
          Spot {spot.n + 1}
          <ChevronIcon size={18} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  return (
    <section className="saved l3">
      <Link href={`/map/route/${route.id}`} className="round glass glass-pin a8-top" aria-label={`Back to ${route.name}`}>
        <BackIcon size={20} />
      </Link>
      <div className="saved-sheet glass" key={spot.n}>
        <SpotBlock
          spot={spot}
          total={total}
          routeName={route.name}
          nav={nav}
          titleId="l3-title"
          organismHref={(id) => `/map/organism/${id}?spot=${spot.n}`}
        />

        <h2>When</h2>
        <MonthGrid months={spot.months} />
        <p className="fb-small">In season {spot.when === "All year" ? "all year" : spot.when}</p>

        <h2>
          What is happening <em>here</em>
        </h2>
        <ClaimCard claim={claim} />

        <h2>
          Recorded here <em>too</em>
        </h2>
        <RecordedToo />
      </div>
    </section>
  );
}
