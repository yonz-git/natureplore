import type { Metadata } from "next";
import RegionMap from "@/components/RegionMap";
import StartSheet from "@/components/StartSheet";

// A1 · Start sheet, where "Go to map" on the welcome lands: Berlin and Brandenburg with their
// route counts, and the sheet that offers search or location. Search opens A2; the location
// prompt opens A4 when allowed and A5 when declined; Browse (desktop) opens A5.

export const metadata: Metadata = { title: "Where to start" };

export default function Start() {
  return (
    <section className="ms a1">
      <RegionMap className="a1-map" />
      <StartSheet />
    </section>
  );
}
