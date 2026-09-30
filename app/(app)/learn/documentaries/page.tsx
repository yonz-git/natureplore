import { Suspense } from "react";

import DocsScreen from "@/components/DocsScreen";

// D2 · Documentaries: the collection, opened from Learn (D0). The filter lives in the address, so
// the screen reads it on the client.

export default function Documentaries() {
  return (
    <Suspense>
      <DocsScreen />
    </Suspense>
  );
}
