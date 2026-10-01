// The pieces Flow B shares, each built once (flow and IA redesign §2):
// the spot block, the whole walk sheet and the top of the spot page; the claim card, with its
// first action printed on it (B1, L3, L4, B4); the action row, a restraint and its mechanism
// (L3, L4, B4); and the month grid (L3, L4, B4). The claim card lives in components/ClaimCard.tsx,
// a client component because its links remember where they were opened from.

import Link from "next/link";

import { BanIcon, CheckCircleIcon, ChevronIcon } from "@/components/Icons";
import { organismPhoto } from "@/lib/photos";
import { MONTH_LETTERS, MONTH_NAMES, NOW, type Spot } from "@/lib/spots";
import { MONTH } from "@/lib/suggestions";

export { ClaimCard } from "@/components/ClaimCard";

export function MonthGrid({ months, label = "In season" }: { months: number[]; label?: string }) {
  // one picture with one name: the twelve letters are drawn, the months are read out
  return (
    <div
      className="fb-months"
      role="img"
      aria-label={`${label}: ${months.length === 12 ? "all year" : months.map((m) => MONTH_NAMES[m]).join(", ")}`}
    >
      {MONTH_LETTERS.map((m, i) => (
        <span key={i} className={months.includes(i) ? (i === NOW ? "is-now" : "is-on") : undefined}>
          {m}
        </span>
      ))}
    </div>
  );
}

/** What not to do here, or what to do: a marked callout, the line, then why it matters. */
export function ActionRow({ spot, className = "" }: { spot: Spot; className?: string }) {
  const dont = spot.kind === "dont";
  return (
    <div className={`fb-rule fb-callout ${className}`}>
      <span className="fb-rule-icon">{dont ? <BanIcon size={20} /> : <CheckCircleIcon size={20} />}</span>
      <div className="fb-rule-text">
        <span className="fb-label">{dont ? "What not to do here" : "What to do here"}</span>
        <span className="fb-rule-line">{spot.line}</span>
        <span className="fb-rule-why">{spot.why}</span>
      </div>
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
  nav,
  organismHref,
  titleId,
  heading: H = "h1",
}: {
  spot: Spot;
  total: number;
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
        </div>
      </div>

      {spot.out ? (
        <p className="fb-out">{spot.out}</p>
      ) : (
        <div className="fb-look">
          <span className="fb-label">Look for in {MONTH}</span>
          <ul>
            {spot.look.map((l) => {
              const photo = organismPhoto(l.name);
              const body = (
                <>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="fb-look-photo" src={photo.src} alt="" />
                  ) : (
                    <span className="fb-look-photo" aria-hidden="true" />
                  )}
                  <span className="fb-look-text">
                    <span className="fb-look-name">{l.name}</span>
                    {l.what && <span className="fb-look-what">{l.what[0].toUpperCase() + l.what.slice(1)}</span>}
                    <span className="fb-look-last">Last recorded {l.last}</span>
                  </span>
                </>
              );
              return (
                <li key={l.name}>
                  {l.organism && organismHref ? (
                    <Link href={organismHref(l.organism)} className="fb-look-row fb-look-link">
                      {body}
                      <ChevronIcon size={18} />
                    </Link>
                  ) : (
                    <div className="fb-look-row">{body}</div>
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
