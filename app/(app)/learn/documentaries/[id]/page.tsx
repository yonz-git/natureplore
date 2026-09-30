import { notFound } from "next/navigation";

import DocScreen from "@/components/DocScreen";
import { docById } from "@/lib/docs";

// D3 · a documentary, or D4 when it cannot be watched here. Opened from Learn, the collection,
// the organism page (B4), D4's alternatives, or Saved.

export default async function DocumentaryPage({ params }: PageProps<"/learn/documentaries/[id]">) {
  const { id } = await params;
  if (!docById(id)) notFound();
  return <DocScreen id={id} />;
}
