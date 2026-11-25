import type { Metadata } from "next";
import { Notifications } from "@/features/saved/SavedPages";

// E3 · Notifications

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return <Notifications />;
}
