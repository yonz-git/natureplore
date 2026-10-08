import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RecordedScreen from "@/components/RecordedScreen";
import { routeById } from "@/lib/routes";

// A8 · Recorded along this route, opened from B1's "What is recorded along this route". Only Grumsin
// wet meadows loop has its records in the prototype.

export async function generateMetadata({ params }: PageProps<"/map/route/[id]/recorded">): Promise<Metadata> {
  const { id } = await params;
  const route = routeById(id);
  return { title: route && `Recorded along ${route.name}` };
}

export default async function Recorded({ params }: PageProps<"/map/route/[id]/recorded">) {
  const { id } = await params;
  if (id !== "grumsin") notFound();
  return <RecordedScreen routeName="Grumsin beech forest loop" routeHref="/map/route/grumsin" />;
}
