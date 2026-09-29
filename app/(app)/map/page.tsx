import RegionMap from "@/components/RegionMap";
import StartSheet from "@/components/StartSheet";

// A1 · Start sheet, the first open of the map, where "Go to map" on A0 lands: Berlin and
// Brandenburg with their route counts, and the sheet that offers search or location. The map is
// real OSM geometry drawn by Leaflet (components/RegionMap.tsx), the layout is app/map.css.

export default function MapHome() {
  return (
    <section className="ms a1">
      <RegionMap className="a1-map" />
      <StartSheet />
    </section>
  );
}
