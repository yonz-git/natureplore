import type { Metadata } from "next";
import { YourActions } from "@/components/SavedPages";

// E6 · Your actions

export const metadata: Metadata = { title: "Your actions" };

export default function Page() {
  return <YourActions />;
}
