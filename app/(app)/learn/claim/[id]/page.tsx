import { notFound } from "next/navigation";

import ClaimScreen from "@/components/ClaimScreen";
import { claimById } from "@/lib/claims";

// C1a, C1b and C6 · a claim, opened from a claim card (B1, a spot, the walk, the crane) or from Learn.

export default async function ClaimPage({ params }: PageProps<"/learn/claim/[id]">) {
  const { id } = await params;
  const claim = claimById(id);
  if (!claim) notFound();
  return <ClaimScreen claim={claim} />;
}
