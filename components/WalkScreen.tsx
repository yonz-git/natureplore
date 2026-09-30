"use client";

// L4 · Walk: where am I, and what is at this spot? A map strip with the route line, the numbered
// spots and the person's position (no directions), over a solid sheet that is the spot block.
// "More about this spot" opens the rest of the spot page in place. Previous and next are buttons,
// not swipes, and the markers on the map open their spot too. End walk goes to Saved. This is the
// location-on walk: it opens on spot 2, the nearest, with the position dot beside it. The sheet is
// solid, not glass, so it reads outdoors. From 64rem the sheet is a solid panel down the left.
// Board: L4 · Walk, phone.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BackIcon, ChevronIcon } from "@/components/Icons";
import { MapTools } from "@/components/MapParts";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { ClaimCard, MonthGrid, RecordedToo, SpotBlock } from "@/components/SpotParts";
import { routeById, spotsOf } from "@/lib/routes";
import { routeDetail } from "@/lib/spots";

// The route is looked up here by its id, not passed from the page: a prop from the server is a new
// object on every step of the walk, and a new route would make the map build itself again.
export default function WalkScreen({ routeId, n }: { routeId: string; n: number }) {
  const route = routeById(routeId)!;
  const detail = routeDetail(routeId)!;
  const map = useRef<MapHandle>(null);
  const router = useRouter();
  const total = detail.spots.length;
  const spot = detail.spots[n - 1];
  const here = `/walk/${route.id}`;
  // "More about this spot" belongs to the spot it was opened on, so the next spot opens folded
  const [openOn, setOpenOn] = useState<number | null>(null);
  const open = openOn === n;

  const marks = useMemo(() => spotsOf(route), [route]);
  // the person stands by spot 2, as on the board; a memo so the map is built once
  const points = useMemo<MapPoint[]>(() => {
    const two = marks[1];
    return [
      { id: "start", lat: route.lat, lon: route.lon, label: `Start and finish, ${route.from}`, start: true },
      ...marks.map((s, i) => ({
        id: `s${s.n}`,
        lat: s.lat,
        lon: s.lon,
        n: s.n,
        label: route.stops[i]?.name ?? `Spot ${s.n}`,
        left: route.stops[i]?.left,
        href: `${here}?spot=${s.n}`,
      })),
      { id: "here", lat: two.lat - 0.0004, lon: two.lon + 0.0022, label: "You are here, at spot 2", here: true },
    ];
  }, [marks, route, here]);
  const line = useMemo(() => route.path ?? marks.map((s) => [s.lat, s.lon] as [number, number]), [route, marks]);

  // the map follows the sheet to the spot it shows
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const m = marks[n - 1];
    map.current?.centre(m.lat, m.lon, 14, !matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [n, marks]);

  const go = (to: number) => router.replace(`${here}?spot=${to}`, { scroll: false });
  // Previous and next stay the same two buttons from spot to spot, so keyboard focus stays on the
  // one that was pressed. At either end the button says so and does nothing, rather than vanishing.
  const nav = (
    <nav aria-label="Spots" className="fb-nav walk-nav">
      <button
        type="button"
        className="fb-nav-btn"
        aria-disabled={n === 1 || undefined}
        onClick={() => n > 1 && go(n - 1)}
      >
        {n > 1 ? (
          <>
            <BackIcon size={19} />
            Spot {n - 1}
          </>
        ) : (
          "First spot"
        )}
      </button>
      <button
        type="button"
        className="fb-nav-btn"
        aria-disabled={n === total || undefined}
        onClick={() => n < total && go(n + 1)}
      >
        {n < total ? (
          <>
            Spot {n + 1}
            <ChevronIcon size={19} />
          </>
        ) : (
          "Last spot"
        )}
      </button>
    </nav>
  );

  return (
    // the walk sits outside the tabbed layout, so the whole screen is the page's main landmark:
    // the map's spot markers and the top controls belong to it too
    <main className="ms walk" aria-labelledby="walk-route">
      <RegionMap className="a1-map" ref={map} points={points} line={line} detail={route.detail} maxZoom={15} mapLabel={`Map of ${route.name}`} />

      <div className="walk-top">
        <p id="walk-route" className="walk-title glass glass-pill">Walking {route.name}</p>
        <Link href="/saved" className="walk-end glass glass-pill">
          End walk
        </Link>
      </div>

      <div className="ms-panel walk-panel">
        <section className="ms-sheet walk-sheet" aria-label="The spot you are at">
          <div className="walk-spot" key={n}>
            <SpotBlock
              spot={spot}
              total={total}
              routeName={route.name}
              nav={null}
              titleId="walk-title"
              organismHref={(id) => `/map/organism/${id}?from=walk&spot=${n}`}
            />
            {/* one toggle that stays in place, so focus is not lost when the rest of the spot opens */}
            <button type="button" className="walk-toggle" aria-expanded={open} aria-controls="walk-more" onClick={() => setOpenOn(open ? null : n)}>
              {open ? "Show less" : "More about this spot"}
            </button>
            {open && (
              <div className="walk-more" id="walk-more">
                <h2>When</h2>
                <MonthGrid months={spot.months} />
                <h2>What is happening here</h2>
                <ClaimCard claim={detail.claims[0]} />
                <h2>Recorded here too</h2>
                <RecordedToo />
              </div>
            )}
          </div>
        </section>
        <div className="walk-bar">{nav}</div>
        <p className="sr-only" aria-live="polite">
          Spot {n} of {total}, {spot.name}
        </p>
      </div>

      <MapTools
        locate={() => {
          const two = marks[1];
          map.current?.centre(two.lat, two.lon, 14, !matchMedia("(prefers-reduced-motion: reduce)").matches);
        }}
      />
    </main>
  );
}
