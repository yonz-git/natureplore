import type { Metadata } from "next";
import { SavedOrganisms } from "@/components/SavedPages";

// E4 · Saved organisms

export const metadata: Metadata = { title: "Saved organisms" };

export default function Page() {
  return <SavedOrganisms />;
}
