import { redirect } from "next/navigation";

// A1 · Start sheet is set aside for now: the welcome goes straight to the map with its search bar on
// top and the sheet under it (A5), at every size. An old link to this address lands there too.
// The sheet itself is kept in components/StartSheet.tsx.

export default function Start() {
  redirect("/map");
}
