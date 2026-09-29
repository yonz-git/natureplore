"use client";

// What the person has saved, kept on this device. v1 has no sign-in in the prototype, so saving
// works as it would once signed in. Every save button and A7 read the same store, so a route saved
// on A4 is saved on A5 and listed on A7.

import { useSyncExternalStore } from "react";

import { HERE, ROUTES, SAVED, type Saved } from "@/lib/routes";

const KEY = "np-saved";
// what the boards start with: a spot and two routes
const START = SAVED.map((s) => s.id);

let ids: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (ids) return ids;
  try {
    const raw = localStorage.getItem(KEY);
    ids = raw ? (JSON.parse(raw) as string[]) : START;
  } catch {
    ids = START;
  }
  return ids;
}

function write(next: string[]) {
  ids = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // a private window keeps it for this visit only
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useSaved() {
  const list = useSyncExternalStore(subscribe, read, () => START);
  return {
    ids: list,
    isSaved: (id: string) => list.includes(id),
    toggle: (id: string) => write(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]),
  };
}

/** Everything saved, as A7 lists it: nearest to the person first. */
export function savedItems(list: string[]): Saved[] {
  const known = SAVED.filter((s) => list.includes(s.id));
  const extra = ROUTES.filter((r) => list.includes(r.id) && !SAVED.some((s) => s.id === r.id)).map(
    (r): Saved => ({
      id: r.id,
      kind: "route",
      name: r.name,
      line: `${r.km} km, ${r.spots} spots`,
      counts: r.counts,
      lat: r.lat,
      lon: r.lon,
      image: r.image,
    }),
  );
  const away = (s: Saved) => (s.lat - HERE.lat) ** 2 + ((s.lon - HERE.lon) * Math.cos((HERE.lat * Math.PI) / 180)) ** 2;
  return [...known, ...extra].sort((a, b) => away(a) - away(b));
}

const LIST_KEY = "np-last-list";

/** The list a route card was opened from, so closing the card goes back to it. */
export function rememberList(path: string) {
  try {
    sessionStorage.setItem(LIST_KEY, path);
  } catch {
    // nothing to remember in a private window
  }
}

export function lastList(): string {
  try {
    return sessionStorage.getItem(LIST_KEY) ?? "/map/near-you";
  } catch {
    return "/map/near-you";
  }
}
