import { redirect } from "next/navigation";

// L3 · A spot opens in place, in the route's spots list, so an old link to a spot page lands on
// the route with that spot open.

export default async function Spot({ params }: PageProps<"/map/route/[id]/spot/[n]">) {
  const { id, n } = await params;
  redirect(`/map/route/${id}?spot=${n}`);
}
