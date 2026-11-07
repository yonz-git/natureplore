// Organism names: the one place a name as the lists write it becomes a page id, aliases included. A page's id is
// not always its name: Sweet woodruff's page is `woodruff`. It reads the generated pages only, so lib/spots.ts and
// lib/season.ts can use it without importing lib/organisms.ts, which imports them.

import { GENERATED } from "@/lib/organism-pages";

const fold = (name: string) => name.trim().toLowerCase();

/** Every name a list may write for a page. */
export const namesOf = (o: { name: string; close: string; alias?: string[] }) => [`${o.name} ${o.close}`, ...(o.alias ?? [])];

const ID_BY_NAME = new Map<string, string>();
for (const o of GENERATED) for (const n of namesOf(o)) ID_BY_NAME.set(fold(n), o.id);

/** The page of a species by its name, when it has one. */
export const organismIdOf = (name: string) => ID_BY_NAME.get(fold(name));
