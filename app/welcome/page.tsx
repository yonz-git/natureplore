import type { Metadata } from "next";
import Welcome from "@/features/welcome/Welcome";

// A0 · Welcome
export const metadata: Metadata = { title: "Welcome" };

export default function WelcomeTwo() {
  return <Welcome still />;
}
