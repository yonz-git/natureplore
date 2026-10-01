import type { Metadata } from "next";
import Welcome from "@/components/Welcome";

// A0 · Welcome on its own, the still page the opening lands on.
export const metadata: Metadata = { title: "Welcome" };

export default function WelcomeTwo() {
  return <Welcome still />;
}
