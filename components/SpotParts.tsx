// The pieces Flow B shares, each built once (flow and IA redesign §2):
// the spot block, the whole walk sheet and the top of the spot page; the claim card, with its
// first action printed on it (B1, L3, L4, B4); the action row, a restraint and its mechanism
// (L3, L4, B4); and the month grid (L3, L4, B4). Flow C, the claim and action pages, is not built
// in the prototype yet, so the claim card is text and its action line a control with nowhere to go.

import Link from "next/link";

import { ChevronIcon } from "@/components/Icons";
import { MONTH_LETTERS, MONTH_NAMES, NOW, type Claim, type Spot } from "@/lib/spots";
import { MONTH } from "@/lib/suggestions";

export function MonthGrid({ months, label = "In season" }: { months: number[]; label?: string }) {
  return (
    <ol className="fb-months" aria-label={`${label}: ${months.length === 12 ? "all year" : months.map((m) => MONTH_NAMES[m]).join(", ")}`}>
      {MONTH_LETTERS.map((m, i) => (
        <li
          key={i}
          aria-hidden="true"
          className={months.includes(i) ? (i === NOW ? "is-now" : "is-on") : undefined}
        >
          {m}
        </li>
      ))}
    </ol>
  );
}

export function ClaimCard({ claim }: { claim: Claim }) {
  // the claim stays readable as text until its page (C1) exists; only the action line is a control
  return (
    <div className="fb-claim">
      <div className="fb-claim-open">
        <span>
          <span className="fb-claim-text">{claim.claim}</span>
          <span className="fb-claim-scope">
            {claim.scope}
            <br />
            Sample figure for the prototype
          </span>
        </span>
      </div>
      <button type="button" className="fb-claim-act" aria-disabled="true">
        <span>
          <span className="fb-soft">What you can do: </span>
          {claim.action}
        </span>
        <span className="sr-only">, not built in the prototype yet</span>
        <ChevronIcon size={18} />
      </button>
    </div>
  );
}

/** What not to do here, or what to do: the line, then why it matters. */
export function ActionRow({ spot, className = "" }: { spot: Spot; className?: string }) {
  return (
    <div className={`fb-rule ${className}`}>
      <span className="fb-label">{spot.kind === "dont" ? "What not to do here" : "What to do here"}</span>
      <span className="fb-rule-line">{spot.line}</span>
      <span className="fb-rule-why">{spot.why}</span>
    </div>
  );
}

export function SpotMark({ n, size = "md" }: { n: number; size?: "md" | "lg" }) {
  return (
    <span className={`spot-mark fb-mark${size === "lg" ? " is-lg" : ""}`} aria-hidden="true">
      {n}
    </span>
  );
}

/**
 * The spot, one block. `nav` is the previous and next pair: links between spot pages on L3,
 * buttons that swap the sheet on the walk. `organismHref` says where a named organism opens.
 */
export function SpotBlock({
  spot,
  total,
  routeName,
  nav,
  organismHref,
  titleId,
  heading: H = "h1",
}: {
  spot: Spot;
  total: number;
  routeName: string;
  nav: React.ReactNode;
  organismHref?: (id: string) => string;
  titleId: string;
  heading?: "h1" | "h2";
}) {
  return (
    <section className="fb-spot" aria-labelledby={titleId}>
      <div className="fb-spot-head">
        <SpotMark n={spot.n} size="lg" />
        <div>
          <span className="fb-soft">
            Spot {spot.n} of {total}
          </span>
          <H id={titleId} className="fb-spot-title">
            {spot.name}
          </H>
          <span className="fb-soft">{routeName}</span>
        </div>
      </div>

      {spot.out ? (
        <p className="fb-out">{spot.out}</p>
      ) : (
        <div className="fb-look">
          <span className="fb-label">Look for in {MONTH}</span>
          <ul>
            {spot.look.map((l) => {
              const body = (
                <span className="fb-look-text">
                  <span className="fb-look-name">
                    {l.name}
                    {l.what && `, ${l.what}`}
                  </span>
                  <span className="fb-rule-why">Last recorded {l.last}</span>
                </span>
              );
              return (
                <li key={l.name}>
                  {l.organism && organismHref ? (
                    <Link href={organismHref(l.organism)} className="fb-look-link">
                      {body}
                      <ChevronIcon size={18} />
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ActionRow spot={spot} />
      {nav}
    </section>
  );
}

/** What else is recorded at a spot: a placeholder on the boards, because §3 lists no other organisms per spot. */
export function RecordedToo() {
  return <p className="fb-card fb-placeholder">[Other organisms recorded at this spot, with their last-recorded dates]</p>;
}
