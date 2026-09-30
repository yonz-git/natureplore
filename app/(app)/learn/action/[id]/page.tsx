import { notFound } from "next/navigation";

import ActionScreen from "@/components/ActionScreen";
import { actionById } from "@/lib/actions";

// C3, C5 and C7 · an action, opened from a claim card's action line, a claim, or Saved.

export default async function ActionPage({ params }: PageProps<"/learn/action/[id]">) {
  const { id } = await params;
  const action = actionById(id);
  if (!action) notFound();
  return <ActionScreen action={action} />;
}
