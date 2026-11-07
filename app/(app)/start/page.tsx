import type { Metadata } from "next";
import RegionMap from "@/components/RegionMap";
import StartSheet from "@/components/StartSheet";

// A1 · Start sheet

export const metadata: Metadata = { title: "Where to start" };

export default function Start() {
  return (
    <section className="ms a1">
      <RegionMap className="a1-map" fixedZoom />
      <StartSheet />
    </section>
  );
}
