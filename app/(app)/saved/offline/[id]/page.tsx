import { notFound } from "next/navigation";

import { OfflineRoute } from "@/components/SavedPages";
import { SUGGESTIONS } from "@/lib/suggestions";

// E2 · One downloaded route: what it includes, Refresh, Remove from this device.

export function generateStaticParams() {
  return SUGGESTIONS.map((s) => ({ id: s.id }));
}

export default async function Page({ params }: PageProps<"/saved/offline/[id]">) {
  const { id } = await params;
  if (!SUGGESTIONS.some((s) => s.id === id)) notFound();
  return <OfflineRoute id={id} />;
}
