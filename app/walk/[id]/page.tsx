import type { Metadata } from "next";
import { notFound } from "next/navigation";

import WalkScreen from "@/features/walk/WalkScreen";
import { routeById } from "@/lib/routes";
import { routeDetail } from "@/lib/spots";

// L4 · Walk

export async function generateMetadata({ params }: PageProps<"/walk/[id]">): Promise<Metadata> {
  const { id } = await params;
  const route = routeById(id);
  return { title: route && `Walking ${route.name}` };
}

export default async function Walk({ params, searchParams }: PageProps<"/walk/[id]">) {
  const { id } = await params;
  const { spot } = await searchParams;
  const route = routeById(id);
  const detail = routeDetail(id);
  if (!route || !detail) notFound();
  const n = Math.min(detail.spots.length, Math.max(1, Number(spot) || 1));
  return <WalkScreen routeId={route.id} n={n} />;
}
