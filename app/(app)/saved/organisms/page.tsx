import type { Metadata } from "next";
import { SavedOrganisms } from "@/components/SavedPages";

// E4 · Saved organisms, with Edit and a row that opens in place.

export const metadata: Metadata = { title: "Saved organisms" };

export default function Page() {
  return <SavedOrganisms />;
}
