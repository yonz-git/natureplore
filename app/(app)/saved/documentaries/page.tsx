import type { Metadata } from "next";
import { SavedDocs } from "@/features/saved/SavedPages";

// E5 · Saved documentaries

export const metadata: Metadata = { title: "Saved documentaries" };

export default function Page() {
  return <SavedDocs />;
}
