import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SourceDialog from "@/components/SourceDialog";
import { claimById } from "@/lib/claims";

// C2a, C2b and C2c · the source of a claim, opened from its "Read the source".

export async function generateMetadata({ params }: PageProps<"/learn/claim/[id]/source">): Promise<Metadata> {
  await params;
  return { title: "Source of the claim" };
}

export default async function SourcePage({ params }: PageProps<"/learn/claim/[id]/source">) {
  const { id } = await params;
  const claim = claimById(id);
  if (!claim) notFound();
  return <SourceDialog claim={claim} />;
}
