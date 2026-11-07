import { redirect } from "next/navigation";

// L3 · Spot

export default async function Spot({ params }: PageProps<"/map/route/[id]/spot/[n]">) {
  const { id, n } = await params;
  redirect(`/map/route/${id}?spot=${n}`);
}
