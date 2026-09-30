import type { Metadata } from "next";
import { OfflineRoutes } from "@/components/SavedPages";

// E8 · Downloaded routes: every saved route, downloaded with it.

export const metadata: Metadata = { title: "Downloaded routes" };

export default function Page() {
  return <OfflineRoutes />;
}
