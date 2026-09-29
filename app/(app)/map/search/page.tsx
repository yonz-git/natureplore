import SearchScreen from "@/components/SearchScreen";

// A2 · Search, routes and organisms, and A3 · Search, no match. The query is in the address, so a
// search can be shared and the back button walks through the searches the person made.

export default async function Search({ searchParams }: PageProps<"/map/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return <SearchScreen key={query} query={query} />;
}
