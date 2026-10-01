"use client";

// Where a claim, an action or a documentary page was opened from, so its back control returns there: a claim
// card on a route, a spot, the walk or the crane; an action row on a claim; Saved. The boards send
// every claim back to Learn and every action back to its claim, one fixed target each; the
// prototype remembers the real one for this visit and falls back to the board's target.
// Only links that enter a claim or an action from somewhere else call `leaveFor`: "See the claim"
// and the back controls themselves do not, so two pages never send each other back and forth.

import { useSyncExternalStore } from "react";

// Keyed by the page opened, so a back target belongs to that page only: opening another claim
// straight from its address falls back to the board's target instead of inheriting this one.
const key = (to: string) => `np-back:${to}`;
const noop = () => () => {};

/** Call from the link that opens a claim or an action, with its href: remembers the page it is on. */
export function leaveFor(to: string) {
  try {
    sessionStorage.setItem(key(to), location.pathname + location.search);
  } catch {
    // a private window remembers nothing; back falls back to the board's target
  }
}

/** The page to go back to, read once the page is in the browser. */
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
      // never back to the page itself, and only ever to a page of this app
      return at && at.startsWith("/") && at !== location.pathname + location.search ? at : fallback;
    },
    () => fallback,
  );
}

/** A name for a back target, for its accessible label and its visible text on the desktop. */
export function backLabel(href: string, fallback: string): string {
  if (href.startsWith("/walk")) return "Back to the walk";
  if (href.startsWith("/learn/documentaries/")) return "Back to the documentary";
  if (href.startsWith("/learn/documentaries")) return "Back to Documentaries";
  if (href.startsWith("/map/route/")) return "Back to the route";
  if (href.startsWith("/map/organism/")) return "Back to the organism";
  if (href.startsWith("/learn/claim/")) return "Back to the claim";
  if (href.startsWith("/learn/action/")) return "Back to the action";
  if (href.startsWith("/saved")) return "Back to Saved";
  if (href === "/learn") return "Back to Learn";
  return fallback;
}
