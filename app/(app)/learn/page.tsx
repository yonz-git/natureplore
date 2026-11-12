import type { Metadata } from "next";
import LearnScreen from "@/features/learn/LearnScreen";

// D0 · Learn

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  return <LearnScreen />;
}
