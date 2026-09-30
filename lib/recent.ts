"use client";

// E7 · Recent searches: the last eight results opened from search, kept on this device only and
// never sent anywhere. A result opened again moves to the top instead of repeating.

import { useSyncExternalStore } from "react";

export type Recent = { label: string; kind: string; href: string };

const KEY = "np-recent-v1";
const MAX = 8;
const NONE: Recent[] = [];

let list: Recent[] | null = null;
const listeners = new Set<() => void>();

function read(): Recent[] {
  if (list) return list;
  try {
    const raw = localStorage.getItem(KEY);
    list = raw ? (JSON.parse(raw) as Recent[]) : NONE;
  } catch {
    list = NONE;
  }
  return list;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Call from a search result as it is opened. */
export function rememberSearch(r: Recent) {
  list = [r, ...read().filter((x) => x.href !== r.href)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // a private window keeps it for this visit only
  }
  listeners.forEach((l) => l());
}

export function useRecent(): Recent[] {
  return useSyncExternalStore(subscribe, read, () => NONE);
}
