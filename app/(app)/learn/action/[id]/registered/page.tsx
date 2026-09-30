import { notFound } from "next/navigation";

import RegisteredDialog from "@/components/RegisteredDialog";
import { actionById } from "@/lib/actions";

// C4 · Registered, after "Register for the clean-up" on C3. Only the clean-up is an event.

export default async function RegisteredPage({ params }: PageProps<"/learn/action/[id]/registered">) {
  const { id } = await params;
  const action = actionById(id);
  if (!action || action.type !== "event") notFound();
  return <RegisteredDialog action={action} />;
}
