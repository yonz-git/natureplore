import type { Metadata } from "next";
import { Suspense } from "react";

import DocsScreen from "@/features/learn/DocsScreen";

// D2 · Documentaries

export const metadata: Metadata = { title: "Documentaries" };

export default function Documentaries() {
  return (
    <Suspense>
      <DocsScreen />
    </Suspense>
  );
}
