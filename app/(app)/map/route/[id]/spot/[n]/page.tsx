import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SpotScreen from "@/components/SpotScreen";
import { routeById } from "@/lib/routes";
import { routeDetail } from "@/lib/spots";

// L3 · Spot 1 to 6, opened from a spot row or marker on B1. Only Linum wet meadows loop has its
// spots in the prototype.

export async function generateMetadata({ params }: PageProps<"/map/route/[id]/spot/[n]">): Promise<Metadata> {
  const { id, n } = await params;
  const spot = routeDetail(id)?.spots.find((s) => String(s.n) === n);
  return { title: spot && `Spot ${spot.n}, ${spot.name}` };
}

export default async function Spot({ params }: PageProps<"/map/route/[id]/spot/[n]">) {
  const { id, n } = await params;
  const route = routeById(id);
  const detail = routeDetail(id);
  const spot = detail?.spots.find((s) => String(s.n) === n);
  if (!route || !detail || !spot) notFound();
  return <SpotScreen route={route} spot={spot} total={detail.spots.length} claim={detail.claims[0]} />;
}
