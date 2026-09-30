import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionScreen from "@/components/ActionScreen";
import { actionById } from "@/lib/actions";

// C3, C5 and C7 · an action, opened from a claim card's action line, a claim, or Saved.

export async function generateMetadata({ params }: PageProps<"/learn/action/[id]">): Promise<Metadata> {
  const { id } = await params;
  const a = actionById(id);
  return { title: a && `${a.title} ${a.close}` };
}

export default async function ActionPage({ params }: PageProps<"/learn/action/[id]">) {
  const { id } = await params;
  const action = actionById(id);
  if (!action) notFound();
  return <ActionScreen action={action} />;
}
