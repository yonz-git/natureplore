import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DocScreen from "@/features/learn/DocScreen";
import { docById } from "@/lib/docs";

// D3 · a documentary

export async function generateMetadata({ params }: PageProps<"/learn/documentaries/[id]">): Promise<Metadata> {
  const { id } = await params;
  const d = docById(id);
  return { title: d && `Documentary, ${d.covers}` };
}

export default async function DocumentaryPage({ params }: PageProps<"/learn/documentaries/[id]">) {
  const { id } = await params;
  if (!docById(id)) notFound();
  return <DocScreen id={id} />;
}
