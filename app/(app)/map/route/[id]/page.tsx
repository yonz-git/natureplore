import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RouteCardScreen from "@/components/RouteCardScreen";
import { routeById } from "@/lib/routes";

// B1 · Route card: opened from a route in a list or from its pin on the map. `?spot=n` opens that
// spot's row in the spots list (L3 now lives there, not on a page of its own).

export async function generateMetadata({ params }: PageProps<"/map/route/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: routeById(id)?.name };
}

export default async function RouteCard({ params, searchParams }: PageProps<"/map/route/[id]">) {
  const { id } = await params;
  const { spot } = await searchParams;
  const route = routeById(id);
  if (!route) notFound();
  return <RouteCardScreen route={route} spot={Number(spot) || undefined} />;
}
