import { notFound } from "next/navigation";

import RecordedScreen from "@/components/RecordedScreen";

// A8 · Recorded along this route, opened from B1's "What is recorded along this route". Only Linum
// wet meadows loop has its records in the prototype.

export default async function Recorded({ params }: PageProps<"/map/route/[id]/recorded">) {
  const { id } = await params;
  if (id !== "linum") notFound();
  return <RecordedScreen routeName="Linum wet meadows loop" routeHref="/map/route/linum" />;
}
