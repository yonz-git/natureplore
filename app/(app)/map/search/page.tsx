import SearchScreen from "@/components/SearchScreen";

// A2 · Search for a region, results, and A3 · no match. The query is in the address, so a search
// can be shared and the back button walks through the searches the person made.

export default async function Search({ searchParams }: PageProps<"/map/search">) {
  const { q } = await searchParams;
  return <SearchScreen query={typeof q === "string" ? q : ""} />;
}
