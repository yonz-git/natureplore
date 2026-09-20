import NotMappedScreen from "@/components/NotMappedScreen";

// A6 · Map home, not mapped yet: the honest empty state for a place with nothing recorded.

export default async function NotMapped({ searchParams }: PageProps<"/map/not-mapped">) {
  const { place } = await searchParams;
  return <NotMappedScreen place={typeof place === "string" && place ? place : "This place"} />;
}
