"use client";

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
    const parsed: unknown = raw ? JSON.parse(raw) : NONE;
    list = Array.isArray(parsed) ? (parsed as Recent[]) : NONE;
  } catch {
    list = NONE;
  }
  return list;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function rememberSearch(r: Recent) {
  list = [r, ...read().filter((x) => x.href !== r.href)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
  }
  listeners.forEach((l) => l());
}

export function useRecent(): Recent[] {
  return useSyncExternalStore(subscribe, read, () => NONE);
}
