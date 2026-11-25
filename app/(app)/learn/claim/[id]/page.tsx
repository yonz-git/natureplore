import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ClaimScreen from "@/features/learn/ClaimScreen";
import { claimById } from "@/lib/claims";

// C1a, C1b and C6 · a claim

export async function generateMetadata({ params }: PageProps<"/learn/claim/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: claimById(id)?.claim.replace(/\.$/, "") };
}

export default async function ClaimPage({ params }: PageProps<"/learn/claim/[id]">) {
  const { id } = await params;
  const claim = claimById(id);
  if (!claim) notFound();
  return <ClaimScreen claim={claim} />;
}
