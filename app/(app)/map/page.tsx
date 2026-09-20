import RegionMap from "@/components/RegionMap";
import StartSheet from "@/components/StartSheet";

// A1 · Start sheet, the first open of the map: Berlin and Brandenburg with their count pins, and
// the sheet that offers location, search or browsing. The map is real OSM geometry drawn by
// Leaflet (components/RegionMap.tsx), the glass recipe is app/glass.css, the layout app/a1.css.

export default function MapHome() {
  return (
    <section className="a1">
      <RegionMap className="a1-map" />
      <StartSheet />
    </section>
  );
}
