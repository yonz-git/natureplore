import type { Metadata } from "next";
import Welcome from "@/components/Welcome";

export const metadata: Metadata = { title: "Welcome" };

export default function Home() {
  return <Welcome />;
}
