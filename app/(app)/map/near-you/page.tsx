import type { Metadata } from "next";
import SuggestionsScreen from "@/components/SuggestionsScreen";

// A4 · Suggestions, near you: A5 after the location is allowed, sorted by distance within the
// share of spots in season, with the person on the map.

export const metadata: Metadata = { title: "Routes near you" };

export default function NearYou() {
  return <SuggestionsScreen near />;
}
