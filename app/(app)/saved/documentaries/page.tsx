import type { Metadata } from "next";
import { SavedDocs } from "@/components/SavedPages";

// E5 · Saved documentaries

export const metadata: Metadata = { title: "Saved documentaries" };

export default function Page() {
  return <SavedDocs />;
}
