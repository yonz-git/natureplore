"use client";

import { useSyncExternalStore } from "react";

const key = (to: string) => `np-back:${to}`;
const noop = () => () => {};

export function leaveFor(to: string) {
  try {
    sessionStorage.setItem(key(to), location.pathname + location.search);
  } catch {
  }
}

export function useBack(fallback: string): string {
  return useSyncExternalStore(
    noop,
    () => {
      let at: string | null = null;
      try {
        at = sessionStorage.getItem(key(location.pathname));
      } catch {
        at = null;
      }
      return at && at.startsWith("/") && at !== location.pathname + location.search ? at : fallback;
    },
    () => fallback,
  );
}

export function backLabel(href: string, fallback: string): string {
  if (href.startsWith("/walk")) return "Back to the walk";
  if (href.startsWith("/learn/documentaries/")) return "Back to the documentary";
  if (href.startsWith("/learn/documentaries")) return "Back to Documentaries";
  if (href.startsWith("/map/route/")) return "Back to the route";
  if (href.startsWith("/map/organism/")) return "Back to the organism";
  if (href.startsWith("/learn/claim/")) return "Back to the claim";
  if (href.startsWith("/learn/action/")) return "Back to the action";
  if (href.startsWith("/saved")) return "Back to Saved";
  if (href === "/you") return "Back to You";
  if (href === "/learn") return "Back to Learn";
  return fallback;
}
