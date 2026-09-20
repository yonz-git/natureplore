import MapScreen from "@/components/MapScreen";

// A5 · Map home, location off: the launch region with its clustered pins, or the region a search
// picked, named in the heading. This is also where declining location lands.

export default async function RegionHome({ searchParams }: PageProps<"/map/region">) {
  const { place } = await searchParams;
  return <MapScreen variant="region" region={typeof place === "string" ? place : undefined} />;
}
