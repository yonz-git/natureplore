import type { Metadata } from "next";
import SuggestionsScreen from "@/components/SuggestionsScreen";

// A5 · Suggestions, location off: the Routes tab. The routes in season this month in Berlin and
// Brandenburg, or in the region picked in search (`?region=linum`), with Routes or Organisms to
// choose what is listed. "Use my location" asks first; allowing opens A4.

export const metadata: Metadata = { title: "Routes in season" };

export default async function Suggestions({ searchParams }: PageProps<"/map">) {
  const { region } = await searchParams;
  const id = typeof region === "string" ? region : undefined;
  return <SuggestionsScreen key={id} near={false} regionId={id} />;
}
