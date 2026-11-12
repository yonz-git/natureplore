import type { Metadata } from "next";
import { Notifications } from "@/components/SavedPages";

// E3 · Notifications

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return <Notifications />;
}
