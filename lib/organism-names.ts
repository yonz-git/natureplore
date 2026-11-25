import { GENERATED } from "@/lib/organism-pages";

const fold = (name: string) => name.trim().toLowerCase();

export const namesOf = (o: { name: string; close: string; alias?: string[] }) => [`${o.name} ${o.close}`, ...(o.alias ?? [])];

const ID_BY_NAME = new Map<string, string>();
for (const o of GENERATED) for (const n of namesOf(o)) ID_BY_NAME.set(fold(n), o.id);

export const organismIdOf = (name: string) => ID_BY_NAME.get(fold(name));
