// The place line: the pin on its ground ring, then the region's name. One line for the map's
// suggestions (A4, A5) and Learn (D0), at the same size and pin on both (.sg-scope, app/flow-a.css);
// each screen sets only the space around it. The pin rolls in when the line mounts; pass replay to
// roll it in again, as the map does for each region.

import { PinIcon } from "@/components/Icons";

export function RegionLine({ children, replay, className = "" }: { children: React.ReactNode; replay?: string; className?: string }) {
  return (
    <p className={`sg-scope ${className}`.trim()}>
      <span className="sg-pin" key={replay}>
        {/* a ring on the ground round the pin's tip */}
        {/* drawn on the pin's own 24 grid and laid exactly over it, centred under its tip (12, 21) */}
        <svg className="sg-pin-ring" viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="12" cy="20.9" rx="7.2" ry="2.5" />
        </svg>
        <PinIcon size={18} className="sg-pin-icon" />
      </span>
      {children}
    </p>
  );
}
