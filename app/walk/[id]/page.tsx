import { notFound } from "next/navigation";

import WalkScreen from "@/components/WalkScreen";
import { routeById } from "@/lib/routes";
import { routeDetail } from "@/lib/spots";

// L4 · Walk, opened from Walk it on Saved (E1) or on a saved route (B1). It sits outside the app
// group because the walk hides the tab bar: End walk is the way out. `?spot=` is the spot the
// sheet shows, so the previous and next buttons, the map's markers and the way back from an
// organism all land on the same spot. Without it the walk opens on spot 2, the one nearest the
// person, as on the location-on board.

export default async function Walk({ params, searchParams }: PageProps<"/walk/[id]">) {
  const { id } = await params;
  const { spot } = await searchParams;
  const route = routeById(id);
  const detail = routeDetail(id);
  if (!route || !detail) notFound();
  const n = Math.min(detail.spots.length, Math.max(1, Number(spot) || 2));
  return <WalkScreen routeId={route.id} n={n} />;
}
