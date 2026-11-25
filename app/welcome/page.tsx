import type { Metadata } from "next";
import Welcome from "@/components/Welcome";

// A0 · Welcome
export const metadata: Metadata = { title: "Welcome" };

export default function WelcomeTwo() {
  return <Welcome still />;
}
