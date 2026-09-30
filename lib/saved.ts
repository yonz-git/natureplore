"use client";

// What the person has saved, kept on this device. There are no accounts: saving a route keeps it
// and downloads it here. Every Save control and E1 read the same store, so a route saved on A5 is
// saved on A4 and on B1, and listed in Saved.

import { useSyncExternalStore } from "react";

const KEY = "np-saved-v2";
// nothing is saved at first: saving on A5 is the first task of the test, and Saved shows what it kept
const START: string[] = [];

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
    /** Removes several at once (E4 and E5 in edit), and `restore` puts them back for Undo. */
    remove: (gone: string[]) => write(list.filter((x) => !gone.includes(x))),
    restore: (back: string[]) => write([...list, ...back.filter((x) => !list.includes(x))]),
  };
}

const LIST_KEY = "np-last-list";

/** The list a route was opened from, A5 or A4, so going back from it returns there. */
export function rememberList(path: string) {
  try {
    sessionStorage.setItem(LIST_KEY, path);
  } catch {
    // nothing to remember in a private window
  }
}

export function lastList(): string {
  try {
    return sessionStorage.getItem(LIST_KEY) ?? "/map";
  } catch {
    return "/map";
  }
}
