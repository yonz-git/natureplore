import type { Metadata } from "next";
import SavedScreen from "@/components/SavedScreen";

export const metadata: Metadata = { title: "You" };

export default function You() {
  return <SavedScreen />;
}
