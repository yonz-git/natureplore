import type { Metadata } from "next";
import LearnScreen from "@/components/LearnScreen";

// D0 · Learn: the Learn tab, impact, what you can do and documentaries.

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  return <LearnScreen />;
}
