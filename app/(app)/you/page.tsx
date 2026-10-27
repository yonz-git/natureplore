import type { Metadata } from "next";
import SavedScreen from "@/components/SavedScreen";

// You: the fourth tab, the profile and, under it, what is kept on this device (E1 · Saved, which
// was a tab of its own until the two were combined).

export const metadata: Metadata = { title: "You" };

export default function You() {
  return <SavedScreen />;
}
