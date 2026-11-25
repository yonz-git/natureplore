import type { Metadata } from "next";
import Welcome from "@/features/welcome/Welcome";

export const metadata: Metadata = { title: "Welcome" };

export default function Home() {
  return <Welcome />;
}
