import type { Metadata } from "next";
import { RecentSearches } from "@/features/saved/SavedPages";

// E7 · Recent searches

export const metadata: Metadata = { title: "Recent searches" };

export default function Page() {
  return <RecentSearches />;
}
