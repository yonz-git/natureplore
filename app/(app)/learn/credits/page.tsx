import type { Metadata } from "next";
import { Credits } from "@/components/SavedPages";

// Credits: the icons, photographs, map and type the app uses, each linked to its source. Reached
// from the foot of Learn.

export const metadata: Metadata = { title: "Credits" };

export default function Page() {
  return <Credits />;
}
