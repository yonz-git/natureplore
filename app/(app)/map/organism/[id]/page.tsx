import { notFound } from "next/navigation";

import OrganismPage from "@/components/OrganismPage";
import { organismById } from "@/lib/organisms";

// B4 · Organism detail, and B5 when its location is generalised.

export default async function Organism({ params }: PageProps<"/map/organism/[id]">) {
  const { id } = await params;
  const o = organismById(id);
  if (!o) notFound();
  return <OrganismPage o={o} />;
}
