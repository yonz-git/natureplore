import { redirect } from "next/navigation";

// The start sheet moved to /start; an old link to this address lands there.

export default function Start() {
  redirect("/start");
}
