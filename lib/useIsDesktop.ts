"use client";

import { useEffect, useState } from "react";

/** The one breakpoint the design system has, where a screen changes shape rather than size. */
export const DESKTOP = "(min-width: 64rem)";

/**
 * Whether the desktop layout is showing. It answers false on the first render, so the markup the
 * server sent and the markup the browser makes are the same, and the answer arrives a frame later.
 * Use it only where the two sizes need different content, never for styling: that belongs in CSS.
 */
export function useIsDesktop() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = matchMedia(DESKTOP);
    const read = () => setWide(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  return wide;
}
