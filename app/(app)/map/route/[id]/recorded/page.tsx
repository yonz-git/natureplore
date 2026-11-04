import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RecordedScreen from "@/components/RecordedScreen";
import { recordedOf } from "@/lib/recorded";
import { routeById } from "@/lib/routes";

// A8 · Recorded along this route, opened from B1's "Recorded organisms": every route GBIF was fetched for
// (lib/recorded.ts).

export async function generateMetadata({ params }: PageProps<"/map/route/[id]/recorded">): Promise<Metadata> {
  const { id } = await params;
  const route = routeById(id);
  return { title: route && `Recorded along ${route.name}` };
}

export default async function Recorded({ params }: PageProps<"/map/route/[id]/recorded">) {
  const { id } = await params;
  const route = routeById(id);
  const recorded = recordedOf(id);
  if (!route || !recorded) notFound();
  return <RecordedScreen routeId={route.id} routeName={route.name} recorded={recorded} />;
}
