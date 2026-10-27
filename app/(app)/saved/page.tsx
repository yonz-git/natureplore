import { redirect } from "next/navigation";

// Saved is part of You now (app/(app)/you/page.tsx); its own pages under /saved stay where they are.

export default function Saved() {
  redirect("/you");
}
