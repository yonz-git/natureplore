import type { Metadata } from "next";
import { SavedOrganisms } from "@/features/saved/SavedPages";

// E4 · Saved organisms

export const metadata: Metadata = { title: "Saved organisms" };

export default function Page() {
  return <SavedOrganisms />;
}
