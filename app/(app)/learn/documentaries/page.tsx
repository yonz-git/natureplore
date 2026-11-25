import type { Metadata } from "next";
import { Suspense } from "react";

import DocsScreen from "@/components/DocsScreen";

// D2 · Documentaries

export const metadata: Metadata = { title: "Documentaries" };

export default function Documentaries() {
  return (
    <Suspense>
      <DocsScreen />
    </Suspense>
  );
}
