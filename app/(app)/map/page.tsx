import type { Metadata } from "next";
import SuggestionsScreen from "@/features/map/SuggestionsScreen";

// A5 · Suggestions

export const metadata: Metadata = { title: "Routes in season" };

export default async function Suggestions({ searchParams }: PageProps<"/map">) {
  const { region } = await searchParams;
  const id = typeof region === "string" ? region : undefined;
  return <SuggestionsScreen key={id} near={false} regionId={id} />;
}
