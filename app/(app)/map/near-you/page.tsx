import type { Metadata } from "next";
import SuggestionsScreen from "@/features/map/SuggestionsScreen";

// A4 · Suggestions

export const metadata: Metadata = { title: "Routes near you" };

export default function NearYou() {
  return <SuggestionsScreen near />;
}
