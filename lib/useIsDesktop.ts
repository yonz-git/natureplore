"use client";

import { useEffect, useState } from "react";

export const DESKTOP = "(min-width: 64rem)";

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
