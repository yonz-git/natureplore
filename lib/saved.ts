"use client";

import { useSyncExternalStore } from "react";

const KEY = "np-saved-v2";
const START: string[] = [];

let ids: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (ids) return ids;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : START;
    ids = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : START;
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
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY && e.key !== null) return;
    ids = null;
    l();
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    removeEventListener("storage", onStorage);
  };
}

export function useSaved() {
  const list = useSyncExternalStore(subscribe, read, () => START);
  return {
    ids: list,
    isSaved: (id: string) => list.includes(id),
    toggle: (id: string) => {
      const now = read();
      write(now.includes(id) ? now.filter((x) => x !== id) : [...now, id]);
    },
    remove: (gone: string[]) => write(read().filter((x) => !gone.includes(x))),
    restore: (back: string[]) => write([...read(), ...back.filter((x) => !read().includes(x))]),
  };
}

const LIST_KEY = "np-last-list";

export function rememberList(path: string) {
  try {
    sessionStorage.setItem(LIST_KEY, path);
  } catch {
  }
}

export function lastList(): string {
  try {
    return sessionStorage.getItem(LIST_KEY) ?? "/map";
  } catch {
    return "/map";
  }
}
