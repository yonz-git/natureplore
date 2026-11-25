import type { Metadata } from "next";
import { Credits } from "@/components/SavedPages";

export const metadata: Metadata = { title: "Credits" };

export default function Page() {
  return <Credits />;
}
