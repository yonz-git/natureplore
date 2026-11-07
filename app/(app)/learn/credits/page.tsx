import type { Metadata } from "next";
import { Credits } from "@/features/saved/SavedPages";

export const metadata: Metadata = { title: "Credits" };

export default function Page() {
  return <Credits />;
}
