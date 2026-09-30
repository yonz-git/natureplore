import type { Metadata } from "next";
import SavedScreen from "@/components/SavedScreen";

// E1 · Saved: the Saved tab, what is kept on this device.

export const metadata: Metadata = { title: "Saved" };

export default function Saved() {
  return <SavedScreen />;
}
