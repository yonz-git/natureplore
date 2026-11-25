import type { Metadata } from "next";
import SearchScreen from "@/components/SearchScreen";

// A2, A3 · Search

export const metadata: Metadata = { title: "Search regions and organisms" };

export default async function Search({ searchParams }: PageProps<"/map/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return <SearchScreen key={query} query={query} />;
}
